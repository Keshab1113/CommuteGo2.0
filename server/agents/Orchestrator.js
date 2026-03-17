// backend/src/agents/Orchestrator.js
const { db } = require("../config/database");
const { config } = require("../config/appConfig");
const { TinyFishClient } = require("../services/tinyfishService");
const logger = require("../utils/logger");

class PlanningAgent {
  constructor() {
    this.tinyfish = new TinyFishClient();
  }

  async analyzeRoute(source, destination) {
    try {
      // Try to get real route data from TinyFish API
      const routeData = await this.tinyfish.getRoute(source, destination);

      if (routeData && routeData.distance) {
        return {
          possibleModes: routeData.modes || this.getAvailableModes(),
          distance: routeData.distance,
          estimatedBaseTime:
            routeData.duration || this.estimateDuration(routeData.distance),
          trafficFactors:
            routeData.traffic ||
            (await this.getTrafficData(source, destination)),
          weatherFactors: await this.getWeatherData(source, destination),
          historicalPatterns: await this.getHistoricalPatterns(
            source,
            destination,
          ),
          rawData: routeData,
        };
      }
    } catch (error) {
      console.warn(
        "TinyFish API unavailable, using fallback calculation:",
        error.message,
      );
    }

    // Fallback: Calculate using config values
    return this.calculateFallback(source, destination);
  }

  getAvailableModes() {
    return ["cab", "bus", "train", "metro", "walk", "mixed"];
  }

  async calculateFallback(source, destination) {
    const distance = await this.calculateDistance(source, destination) || 10; // Default if calculation fails
    
    return {
        possibleModes: this.getAvailableModes(),
        distance: !isNaN(distance) && distance > 0 ? distance : 10,
        estimatedBaseTime: this.estimateDuration(distance) || 45,
        trafficFactors: await this.getTrafficData(source, destination) || { congestion: 'medium' },
        weatherFactors: await this.getWeatherData(source, destination) || { condition: 'clear' },
        historicalPatterns: await this.getHistoricalPatterns(source, destination) || { avgTime: 45 }
    };
}

  async calculateDistance(source, destination) {
    // Use Haversine formula for real distance calculation
    try {
      const [sourceCoords, destCoords] = await Promise.all([
        this.geocodeAddress(source),
        this.geocodeAddress(destination),
      ]);

      if (sourceCoords && destCoords) {
        return this.haversineDistance(
          sourceCoords.lat,
          sourceCoords.lng,
          destCoords.lat,
          destCoords.lng,
        );
      }
    } catch (error) {
      console.warn("Geocoding failed:", error.message);
    }

    // Fallback: estimate based on typical city distances
    return 10.0; // Default fallback in km
  }

  async geocodeAddress(address) {
    // Common city coordinates database (fallback if geocoding API fails)
    const cityCoords = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'lucknow': { lat: 26.8467, lng: 80.9462 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'dubai': { lat: 25.2048, lng: 55.2708 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'berlin': { lat: 52.5200, lng: 13.4050 },
      'toronto': { lat: 43.6532, lng: -79.3832 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'india': { lat: 28.6139, lng: 77.2090 }, // Default India to Delhi
    };

    const normalizedAddress = address.toLowerCase().trim();
    
    // Check exact match first
    if (cityCoords[normalizedAddress]) {
      return cityCoords[normalizedAddress];
    }
    
    // Check partial match (e.g., "New Delhi" contains "delhi")
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (normalizedAddress.includes(city)) {
        return coords;
      }
    }

    // Try to get coordinates from database cache second
    try {
      const [rows] = await db.execute(
        "SELECT lat, lng FROM geocode_cache WHERE address = ?",
        [normalizedAddress],
      );
      if (rows.length > 0) {
        return { lat: rows[0].lat, lng: rows[0].lng };
      }
    } catch (error) {
      console.warn("Geocode cache lookup failed:", error.message);
    }

    // Try Nominatim API (OpenStreetMap) for unknown addresses
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'CommuteGo/2.0 (contact@commutego.com)',
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Cache the result for future use
          try {
            await db.execute(
              "INSERT INTO geocode_cache (address, lat, lng, created_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE lat = VALUES(lat), lng = VALUES(lng)",
              [normalizedAddress, parseFloat(data[0].lat), parseFloat(data[0].lon)],
            );
          } catch (cacheError) {
            console.warn("Failed to cache geocode result:", cacheError.message);
          }
          
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
        }
      }
    } catch (error) {
      console.warn(`[Orchestrator] Nominatim geocoding failed for "${address}":`, error.message);
    }

    // Default coordinates (Delhi) if not found
    return { lat: 28.6139, lng: 77.2090 };
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  estimateDuration(distance) {
    // Use config speeds to estimate base duration
    const avgSpeed = Object.values(config.calculations.speeds).reduce((a, b) => a + b, 0) / 
                    Object.keys(config.calculations.speeds).length || 40;
    
    // Ensure distance is valid
    const validDistance = !isNaN(distance) && distance > 0 ? distance : 10;
    
    // Convert to minutes
    return Math.round((validDistance / avgSpeed) * 60) || 45;
}

  async getTrafficData(source, destination) {
    try {
      const hour = new Date().getHours();
      let congestion = "low";

      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        congestion = "high";
      } else if ((hour >= 10 && hour <= 16) || (hour >= 20 && hour <= 22)) {
        congestion = "medium";
      }

      // Try to get real traffic data from database
      const [rows] = await db.execute(
        `SELECT congestion_level FROM traffic_data 
                 WHERE area = ? AND hour = ? 
                 ORDER BY recorded_at DESC LIMIT 1`,
        [source, hour],
      );

      if (rows.length > 0) {
        congestion = rows[0].congestion_level;
      }

      return { congestion };
    } catch (error) {
      return { congestion: "medium" };
    }
  }

  async getWeatherData(source, destination) {
    try {
      // Try to get weather from database cache
      const [rows] = await db.execute(
        `SELECT condition, temperature FROM weather_data 
                 WHERE area = ? 
                 ORDER BY recorded_at DESC LIMIT 1`,
        [source],
      );

      if (rows.length > 0) {
        return {
          condition: rows[0].condition,
          temperature: rows[0].temperature,
        };
      }
    } catch (error) {
      // Ignore and return default
    }

    return { condition: "clear" };
  }

  async getHistoricalPatterns(source, destination) {
    try {
      const [rows] = await db.execute(
        `SELECT AVG(total_time) as avgTime, 
                        AVG(total_cost) as avgCost,
                        COUNT(*) as sampleSize
                 FROM routes r
                 JOIN route_options ro ON r.id = ro.route_id
                 WHERE r.source = ? AND r.destination = ?`,
        [source, destination],
      );

      if (rows.length > 0 && rows[0].sampleSize > 0) {
        return {
          avgTime: Math.round(rows[0].avgTime),
          avgCost: parseFloat(rows[0].avgCost),
          sampleSize: rows[0].sampleSize,
        };
      }
    } catch (error) {
      // Ignore and return default
    }

    return { avgTime: 45 };
  }
}

class OptimizationAgent {
  constructor() {
    this.timeFactors = config.calculations.speeds;
    this.costRates = config.calculations.costRates;
    this.emissionFactors = config.calculations.carbonEmissionFactors;
  }

  async calculateOptions(planningResult, preferences) {
    const modes = planningResult.possibleModes;
    const options = [];

    modes.forEach((mode, index) => {
      const baseTime = planningResult.estimatedBaseTime || 45; // Default if undefined
      const distance = planningResult.distance || 10; // Default if undefined

      // Use config values for all factors
      const speed = this.timeFactors[mode] || 40; // km/h from config
      const costRate = this.costRates[mode] || 1.0;
      const emissionRate = this.emissionFactors[mode] || 50;

      // Calculate time based on speed - ensure we have valid numbers
      const timeFactor = speed > 0 ? 60 / speed : 1.5; // Convert to time multiplier

      // Get traffic multiplier from planning result - handle undefined
      const trafficMultiplier = this.getTrafficMultiplier(
        planningResult.trafficFactors?.congestion,
      );

      // Calculate values with proper validation
      const totalTime = Math.round(
        (baseTime || 45) * (timeFactor || 1) * (trafficMultiplier || 1),
      );
      const totalCost = this.calculateCost(mode, distance || 10, costRate || 1);
      const carbonKg = ((distance || 10) * (emissionRate || 50)) / 1000;

      // Ensure all numeric values are valid (not NaN, not null, not undefined)
      const option = {
        id: `opt_${Date.now()}_${index}`,
        mode,
        totalTime: isNaN(totalTime) ? 45 : totalTime,
        totalCost: isNaN(totalCost) ? 10 : totalCost,
        carbonKg: isNaN(carbonKg) ? 1 : carbonKg,
        distanceKm: isNaN(distance) ? 10 : distance,
        agentConfidence: this.calculateConfidence(distance || 10, mode),
        steps: this.generateSteps(mode, distance || 10),
        rankCheapest: 0,
        rankFastest: 0,
        rankEco: 0,
        details: {
          speed: speed || 40,
          costRate: costRate || 1,
          emissionRate: emissionRate || 50,
          trafficMultiplier: trafficMultiplier || 1,
        },
      };

      options.push(option);
    });

    // Calculate ranks
    this.calculateRanks(options);

    return options;
  }

  getTrafficMultiplier(congestion) {
    const multipliers = {
      low: 1.0,
      medium: 1.2,
      high: 1.5,
      severe: 2.0,
    };
    return multipliers[congestion] || 1.2;
  }

  calculateCost(mode, distance, rate) {
    // Get cost configuration for the mode
    const costConfig = config.calculations.costRates?.[mode] || {
      base: 0,
      perKm: 1,
    };
    const baseFare = costConfig.base || 0;
    const perKmRate = costConfig.perKm || rate || 1;

    // Ensure distance is a valid number
    const validDistance = !isNaN(distance) && distance > 0 ? distance : 10;

    return baseFare + validDistance * perKmRate;
  }

  calculateConfidence(distance, mode) {
    // Ensure distance is valid
    const validDistance = !isNaN(distance) && distance > 0 ? distance : 10;

    // Higher confidence for shorter distances and established modes
    const distanceFactor = Math.max(0.5, 1 - validDistance / 100);
    const modeConfidence = {
      cab: 0.95,
      bus: 0.9,
      train: 0.92,
      metro: 0.92,
      walk: 0.98,
      mixed: 0.85,
    };
    return (modeConfidence[mode] || 0.8) * distanceFactor;
  }

  generateSteps(mode, distance) {
    if (mode === "mixed") {
      // Generate realistic mixed route steps
      const walkDist = Math.round(distance * 0.1 * 10) / 10;
      const transitDist = Math.round(distance * 0.7 * 10) / 10;
      const finalWalkDist = Math.round(distance * 0.2 * 10) / 10;

      return [
        {
          mode: "walk",
          from: "Start",
          to: "Transit Stop",
          duration: Math.round((walkDist / 5) * 60),
          distance: walkDist,
        },
        {
          mode: "transit",
          from: "Transit Stop",
          to: "Station",
          duration: Math.round((transitDist / 30) * 60),
          distance: transitDist,
        },
        {
          mode: "walk",
          from: "Station",
          to: "Destination",
          duration: Math.round((finalWalkDist / 5) * 60),
          distance: finalWalkDist,
        },
      ];
    }

    const speed = this.timeFactors[mode] || 40;
    const duration = Math.round((distance / speed) * 60);

    return [{ mode, from: "Start", to: "Destination", duration, distance }];
  }

  calculateRanks(options) {
    // Sort by cost
    const sortedByCost = [...options].sort((a, b) => a.totalCost - b.totalCost);
    sortedByCost.forEach((opt, idx) => {
      const option = options.find((o) => o.mode === opt.mode);
      if (option) option.rankCheapest = idx + 1;
    });

    // Sort by time
    const sortedByTime = [...options].sort((a, b) => a.totalTime - b.totalTime);
    sortedByTime.forEach((opt, idx) => {
      const option = options.find((o) => o.mode === opt.mode);
      if (option) option.rankFastest = idx + 1;
    });

    // Sort by carbon
    const sortedByCarbon = [...options].sort((a, b) => a.carbonKg - b.carbonKg);
    sortedByCarbon.forEach((opt, idx) => {
      const option = options.find((o) => o.mode === opt.mode);
      if (option) option.rankEco = idx + 1;
    });
  }

  generateSteps(mode) {
    if (mode === "mixed") {
      return [
        {
          mode: "walk",
          from: "Start",
          to: "Bus Stop",
          duration: 5,
          distance: 0.3,
        },
        {
          mode: "bus",
          from: "Bus Stop",
          to: "Train Station",
          duration: 15,
          distance: 3.2,
        },
        {
          mode: "train",
          from: "Train Station",
          to: "Destination",
          duration: 20,
          distance: 8.5,
        },
      ];
    }
    return [
      { mode, from: "Start", to: "Destination", duration: 30, distance: 10 },
    ];
  }
}

class AnalyticsAgent {
  async enhanceWithInsights(routes, userId) {
    return routes.map((route) => ({
      ...route,
      insights: this.generateInsights(route),
      predictions: this.generatePredictions(route),
      recommendations: this.generateRecommendations(route),
    }));
  }

  generateInsights(route) {
    const insights = [];

    if (route.rankCheapest === 1) {
      insights.push({
        type: "saving",
        message: "This is the most affordable option",
        icon: "💰",
        detail: `Save up to $${(route.totalCost * 0.3).toFixed(2)} compared to other options`,
      });
    }

    if (route.rankFastest === 1) {
      insights.push({
        type: "fast",
        message: "Fastest route available",
        icon: "⚡",
        detail: `Save ${Math.round(route.totalTime * 0.2)} minutes compared to average`,
      });
    }

    if (route.rankEco === 1) {
      insights.push({
        type: "eco",
        message: "Most environmentally friendly",
        icon: "🌱",
        detail: `${route.carbonKg.toFixed(1)} kg CO₂ - lowest carbon footprint`,
      });
    }

    return insights;
  }

  async generatePredictions(route) {
    // Get real-time data from database for predictions
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();

    // Query historical data for this route and time
    const historicalData = await this.getHistoricalPatterns(
      route.mode,
      hour,
      dayOfWeek,
    );

    // Get current traffic data
    const trafficData = await this.getCurrentTraffic(route);

    // Get weather impact
    const weatherImpact = await this.getWeatherImpact();

    // Calculate reliability based on multiple factors
    const timeReliability = this.calculateTimeReliability(
      hour,
      trafficData,
      weatherImpact,
    );
    const crowdLevel = this.determineCrowdLevel(
      hour,
      dayOfWeek,
      historicalData,
    );

    return {
      timeReliability,
      costStability: historicalData?.costStability || 90,
      crowdLikelihood: crowdLevel,
      delayProbability: this.calculateDelayProbability(
        crowdLevel,
        trafficData,
        weatherImpact,
      ),
      historicalData: historicalData || null,
      trafficCondition: trafficData?.congestion || "unknown",
      weatherImpact: weatherImpact?.severity || "none",
    };
  }

  async getHistoricalPatterns(mode, hour, dayOfWeek) {
    try {
      // Query historical commute data from database
      const { db } = require("../config/database");
      const [rows] = await db.execute(
        `SELECT 
                    AVG(actual_duration - estimated_duration) as avg_delay,
                    COUNT(*) as sample_size,
                    AVG(cost) as avg_cost,
                    STDDEV(cost) as cost_stddev
                FROM route_options ro
                JOIN routes r ON ro.route_id = r.id
                WHERE r.mode = ? 
                AND HOUR(r.created_at) BETWEEN ? AND ?
                AND DAYOFWEEK(r.created_at) = ?
                AND r.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [
          mode,
          Math.max(0, hour - 1),
          Math.min(23, hour + 1),
          ((dayOfWeek + 1) % 7) + 1,
        ],
      );

      if (rows[0] && rows[0].sample_size > 10) {
        return {
          avgDelay: rows[0].avg_delay || 0,
          sampleSize: rows[0].sample_size,
          costStability: rows[0].cost_stddev
            ? Math.max(70, 100 - (rows[0].cost_stddev / rows[0].avg_cost) * 100)
            : 90,
        };
      }
    } catch (error) {
      logger.warn("Historical patterns query failed:", error.message);
    }
    return null;
  }

  async getCurrentTraffic(route) {
    try {
      const { db } = require("../config/database");
      const [rows] = await db.execute(
        `SELECT congestion_level, avg_speed, incident_count 
                FROM traffic_data 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
                ORDER BY created_at DESC LIMIT 1`,
      );

      if (rows[0]) {
        return {
          congestion: rows[0].congestion_level,
          avgSpeed: rows[0].avg_speed,
          incidents: rows[0].incident_count,
        };
      }
    } catch (error) {
      logger.warn("Traffic data query failed:", error.message);
    }
    return { congestion: "medium", avgSpeed: 40, incidents: 0 };
  }

  async getWeatherImpact() {
    try {
      const { db } = require("../config/database");
      const [rows] = await db.execute(
        `SELECT condition, temperature, visibility 
                FROM weather_data 
                ORDER BY created_at DESC LIMIT 1`,
      );

      if (rows[0]) {
        const severity = this.calculateWeatherSeverity(rows[0]);
        return { ...rows[0], severity };
      }
    } catch (error) {
      logger.warn("Weather data query failed:", error.message);
    }
    return { severity: "none" };
  }

  calculateWeatherSeverity(weather) {
    if (
      weather.condition?.toLowerCase().includes("rain") ||
      weather.condition?.toLowerCase().includes("storm")
    ) {
      return weather.visibility < 5 ? "high" : "medium";
    }
    if (weather.condition?.toLowerCase().includes("snow")) return "high";
    if (weather.visibility < 10) return "medium";
    return "low";
  }

  calculateTimeReliability(hour, trafficData, weatherImpact) {
    let reliability = 85; // Base reliability

    // Peak hours reduction
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
      reliability -= 15;
    } else if ((hour >= 6 && hour <= 7) || (hour >= 20 && hour <= 22)) {
      reliability -= 5;
    }

    // Traffic impact
    const trafficImpact = { low: 0, medium: -5, high: -15, severe: -25 };
    reliability += trafficImpact[trafficData?.congestion] || -5;

    // Weather impact
    const weatherImpactMap = { none: 0, low: -3, medium: -8, high: -15 };
    reliability += weatherImpactMap[weatherImpact?.severity] || 0;

    return Math.max(40, Math.min(98, reliability));
  }

  determineCrowdLevel(hour, dayOfWeek, historicalData) {
    // Weekend vs weekday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return hour >= 10 && hour <= 16 ? "High" : "Low";
    }

    // Weekday patterns
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return "High";
    } else if (hour >= 10 && hour <= 16) {
      return "Low";
    }

    return "Medium";
  }

  calculateDelayProbability(crowdLevel, trafficData, weatherImpact) {
    let probability = 0.1; // Base probability

    if (crowdLevel === "High") probability += 0.2;
    else if (crowdLevel === "Medium") probability += 0.1;

    if (trafficData?.congestion === "high") probability += 0.15;
    else if (trafficData?.congestion === "severe") probability += 0.25;

    if (weatherImpact?.severity === "high") probability += 0.2;
    else if (weatherImpact?.severity === "medium") probability += 0.1;

    return Math.min(0.8, probability);
  }

  generateRecommendations(route) {
    const recommendations = [];

    if (route.mode === "cab" && route.totalCost > 20) {
      recommendations.push("Consider public transport to save money");
    }

    if (route.mode === "walk" && route.totalTime > 60) {
      recommendations.push("This walk is long - consider mixed transport");
    }

    return recommendations;
  }
}

class NotificationAgent {
  constructor() {
    this.db = require("../config/database").db;
  }

  async checkRouteAlerts(source, destination, routes) {
    const alerts = [];

    // Check for weather alerts from database
    const weatherAlert = await this.checkWeather(source, destination);
    if (weatherAlert) alerts.push(weatherAlert);

    // Check for traffic alerts from database
    const trafficAlert = await this.checkTraffic(routes);
    if (trafficAlert) alerts.push(trafficAlert);

    // Check for route-specific alerts
    const routeAlerts = await this.checkRouteConditions(routes);
    alerts.push(...routeAlerts);

    return alerts;
  }

  async checkWeather(source, destination) {
    try {
      const [rows] = await this.db.execute(
        `SELECT * FROM weather_data 
                ORDER BY created_at DESC LIMIT 1`,
      );

      if (rows[0]) {
        const weather = rows[0];
        const severity = this.calculateWeatherSeverity(weather);

        // Only alert for significant weather
        if (severity !== "none") {
          return {
            id: `weather_${Date.now()}`,
            type: "weather",
            title: this.getWeatherTitle(weather.condition),
            message: this.getWeatherMessage(weather),
            severity,
            expires_at: new Date(Date.now() + 3600000).toISOString(),
            details: {
              condition: weather.condition,
              temperature: weather.temperature,
              humidity: weather.humidity,
              visibility: weather.visibility,
            },
          };
        }
      }
    } catch (error) {
      logger.warn("Weather check failed:", error.message);
    }
    return null;
  }

  calculateWeatherSeverity(weather) {
    const condition = weather.condition?.toLowerCase() || "";

    if (
      condition.includes("storm") ||
      condition.includes("tornado") ||
      condition.includes("blizzard")
    ) {
      return "severe";
    }
    if (
      condition.includes("heavy rain") ||
      condition.includes("heavy snow") ||
      condition.includes("fog")
    ) {
      return "high";
    }
    if (
      condition.includes("rain") ||
      condition.includes("snow") ||
      condition.includes("mist")
    ) {
      return "medium";
    }
    if (condition.includes("cloud") || condition.includes("overcast")) {
      return "low";
    }
    return "none";
  }

  getWeatherTitle(condition) {
    const c = condition?.toLowerCase() || "";
    if (c.includes("rain")) return "Rain Alert";
    if (c.includes("snow")) return "Snow Alert";
    if (c.includes("fog")) return "Fog Alert";
    if (c.includes("storm")) return "Storm Alert";
    if (c.includes("wind")) return "Wind Alert";
    return "Weather Advisory";
  }

  getWeatherMessage(weather) {
    const msgs = [];
    if (weather.temperature < 0) msgs.push("Freezing temperatures");
    if (weather.temperature > 35) msgs.push("Extreme heat");
    if (weather.condition?.toLowerCase().includes("rain"))
      msgs.push("Rain expected");
    if (weather.condition?.toLowerCase().includes("snow"))
      msgs.push("Snow expected");
    if (weather.visibility < 5) msgs.push("Low visibility");

    return msgs.length > 0
      ? msgs.join(". ") + " during your commute"
      : "Check weather conditions before traveling";
  }

  async checkTraffic(routes) {
    try {
      const [rows] = await this.db.execute(
        `SELECT * FROM traffic_data 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
                ORDER BY created_at DESC LIMIT 1`,
      );

      if (rows[0] && rows[0].congestion_level !== "low") {
        return {
          id: `traffic_${Date.now()}`,
          type: "traffic",
          title: "Traffic Advisory",
          message: `${rows[0].congestion_level.charAt(0).toUpperCase() + rows[0].congestion_level.slice(1)} traffic detected`,
          severity: rows[0].congestion_level === "severe" ? "high" : "medium",
          expires_at: new Date(Date.now() + 1800000).toISOString(),
          details: {
            congestion: rows[0].congestion_level,
            avgSpeed: rows[0].avg_speed,
            incidents: rows[0].incident_count,
          },
        };
      }
    } catch (error) {
      logger.warn("Traffic check failed:", error.message);
    }
    return null;
  }

  async checkRouteConditions(routes) {
    const alerts = [];

    try {
      // Check for any active incidents
      const [incidents] = await this.db.execute(
        `SELECT * FROM traffic_data 
                WHERE incident_count > 0 
                AND created_at > DATE_SUB(NOW(), INTERVAL 60 MINUTE)
                ORDER BY created_at DESC LIMIT 3`,
      );

      for (const incident of incidents) {
        alerts.push({
          id: `incident_${incident.id}`,
          type: "incident",
          title: "Route Incident",
          message: `${incident.incident_count} incident(s) reported on route`,
          severity: "medium",
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        });
      }
    } catch (error) {
      logger.warn("Route conditions check failed:", error.message);
    }

    return alerts;
  }

  async generatePersonalizedAlerts(userId) {
    const alerts = [];

    try {
      // Get user's commute history
      const [history] = await this.db.execute(
        `SELECT mode, AVG(duration) as avg_duration, 
                        AVG(cost) as avg_cost,
                        HOUR(planned_start) as hour
                FROM routes 
                WHERE user_id = ? 
                AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY mode, HOUR(planned_start)
                ORDER BY hour`,
        [userId],
      );

      if (history.length > 0) {
        // Find optimal time based on history
        const optimalTime = this.findOptimalTime(history);
        if (optimalTime) {
          alerts.push({
            type: "system",
            title: "Optimal Commute Time",
            message: `Based on your history, leaving at ${optimalTime} saves you ${optimalTime.savings} minutes`,
            severity: "low",
            expires_at: new Date(Date.now() + 86400000).toISOString(),
          });
        }

        // Check for cost-saving opportunities
        const savings = this.checkCostSavings(history);
        if (savings) {
          alerts.push({
            type: "savings",
            title: "Save on Commute",
            message: savings,
            severity: "low",
            expires_at: new Date(Date.now() + 86400000).toISOString(),
          });
        }
      }

      // Check for promotional offers
      const [promos] = await this.db.execute(
        `SELECT * FROM alerts 
                WHERE type = 'promotional' 
                AND expires_at > NOW()
                ORDER BY created_at DESC LIMIT 1`,
      );

      if (promos[0]) {
        alerts.push({
          type: "promotional",
          title: promos[0].title,
          message: promos[0].message,
          severity: "low",
          expires_at: promos[0].expires_at,
        });
      }
    } catch (error) {
      logger.warn("Personalized alerts generation failed:", error.message);
    }

    return alerts;
  }

  findOptimalTime(history) {
    // Find time with fastest average commute
    const timeStats = {};
    history.forEach((h) => {
      if (!timeStats[h.hour]) timeStats[h.hour] = { total: 0, count: 0 };
      timeStats[h.hour].total += h.avg_duration;
      timeStats[h.hour].count++;
    });

    let bestHour = null;
    let minAvg = Infinity;

    Object.entries(timeStats).forEach(([hour, stats]) => {
      const avg = stats.total / stats.count;
      if (avg < minAvg) {
        minAvg = avg;
        bestHour = parseInt(hour);
      }
    });

    if (bestHour !== null) {
      const currentHour = new Date().getHours();
      const savings = Math.abs(currentHour - bestHour) * 5; // Rough estimate
      return {
        time: `${bestHour}:00`,
        savings: Math.max(5, savings),
      };
    }
    return null;
  }

  checkCostSavings(history) {
    const cabRides = history.find((h) => h.mode === "cab");
    const publicTransport = history.find((h) =>
      ["bus", "train", "metro"].includes(h.mode),
    );

    if (
      cabRides &&
      publicTransport &&
      cabRides.avg_cost > publicTransport.avg_cost * 2
    ) {
      const savings = (cabRides.avg_cost - publicTransport.avg_cost).toFixed(2);
      return `You could save $${savings} on average by using public transport`;
    }
    return null;
  }
}

class AgentOrchestrator {
  constructor() {
    this.agents = {
      planner: new PlanningAgent(),
      optimizer: new OptimizationAgent(),
      analyzer: new AnalyticsAgent(),
      notifier: new NotificationAgent(),
    };
  }

  async planCommute(userId, source, destination, preferences) {
    const startTime = Date.now();

    try {
      // Step 1: Planning Agent - Get route possibilities
      const planningResult = await this.agents.planner.analyzeRoute(
        source,
        destination,
      );

      // Step 2: Optimization Agent - Calculate optimal routes
      const optimizedRoutes = await this.agents.optimizer.calculateOptions(
        planningResult,
        preferences,
      );

      // Step 3: Analytics Agent - Add insights and predictions
      const enhancedRoutes = await this.agents.analyzer.enhanceWithInsights(
        optimizedRoutes,
        userId,
      );

      // Step 4: Notification Agent - Check for alerts
      const alerts = await this.agents.notifier.checkRouteAlerts(
        source,
        destination,
        enhancedRoutes,
      );

      // Log agent activity
      await this.logAgentActivity("planCommute", startTime, {
        userId,
        source,
        destination,
      });

      return {
        routes: enhancedRoutes,
        alerts,
        agentMetadata: {
          processingTime: Date.now() - startTime,
          agents: Object.keys(this.agents),
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      await this.handleAgentError("planCommute", error);
      throw error;
    }
  }

  async optimizeExistingRoutes(routes) {
    // Re-optimize existing routes with current conditions
    const optimized = routes.map((route) => ({
      ...route,
      agentConfidence: 0.9,
      insights: this.agents.analyzer.generateInsights(route),
      predictions: this.agents.analyzer.generatePredictions(route),
    }));

    return optimized;
  }

  async generateRouteInsights(routeData, userId) {
    const { route, options } = routeData;

    return {
      bestTime: this.getBestTime(),
      crowdLevel: this.getCrowdLevel(),
      dayComparison: this.getDayComparison(),
      confidence: "High (92%)",
      recommendations: this.getRecommendations(options),
      routeInsights: options.reduce((acc, opt) => {
        acc[opt.mode] = {
          timeReliability: 85,
          crowdLikelihood: "Medium",
        };
        return acc;
      }, {}),
    };
  }

  async generateUserInsights(userId) {
    return {
      patterns: {
        mostFrequentMode: "mixed",
        averageTime: 45,
        averageCost: 12.5,
        peakHours: ["08:00", "09:00", "17:00", "18:00"],
      },
      recommendations: [
        "Consider taking the train in the morning - it's 15% faster",
        "You save $5.50 on average when using public transport",
      ],
      achievements: [
        "Eco Warrior: Saved 15kg CO₂ this month",
        "Time Saver: Saved 3 hours compared to driving",
      ],
    };
  }

  async generateDashboardInsights(startDate, endDate) {
    // Get real data from AnalyticsService
    const AnalyticsService = require('../services/analyticsService');
    
    const [commutesPerDay, revenueTrend, peakHours, modeDistribution] = await Promise.all([
      AnalyticsService.generateCommutesPerDay(startDate, endDate),
      AnalyticsService.generateRevenueTrend(startDate, endDate),
      AnalyticsService.generatePeakHours(startDate, endDate),
      AnalyticsService.generateModeDistribution(startDate, endDate),
    ]);
    
    return {
      commutesPerDay,
      revenueTrend,
      peakHours,
      modeDistribution,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateEnhancedAnalytics(startDate, endDate) {
    return {
      ...(await this.generateDashboardInsights(startDate, endDate)),
      predictions: {
        nextWeekTraffic: "Moderate",
        expectedGrowth: "+12%",
        peakHours: ["08:30", "09:00", "17:30", "18:00"],
      },
      anomalies: [],
      agentPerformance: {
        accuracy: 94.5,
        avgResponseTime: 123,
      },
    };
  }

  async checkHealth() {
    return {
      planner: { status: "healthy", lastActive: new Date().toISOString() },
      optimizer: { status: "healthy", lastActive: new Date().toISOString() },
      analyzer: { status: "healthy", lastActive: new Date().toISOString() },
      notifier: { status: "healthy", lastActive: new Date().toISOString() },
    };
  }

  async generatePersonalizedAlerts(userId) {
    return this.agents.notifier.generatePersonalizedAlerts(userId);
  }

  async logAgentActivity(action, startTime, metadata) {
    try {
      await db.execute(
        `INSERT INTO agent_logs (agent_name, action, input_data, processing_time_ms) 
                 VALUES (?, ?, ?, ?)`,
        [
          "Orchestrator",
          action,
          JSON.stringify(metadata),
          Date.now() - startTime,
        ],
      );
    } catch (error) {
      console.error("Failed to log agent activity:", error);
    }
  }

  async handleAgentError(action, error) {
    try {
      await db.execute(
        `INSERT INTO agent_logs (agent_name, action, success, error_message) 
                 VALUES (?, ?, ?, ?)`,
        ["Orchestrator", action, false, error.message],
      );
    } catch (logError) {
      console.error("Failed to log agent error:", logError);
    }
  }

  // Helper methods
  getBestTime() {
    return "8:30 AM - 9:30 AM";
  }

  getCrowdLevel() {
    return "Moderate";
  }

  getDayComparison() {
    return "20% faster than Tuesday";
  }

  getRecommendations(options) {
    return [
      "Leave 15 minutes earlier to avoid traffic",
      "Consider taking the express train for faster commute",
    ];
  }
}

module.exports = AgentOrchestrator;
