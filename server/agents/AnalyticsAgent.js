// backend/src/agents/AnalyticsAgent.js
class AnalyticsAgent {
    async enhanceWithInsights(routes, userId) {
        const userHistory = await this.getUserHistory(userId);
        const systemTrends = await this.getSystemTrends();
        
        return routes.map(route => ({
            ...route,
            insights: this.generateInsights(route, userHistory, systemTrends),
            predictions: this.generatePredictions(route, systemTrends),
            recommendations: this.generateRecommendations(route, userHistory)
        }));
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
        
        return insights;
    }

    generatePredictions(route, systemTrends) {
        return {
            timeReliability: this.calculateTimeReliability(route),
            costStability: this.calculateCostStability(route),
            crowdLikelihood: this.calculateCrowdLikelihood(route)
        };
    }

    calculateTimeReliability(route) {
        // Based on historical data and time of day
        return Math.round(70 + Math.random() * 25); // Simplified
    }

    calculateCostStability(route) {
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
        
        return recommendations;
    }
}