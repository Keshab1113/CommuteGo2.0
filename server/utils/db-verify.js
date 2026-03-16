// server/utils/db-verify.js
/**
 * Database Verification and Setup Utility
 * Use: node server/utils/db-verify.js
 * 
 * Verifies:
 * - Database connection
 * - All required tables exist
 * - Table structure correctness
 * - Foreign key relationships
 * - Data integrity
 */

const mysql = require('mysql2/promise');
const logger = require('./logger');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'commutego',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const requiredTables = [
    'users',
    'routes',
    'route_options',
    'tinyfish_route_data',
    'commute_history',
    'alerts',
    'analytics_cache'
];

const tableSchemas = {
    tinyfish_route_data: [
        'id', 'route_id', 'source', 'destination', 'travel_date',
        'transportation_options', 'flight_options', 'raw_response',
        'created_at', 'updated_at'
    ]
};

async function verifyConnection() {
    try {
        console.log('🔍 Verifying database connection...');
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

async function verifyTables() {
    console.log('\n🔍 Verifying required tables...');
    const connection = await pool.getConnection();
    
    try {
        const [tables] = await connection.query(
            `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
            [process.env.DB_NAME || 'commutego']
        );
        
        const existingTables = tables.map(t => t.TABLE_NAME);
        let allExist = true;
        
        requiredTables.forEach(table => {
            if (existingTables.includes(table)) {
                console.log(`  ✅ ${table}`);
            } else {
                console.log(`  ❌ ${table} - MISSING`);
                allExist = false;
            }
        });
        
        connection.release();
        return allExist;
    } catch (error) {
        console.error('❌ Table verification failed:', error.message);
        connection.release();
        return false;
    }
}

async function verifyTableStructure() {
    console.log('\n🔍 Verifying table structures...');
    const connection = await pool.getConnection();
    
    try {
        // Check tinyfish_route_data structure specifically
        const [columns] = await connection.query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?`,
            ['tinyfish_route_data', process.env.DB_NAME || 'commutego']
        );
        
        const existingColumns = columns.map(c => c.COLUMN_NAME);
        let structureValid = true;
        
        console.log('\n  tinyfish_route_data columns:');
        tableSchemas.tinyfish_route_data.forEach(col => {
            if (existingColumns.includes(col)) {
                console.log(`    ✅ ${col}`);
            } else {
                console.log(`    ❌ ${col} - MISSING`);
                structureValid = false;
            }
        });
        
        // Check for extra columns
        const expectedCols = tableSchemas.tinyfish_route_data;
        existingColumns.forEach(col => {
            if (!expectedCols.includes(col)) {
                console.log(`    ⚠️  ${col} - EXTRA (not expected but won't cause issues)`);
            }
        });
        
        connection.release();
        return structureValid;
    } catch (error) {
        console.error('❌ Structure verification failed:', error.message);
        connection.release();
        return false;
    }
}

async function verifyForeignKeys() {
    console.log('\n🔍 Verifying foreign key relationships...');
    const connection = await pool.getConnection();
    
    try {
        const [fks] = await connection.query(
            `SELECT 
                TABLE_NAME, 
                COLUMN_NAME, 
                CONSTRAINT_NAME, 
                REFERENCED_TABLE_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
            [process.env.DB_NAME || 'commutego']
        );
        
        if (fks.length > 0) {
            console.log(`  ✅ Found ${fks.length} foreign key relationships`);
            fks.forEach(fk => {
                console.log(`     - ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}`);
            });
        } else {
            console.log('  ⚠️  No foreign keys found');
        }
        
        // Specific check for tinyfish_route_data
        const hasTinyFishFK = fks.some(fk => 
            fk.TABLE_NAME === 'tinyfish_route_data' && 
            fk.REFERENCED_TABLE_NAME === 'routes'
        );
        
        if (hasTinyFishFK) {
            console.log('  ✅ tinyfish_route_data properly linked to routes');
        } else {
            console.log('  ❌ tinyfish_route_data NOT linked to routes');
        }
        
        connection.release();
        return hasTinyFishFK;
    } catch (error) {
        console.error('❌ Foreign key verification failed:', error.message);
        connection.release();
        return false;
    }
}

async function verifyIndices() {
    console.log('\n🔍 Verifying indices...');
    const connection = await pool.getConnection();
    
    try {
        const [indices] = await connection.query(
            `SELECT DISTINCT INDEX_NAME, COLUMN_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tinyfish_route_data'`,
            [process.env.DB_NAME || 'commutego']
        );
        
        console.log(`  ✅ Found ${indices.length} indices on tinyfish_route_data`);
        indices.forEach(idx => {
            console.log(`     - ${idx.INDEX_NAME} (${idx.COLUMN_NAME})`);
        });
        
        connection.release();
        return indices.length > 0;
    } catch (error) {
        console.error('❌ Index verification failed:', error.message);
        connection.release();
        return false;
    }
}

async function testInsert() {
    console.log('\n🔍 Testing insert operations...');
    const connection = await pool.getConnection();
    
    try {
        // Test insert into tinyfish_route_data with sample data
        const testData = {
            route_id: 999999, // Use a high ID unlikely to exist
            source: 'Test Source',
            destination: 'Test Destination',
            travel_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            transportation_options: JSON.stringify([
                { mode: 'flight', provider: 'Test Airline', price: 250 },
                { mode: 'bus', provider: 'Test Bus', price: 50 }
            ]),
            flight_options: JSON.stringify([
                { mode: 'flight', provider: 'Test Airline', price: 250 }
            ])
        };
        
        // First check if test route exists
        const [existingRoute] = await connection.query(
            'SELECT id FROM routes WHERE id = ?',
            [999999]
        );
        
        if (existingRoute.length === 0) {
            console.log('  ⚠️  Test route (ID 999999) does not exist');
            console.log('  ℹ️  To fully test insert, manually create a route first');
            connection.release();
            return null;
        }
        
        // Try insert
        const [result] = await connection.query(
            `INSERT INTO tinyfish_route_data 
             (route_id, source, destination, travel_date, transportation_options, flight_options) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [testData.route_id, testData.source, testData.destination, testData.travel_date, 
             testData.transportation_options, testData.flight_options]
        );
        
        console.log(`  ✅ Insert successful (ID: ${result.insertId})`);
        
        // Verify insert
        const [inserted] = await connection.query(
            'SELECT * FROM tinyfish_route_data WHERE id = ?',
            [result.insertId]
        );
        
        if (inserted.length > 0) {
            console.log('  ✅ Insert verification successful');
            
            // Parse JSON
            try {
                const transportOptions = JSON.parse(inserted[0].transportation_options);
                console.log(`  ✅ JSON parsing successful (${transportOptions.length} options)`);
            } catch (e) {
                console.log('  ❌ JSON parsing failed');
                return false;
            }
            
            // Cleanup test data
            await connection.query('DELETE FROM tinyfish_route_data WHERE id = ?', [result.insertId]);
            console.log('  ✅ Cleanup successful');
            
            connection.release();
            return true;
        } else {
            console.log('  ❌ Insert verification failed');
            connection.release();
            return false;
        }
    } catch (error) {
        console.error('❌ Insert test failed:', error.message);
        connection.release();
        return false;
    }
}

async function getStatistics() {
    console.log('\n📊 Database Statistics:');
    const connection = await pool.getConnection();
    
    try {
        for (const table of requiredTables) {
            const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
            const count = result[0]?.count || 0;
            console.log(`  ${table}: ${count} records`);
        }
        connection.release();
    } catch (error) {
        console.error('❌ Statistics query failed:', error.message);
        connection.release();
    }
}

async function runAllVerifications() {
    console.log('======================================');
    console.log('CommuteGo Database Verification');
    console.log('======================================');
    
    const results = {
        connection: await verifyConnection(),
        tables: await verifyTables(),
        structure: await verifyTableStructure(),
        foreignKeys: await verifyForeignKeys(),
        indices: await verifyIndices(),
        insert: await testInsert()
    };
    
    await getStatistics();
    
    console.log('\n======================================');
    console.log('VERIFICATION SUMMARY');
    console.log('======================================');
    console.log(`Connection:     ${results.connection ? '✅' : '❌'}`);
    console.log(`Tables:         ${results.tables ? '✅' : '❌'}`);
    console.log(`Structure:      ${results.structure ? '✅' : '❌'}`);
    console.log(`Foreign Keys:   ${results.foreignKeys ? '✅' : '❌'}`);
    console.log(`Indices:        ${results.indices ? '✅' : '❌'}`);
    console.log(`Insert Test:    ${results.insert === null ? '⏭️  SKIPPED' : (results.insert ? '✅' : '❌')}`);
    
    const allPassed = Object.values(results).filter(v => v !== null).every(v => v);
    
    console.log('======================================');
    if (allPassed) {
        console.log('✅ ALL VERIFICATIONS PASSED');
    } else {
        console.log('❌ SOME VERIFICATIONS FAILED');
        console.log('\nTo fix:');
        console.log('1. Run DATABASE_SCHEMA.sql to create missing tables');
        console.log('2. Ensure MySQL user has full permissions');
        console.log('3. Check .env file configuration');
    }
    console.log('======================================\n');
    
    process.exit(allPassed ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
    runAllVerifications().catch(error => {
        console.error('Verification failed:', error);
        process.exit(1);
    });
}

module.exports = { verifyConnection, verifyTables, verifyTableStructure };