const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'commutego',
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: '+00:00',
    dateStrings: true,
    namedPlaceholders: true
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('✅ Database connection successful');
        
        // Test query
        await connection.query('SELECT 1');
        
        connection.release();
        return true;
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw error;
    }
};

// Monitor pool events
pool.on('acquire', (connection) => {
    logger.debug('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
    logger.debug('Connection %d released', connection.threadId);
});

pool.on('enqueue', () => {
    logger.debug('Waiting for available connection slot');
});

module.exports = { 
    db: pool,
    testConnection 
};