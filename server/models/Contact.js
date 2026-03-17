const { db } = require('../config/database');

class Contact {
    static async findAll(status = null) {
        let query = 'SELECT * FROM contacts';
        const params = [];
        
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC';
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM contacts WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(contactData) {
        const { name, email, subject, message, phone } = contactData;
        
        const [result] = await db.execute(
            `INSERT INTO contacts (name, email, subject, message, phone) VALUES (?, ?, ?, ?, ?)`,
            [name, email, subject || null, message, phone || null]
        );
        return result.insertId;
    }

    static async update(id, contactData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(contactData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        
        values.push(id);
        const [result] = await db.execute(
            `UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async getUnreadCount() {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM contacts WHERE status = ?', ['new']);
        return rows[0].count;
    }
}

module.exports = Contact;