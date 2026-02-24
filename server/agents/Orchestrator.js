// backend/src/agents/Orchestrator.js
const { db } = require('../config/database');

class PlanningAgent {
    async analyzeRoute(source, destination) {
        // Mock implementation for now
        return {
            possibleModes: ['cab', 'bus', 'train', 'metro', 'walk', 'mixed'],
            distance: this.calculateDistance(source, destination),
            estimatedBaseTime: 45,
            trafficFactors: { congestion: 'medium' },
            weatherFactors: { condition: 'clear' },
            historicalPatterns: { avgTime: 42 }
        };
    }

    calculateDistance(source, destination) {
        // Mock distance calculation
        return 15.5; // km
    }
}

class OptimizationAgent {
    async calculateOptions(planningResult, preferences) {
        const modes = planningResult.possibleModes;
        const options = [];
        
        modes.forEach((mode, index) => {
            const baseTime = planningResult.estimatedBaseTime;
            
            // Mode-specific factors
            const timeFactors = {
                walk: 3.0,
                bus: 1.2,
                train: 0.7,
                metro: 0.8,
                cab: 0.6,
                mixed: 0.9
            };
            
            const costRates = {
                walk: 0,
                bus: 2.5,
                train: 3.0,
                metro: 2.0,
                cab: 5.0,
                mixed: 4.0
            };
            
            const emissionFactors = {
                walk: 0,
                bus: 0.089,
                train: 0.041,
                metro: 0.041,
                cab: 0.192,
                mixed: 0.1
            };
            
            const timeFactor = timeFactors[mode] || 1.0;
            const distance = planningResult.distance;
            
            options.push({
                id: `opt_${Date.now()}_${index}`,
                mode,
                totalTime: Math.round(baseTime * timeFactor),
                totalCost: costRates[mode] + (distance * (mode === 'cab' ? 1.5 : 0.2)),
                carbonKg: distance * (emissionFactors[mode] || 0.1),
                distanceKm: distance,
                agentConfidence: 0.85 + (Math.random() * 0.1),
                steps: this.generateSteps(mode),
                rankCheapest: 0,
                rankFastest: 0,
                rankEco: 0
            });
        });
        
        // Calculate ranks
        this.calculateRanks(options);
        
        return options;
    }

    calculateRanks(options) {
        // Sort by cost
        const sortedByCost = [...options].sort((a, b) => a.totalCost - b.totalCost);
        sortedByCost.forEach((opt, idx) => {
            const option = options.find(o => o.mode === opt.mode);
            if (option) option.rankCheapest = idx + 1;
        });
        
        // Sort by time
        const sortedByTime = [...options].sort((a, b) => a.totalTime - b.totalTime);
        sortedByTime.forEach((opt, idx) => {
            const option = options.find(o => o.mode === opt.mode);
            if (option) option.rankFastest = idx + 1;
        });
        
        // Sort by carbon
        const sortedByCarbon = [...options].sort((a, b) => a.carbonKg - b.carbonKg);
        sortedByCarbon.forEach((opt, idx) => {
            const option = options.find(o => o.mode === opt.mode);
            if (option) option.rankEco = idx + 1;
        });
    }

    generateSteps(mode) {
        if (mode === 'mixed') {
            return [
                { mode: 'walk', from: 'Start', to: 'Bus Stop', duration: 5, distance: 0.3 },
                { mode: 'bus', from: 'Bus Stop', to: 'Train Station', duration: 15, distance: 3.2 },
                { mode: 'train', from: 'Train Station', to: 'Destination', duration: 20, distance: 8.5 }
            ];
        }
        return [
            { mode, from: 'Start', to: 'Destination', duration: 30, distance: 10 }
        ];
    }
}

class AnalyticsAgent {
    async enhanceWithInsights(routes, userId) {
        return routes.map(route => ({
            ...route,
            insights: this.generateInsights(route),
            predictions: this.generatePredictions(route),
            recommendations: this.generateRecommendations(route)
        }));
    }

    generateInsights(route) {
        const insights = [];
        
        if (route.rankCheapest === 1) {
            insights.push({
                type: 'saving',
                message: 'This is the most affordable option',
                icon: '💰',
                detail: `Save up to $${(route.totalCost * 0.3).toFixed(2)} compared to other options`
            });
        }
        
        if (route.rankFastest === 1) {
            insights.push({
                type: 'fast',
                message: 'Fastest route available',
                icon: '⚡',
                detail: `Save ${Math.round(route.totalTime * 0.2)} minutes compared to average`
            });
        }
        
        if (route.rankEco === 1) {
            insights.push({
                type: 'eco',
                message: 'Most environmentally friendly',
                icon: '🌱',
                detail: `${route.carbonKg.toFixed(1)} kg CO₂ - lowest carbon footprint`
            });
        }
        
        return insights;
    }

    generatePredictions(route) {
        const hour = new Date().getHours();
        let crowdLevel = 'Medium';
        let timeReliability = 85;
        
        if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
            crowdLevel = 'High';
            timeReliability = 70;
        } else if (hour >= 11 && hour <= 15) {
            crowdLevel = 'Low';
            timeReliability = 95;
        }
        
        return {
            timeReliability,
            costStability: 90,
            crowdLikelihood: crowdLevel,
            delayProbability: crowdLevel === 'High' ? 0.3 : 0.1
        };
    }

    generateRecommendations(route) {
        const recommendations = [];
        
        if (route.mode === 'cab' && route.totalCost > 20) {
            recommendations.push('Consider public transport to save money');
        }
        
        if (route.mode === 'walk' && route.totalTime > 60) {
            recommendations.push('This walk is long - consider mixed transport');
        }
        
        return recommendations;
    }
}

class NotificationAgent {
    async checkRouteAlerts(source, destination, routes) {
        const alerts = [];
        
        // Check for weather alerts
        const weatherAlert = this.checkWeather(source, destination);
        if (weatherAlert) alerts.push(weatherAlert);
        
        // Check for traffic alerts
        const trafficAlert = this.checkTraffic(routes);
        if (trafficAlert) alerts.push(trafficAlert);
        
        return alerts;
    }

    checkWeather(source, destination) {
        // Mock weather check
        const random = Math.random();
        if (random > 0.7) {
            return {
                id: `weather_${Date.now()}`,
                type: 'weather',
                title: 'Weather Alert',
                message: 'Light rain expected during your commute',
                severity: 'low',
                expires_at: new Date(Date.now() + 3600000).toISOString()
            };
        }
        return null;
    }

    checkTraffic(routes) {
        // Mock traffic check
        const random = Math.random();
        if (random > 0.8) {
            return {
                id: `traffic_${Date.now()}`,
                type: 'traffic',
                title: 'Traffic Alert',
                message: 'Heavy traffic expected on your route',
                severity: 'medium',
                expires_at: new Date(Date.now() + 1800000).toISOString()
            };
        }
        return null;
    }

    async generatePersonalizedAlerts(userId) {
        // Mock personalized alerts
        const alerts = [];
        
        if (Math.random() > 0.5) {
            alerts.push({
                type: 'system',
                title: 'Optimal Commute Time',
                message: 'Based on your history, leaving at 8:30 AM saves you 15 minutes',
                severity: 'low',
                expires_at: new Date(Date.now() + 86400000).toISOString()
            });
        }
        
        if (Math.random() > 0.7) {
            alerts.push({
                type: 'promotional',
                title: 'Public Transport Discount',
                message: '20% off on bus passes this week',
                severity: 'low',
                expires_at: new Date(Date.now() + 604800000).toISOString()
            });
        }
        
        return alerts;
    }
}

class AgentOrchestrator {
    constructor() {
        this.agents = {
            planner: new PlanningAgent(),
            optimizer: new OptimizationAgent(),
            analyzer: new AnalyticsAgent(),
            notifier: new NotificationAgent()
        };
    }

    async planCommute(userId, source, destination, preferences) {
        const startTime = Date.now();
        
        try {
            // Step 1: Planning Agent - Get route possibilities
            const planningResult = await this.agents.planner.analyzeRoute(source, destination);
            
            // Step 2: Optimization Agent - Calculate optimal routes
            const optimizedRoutes = await this.agents.optimizer.calculateOptions(planningResult, preferences);
            
            // Step 3: Analytics Agent - Add insights and predictions
            const enhancedRoutes = await this.agents.analyzer.enhanceWithInsights(optimizedRoutes, userId);
            
            // Step 4: Notification Agent - Check for alerts
            const alerts = await this.agents.notifier.checkRouteAlerts(source, destination, enhancedRoutes);
            
            // Log agent activity
            await this.logAgentActivity('planCommute', startTime, {
                userId, source, destination
            });
            
            return {
                routes: enhancedRoutes,
                alerts,
                agentMetadata: {
                    processingTime: Date.now() - startTime,
                    agents: Object.keys(this.agents),
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            await this.handleAgentError('planCommute', error);
            throw error;
        }
    }

    async optimizeExistingRoutes(routes) {
        // Re-optimize existing routes with current conditions
        const optimized = routes.map(route => ({
            ...route,
            agentConfidence: 0.9,
            insights: this.agents.analyzer.generateInsights(route),
            predictions: this.agents.analyzer.generatePredictions(route)
        }));
        
        return optimized;
    }

    async generateRouteInsights(routeData, userId) {
        const { route, options } = routeData;
        
        return {
            bestTime: this.getBestTime(),
            crowdLevel: this.getCrowdLevel(),
            dayComparison: this.getDayComparison(),
            confidence: 'High (92%)',
            recommendations: this.getRecommendations(options),
            routeInsights: options.reduce((acc, opt) => {
                acc[opt.mode] = {
                    timeReliability: 85,
                    crowdLikelihood: 'Medium'
                };
                return acc;
            }, {})
        };
    }

    async generateUserInsights(userId) {
        return {
            patterns: {
                mostFrequentMode: 'mixed',
                averageTime: 45,
                averageCost: 12.50,
                peakHours: ['08:00', '09:00', '17:00', '18:00']
            },
            recommendations: [
                'Consider taking the train in the morning - it\'s 15% faster',
                'You save $5.50 on average when using public transport'
            ],
            achievements: [
                'Eco Warrior: Saved 15kg CO₂ this month',
                'Time Saver: Saved 3 hours compared to driving'
            ]
        };
    }

    async generateDashboardInsights(startDate, endDate) {
        return {
            overview: {
                totalCommutes: 1250,
                activeUsers: 342,
                averageTime: 38,
                averageCost: 11.25
            },
            trends: [
                { date: 'Mon', commutes: 245 },
                { date: 'Tue', commutes: 278 },
                { date: 'Wed', commutes: 312 },
                { date: 'Thu', commutes: 298 },
                { date: 'Fri', commutes: 267 }
            ],
            popularModes: [
                { mode: 'Bus', percentage: 35 },
                { mode: 'Train', percentage: 28 },
                { mode: 'Metro', percentage: 22 },
                { mode: 'Cab', percentage: 15 }
            ]
        };
    }

    async generateEnhancedAnalytics(startDate, endDate) {
        return {
            ...(await this.generateDashboardInsights(startDate, endDate)),
            predictions: {
                nextWeekTraffic: 'Moderate',
                expectedGrowth: '+12%',
                peakHours: ['08:30', '09:00', '17:30', '18:00']
            },
            anomalies: [],
            agentPerformance: {
                accuracy: 94.5,
                avgResponseTime: 123
            }
        };
    }

    async checkHealth() {
        return {
            planner: { status: 'healthy', lastActive: new Date().toISOString() },
            optimizer: { status: 'healthy', lastActive: new Date().toISOString() },
            analyzer: { status: 'healthy', lastActive: new Date().toISOString() },
            notifier: { status: 'healthy', lastActive: new Date().toISOString() }
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
                ['Orchestrator', action, JSON.stringify(metadata), Date.now() - startTime]
            );
        } catch (error) {
            console.error('Failed to log agent activity:', error);
        }
    }

    async handleAgentError(action, error) {
        
        try {
            await db.execute(
                `INSERT INTO agent_logs (agent_name, action, success, error_message) 
                 VALUES (?, ?, ?, ?)`,
                ['Orchestrator', action, false, error.message]
            );
        } catch (logError) {
            console.error('Failed to log agent error:', logError);
        }
    }

    // Helper methods
    getBestTime() {
        return '8:30 AM - 9:30 AM';
    }

    getCrowdLevel() {
        return 'Moderate';
    }

    getDayComparison() {
        return '20% faster than Tuesday';
    }

    getRecommendations(options) {
        return [
            'Leave 15 minutes earlier to avoid traffic',
            'Consider taking the express train for faster commute'
        ];
    }
}

module.exports = AgentOrchestrator;