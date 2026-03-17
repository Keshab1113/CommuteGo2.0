const { db } = require('../config/database');

const Setting = {
  // Get all settings
  async findAll() {
    const [rows] = await db.query('SELECT * FROM settings ORDER BY category, setting_key');
    return rows;
  },

  // Get settings by category
  async findByCategory(category) {
    const [rows] = await db.query('SELECT * FROM settings WHERE category = ? ORDER BY setting_key', [category]);
    return rows;
  },

  // Get setting by key
  async findByKey(settingKey) {
    const [rows] = await db.query('SELECT * FROM settings WHERE setting_key = ?', [settingKey]);
    return rows[0];
  },

  // Create new setting
  async create(setting) {
    const { setting_key, setting_value, setting_type, category, description, is_public } = setting;
    const [result] = await db.query(
      `INSERT INTO settings (setting_key, setting_value, setting_type, category, description, is_public) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [setting_key, setting_value, setting_type || 'string', category || 'general', description || '', is_public || false]
    );
    return { id: result.insertId, setting_key, setting_value, setting_type, category, description, is_public };
  },

  // Update setting
  async update(settingKey, settingValue) {
    const [result] = await db.query(
      'UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
      [settingValue, settingKey]
    );
    return result.affectedRows > 0;
  },

  // Delete setting
  async delete(settingKey) {
    const [result] = await db.query('DELETE FROM settings WHERE setting_key = ?', [settingKey]);
    return result.affectedRows > 0;
  },

  // Get public settings
  async findPublic() {
    const [rows] = await db.query('SELECT setting_key, setting_value, setting_type FROM settings WHERE is_public = TRUE');
    return rows;
  }
};

module.exports = Setting;