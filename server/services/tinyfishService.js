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
      const body = JSON.stringify({ url: 'https://www.google.com', goal });

      const urlObj = new URL(`${this.baseUrl}/v1/automation/run-sse`);

      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
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
    onProgress = null,
  }) {
    try {
      const goal = this.buildPrompt({
        source, destination, travelDate, currency, transportMode, preferences, travelTime,
      });

      logger.info(`Calling TinyFish API for ${transportMode} from ${source} to ${destination}`);

      const response = await this.client.run(goal, onProgress);
      const result = this.parseResponse(response, transportMode, source, destination);

      return {
        notes: result.notes || '',
        flights: result.flights || [],
        description: result.description || '',
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
   */
  buildPrompt({ source, destination, travelDate, currency, transportMode, preferences, travelTime }) {
    const dateObj = new Date(travelDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const modePreference = preferences?.modePreference || 'cheapest';
    let prompt = '';

    if (transportMode === 'flight' || transportMode === 'all') {
      prompt += `Find the cheapest flights from ${source} to ${destination} on ${formattedDate}. `
        + `Use any flight search site (Skyscanner, Kayak, Ixigo, Google Flights, etc.). Sort by price ascending. `;
    }
    if (transportMode === 'train' || transportMode === 'all') {
      prompt += `Find the cheapest trains from ${source} to ${destination} on ${formattedDate}. Sort by price ascending. `;
    }
    if (transportMode === 'bus' || transportMode === 'all') {
      prompt += `Find the cheapest buses from ${source} to ${destination} on ${formattedDate}. Sort by price ascending. `;
    }
    if (transportMode === 'taxi' || transportMode === 'all') {
      prompt += `Find the cheapest taxi/cab options from ${source} to ${destination} on ${formattedDate}. Sort by price ascending. `;
    }
    if (transportMode === 'metro' || transportMode === 'all') {
      prompt += `Find metro options from ${source} to ${destination}. Sort by price ascending. `;
    }
    if (transportMode === 'other' || transportMode === 'all') {
      prompt += `Find all transport options from ${source} to ${destination} on ${formattedDate}. Sort by price ascending. `;
    }

    prompt +=
      `Currency: ${currency}. Primary sort: ${modePreference}. ` +
      `Return ONLY a JSON object with this exact structure: ` +
      `{ "flights": [ { "no": 1, "from": "CCU", "to": "LHR", "depart": "05:20", "arrive": "17:45", ` +
      `"airline": "IndiGo", "codes": "6E 474", "price": 25835, "booking_url": "https://..." } ], ` +
      `"notes": "any coupons or availability notes", "search_info": { "platforms": ["Skyscanner"] } }`;

    return prompt;
  }

  parseResponse(response, transportMode, source, destination) {
    try {
      let parsedData = typeof response === 'string' ? JSON.parse(response) : response;

      let flights = [];
      if (Array.isArray(parsedData))              flights = parsedData;
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

      return {
        paymentUrl,
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
   * This instructs TinyFish to:
   *  1. Navigate to the flight's booking URL
   *  2. Fill in all passenger details
   *  3. Proceed to payment
   *  4. Return the payment page URL (NOT complete the payment)
   */
  buildBookingGoal({ flight, passengers, currency }) {
    const lead = passengers[0];

    // Format all passengers for the prompt
    const passengerList = passengers.map((p, i) => {
      return `Passenger ${i + 1}:
  - First Name: ${p.firstName}
  - Last Name: ${p.lastName}
  - Email: ${i === 0 ? p.email : (p.email || lead.email)}
  - Phone: ${i === 0 ? p.phone : (p.phone || lead.phone)}
  - Date of Birth: ${p.dateOfBirth}
  - Passport Number: ${p.passportNumber}
  - Nationality: ${p.nationality}
  - Passport Expiry: ${p.passportExpiry}
  - Gender: ${p.gender}`;
    }).join('\n\n');

    const flightSummary = `
Flight Details:
  - Airline: ${flight.name || flight.airline || 'N/A'}
  - Flight Code: ${flight.codes || 'N/A'}
  - From: ${flight.from}
  - To: ${flight.to}
  - Departure: ${flight.time || flight.depart || 'N/A'}
  - Arrival: ${flight.arrivalTime || flight.arrive || 'N/A'}
  - Price: ${flight.price} ${currency}
  - Booking URL: ${flight.url || flight.bookingUrl || flight.booking_url}
`;

    return `You are booking a flight. Follow these steps exactly:

1. Navigate to this booking URL: ${flight.url || flight.bookingUrl || flight.booking_url}

2. This page will show a flight booking form. Fill in all passenger details as follows:
${flightSummary}

Passengers to fill in (${passengers.length} total):
${passengerList}

3. Fill in ALL required fields in the booking form — passenger names, dates of birth, passport numbers, contact details, nationality, passport expiry.

4. If there are add-on options (seat selection, meals, baggage), skip them or select the free/default option.

5. Proceed through the booking steps until you reach the PAYMENT page where a credit card or payment method is required.

6. STOP at the payment page — do NOT enter any payment details.

7. Return a JSON object with:
{
  "payment_url": "the exact URL of the payment page you reached",
  "booking_reference": "any reference or PNR number shown",
  "summary": {
    "airline": "${flight.name || flight.airline}",
    "flight": "${flight.codes}",
    "from": "${flight.from}",
    "to": "${flight.to}",
    "departure": "${flight.time || flight.depart}",
    "passengers": ${passengers.length},
    "total_price": ${flight.price},
    "currency": "${currency}"
  }
}

IMPORTANT: Stop at the payment page. Do not complete the payment.`;
  }
}

module.exports = { TinyFishClient, TinyFishTransportationService, TinyFishBookingService };