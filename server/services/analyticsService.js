// backend/src/services/analyticsService.js
const db = require('../config/database');
const dayjs = require('dayjs');

class AnalyticsService {
  static async generateCommutesPerDay(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        DATE(r.created_at) as date,
        COUNT(*) as count
       FROM routes r
       WHERE r.created_at BETWEEN ? AND ?
       GROUP BY DATE(r.created_at)
       ORDER BY date`,
      [startDate, endDate]
    );
    
    return rows.map(row => ({
      date: dayjs(row.date).format('MMM DD'),
      count: parseInt(row.count)
    }));
  }
  
  static async generateRevenueTrend(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        DATE(r.created_at) as date,
        COALESCE(SUM(ro.total_cost), 0) as revenue
       FROM routes r
       LEFT JOIN route_options ro ON r.id = ro.route_id AND ro.rank_cheapest = 1
       WHERE r.created_at BETWEEN ? AND ?
       GROUP BY DATE(r.created_at)
       ORDER BY date`,
      [startDate, endDate]
    );
    
    return rows.map(row => ({
      date: dayjs(row.date).format('MMM DD'),
      revenue: parseFloat(row.revenue) || 0
    }));
  }
  
  static async generatePeakHours(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        HOUR(r.travel_date) as hour,
        COUNT(*) as count
       FROM routes r
       WHERE r.travel_date BETWEEN ? AND ?
       GROUP BY HOUR(r.travel_date)
       ORDER BY hour`,
      [startDate, endDate]
    );
    
    return rows.map(row => ({
      hour: `${row.hour}:00`,
      count: parseInt(row.count)
    }));
  }
  
  static async generateModeDistribution(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        ro.mode,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM route_options ro2
          JOIN routes r2 ON ro2.route_id = r2.id
          WHERE r2.created_at BETWEEN ? AND ?
        ), 1) as percentage
       FROM route_options ro
       JOIN routes r ON ro.route_id = r.id
       WHERE r.created_at BETWEEN ? AND ?
       GROUP BY ro.mode
       ORDER BY count DESC`,
      [startDate, endDate, startDate, endDate]
    );
    
    return rows.map(row => ({
      mode: row.mode.charAt(0).toUpperCase() + row.mode.slice(1),
      count: parseInt(row.count),
      percentage: parseFloat(row.percentage) || 0
    }));
  }
  
  static async getSystemMetrics() {
    const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [routes] = await db.execute('SELECT COUNT(*) as count FROM routes');
    const [commutes] = await db.execute('SELECT COUNT(*) as count FROM commute_history');
    const [revenue] = await db.execute(
      'SELECT COALESCE(SUM(total_cost), 0) as revenue FROM route_options'
    );
    
    return {
      totalUsers: parseInt(users[0].count),
      totalRoutes: parseInt(routes[0].count),
      totalCommutes: parseInt(commutes[0].count),
      totalRevenue: parseFloat(revenue[0].revenue) || 0
    };
  }
}

module.exports = AnalyticsService;