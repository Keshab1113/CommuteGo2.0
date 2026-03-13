// backend/src/agents/PlanningAgent.js
const { createTinyFishAgents } = require('../services/tinyfishService');

class PlanningAgent {
    constructor() {
        this.tinyfishAgents = null;
        this.mcpClient = null;
    }

    /**
     * Initialize TinyFish agents and MCP client
     */
    async initialize() {
        if (!this.tinyfishAgents) {
            this.tinyfishAgents = createTinyFishAgents();
        }
        if (!this.mcpClient) {
            const MCPClient = require('./MCPClient');
            this.mcpClient = new MCPClient();
        }
    }

    /**
     * Analyze route with TinyFish-powered multi-site search
     * @param {string} source - Origin location
     * @param {string} destination - Destination location
     * @param {Object} options - Search options (date, passengers, etc.)
     */
    async analyzeRoute(source, destination, options = {}) {
        await this.initialize();
        
        const { date, passengers = 1, transportMode } = options;
        
        // Use MCP to discover available route services
        const services = await this.mcpClient.discoverServices('route-planning');
        
        // Gather data from multiple sources
        const routeData = await Promise.all([
            this.getMapData(source, destination),
            this.getTrafficPatterns(source, destination),
            this.getWeatherImpact(source, destination),
            this.getHistoricalData(source, destination)
        ]);

        // Get real transport options from TinyFish
        const transportOptions = await this.getTransportOptions(source, destination, {
            date,
            passengers,
            mode: transportMode
        });

        return {
            possibleModes: ['cab', 'bus', 'train', 'metro', 'walk', 'mixed'],
            distance: this.calculateDistance(source, destination),
            estimatedBaseTime: this.estimateBaseTime(routeData),
            trafficFactors: routeData[1],
            weatherFactors: routeData[2],
            historicalPatterns: routeData[3],
            transportOptions, // Real-time data from TinyFish
            sources: this.getSources(transportOptions)
        };
    }

    /**
     * Get real transport options using TinyFish agents
     * Searches multiple sites for flights, buses, trains, and rideshare
     */
    async getTransportOptions(source, destination, options = {}) {
        const { date, passengers = 1, mode } = options;
        const results = {
            flights: [],
            buses: [],
            trains: [],
            rideshare: []
        };

        try {
            // Search all transport types in parallel using TinyFish
            const searchPromises = [];

            // Flight search
            if (!mode || mode === 'flight') {
                searchPromises.push(
                    this.tinyfishAgents.flight.searchFlights(source, destination, {
                        date,
                        passengers
                    }).catch(err => {
                        console.error('Flight search error:', err.message);
                        return [];
                    })
                );
            }

            // Bus search
            if (!mode || mode === 'bus') {
                searchPromises.push(
                    this.tinyfishAgents.bus.searchBuses(source, destination, {
                        date,
                        passengers
                    }).catch(err => {
                        console.error('Bus search error:', err.message);
                        return [];
                    })
                );
            }

            // Train search
            if (!mode || mode === 'train') {
                searchPromises.push(
                    this.tinyfishAgents.train.searchTrains(source, destination, {
                        date,
                        passengers
                    }).catch(err => {
                        console.error('Train search error:', err.message);
                        return [];
                    })
                );
            }

            // Rideshare search
            if (!mode || mode === 'rideshare' || mode === 'cab') {
                searchPromises.push(
                    this.tinyfishAgents.rideshare.getEstimates(source, destination).catch(err => {
                        console.error('Rideshare search error:', err.message);
                        return [];
                    })
                );
            }

            // Wait for all searches to complete
            const [flights, buses, trains, rideshare] = await Promise.all(searchPromises);

            results.flights = flights || [];
            results.buses = buses || [];
            results.trains = trains || [];
            results.rideshare = rideshare || [];

        } catch (error) {
            console.error('Error fetching transport options:', error.message);
        }

        return results;
    }

    /**
     * Get sources from which data was retrieved
     */
    getSources(transportOptions) {
        const sources = new Set();
        
        if (transportOptions.flights) {
            transportOptions.flights.forEach(f => {
                if (f.source) sources.add(f.source);
            });
        }
        if (transportOptions.buses) {
            transportOptions.buses.forEach(b => {
                if (b.source) sources.add(b.source);
            });
        }
        if (transportOptions.trains) {
            transportOptions.trains.forEach(t => {
                if (t.source) sources.add(t.source);
            });
        }
        if (transportOptions.rideshare) {
            transportOptions.rideshare.forEach(r => {
                if (r.provider) sources.add(r.provider);
            });
        }
        
        return Array.from(sources);
    }

    /**
     * Perform multi-site search using TinyFish
     * Searches multiple booking sites in parallel
     */
    async multiSiteSearch(source, destination, options = {}) {
        const { transportType = 'flight', date, passengers = 1 } = options;
        
        const sites = this.getBookingSites(transportType);
        
        const tinyfishClient = this.tinyfishAgents.client;
        
        // Use TinyFish for concurrent multi-site search
        return await tinyfishClient.multiSiteSearch(
            sites,
            { source, destination, date, passengers },
            transportType
        );
    }

    /**
     * Get list of booking sites for multi-site search
     */
    getBookingSites(transportType) {
        const sites = {
            flight: [
                'https://www.expedia.com/flights',
                'https://www.kayak.com/flights',
                'https://www.skyscanner.com',
                'https://www.google.com/travel/flights'
            ],
            bus: [
                'https://www.redbus.in',
                'https://www.busindia.com',
                'https://www.abhibus.com'
            ],
            train: [
                'https://www.irctc.co.in',
                'https://www.cleartrip.com/trains'
            ],
            rideshare: [
                'https://www.uber.com',
                'https://www.lyft.com'
            ]
        };
        
        return sites[transportType] || sites.flight;
    }

    async getMapData(source, destination) {
        // Use MCP to get map data from various providers
        const providers = await this.mcpClient.discoverServices('mapping');
        // Return aggregated map data
        return {};
    }

    calculateDistance(source, destination) {
        // Haversine formula for distance calculation
        // In production, use actual geocoding and distance matrix APIs
        return 15.5; // km
    }

    estimateBaseTime(routeData) {
        // Agent logic to estimate base travel time
        return 45; // minutes
    }
}

module.exports = PlanningAgent;