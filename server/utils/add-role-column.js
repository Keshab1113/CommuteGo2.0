// Migration script to add role column to users table
const { db } = require('../config/database');

async function addRoleColumn() {
    try {
        // Check if role column exists
        const [columns] = await db.execute('DESCRIBE users');
        const roleColumn = columns.find(col => col.Field === 'role');
        
        if (!roleColumn) {
            console.log('Adding role column to users table...');
            await db.execute('ALTER TABLE users ADD COLUMN role ENUM("user", "admin") DEFAULT "user"');
            console.log('✓ Role column added successfully');
        } else {
            console.log('Role column already exists');
        }

        // Check if is_active column exists
        const activeColumn = columns.find(col => col.Field === 'is_active');
        
        if (!activeColumn) {
            console.log('Adding is_active column to users table...');
            await db.execute('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
            console.log('✓ is_active column added successfully');
        } else {
            console.log('is_active column already exists');
        }

        // Create admin user if not exists (for testing)
        const [admins] = await db.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1');
        if (admins.length === 0) {
            console.log('No admin user found. Creating default admin...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('admin123', salt);
            
            await db.execute(
                'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@commutego.com', passwordHash, 'admin']
            );
            console.log('✓ Default admin user created: admin@commutego.com / admin123');
        } else {
            console.log('Admin user already exists');
        }

        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addRoleColumn();