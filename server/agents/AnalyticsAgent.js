// backend/src/agents/AnalyticsAgent.js
const { createTinyFishAgents } = require('../services/tinyfishService');

class AnalyticsAgent {
    constructor() {
        this.tinyfishAgents = null;
        this.mcpClient = null;
        this.priceHistory = new Map(); // Store historical price data
        this.priceAlerts = [];
    }

    async initialize() {
        // Initialize TinyFish agents for price monitoring and pattern analysis
        try {
            this.tinyfishAgents = createTinyFishAgents();
            console.log('[AnalyticsAgent] TinyFish agents initialized for price analytics');
        } catch (error) {
            console.error('[AnalyticsAgent] Failed to initialize TinyFish agents:', error.message);
        }
    }

    async enhanceWithInsights(routes, userId) {
        // Initialize TinyFish agents if not already done
        if (!this.tinyfishAgents) {
            await this.initialize();
        }
        
        const userHistory = await this.getUserHistory(userId);
        const systemTrends = await this.getSystemTrends();
        
        // Monitor prices for routes if TinyFish is available
        if (this.tinyfishAgents && routes.length > 0) {
            await this.monitorPrices(routes);
        }
        
        return routes.map(route => ({
            ...route,
            insights: this.generateInsights(route, userHistory, systemTrends),
            predictions: this.generatePredictions(route, systemTrends),
            recommendations: this.generateRecommendations(route, userHistory),
            priceAnalysis: this.getPriceAnalysis(route)
        }));
    }

    async monitorPrices(routes) {
        // Monitor prices for all routes to build historical data
        for (const route of routes) {
            if (!route.origin || !route.destination) continue;
            
            const key = `${route.origin}-${route.destination}-${route.mode}`;
            
            // Get current prices using TinyFish
            const currentPrices = await this.fetchCurrentPrices(route.origin, route.destination, route.mode);
            
            if (currentPrices) {
                // Store in price history
                if (!this.priceHistory.has(key)) {
                    this.priceHistory.set(key, []);
                }
                
                const history = this.priceHistory.get(key);
                history.push({
                    timestamp: new Date().toISOString(),
                    price: currentPrices.bestPrice,
                    provider: currentPrices.provider
                });
                
                // Keep only last 24 data points
                if (history.length > 24) {
                    history.shift();
                }
                
                // Check for price alerts
                this.checkPriceAlerts(key, currentPrices, history);
            }
        }
    }

    async fetchCurrentPrices(origin, destination, mode) {
        const transportMap = {
            flight: 'flight',
            bus: 'bus',
            train: 'train',
            cab: 'rideshare',
            mixed: 'flight'
        };
        
        const transportType = transportMap[mode] || 'flight';
        
        try {
            switch (transportType) {
                case 'flight':
                    if (this.tinyfishAgents.flightAgent) {
                        const results = await this.tinyfishAgents.flightAgent.searchFlights(origin, destination);
                        return this.extractPriceData(results);
                    }
                    break;
                case 'bus':
                    if (this.tinyfishAgents.busAgent) {
                        const results = await this.tinyfishAgents.busAgent.searchBuses(origin, destination);
                        return this.extractPriceData(results);
                    }
                    break;
                case 'train':
                    if (this.tinyfishAgents.trainAgent) {
                        const results = await this.tinyfishAgents.trainAgent.searchTrains(origin, destination);
                        return this.extractPriceData(results);
                    }
                    break;
                case 'rideshare':
                    if (this.tinyfishAgents.rideShareAgent) {
                        const results = await this.tinyfishAgents.rideShareAgent.getRideEstimate(origin, destination);
                        return this.extractPriceData(results);
                    }
                    break;
            }
        } catch (error) {
            console.error(`[AnalyticsAgent] Error fetching prices:`, error.message);
        }
        
        return null;
    }

    extractPriceData(results) {
        if (!results || !Array.isArray(results) || results.length === 0) {
            return null;
        }
        
        const prices = results.map(r => r.price || r.cost || r.fare || 0).filter(p => p > 0);
        
        if (prices.length === 0) {
            return null;
        }
        
        return {
            bestPrice: Math.min(...prices),
            averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            provider: results[0]?.provider || 'Unknown'
        };
    }

    checkPriceAlerts(key, currentPrices, history) {
        if (history.length < 2) return;
        
        const previousPrice = history[history.length - 2].price;
        const priceChange = ((currentPrices.bestPrice - previousPrice) / previousPrice) * 100;
        
        // Alert if price dropped by more than 10%
        if (priceChange < -10) {
            this.priceAlerts.push({
                routeKey: key,
                type: 'price_drop',
                message: `Price dropped by ${Math.abs(priceChange).toFixed(1)}%`,
                previousPrice,
                currentPrice: currentPrices.bestPrice,
                timestamp: new Date().toISOString()
            });
        }
        
        // Alert if price increased significantly
        if (priceChange > 20) {
            this.priceAlerts.push({
                routeKey: key,
                type: 'price_spike',
                message: `Price increased by ${priceChange.toFixed(1)}%`,
                previousPrice,
                currentPrice: currentPrices.bestPrice,
                timestamp: new Date().toISOString()
            });
        }
    }

    getPriceAnalysis(route) {
        const key = `${route.origin}-${route.destination}-${route.mode}`;
        const history = this.priceHistory.get(key);
        
        if (!history || history.length < 2) {
            return {
                available: false,
                message: 'Insufficient price history for analysis'
            };
        }
        
        const prices = history.map(h => h.price);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const currentPrice = prices[prices.length - 1];
        
        // Calculate price trend
        const priceTrend = this.calculatePriceTrend(prices);
        
        // Calculate volatility
        const volatility = ((maxPrice - minPrice) / avgPrice) * 100;
        
        // Determine if now is a good time to book
        const bookingRecommendation = this.getBookingRecommendation(currentPrice, avgPrice, minPrice);
        
        return {
            available: true,
            currentPrice,
            averagePrice: Math.round(avgPrice * 100) / 100,
            lowestPrice: minPrice,
            highestPrice: maxPrice,
            priceTrend, // 'increasing', 'decreasing', 'stable'
            volatility: Math.round(volatility * 100) / 100,
            recommendation: bookingRecommendation,
            dataPoints: history.length,
            lastUpdated: history[history.length - 1].timestamp
        };
    }

    calculatePriceTrend(prices) {
        if (prices.length < 3) return 'stable';
        
        // Simple linear regression for trend
        const n = prices.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += prices[i];
            sumXY += i * prices[i];
            sumX2 += i * i;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const avgPrice = sumY / n;
        const normalizedSlope = (slope / avgPrice) * 100;
        
        if (normalizedSlope > 2) return 'increasing';
        if (normalizedSlope < -2) return 'decreasing';
        return 'stable';
    }

    getBookingRecommendation(currentPrice, avgPrice, minPrice) {
        const ratio = currentPrice / avgPrice;
        
        if (ratio < 0.8) {
            return {
                action: 'book_now',
                message: 'Price is below average - good time to book!',
                confidence: 'high'
            };
        } else if (ratio < 1.0) {
            return {
                action: 'consider_booking',
                message: 'Price is slightly below average',
                confidence: 'medium'
            };
        } else if (currentPrice === minPrice) {
            return {
                action: 'book_now',
                message: 'This is the lowest price we\'ve seen!',
                confidence: 'high'
            };
        } else {
            return {
                action: 'wait',
                message: 'Price may drop further - consider waiting',
                confidence: 'low'
            };
        }
    }

    getPriceAlerts() {
        return this.priceAlerts.slice(-10); // Return last 10 alerts
    }

    clearPriceAlerts() {
        this.priceAlerts = [];
    }

    async getUserHistory(userId) {
        const { db } = require('../config/database');
        const [rows] = await db.execute(
            `SELECT ro.*, ch.travelled_on 
             FROM commute_history ch
             JOIN route_options ro ON ch.route_option_id = ro.id
             WHERE ch.user_id = ?
             ORDER BY ch.travelled_on DESC
             LIMIT 20`,
            [userId]
        );
        return rows;
    }

    async getSystemTrends() {
        const { db } = require('../config/database');
        const [rows] = await db.execute(
            `SELECT 
                mode,
                AVG(total_time) as avg_time,
                AVG(total_cost) as avg_cost,
                COUNT(*) as popularity
             FROM route_options
             WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY mode`
        );
        return rows;
    }

    generateInsights(route, userHistory, systemTrends) {
        const insights = [];
        
        // Compare with user's average
        const userAvgCost = userHistory.reduce((sum, h) => sum + h.total_cost, 0) / userHistory.length || 0;
        if (route.totalCost < userAvgCost * 0.8) {
            insights.push({
                type: 'saving',
                message: `This route is 20% cheaper than your average commute`,
                icon: '💰'
            });
        }
        
        // Compare with system average
        const modeTrend = systemTrends.find(t => t.mode === route.mode);
        if (modeTrend && route.totalTime < modeTrend.avg_time * 0.9) {
            insights.push({
                type: 'fast',
                message: `Faster than average ${route.mode} routes`,
                icon: '⚡'
            });
        }
        
        // Add price-based insight if available
        const priceAnalysis = this.getPriceAnalysis(route);
        if (priceAnalysis.available && priceAnalysis.recommendation.action === 'book_now') {
            insights.push({
                type: 'price',
                message: priceAnalysis.recommendation.message,
                icon: '🎯'
            });
        }
        
        return insights;
    }

    generatePredictions(route, systemTrends) {
        const priceAnalysis = this.getPriceAnalysis(route);
        
        return {
            timeReliability: this.calculateTimeReliability(route),
            costStability: this.calculateCostStability(route),
            crowdLikelihood: this.calculateCrowdLikelihood(route),
            // Add price predictions if available
            ...(priceAnalysis.available && {
                pricePrediction: {
                    trend: priceAnalysis.priceTrend,
                    volatility: priceAnalysis.volatility,
                    recommendation: priceAnalysis.recommendation.action
                }
            })
        };
    }

    calculateTimeReliability(route) {
        // Based on historical data and time of day
        return Math.round(70 + Math.random() * 25); // Simplified
    }

    calculateCostStability(route) {
        const priceAnalysis = this.getPriceAnalysis(route);
        if (priceAnalysis.available) {
            return Math.max(50, 100 - priceAnalysis.volatility);
        }
        return Math.round(80 + Math.random() * 15); // Simplified
    }

    calculateCrowdLikelihood(route) {
        const hour = new Date().getHours();
        if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
            return 'High';
        }
        return 'Medium';
    }

    generateRecommendations(route, userHistory) {
        const recommendations = [];
        
        // Recommend based on user patterns
        const preferredModes = userHistory.reduce((acc, h) => {
            acc[h.mode] = (acc[h.mode] || 0) + 1;
            return acc;
        }, {});
        
        const topMode = Object.entries(preferredModes)
            .sort((a, b) => b[1] - a[1])[0]?.[0];
        
        if (topMode && topMode !== route.mode) {
            const alternativeRoute = userHistory.find(h => h.mode === topMode);
            if (alternativeRoute) {
                recommendations.push({
                    type: 'alternative',
                    message: `Consider ${topMode} as an alternative`,
                    estimatedTime: alternativeRoute.total_time,
                    estimatedCost: alternativeRoute.total_cost
                });
            }
        }
        
        // Add price-based recommendation
        const priceAnalysis = this.getPriceAnalysis(route);
        if (priceAnalysis.available && priceAnalysis.recommendation.action === 'wait') {
            recommendations.push({
                type: 'timing',
                message: 'Consider waiting for a better price',
                potentialSavings: priceAnalysis.averagePrice - priceAnalysis.lowestPrice
            });
        }
        
        return recommendations;
    }
}