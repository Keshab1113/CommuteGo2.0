const { db } = require('../config/database');

class FAQ {
    static async findAll(visibleOnly = false) {
        let query = 'SELECT * FROM faqs';
        
        if (visibleOnly) {
            query += ' WHERE is_visible = TRUE';
        }
        
        query += ' ORDER BY order_index ASC, created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM faqs WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(faqData) {
        const { question, answer, category, order_index, is_visible } = faqData;
        
        const [result] = await db.execute(
            `INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES (?, ?, ?, ?, ?)`,
            [question, answer, category || null, order_index || 0, is_visible !== false]
        );
        return result.insertId;
    }

    static async update(id, faqData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(faqData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        
        values.push(id);
        const [result] = await db.execute(
            `UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM faqs WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async reorder(ids) {
        for (let i = 0; i < ids.length; i++) {
            await db.execute('UPDATE faqs SET order_index = ? WHERE id = ?', [i, ids[i]]);
        }
    }
}

module.exports = FAQ;