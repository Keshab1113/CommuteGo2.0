const app = require("./app");
const { testConnection } = require("./config/database");
const { config } = require("./config/appConfig");
const logger = require("./utils/logger");

const PORT = config.server.port;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message, err.stack);
    process.exit(1);
});

// Test database connection and start server
const startServer = async () => {
    try {
        await testConnection();
        logger.info("✅ MySQL database connected successfully");
        
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📊 Health check: http://localhost:${PORT}/health`);
            logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
            logger.error(err.name, err.message, err.stack);
            server.close(() => {
                process.exit(1);
            });
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('👋 SIGTERM received. Shutting down gracefully');
            server.close(() => {
                logger.info('💤 Process terminated');
            });
        });

    } catch (err) {
        logger.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

startServer();