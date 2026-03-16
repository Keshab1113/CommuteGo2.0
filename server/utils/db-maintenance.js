// server/utils/db-maintenance.js
/**
 * Database Maintenance Utility
 * Use: node server/utils/db-maintenance.js [command]
 * 
 * Commands:
 * - cleanup        : Remove test data and old entries
 * - stats          : Show data statistics
 * - repair         : Check/repair data integrity
 * - export-routes  : Export all routes to JSON
 * - clear-tinyfish : Clear TinyFish cache (dangerous!)
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'commutego',
    waitForConnections: true,
    connectionLimit: 10
});

async function showStats() {
    console.log('\n📊 Database Statistics:\n');
    const connection = await pool.getConnection();
    
    try {
        // Users
        const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log(`Users:                  ${users[0].count}`);
        
        // Routes
        const [routes] = await connection.query('SELECT COUNT(*) as count FROM routes');
        console.log(`Routes:                 ${routes[0].count}`);
        
        // TinyFish data
        const [tinyfish] = await connection.query('SELECT COUNT(*) as count FROM tinyfish_route_data');
        console.log(`Routes with TinyFish:   ${tinyfish[0].count}`);
        
        // Route options
        const [routeOpts] = await connection.query('SELECT COUNT(*) as count FROM route_options');
        console.log(`Route Options:          ${routeOpts[0].count}`);
        
        // Commute history
        const [history] = await connection.query('SELECT COUNT(*) as count FROM commute_history');
        console.log(`Commute History:        ${history[0].count}`);
        
        // Alerts
        const [alerts] = await connection.query('SELECT COUNT(*) as count FROM alerts');
        console.log(`Alerts:                 ${alerts[0].count}`);
        
        // Database size
        const [dbSize] = await connection.query(`
            SELECT 
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
            FROM information_schema.tables 
            WHERE table_schema = ?
        `, [process.env.DB_NAME || 'commutego']);
        
        console.log(`\nDatabase Size:          ${dbSize[0].size_mb} MB`);
        
        // Recent routes
        const [recentRoutes] = await connection.query(`
            SELECT id, source, destination, travel_date, created_at 
            FROM routes 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        
        console.log('\nRecent Routes:');
        recentRoutes.forEach((route, i) => {
            console.log(`  ${i + 1}. [${route.id}] ${route.source} → ${route.destination}`);
            console.log(`     Travel: ${route.travel_date} | Created: ${route.created_at}`);
        });
        
        connection.release();
    } catch (error) {
        console.error('❌ Error getting statistics:', error.message);
        connection.release();
    }
}

async function cleanup() {
    console.log('\n🧹 Cleaning up test data...\n');
    const connection = await pool.getConnection();
    
    try {
        // Delete old test data (older than 7 days)
        const [result1] = await connection.query(`
            DELETE FROM commute_history 
            WHERE created_at < NOW() - INTERVAL 7 DAY 
            AND user_id IN (SELECT id FROM users WHERE email LIKE '%test%')
        `);
        console.log(`Deleted ${result1.affectedRows} old test commute history entries`);
        
        // Delete orphaned alerts
        const [result2] = await connection.query(`
            DELETE FROM alerts 
            WHERE route_id NOT IN (SELECT id FROM routes)
        `);
        console.log(`Deleted ${result2.affectedRows} orphaned alert entries`);
        
        // Delete routes older than 30 days with no bookings
        const [result3] = await connection.query(`
            DELETE FROM routes 
            WHERE created_at < NOW() - INTERVAL 30 DAY 
            AND id NOT IN (SELECT DISTINCT route_id FROM commute_history WHERE route_id IS NOT NULL)
        `);
        console.log(`Deleted ${result3.affectedRows} old unused route entries`);
        
        console.log('✅ Cleanup complete');
        connection.release();
    } catch (error) {
        console.error('❌ Cleanup failed:', error.message);
        connection.release();
    }
}

async function repair() {
    console.log('\n🔧 Checking data integrity...\n');
    const connection = await pool.getConnection();
    
    try {
        // Check for orphaned route_options
        const [orphaned1] = await connection.query(`
            SELECT COUNT(*) as count FROM route_options 
            WHERE route_id NOT IN (SELECT id FROM routes)
        `);
        console.log(`Orphaned route_options: ${orphaned1[0].count}`);
        
        if (orphaned1[0].count > 0) {
            const [del1] = await connection.query(`
                DELETE FROM route_options 
                WHERE route_id NOT IN (SELECT id FROM routes)
            `);
            console.log(`  ✅ Fixed: Deleted ${del1.affectedRows} entries`);
        }
        
        // Check for orphaned tinyfish_route_data
        const [orphaned2] = await connection.query(`
            SELECT COUNT(*) as count FROM tinyfish_route_data 
            WHERE route_id NOT IN (SELECT id FROM routes)
        `);
        console.log(`Orphaned tinyfish_route_data: ${orphaned2[0].count}`);
        
        if (orphaned2[0].count > 0) {
            const [del2] = await connection.query(`
                DELETE FROM tinyfish_route_data 
                WHERE route_id NOT IN (SELECT id FROM routes)
            `);
            console.log(`  ✅ Fixed: Deleted ${del2.affectedRows} entries`);
        }
        
        // Check for orphaned routes (no user)
        const [orphaned3] = await connection.query(`
            SELECT COUNT(*) as count FROM routes 
            WHERE user_id NOT IN (SELECT id FROM users)
        `);
        console.log(`Orphaned routes: ${orphaned3[0].count}`);
        
        if (orphaned3[0].count > 0) {
            const [del3] = await connection.query(`
                DELETE FROM routes 
                WHERE user_id NOT IN (SELECT id FROM users)
            `);
            console.log(`  ✅ Fixed: Deleted ${del3.affectedRows} entries`);
        }
        
        // Verify JSON columns
        const [tinyfish] = await connection.query(`
            SELECT id, transportation_options FROM tinyfish_route_data LIMIT 5
        `);
        
        let validJson = 0;
        let invalidJson = 0;
        
        tinyfish.forEach(row => {
            try {
                JSON.parse(row.transportation_options);
                validJson++;
            } catch (e) {
                invalidJson++;
                console.log(`  ⚠️  Invalid JSON in tinyfish_route_data id=${row.id}`);
            }
        });
        
        console.log(`JSON validation: ${validJson} valid, ${invalidJson} invalid`);
        
        console.log('\n✅ Repair check complete');
        connection.release();
    } catch (error) {
        console.error('❌ Repair failed:', error.message);
        connection.release();
    }
}

async function exportRoutes() {
    console.log('\n📤 Exporting routes to JSON...\n');
    const connection = await pool.getConnection();
    
    try {
        const [routes] = await connection.query(`
            SELECT 
                r.id,
                r.source,
                r.destination,
                r.travel_date,
                r.created_at,
                COUNT(DISTINCT ro.id) as option_count,
                COUNT(DISTINCT tf.id) as has_tinyfish
            FROM routes r
            LEFT JOIN route_options ro ON r.id = ro.route_id
            LEFT JOIN tinyfish_route_data tf ON r.id = tf.route_id
            GROUP BY r.id
            ORDER BY r.created_at DESC
            LIMIT 100
        `);
        
        const data = {
            export_date: new Date().toISOString(),
            total_routes: routes.length,
            routes: routes
        };
        
        console.log(JSON.stringify(data, null, 2));
        connection.release();
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        connection.release();
    }
}

async function clearTinyFish() {
    console.log('\n⚠️  WARNING: This will clear all TinyFish cached data!\n');
    console.log('This should only be done for debugging purposes.');
    console.log('Use Ctrl+C to cancel.\n');
    
    // Give user time to cancel
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const connection = await pool.getConnection();
    
    try {
        const [result] = await connection.query('DELETE FROM tinyfish_route_data');
        console.log(`🧹 Deleted ${result.affectedRows} TinyFish cache entries`);
        console.log('✅ Clear complete');
        connection.release();
    } catch (error) {
        console.error('❌ Clear failed:', error.message);
        connection.release();
    }
}

async function main() {
    const command = process.argv[2] || 'help';
    
    console.log('======================================');
    console.log('CommuteGo Database Maintenance');
    console.log('======================================');
    
    switch (command) {
        case 'stats':
            await showStats();
            break;
        case 'cleanup':
            await cleanup();
            break;
        case 'repair':
            await repair();
            break;
        case 'export-routes':
            await exportRoutes();
            break;
        case 'clear-tinyfish':
            await clearTinyFish();
            break;
        default:
            console.log('\nUsage:');
            console.log('  node server/utils/db-maintenance.js [command]\n');
            console.log('Commands:');
            console.log('  stats          - Show database statistics');
            console.log('  cleanup        - Remove old test data');
            console.log('  repair         - Check and fix data integrity');
            console.log('  export-routes  - Export routes as JSON');
            console.log('  clear-tinyfish - Clear TinyFish cache (!!!)');
            console.log('\nExamples:');
            console.log('  node server/utils/db-maintenance.js stats');
            console.log('  node server/utils/db-maintenance.js cleanup');
    }
    
    console.log('======================================\n');
    process.exit(0);
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

module.exports = { showStats, cleanup, repair };