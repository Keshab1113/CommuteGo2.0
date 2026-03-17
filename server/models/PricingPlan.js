const { db } = require('../config/database');

class PricingPlan {
    static async findAll(activeOnly = false) {
        let query = 'SELECT * FROM pricing_plans';
        
        if (activeOnly) {
            query += ' WHERE is_active = TRUE';
        }
        
        query += ' ORDER BY order_index ASC, created_at DESC';
        const [rows] = await db.execute(query);
        
        // Parse features JSON
        return rows.map(row => ({
            ...row,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features
        }));
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM pricing_plans WHERE id = ?', [id]);
        if (rows[0]) {
            rows[0].features = typeof rows[0].features === 'string' ? JSON.parse(rows[0].features) : rows[0].features;
        }
        return rows[0];
    }

    static async findBySlug(slug) {
        const [rows] = await db.execute('SELECT * FROM pricing_plans WHERE slug = ?', [slug]);
        if (rows[0]) {
            rows[0].features = typeof rows[0].features === 'string' ? JSON.parse(rows[0].features) : rows[0].features;
        }
        return rows[0];
    }

    static async create(planData) {
        const { name, slug, description, price_monthly, price_yearly, features, is_popular, is_active, order_index } = planData;
        
        const [result] = await db.execute(
            `INSERT INTO pricing_plans (name, slug, description, price_monthly, price_yearly, features, is_popular, is_active, order_index) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description || null, price_monthly, price_yearly || null, JSON.stringify(features || []), is_popular || false, is_active !== false, order_index || 0]
        );
        return result.insertId;
    }

    static async update(id, planData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(planData)) {
            if (key === 'features') {
                fields.push('features = ?');
                values.push(JSON.stringify(value));
            } else {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        values.push(id);
        const [result] = await db.execute(
            `UPDATE pricing_plans SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM pricing_plans WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async reorder(ids) {
        for (let i = 0; i < ids.length; i++) {
            await db.execute('UPDATE pricing_plans SET order_index = ? WHERE id = ?', [i, ids[i]]);
        }
    }
}

module.exports = PricingPlan;