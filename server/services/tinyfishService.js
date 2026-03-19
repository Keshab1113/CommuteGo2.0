/**
 * TinyFish Web Agents Service
 * Uses https module with keep-alive for reliable long-running SSE streams.
 *
 * Why not fetch: Node's fetch throws "terminated" on long-running SSE streams
 * when the remote server sends keep-alive TCP packets but no data for >60s.
 * The https module with a custom Agent (keepAlive: true, timeout: 0) handles
 * this correctly and never drops the connection prematurely.
 */

const https = require('https');
const logger = require('../utils/logger');

// Keep-alive agent so the TCP socket stays open for the full TinyFish run
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  timeout: 0, // no socket timeout — TinyFish can take 3-5 minutes
});

class TinyFishClient {
  constructor(cfg = {}) {
    this.apiKey = cfg.apiKey || process.env.TINYFISH_API_KEY;
    this.baseUrl = cfg.baseUrl || 'https://agent.tinyfish.ai';
  }

  /**
   * Run TinyFish automation via SSE and return the final result.
   *
   * SSE event types (per https://docs.tinyfish.ai):
   *   STARTED       - run has begun
   *   STREAMING_URL - live browser preview URL
   *   PROGRESS      - intermediate step (purpose field, no result)
   *   HEARTBEAT     - keep-alive ping
   *   COMPLETE      - final event; data lives in event.result
   *   FAILED/ERROR  - infrastructure-level failure
   *
   * @param {string} goal       - Natural language task for the agent
   * @param {function} onProgress - Optional callback for each SSE event
   * @returns {Promise<any>}    - event.result from the COMPLETE event
   */
  async run(goal, onProgress = null) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        url: 'https://www.goindigo.in/flights?linkNav=Flight%7CBook%7CBook',
        goal,
        browser_profile: 'stealth',
        proxy_config: { enabled: true, country_code: 'US' },
      });

      const urlObj = new URL(`${this.baseUrl}/v1/automation/run-sse`);

      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body, 'utf8'),
          'X-API-Key': this.apiKey,
        },
        agent: httpsAgent,
        // No timeout — let TinyFish take as long as it needs
      };

      let settled = false;
      let buffer = '';

      const settle = (fn, value) => {
        if (!settled) {
          settled = true;
          fn(value);
        }
      };

      const req = https.request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          let errBody = '';
          res.on('data', c => errBody += c);
          res.on('end', () =>
            settle(reject, new Error(`TinyFish API returned status ${res.statusCode}: ${errBody}`))
          );
          return;
        }

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          if (settled) return;

          buffer += chunk;

          // Process all complete lines; keep last incomplete line in buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const raw = line.slice(6).trim();
            if (!raw) continue;

            logger.debug(`TinyFish SSE: ${raw.substring(0, 150)}`);

            let event;
            try {
              event = JSON.parse(raw);
            } catch (_) {
              continue; // malformed chunk — skip
            }

            // Forward every event to the controller so it can stream to browser
            if (onProgress) {
              try { onProgress(event); } catch (_) {}
            }

            if (event.type === 'PROGRESS') {
              logger.info(`TinyFish agent: ${event.purpose}`);
              continue;
            }

            if (event.type === 'COMPLETE') {
              if (event.status !== 'COMPLETED') {
                return settle(reject, new Error(`TinyFish run ended with status: ${event.status}`));
              }
              if (!event.result) {
                return settle(reject, new Error('TinyFish COMPLETE event has no result field'));
              }
              // Goal-level failure: result.status === "failure" per docs
              if (event.result.status === 'failure' || event.result.error) {
                return settle(
                  reject,
                  new Error(event.result.reason || event.result.error || 'TinyFish goal not achieved')
                );
              }
              logger.info(`TinyFish COMPLETE for run_id: ${event.run_id}`);
              return settle(resolve, event.result);
            }

            if (event.type === 'FAILED' || event.type === 'ERROR') {
              return settle(
                reject,
                new Error(event.error?.message || event.message || 'TinyFish run failed')
              );
            }
          }
        });

        res.on('end', () => {
          if (!settled) {
            settle(reject, new Error('TinyFish SSE stream closed without a COMPLETE event'));
          }
        });

        res.on('error', (err) => settle(reject, err));
      });

      req.on('error', (err) => settle(reject, err));

      req.write(body);
      req.end();
    });
  }
}

// ---------------------------------------------------------------------------
// Transportation Service — builds prompts and normalizes TinyFish responses
// ---------------------------------------------------------------------------

class TinyFishTransportationService {
  constructor() {
    this.client = new TinyFishClient({ apiKey: process.env.TINYFISH_API_KEY });
  }

  /**
   * Get transportation options using TinyFish API.
   * @param {Object}   params
   * @param {string}   params.source
   * @param {string}   params.destination
   * @param {string}   params.travelDate      - ISO format
   * @param {string}   params.currency
   * @param {string}   params.transportMode   - flight|train|bus|taxi|metro|all|other
   * @param {Object}   params.preferences
   * @param {string}   params.travelTime
   * @param {function} params.onProgress      - Optional SSE event callback
   * @returns {Promise<Object>} { notes, flights, description, searchMetadata }
   */
  async getTransportationOptionsWithPrompt({
    source,
    destination,
    travelDate,
    currency = 'USD',
    transportMode = 'flight',
    preferences = {},
    travelTime,
    passengers = [],
    bookingPreferences = {},
    onProgress = null,
  }) {
    try {
      const goal = this.buildPrompt({
        source, destination, travelDate, currency, transportMode, preferences, travelTime,
        passengers, bookingPreferences,
      });

      logger.info(`Calling TinyFish API for ${transportMode} from ${source} to ${destination}`);

      const response = await this.client.run(goal, onProgress);
      const result = this.parseResponse(response, transportMode, source, destination);

      // Extract payment_url from TinyFish response.
      // IMPORTANT: do NOT decode. IndiGo requires the refUrl param to be double-encoded
      // (%253A / %252F). Decoding once breaks it (%3A / %2F = invalid URL).
      const rawPaymentUrl = response?.payment_url || response?.paymentUrl || null;
      let paymentUrl = rawPaymentUrl;
      // Append #tidSet — required by IndiGo's payment page
      if (paymentUrl && !paymentUrl.includes('#tidSet')) {
        paymentUrl = paymentUrl + '#tidSet';
      }

      return {
        notes: result.notes || '',
        flights: result.flights || [],
        description: result.description || '',
        paymentUrl,
        bookingReference: response?.booking_reference || response?.bookingReference || null,
        totalAmount: response?.total_amount || null,
        rawResponse: response,
        searchMetadata: {
          source, destination, travelDate, currency,
          transportMode, preferences, travelTime,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error(`TinyFish transportation service error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build a natural-language goal prompt for TinyFish.
   * Specifies the exact JSON schema so the result is always predictable.
   * UPDATED: Based on real IndiGo screenshots — correct fare labels, DOB format, page flow.
   */
  buildPrompt({ source, destination, travelDate, currency, transportMode, preferences, travelTime, passengers = [], bookingPreferences = {} }) {
    const dateObj    = new Date(travelDate);
    const dd         = String(dateObj.getDate()).padStart(2, '0');
    const mm         = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy       = dateObj.getFullYear();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedDate  = `${dd} ${monthNames[dateObj.getMonth()]} ${yyyy}`;
    const modePreference = preferences?.modePreference || 'cheapest';
    const pickFlight     = modePreference === 'fastest' ? 'fastest' : 'cheapest';

    // Pre-compute passenger fields
    const pax    = passengers[0] || {};
    const dobObj = pax.dateOfBirth ? new Date(pax.dateOfBirth) : null;
    const expObj = pax.passportExpiry ? new Date(pax.passportExpiry) : null;
    // IndiGo DOB field is a single text input in DD-MM-YYYY format
    const dobFormatted = dobObj
      ? `${String(dobObj.getDate()).padStart(2,'0')}-${String(dobObj.getMonth()+1).padStart(2,'0')}-${dobObj.getFullYear()}`
      : '';

    return `Book a flight on goindigo.in and return the payment page URL. Do NOT pay.

TRIP: ${source} → ${destination} | ${formattedDate} | ${preferences?.cabinClass || 'Economy'} | ${passengers.length || 1} Adult | pick ${pickFlight}
PAX: ${pax.gender||'Male'} | ${pax.firstName||''} ${pax.lastName||''} | DOB: ${dobFormatted} (DD-MM-YYYY) | ${pax.phone||''} | ${pax.email||''}

━━━ STEP 1 — Navigate & dismiss popups ━━━
Go to: https://www.goindigo.in/flights?linkNav=Flight%7CBook%7CBook
Close any popup immediately (X or "Continue as Guest"). Do NOT log in.

━━━ STEP 2 — Search form ━━━
Click "One Way". Type "${source}" in FROM → pick first suggestion. Type "${destination}" in TO → pick first suggestion. Click DATE field → pick ${dd} ${monthNames[dateObj.getMonth()]} ${yyyy}. Click "Search Flights".
⚠ If Search button stays disabled: re-select FROM city, re-select TO city, re-select date, then click Search again.

━━━ STEP 3 — Select flight + fare (EXACT IndiGo UI) ━━━
Page URL will be: goindigo.in/book/flight-select.html

Wait up to 8s for real flight cards to load (cards show flight code "6E XXXX", departure time, price badge). Grey shimmers with no text = still loading, keep waiting. If no real cards after 8s, click the "${dd}" date tile in the date strip at top of results.

FLIGHT CARD LAYOUT (what you will actually see):
- Each card shows: flight code (e.g. "6E 2588"), departure time, arrival time, duration, price badge "Economy ₹X,XXX ↑"
- The "↑" chevron / price badge on the right side — click it to EXPAND the fare panel
- The fare panel opens below the card row showing THREE columns:
    Column 1: "Saver fare"       ← CHEAPEST — click this column / its price area
    Column 2: "Flexi plus fare"
    Column 3: "IndiGo UpFront"
- After clicking "Saver fare" column, it gets highlighted/selected
- Click the blue "Next" button at the BOTTOM RIGHT of the page (shows "Next" with total fare)
- Do NOT click "Know more" — that opens an info modal
- Do NOT look for a "Book" button inside the fare panel — use the "Next" button at bottom right

${pickFlight === 'fastest' ? 'Sort: click the sort icon (⇅) at top right of results and pick "Duration".' : 'Sort: click the sort icon (⇅) at top right of results and pick "Price" if available.'}

⚠ TIMEOUT: If stuck on fare selection for 60s, try the next flight card.

━━━ STEP 4 — Passenger form (goindigo.in/book/passenger-edit.html) ━━━
EXACT FORM LAYOUT (from real page):
- Page heading: "Enter passenger details"
- Card header: "Adult 1 / Passenger 1" with a ∧ chevron (already EXPANDED — do NOT try to click to expand)
- Field 1: Two radio buttons → "Male" and "Female" — click the "${pax.gender||'Male'}" label
- Field 2: Text input labelled "First And Middle Name" → type "${pax.firstName||''}"
- Field 3: Text input labelled "Last Name" → type "${pax.lastName||''}"
- Field 4: Text input labelled "Date Of Birth (Optional)" — format is DD-MM-YYYY (e.g. 25-04-1998)
           → type "${dobFormatted}"
           ⚠ This is a SINGLE text field, NOT three dropdowns
- "Special Assistance" — collapsed section, leave it alone
- "Add IndiGo BluChip Membership Number" — collapsed section, leave it alone
- Question: "Are there any passengers EU citizens aged 12-15 years..." → select "No"

CONTACT DETAILS section (below passenger card):
- Phone: "+91" country code already shown → type "${pax.phone||''}" in the number field
- Email: type "${pax.email||''}"
- "Enter GST details" — collapsed, leave it alone
- "6E Fare Hold" section — ignore, do NOT add

Checkboxes at bottom:
- "I have read and agree to IndiGo's Conditions of Carriage..." → check it (tick it) if not already checked
- Marketing email checkbox → leave unchecked
- WhatsApp checkbox → leave unchecked

Click the blue "Next" button at bottom right of the page.
⚠ Next button is GREYED OUT until required fields are filled — if still grey after filling, scroll up to find any missed field.

━━━ STEP 5 — Add-ons page (URL ends with #addon) ━━━
Page shows "Recommended", "Premium", "Meals", "Excess Baggage" tabs.
Three bundle cards: "GoFlex" (₹450), "GoSmart" (₹600), "GoLite" (₹650) — all paid.
→ Do NOT click any "Add" button. Click the blue "Next" button at bottom right immediately.

━━━ STEP 6 — Seat selection page (URL ends with #seat) ━━━
Page shows seat map. "Free" seats = 0 available.
→ Do NOT select any paid seat. Click the blue "Next" button at bottom right immediately.

━━━ STEP 7 — STOP ON PAYMENT PAGE ━━━
You are on the payment page when URL contains "payment.html" or "isBookingFlow=1".
The page shows: "Payment options", UPI, Cards, Net banking, Pay with Wallet.
STOP IMMEDIATELY. Do NOT click anything. Read the FULL URL from address bar. Return it.

RULES: Stay on goindigo.in. Accept price alerts. Solve CAPTCHA. Never refresh. Never log in.

Return ONLY this JSON:
{
  "payment_url": "<full URL — must contain payment.html and isBookingFlow=1>",
  "booking_reference": "<PNR/order ID or null>",
  "total_amount": "<price shown>",
  "currency": "${currency}",
  "flight_selected": { "from": "${source}", "to": "${destination}", "depart": "HH:MM", "arrive": "HH:MM", "codes": "6E XXXX", "price": 0 },
  "summary": { "passengers_filled": ${passengers.length||1}, "cabin": "${bookingPreferences.cabinClass||preferences?.cabinClass||'economy'}", "steps_completed": "brief", "errors_encountered": null }
}`;
  }


  parseResponse(response, transportMode, source, destination) {
    try {
      let parsedData = typeof response === 'string' ? JSON.parse(response) : response;

      let flights = [];
      
      // Handle direct array
      if (Array.isArray(parsedData)) {
        flights = parsedData;
      }
      // Handle single flight_selected object (from TinyFish booking agent)
      else if (parsedData?.flight_selected && !Array.isArray(parsedData.flight_selected)) {
        flights = [parsedData.flight_selected];
      }
      // Handle array fields
      else if (Array.isArray(parsedData.flights)) flights = parsedData.flights;
      else if (Array.isArray(parsedData.options)) flights = parsedData.options;
      else if (Array.isArray(parsedData.results)) flights = parsedData.results;
      else if (Array.isArray(parsedData.data))    flights = parsedData.data;
      else if (Array.isArray(parsedData.items))   flights = parsedData.items;

      const normalizedFlights = this.normalizeItems(flights, transportMode);

      return {
        notes: parsedData?.notes || '',
        flights: normalizedFlights,
        description:
          parsedData?.description ||
          `Found ${normalizedFlights.length} ${transportMode} options from ${source} to ${destination}`,
      };
    } catch (error) {
      logger.error(`Error parsing TinyFish response: ${error.message}`);
      return { notes: '', flights: [], description: 'Unable to parse transportation options' };
    }
  }

  extractField(obj, ...keys) {
    for (const key of keys) {
      if (obj[key] !== undefined) return obj[key];
    }
    return null;
  }

  /**
   * Normalise raw TinyFish items.
   * TinyFish flight fields: airline, codes, depart, arrive, price, booking_url, from, to, no
   */
  normalizeItems(items, transportMode) {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const from        = this.extractField(item, 'from', 'origin', 'departureAirport', 'departureStation') || 'N/A';
      const to          = this.extractField(item, 'to', 'destination', 'arrivalAirport', 'arrivalStation') || 'N/A';
      const time        = this.extractField(item, 'depart', 'time', 'departureTime', 'departure_time') || 'N/A';
      const arrivalTime = this.extractField(item, 'arrive', 'arrivalTime', 'arrival_time') || 'N/A';
      const rawPrice    = this.extractField(item, 'price', 'Price', 'fare', 'cost', 'amount') || 0;
      const name        = this.extractField(item, 'airline', 'name', 'provider', 'operator', 'carrier') || 'N/A';
      const codes       = this.extractField(item, 'codes', 'flightNumber', 'flight_number') || '';
      const url         = this.extractField(item, 'booking_url', 'bookingUrl', 'url', 'link') || '';
      const no          = this.extractField(item, 'no', 'number', 'rank') || null;

      let price = 0;
      if (typeof rawPrice === 'number')      price = rawPrice;
      else if (typeof rawPrice === 'string') price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

      return { no, from, to, time, arrivalTime, price, name, codes, url, mode: transportMode };
    });
  }
}

// ---------------------------------------------------------------------------
// Booking Service — TinyFish fills in passenger details and returns payment URL
// ---------------------------------------------------------------------------

class TinyFishBookingService {
  constructor() {
    this.client = new TinyFishClient({ apiKey: process.env.TINYFISH_API_KEY });
  }

  /**
   * Book a specific flight by navigating to its booking URL, filling in all
   * passenger details, and returning the payment page URL.
   *
   * @param {Object} params
   * @param {Object} params.flight       - The selected flight (from TinyFishTransportationService)
   * @param {Array}  params.passengers   - Array of passenger objects
   * @param {string} params.currency     - Currency code
   * @param {function} params.onProgress - SSE event callback
   * @returns {Promise<Object>}          - { paymentUrl, bookingReference, summary }
   */
  async bookFlight({ flight, passengers, currency = 'INR', onProgress = null }) {
    try {
      const goal = this.buildBookingGoal({ flight, passengers, currency });

      logger.info(`TinyFish booking flight: ${flight.name || flight.airline} ${flight.codes || ''} from ${flight.from} to ${flight.to}`);

      const result = await this.client.run(goal, onProgress);

      // Expect result to contain payment_url or paymentUrl
      const paymentUrl =
        result.payment_url ||
        result.paymentUrl ||
        result.checkout_url ||
        result.checkoutUrl ||
        result.redirect_url ||
        result.url ||
        null;

      if (!paymentUrl) {
        logger.warn('TinyFish booking did not return a payment URL', result);
      }

      // Append #tidSet — required by IndiGo's payment page
      const finalPaymentUrl = (paymentUrl && !paymentUrl.includes('#tidSet'))
        ? paymentUrl + '#tidSet'
        : paymentUrl;

      return {
        paymentUrl: finalPaymentUrl,
        bookingReference: result.booking_reference || result.bookingReference || result.pnr || null,
        summary: result.summary || result.booking_summary || null,
        rawResult: result,
      };
    } catch (error) {
      logger.error(`TinyFish booking service error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build the goal prompt for TinyFish to complete a flight booking.
   * UPDATED: Based on real IndiGo screenshots — correct fare labels, DOB format, page flow.
   */
  buildBookingGoal({ flight, passengers, currency, bookingPreferences = {} }) {
    const lead  = passengers[0];
    const prefs = bookingPreferences;

    const fmt = (dateStr) => {
      if (!dateStr) return { dd:'', mm:'', yyyy:'', monthName:'', ddmmyyyy:'', dobField:'' };
      const d    = new Date(dateStr);
      const dd   = String(d.getDate()).padStart(2, '0');
      const mm   = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = String(d.getFullYear());
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      return {
        dd, mm, yyyy,
        monthName: months[d.getMonth()],
        ddmmyyyy: `${dd}/${mm}/${yyyy}`,
        dobField: `${dd}-${mm}-${yyyy}`,  // IndiGo's actual DOB text field format
      };
    };

    const flightFrom = flight.from || '';
    const flightTo   = flight.to   || '';
    const flightDate = flight.travelDate || '';
    const pickFlight = (prefs.modePreference || 'cheapest') === 'fastest' ? 'fastest' : 'cheapest';

    const paxSummary = passengers.map((p, i) => {
      const dob = fmt(p.dateOfBirth);
      const phone = i === 0 ? p.phone : (p.phone || lead.phone);
      const email = i === 0 ? p.email : (p.email || lead.email);
      return `  PAX${i+1}: ${p.gender||'Male'} | ${p.firstName} ${p.lastName} | DOB: ${dob.dobField} | ${phone} | ${email}`;
    }).join('\n');

    const paxFormLines = passengers.map((p, i) => {
      const dob   = fmt(p.dateOfBirth);
      const phone = i === 0 ? p.phone : (p.phone || lead.phone);
      const email = i === 0 ? p.email : (p.email || lead.email);
      return `  PAX${i+1}: gender "${p.gender||'Male'}" → "First And Middle Name" = "${p.firstName}" → "Last Name" = "${p.lastName}" → "Date Of Birth (Optional)" = "${dob.dobField}" (type exactly, DD-MM-YYYY) → Phone = "${phone}" → Email = "${email}"`;
    }).join('\n');

    return `Book a flight on goindigo.in and return the payment page URL. Do NOT pay.

TRIP: ${flightFrom} → ${flightTo} | ${flightDate} | ${prefs.cabinClass||'Economy'} | ${passengers.length} Adult | pick ${pickFlight}
PASSENGERS:
${paxSummary}

━━━ STEP 1 — Navigate & dismiss popups ━━━
Go to: https://www.goindigo.in/flights?linkNav=Flight%7CBook%7CBook
Close any popup (X or "Continue as Guest"). Do NOT log in.

━━━ STEP 2 — Search ━━━
Click "One Way". Type "${flightFrom}" in FROM → first suggestion. Type "${flightTo}" in TO → first suggestion. Set date "${flightDate}". Click "Search Flights".
⚠ If Search button is disabled: re-select FROM, re-select TO, re-select date, click Search again.

━━━ STEP 3 — Select flight + fare (EXACT IndiGo UI) ━━━
Page URL: goindigo.in/book/flight-select.html
Wait up to 8s for real flight cards. Shimmers = grey/no text, keep waiting.

FARE SELECTION (what you will actually see):
- Each card has a price badge "Economy ₹X,XXX ↑" on the right — click it to expand fare panel
- Fare panel shows THREE columns:
    LEFT:   "Saver fare"       ← pick this (cheapest)
    MIDDLE: "Flexi plus fare"
    RIGHT:  "IndiGo UpFront"
- Click the "Saver fare" column to select it (it gets a border/highlight)
- Then click the blue "Next" button at BOTTOM RIGHT of the page (shows total fare ₹X,XXX)
- Do NOT click "Know more" — it opens a useless info modal
- There is NO separate "Book" button — always use "Next" at bottom right

⚠ If stuck on one card for 60s, try the next card.

━━━ STEP 4 — Passenger form (goindigo.in/book/passenger-edit.html) ━━━
The passenger card "Adult 1 / Passenger 1" is ALREADY EXPANDED — fields are visible immediately.
Do NOT try to expand or click the card header.

FILL IN THIS ORDER:
${paxFormLines}

IMPORTANT FIELD DETAILS:
- "First And Middle Name" = first name only (no middle name needed if not available)
- "Date Of Birth (Optional)" = SINGLE text input, type in DD-MM-YYYY format (e.g. 25-04-1998)
  ⚠ This is NOT three dropdowns — it is ONE text field
- "Are there any passengers EU citizens..." question → click "No"
- Contact details: +91 country code is pre-filled → type phone number only
- Checkboxes: tick "I have read and agree to IndiGo's Conditions of Carriage" if not ticked
- Leave all other checkboxes unchecked
- "6E Fare Hold", "GST Details" sections → ignore, do not expand

Click the blue "Next" button at bottom right.
⚠ "Next" is greyed out until fields are filled — if grey after filling, scroll up to find missed field.

━━━ STEP 5 — Add-ons page (URL ends with #addon) ━━━
Shows "GoFlex" (₹450), "GoSmart" (₹600), "GoLite" (₹650) bundles — all paid.
→ Do NOT add anything. Click the blue "Next" button at bottom right immediately.

━━━ STEP 6 — Seat page (URL ends with #seat) ━━━
Shows seat map. No free seats available.
→ Do NOT select any paid seat. Click the blue "Next" button at bottom right immediately.

━━━ STEP 7 — STOP ON PAYMENT PAGE ━━━
URL will contain: payment.html and isBookingFlow=1
Page shows: "Payment options" with UPI, Cards, Net banking, Pay with Wallet.
STOP. Do NOT click anything. Read the FULL URL from address bar. Return it.

RULES: Stay on goindigo.in. Accept price alerts. Solve CAPTCHA. Never refresh. Never log in.

Return ONLY this JSON:
{
  "payment_url": "<full URL — must contain payment.html and isBookingFlow=1>",
  "booking_reference": "<PNR or null>",
  "total_amount": "<price shown>",
  "currency": "${currency}",
  "summary": { "from": "${flightFrom}", "to": "${flightTo}", "passengers_filled": ${passengers.length}, "cabin": "${prefs.cabinClass||'economy'}", "steps_completed": "brief", "errors_encountered": null }
}`;

  }
}

module.exports = { TinyFishClient, TinyFishTransportationService, TinyFishBookingService };