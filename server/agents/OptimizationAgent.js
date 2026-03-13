// backend/src/agents/OptimizationAgent.js
const { createTinyFishAgents } = require('../services/tinyfishService');

class OptimizationAgent {
    constructor() {
        this.tinyfishAgents = null;
        this.mcpClient = null;
        this.dataSources = [];
    }

    async initialize() {
        // Initialize TinyFish agents and MCP client for real-time price comparison
        try {
            this.tinyfishAgents = createTinyFishAgents();
            // MCP client would be initialized here if available
            // this.mcpClient = new MCPClient();
            console.log('[OptimizationAgent] TinyFish agents initialized for price comparison');
        } catch (error) {
            console.error('[OptimizationAgent] Failed to initialize TinyFish agents:', error.message);
        }
    }

    async calculateOptions(planningResult, preferences) {
        const modes = planningResult.possibleModes;
        const options = [];
        
        // Initialize TinyFish agents if not already done
        if (!this.tinyfishAgents) {
            await this.initialize();
        }
        
        for (const mode of modes) {
            const option = await this.generateOption(mode, planningResult, preferences);
            options.push(option);
        }
        
        // Apply multi-objective optimization
        const optimized = this.applyParetoOptimization(options);
        
        // Rank options
        return this.rankOptions(optimized, preferences);
    }

    async generateOption(mode, planningResult, preferences) {
        const baseTime = planningResult.estimatedBaseTime;
        
        // Apply mode-specific factors
        const timeFactor = this.getTimeFactor(mode);
        const costFactor = this.getCostFactor(mode);
        const ecoFactor = this.getEcoFactor(mode);
        
        // Get real-time prices using TinyFish if available
        let realTimePrices = null;
        if (this.tinyfishAgents && planningResult.origin && planningResult.destination) {
            realTimePrices = await this.getRealTimePrices(
                planningResult.origin,
                planningResult.destination,
                mode
            );
        }
        
        const option = {
            mode,
            totalTime: Math.round(baseTime * timeFactor),
            totalCost: realTimePrices?.bestPrice || this.calculateCost(mode, planningResult.distance, baseTime),
            carbonKg: this.calculateCarbon(mode, planningResult.distance),
            distanceKm: planningResult.distance,
            steps: this.generateSteps(mode, planningResult),
            confidence: this.calculateConfidence(mode, planningResult),
            // Add real-time price data if available
            ...(realTimePrices && {
                priceData: {
                    bestPrice: realTimePrices.bestPrice,
                    averagePrice: realTimePrices.averagePrice,
                    priceRange: realTimePrices.priceRange,
                    provider: realTimePrices.provider,
                    bookingUrl: realTimePrices.bookingUrl,
                    lastUpdated: realTimePrices.lastUpdated
                }
            })
        };
        
        // Apply user preferences
        if (preferences) {
            this.applyPreferences(option, preferences);
        }
        
        return option;
    }

    async getRealTimePrices(origin, destination, mode) {
        // Map mode to TinyFish transport type
        const transportMap = {
            flight: 'flight',
            bus: 'bus',
            train: 'train',
            cab: 'rideshare',
            mixed: 'flight'
        };
        
        const transportType = transportMap[mode] || 'flight';
        
        try {
            let prices = null;
            
            // Use appropriate TinyFish agent based on transport type
            switch (transportType) {
                case 'flight':
                    if (this.tinyfishAgents.flightAgent) {
                        const results = await this.tinyfishAgents.flightAgent.searchFlights(origin, destination);
                        prices = this.extractPriceData(results, 'flight');
                    }
                    break;
                case 'bus':
                    if (this.tinyfishAgents.busAgent) {
                        const results = await this.tinyfishAgents.busAgent.searchBuses(origin, destination);
                        prices = this.extractPriceData(results, 'bus');
                    }
                    break;
                case 'train':
                    if (this.tinyfishAgents.trainAgent) {
                        const results = await this.tinyfishAgents.trainAgent.searchTrains(origin, destination);
                        prices = this.extractPriceData(results, 'train');
                    }
                    break;
                case 'rideshare':
                    if (this.tinyfishAgents.rideShareAgent) {
                        const results = await this.tinyfishAgents.rideShareAgent.getRideEstimate(origin, destination);
                        prices = this.extractPriceData(results, 'rideshare');
                    }
                    break;
            }
            
            // Track data source
            if (prices) {
                this.dataSources.push({
                    type: transportType,
                    origin,
                    destination,
                    timestamp: new Date().toISOString()
                });
            }
            
            return prices;
        } catch (error) {
            console.error(`[OptimizationAgent] Error fetching real-time prices for ${mode}:`, error.message);
            return null;
        }
    }

    extractPriceData(results, type) {
        if (!results || !Array.isArray(results) || results.length === 0) {
            return null;
        }
        
        const prices = results.map(r => r.price || r.cost || r.fare || 0).filter(p => p > 0);
        
        if (prices.length === 0) {
            return null;
        }
        
        const bestPrice = Math.min(...prices);
        const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
        
        // Find the result with best price
        const bestResult = results.find(r => (r.price || r.cost || r.fare) === bestPrice);
        
        return {
            bestPrice: Math.round(bestPrice * 100) / 100,
            averagePrice: Math.round(averagePrice * 100) / 100,
            priceRange,
            provider: bestResult?.provider || bestResult?.operator || 'Unknown',
            bookingUrl: bestResult?.bookingUrl || bestResult?.url || bestResult?.link || null,
            lastUpdated: new Date().toISOString()
        };
    }

    getSources() {
        return this.dataSources;
    }

    clearSources() {
        this.dataSources = [];
    }

    applyParetoOptimization(options) {
        // Pareto frontier optimization for multi-objective trade-offs
        const frontiers = [];
        
        for (let i = 0; i < options.length; i++) {
            let isDominated = false;
            
            for (let j = 0; j < options.length; j++) {
                if (i !== j) {
                    if (this.dominates(options[j], options[i])) {
                        isDominated = true;
                        break;
                    }
                }
            }
            
            if (!isDominated) {
                frontiers.push(options[i]);
            }
        }
        
        return frontiers;
    }

    dominates(optionA, optionB) {
        // Check if optionA dominates optionB in all objectives
        return (
            optionA.totalTime <= optionB.totalTime &&
            optionA.totalCost <= optionB.totalCost &&
            optionA.carbonKg <= optionB.carbonKg &&
            (
                optionA.totalTime < optionB.totalTime ||
                optionA.totalCost < optionB.totalCost ||
                optionA.carbonKg < optionB.carbonKg
            )
        );
    }

    rankOptions(options, preferences) {
        const weights = this.getPreferenceWeights(preferences);
        
        // Normalize values
        const maxTime = Math.max(...options.map(o => o.totalTime));
        const maxCost = Math.max(...options.map(o => o.totalCost));
        const maxCarbon = Math.max(...options.map(o => o.carbonKg));
        
        // Calculate weighted scores
        options.forEach(option => {
            const timeScore = 1 - (option.totalTime / maxTime);
            const costScore = 1 - (option.totalCost / maxCost);
            const carbonScore = 1 - (option.carbonKg / maxCarbon);
            
            option.score = (
                timeScore * weights.time +
                costScore * weights.cost +
                carbonScore * weights.carbon
            );
        });
        
        // Sort by score
        return options.sort((a, b) => b.score - a.score);
    }

    getPreferenceWeights(preferences) {
        const defaultWeights = { time: 0.33, cost: 0.33, carbon: 0.34 };
        
        if (!preferences || !preferences.modePreference) {
            return defaultWeights;
        }
        
        switch (preferences.modePreference) {
            case 'fastest':
                return { time: 0.7, cost: 0.15, carbon: 0.15 };
            case 'cheapest':
                return { time: 0.15, cost: 0.7, carbon: 0.15 };
            case 'greenest':
                return { time: 0.15, cost: 0.15, carbon: 0.7 };
            default:
                return defaultWeights;
        }
    }

    getTimeFactor(mode) {
        const factors = {
            walk: 3.0,
            bus: 1.2,
            train: 0.7,
            metro: 0.8,
            cab: 0.6,
            mixed: 0.9
        };
        return factors[mode] || 1.0;
    }

    calculateCost(mode, distance, time) {
        const rates = {
            walk: 0,
            bus: 2.5 + (distance * 0.1),
            train: 3.0 + (distance * 0.15),
            metro: 2.0 + (distance * 0.12),
            cab: 5.0 + (distance * 1.5) + (time * 0.2),
            mixed: 4.0 + (distance * 0.8)
        };
        return rates[mode] || 5.0;
    }

    calculateCarbon(mode, distance) {
        const emissionFactors = {
            walk: 0,
            bus: 0.089,
            train: 0.041,
            metro: 0.041,
            cab: 0.192,
            mixed: 0.1
        };
        return distance * (emissionFactors[mode] || 0.1);
    }

    calculateConfidence(mode, planningResult) {
        // Confidence based on data availability and historical accuracy
        return 0.85 + (Math.random() * 0.1); // Simplified
    }

    generateSteps(mode, planningResult) {
        // Generate step-by-step directions
        const steps = [];
        
        if (mode === 'mixed') {
            steps.push(
                { mode: 'walk', from: 'Start', to: 'Bus Stop', duration: 5 },
                { mode: 'bus', from: 'Bus Stop', to: 'Train Station', duration: 15 },
                { mode: 'train', from: 'Train Station', to: 'Destination', duration: 20 }
            );
        } else {
            steps.push({
                mode,
                from: 'Start',
                to: 'Destination',
                duration: planningResult.estimatedBaseTime
            });
        }
        
        return steps;
    }

    applyPreferences(option, preferences) {
        // Apply filters like avoidTolls, maxCost, maxTime
        // This is handled by the main agent logic
        return option;
    }
}