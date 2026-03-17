require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function createAdmin() {
    const email = 'admin@gmail.com';
    const password = 'Admin@1234';
    const name = 'Admin';
    const role = 'admin';

    const db = pool;
    try {
        // Check if admin already exists
        const [existing] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            console.log('Admin user already exists!');
            
            // Update to ensure role is admin
            await db.execute(
                'UPDATE users SET role = ? WHERE email = ?',
                [role, email]
            );
            console.log('Admin role updated successfully!');
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert admin user (using is_active instead of status)
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
            [name, email, passwordHash, role, 1]
        );

        console.log(`Admin user created successfully with ID: ${result.insertId}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await pool.end();
        process.exit();
    }
}

createAdmin();