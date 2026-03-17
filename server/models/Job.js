const { db } = require('../config/database');

class Job {
    static async findAll(activeOnly = false) {
        let query = 'SELECT * FROM jobs';
        
        if (activeOnly) {
            query += ' WHERE is_active = TRUE';
        }
        
        query += ' ORDER BY posted_at DESC, created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM jobs WHERE id = ?', [id]);
        return rows[0];
    }

    static async findBySlug(slug) {
        const [rows] = await db.execute('SELECT * FROM jobs WHERE slug = ?', [slug]);
        return rows[0];
    }

    static async create(jobData) {
        const { title, slug, description, requirements, location, type, department, salary_range, is_active, posted_at, expires_at } = jobData;
        
        const [result] = await db.execute(
            `INSERT INTO jobs (title, slug, description, requirements, location, type, department, salary_range, is_active, posted_at, expires_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, description, requirements || null, location || null, type || 'full-time', department || null, salary_range || null, is_active !== false, posted_at || null, expires_at || null]
        );
        return result.insertId;
    }

    static async update(id, jobData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(jobData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        
        values.push(id);
        const [result] = await db.execute(
            `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM jobs WHERE id = ?', [id]);
        return result.heritedRows;
    }

    static async toggleActive(id) {
        const job = await Job.findById(id);
        if (job) {
            await db.execute('UPDATE jobs SET is_active = ? WHERE id = ?', [!job.is_active, id]);
        }
    }
}

module.exports = Job;