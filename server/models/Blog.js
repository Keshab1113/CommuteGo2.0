const { db } = require('../config/database');

class Blog {
    static async findAll(status = null) {
        let query = 'SELECT * FROM blogs';
        const params = [];
        
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY published_at DESC, created_at DESC';
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
        return rows[0];
    }

    static async findBySlug(slug) {
        const [rows] = await db.execute('SELECT * FROM blogs WHERE slug = ?', [slug]);
        return rows[0];
    }

    static async create(blogData) {
        const { title, slug, content, excerpt, cover_image, author, category, tags, status, published_at } = blogData;
        
        const [result] = await db.execute(
            `INSERT INTO blogs (title, slug, content, excerpt, cover_image, author, category, tags, status, published_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, content, excerpt || null, cover_image || null, author || null, category || null, JSON.stringify(tags || []), status || 'draft', published_at || null]
        );
        return result.insertId;
    }

    static async update(id, blogData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(blogData)) {
            if (key === 'tags') {
                fields.push('tags = ?');
                values.push(JSON.stringify(value));
            } else {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        values.push(id);
        const [result] = await db.execute(
            `UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM blogs WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async incrementViews(id) {
        await db.execute('UPDATE blogs SET views = views + 1 WHERE id = ?', [id]);
    }
}

module.exports = Blog;