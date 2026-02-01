// backend/server.js
const app = require("./app");
const { testConnection } = require("./config/database");

const PORT = process.env.PORT || 5000;

// Test database connection and start server
const startServer = async () => {
  try {
    await testConnection();
    console.log("✅ MySQL database connected successfully");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

startServer();