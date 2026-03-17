require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    const db = pool;
    try {
        console.log('Creating admin management tables...');

        // Create blogs table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content LONGTEXT NOT NULL,
                excerpt TEXT,
                cover_image VARCHAR(500),
                author VARCHAR(255),
                category VARCHAR(100),
                tags JSON,
                status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
                views INT DEFAULT 0,
                published_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug),
                INDEX idx_status (status),
                INDEX idx_published_at (published_at)
            )
        `);
        console.log('✓ blogs table created');

        // Create FAQs table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS faqs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                question VARCHAR(500) NOT NULL,
                answer LONGTEXT NOT NULL,
                category VARCHAR(100),
                order_index INT DEFAULT 0,
                is_visible BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_order (order_index)
            )
        `);
        console.log('✓ faqs table created');

        // Create contacts table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                phone VARCHAR(50),
                status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_email (email),
                INDEX idx_created_at (created_at)
            )
        `);
        console.log('✓ contacts table created');

        // Create jobs table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description LONGTEXT NOT NULL,
                requirements TEXT,
                location VARCHAR(255),
                type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
                department VARCHAR(100),
                salary_range VARCHAR(100),
                is_active BOOLEAN DEFAULT TRUE,
                posted_at DATETIME,
                expires_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug),
                INDEX idx_is_active (is_active),
                INDEX idx_posted_at (posted_at)
            )
        `);
        console.log('✓ jobs table created');

        // Create pricing_plans table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS pricing_plans (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                price_monthly DECIMAL(10, 2) NOT NULL,
                price_yearly DECIMAL(10, 2),
                features JSON NOT NULL,
                is_popular BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug),
                INDEX idx_is_active (is_active),
                INDEX idx_order (order_index)
            )
        `);
        console.log('✓ pricing_plans table created');

        // Insert default pricing plans if none exist
        const [existingPlans] = await db.execute('SELECT COUNT(*) as count FROM pricing_plans');
        if (existingPlans[0].count === 0) {
            await db.execute(`
                INSERT INTO pricing_plans (name, slug, description, price_monthly, price_yearly, features, is_popular, is_active, order_index) VALUES
                ('Free', 'free', 'Perfect for getting started', 0, 0, '["Basic route planning", "Up to 5 routes per day", "Email support"]', FALSE, TRUE, 1),
                ('Pro', 'pro', 'For daily commuters', 9.99, 99.99, '["Unlimited routes", "Route history", "Priority support", "Carbon tracking", "Favorite routes"]', TRUE, TRUE, 2),
                ('Enterprise', 'enterprise', 'For teams and organizations', 49.99, 499.99, '["Everything in Pro", "Team management", "API access", "Custom integrations", "Dedicated support", "Analytics dashboard"]', FALSE, TRUE, 3)
            `);
            console.log('✓ Default pricing plans inserted');
        }

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await pool.end();
        process.exit();
    }
}

migrate();