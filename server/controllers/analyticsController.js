// backend/src/controllers/analyticsController.js
const AnalyticsService = require("../services/analyticsService");
const AnalyticsCache = require("../models/AnalyticsCache");
const AgentOrchestrator = require("../agents/Orchestrator");
const { db } = require("../config/database");

class AnalyticsController {
  static async getDashboardData(req, res) {
    try {
      const { startDate, endDate, cacheKey } = req.query;

      // Check cache first
      const cacheData = await AnalyticsCache.get(cacheKey || "dashboard_data");
      if (cacheData) {
        return res.json({ ...cacheData, cached: true });
      }

      const [commutesPerDay, revenueTrend, peakHours, modeDistribution] =
        await Promise.all([
          AnalyticsService.generateCommutesPerDay(startDate, endDate),
          AnalyticsService.generateRevenueTrend(startDate, endDate),
          AnalyticsService.generatePeakHours(startDate, endDate),
          AnalyticsService.generateModeDistribution(startDate, endDate),
        ]);

      const dashboardData = {
        commutesPerDay,
        revenueTrend,
        peakHours,
        modeDistribution,
        generatedAt: new Date().toISOString(),
      };

      // Cache the results
      await AnalyticsCache.set("dashboard_data", dashboardData, 5);

      res.json(dashboardData);
    } catch (error) {
      console.error("Get dashboard data error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  }

  static async getAgentDashboardData(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Use agent orchestrator for enhanced analytics
      const orchestrator = new AgentOrchestrator();
      const agentDashboard = await orchestrator.generateDashboardInsights(
        startDate,
        endDate,
      );

      res.json(agentDashboard);
    } catch (error) {
      console.error("Get agent dashboard error:", error);
      res.status(500).json({ error: "Failed to generate agent dashboard" });
    }
  }

  static async getUserAnalytics(req, res) {
    try {
      const userId = req.user.id;

      const [userStats] = await Promise.all([
        db.execute(
          `
                    SELECT COUNT(*) as total_commutes
                    FROM commute_history
                    WHERE user_id = ?
                `,
          [userId],
        ),

        db.execute(
          `
                    SELECT ro.mode, COUNT(*) as count
                    FROM commute_history ch
                    JOIN route_options ro ON ch.route_option_id = ro.id
                    WHERE ch.user_id = ?
                    GROUP BY ro.mode
                    ORDER BY count DESC
                `,
          [userId],
        ),

        db.execute(
          `
                    SELECT 
                        SUM(ro.total_cost) as total_spent,
                        MIN(ro2.total_cost) as cheapest_alternative,
                        SUM(ro2.total_cost - ro.total_cost) as total_saved
                    FROM commute_history ch
                    JOIN route_options ro ON ch.route_option_id = ro.id
                    JOIN routes r ON ro.route_id = r.id
                    JOIN route_options ro2 ON r.id = ro2.route_id AND ro2.rank_cheapest = 1
                    WHERE ch.user_id = ?
                `,
          [userId],
        ),

        db.execute(
          `
                    SELECT 
                        DAYNAME(ch.travelled_on) as day,
                        COUNT(*) as count
                    FROM commute_history ch
                    WHERE ch.user_id = ?
                        AND ch.travelled_on >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    GROUP BY DAYNAME(ch.travelled_on)
                    ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
                `,
          [userId],
        ),
      ]);

      const userAnalytics = {
        totalCommutes: userStats[0][0][0]?.total_commutes || 0,
        preferredModes: userStats[1][0] || [],
        savings: {
          totalSpent: parseFloat(userStats[2][0][0]?.total_spent || 0),
          cheapestAlternative: parseFloat(
            userStats[2][0][0]?.cheapest_alternative || 0,
          ),
          totalSaved: parseFloat(userStats[2][0][0]?.total_saved || 0),
        },
        weeklyActivity: userStats[3][0] || [],
        generatedAt: new Date().toISOString(),
      };

      res.json(userAnalytics);
    } catch (error) {
      console.error("Get user analytics error:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  }

  static async getUserAgentInsights(req, res) {
    try {
      const userId = req.user.id;

      // Use agent orchestrator for personalized insights
      const orchestrator = new AgentOrchestrator();
      const insights = await orchestrator.generateUserInsights(userId);

      res.json(insights);
    } catch (error) {
      console.error("Get user agent insights error:", error);
      res.status(500).json({ error: "Failed to generate user insights" });
    }
  }

  static async getRealTimeMetrics(req, res) {
    try {
      const [metrics] = await Promise.all([
        // Current hour activity
        db.execute(`
                    SELECT COUNT(*) as current_hour_commutes 
                    FROM routes 
                    WHERE HOUR(created_at) = HOUR(NOW())
                `),
        // Today's activity
        db.execute(`
                    SELECT COUNT(*) as today_commutes 
                    FROM routes 
                    WHERE DATE(created_at) = CURDATE()
                `),
        // Active users today
        db.execute(`
                    SELECT COUNT(DISTINCT user_id) as active_users_today 
                    FROM routes 
                    WHERE DATE(created_at) = CURDATE()
                `),
        // Most active hour
        db.execute(`
                    SELECT HOUR(created_at) as hour, COUNT(*) as count
                    FROM routes
                    WHERE DATE(created_at) = CURDATE()
                    GROUP BY HOUR(created_at)
                    ORDER BY count DESC
                    LIMIT 1
                `),
      ]);

      const realTimeMetrics = {
        currentHourCommutes: metrics[0][0][0]?.current_hour_commutes || 0,
        todayCommutes: metrics[1][0][0]?.today_commutes || 0,
        activeUsersToday: metrics[2][0][0]?.active_users_today || 0,
        mostActiveHour: metrics[3][0][0] || { hour: 0, count: 0 },
        lastUpdated: new Date().toISOString(),
      };

      res.json(realTimeMetrics);
    } catch (error) {
      console.error("Get real-time metrics error:", error);
      res.status(500).json({ error: "Failed to fetch real-time metrics" });
    }
  }

  static async getAgentPerformance(req, res) {
    try {
      // Get agent performance metrics
      const [agentLogs] = await db.execute(`
                SELECT 
                    agent_name,
                    COUNT(*) as total_calls,
                    AVG(processing_time_ms) as avg_processing_time,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate
                FROM agent_logs
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                GROUP BY agent_name
            `);

      res.json({
        agents: agentLogs,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get agent performance error:", error);
      res.status(500).json({ error: "Failed to fetch agent performance" });
    }
  }

  static async getUserAgentInsights(req, res) {
    try {
      const userId = req.user.id;

      // Use agent orchestrator for personalized insights
      const orchestrator = new AgentOrchestrator();
      const insights = await orchestrator.generateUserInsights(userId);

      res.json(insights);
    } catch (error) {
      console.error("Get user agent insights error:", error);
      res.status(500).json({ error: "Failed to generate user insights" });
    }
  }

  static async getAgentInsights(req, res) {
    try {
      const userId = req.user.id;

      // Generate general AI insights for the user
      const insights = {
        recommendations: [
          "Consider leaving 15 minutes earlier to avoid morning traffic",
          "Taking the train could save you $5.50 per day compared to driving",
          "Your most efficient commute day is Wednesday",
        ],
        patterns: {
          bestTimeToTravel: "8:30 AM - 9:30 AM",
          mostEfficientMode: "train",
          averageSavings: 12.5,
          weeklyTrend: "+8% efficiency",
        },
        alerts: [
          {
            type: "tip",
            message:
              "Using public transport 3 times a week would save 15kg CO₂",
          },
        ],
        generatedAt: new Date().toISOString(),
      };

      res.json(insights);
    } catch (error) {
      console.error("Get agent insights error:", error);
      res.status(500).json({ error: "Failed to generate agent insights" });
    }
  }

  static async getRouteAgentInsights(req, res) {
    try {
      const userId = req.user.id;
      const { routeId } = req.params;

      // Generate route-specific insights
      const insights = {
        routeId,
        timeReliability: "92%",
        costEfficiency: "Good",
        crowdPrediction: "Moderate at 8:30 AM",
        alternatives: [
          {
            mode: "train",
            savings: "15 min faster",
            costDifference: "-$2.50",
          },
        ],
        recommendations: [
          "Window seat available on the 8:15 train",
          "Bus stop 3 has less crowd today",
        ],
      };

      res.json(insights);
    } catch (error) {
      console.error("Get route agent insights error:", error);
      res.status(500).json({ error: "Failed to generate route insights" });
    }
  }
}

module.exports = AnalyticsController;
