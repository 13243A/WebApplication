import { pool } from '../config/db.js';

// GET /api/items - อ่านรายการสิ่งของทั้งหมดจากตาราง items ใน MySQL
export const getItems = async (req, res) => {
  try {
    let sql = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    const { search, category, status, type } = req.query;

    if (search) {
      sql += ' AND (name LIKE ? OR location LIKE ? OR sub_location LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getItems Error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก MySQL', error: err.message });
  }
};

// GET /api/items/:id - อ่านข้อมูลสิ่งของตาม ID
export const getItemById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการสิ่งของที่ระบุ' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getItemById Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/items - เพิ่มรายการใหม่ (นิรนาม 100% ไม่ต้องกรอกชื่อและสังกัด)
export const createItem = async (req, res) => {
  try {
    const { name, type, category, location, sub_location, dropoff_point, image_url } = req.body;
    const reporter_name = 'ผู้แจ้งนิรนาม';
    const reporter_faculty = '';

    if (!name || !type || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อสิ่งของ, ประเภท, หมวดหมู่, สถานที่)'
      });
    }

    const initialStatus = type === 'found' ? 'ready_pickup' : 'searching';
    const sql = `
      INSERT INTO items (name, type, category, location, sub_location, dropoff_point, reporter_name, reporter_faculty, status, image_url, is_my_post)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const [result] = await pool.query(sql, [
      name,
      type,
      category,
      location,
      sub_location || '',
      dropoff_point || 'นัดรับส่งมอบโดยตรงผ่านแชท',
      reporter_name,
      reporter_faculty,
      initialStatus,
      image_url || ''
    ]);

    const [newItem] = await pool.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'บันทึกรายการลง MySQL สำเร็จ', data: newItem[0] });
  } catch (err) {
    console.error('createItem Error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถบันทึกข้อมูลได้', error: err.message });
  }
};

// PUT /api/items/:id - แก้ไขข้อมูลสิ่งของ
export const updateItem = async (req, res) => {
  try {
    const { name, type, category, location, sub_location, dropoff_point, image_url } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อสิ่งของ, สถานที่)'
      });
    }

    const sql = `
      UPDATE items
      SET name = ?, type = ?, category = ?, location = ?, sub_location = ?, dropoff_point = ?, reporter_faculty = '', image_url = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [
      name,
      type || 'found',
      category || 'อุปกรณ์อิเล็กทรอนิกส์',
      location,
      sub_location || '',
      dropoff_point || 'นัดรับส่งมอบโดยตรงผ่านแชท',
      image_url || '',
      req.params.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการสิ่งของที่ต้องการแก้ไข' });
    }

    const [updatedItem] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'อัปเดตข้อมูลสิ่งของสำเร็จ', data: updatedItem[0] });
  } catch (err) {
    console.error('updateItem Error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', error: err.message });
  }
};

// PUT /api/items/:id/resolve - ปิดเคส / ยืนยันส่งมอบสำเร็จ
export const resolveItem = async (req, res) => {
  try {
    const resolvedBy = req.body.resolved_by || 'นัดส่งมอบตรงเรียบร้อย (P2P Handover)';
    const now = new Date();

    const [result] = await pool.query(
      'UPDATE items SET status = ?, resolved_at = ?, resolved_by = ? WHERE id = ?',
      ['returned', now, resolvedBy, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการสิ่งของ' });
    }

    const [updatedItem] = await pool.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'ปิดเคสและอัปเดตสถานะเป็นส่งมอบสำเร็จแล้ว', data: updatedItem[0] });
  } catch (err) {
    console.error('resolveItem Error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error: err.message });
  }
};

// DELETE /api/items/:id - ลบรายการจากตาราง items
export const deleteItem = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการสิ่งของ' });
    }
    res.json({ success: true, message: 'ลบรายการออกจากฐานข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('deleteItem Error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถลบข้อมูลได้', error: err.message });
  }
};

// GET /api/items/stats - คำนวณสรุปสถิติจากฐานข้อมูล
export const getStats = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM items GROUP BY status');
    let total = 0;
    let searching = 0;
    let ready = 0;
    let returned = 0;

    rows.forEach(r => {
      const c = Number(r.count);
      total += c;
      if (r.status === 'searching') searching = c;
      if (r.status === 'ready_pickup') ready = c;
      if (r.status === 'returned') returned = c;
    });

    const successRate = total > 0 ? Math.round((returned / total) * 100) : 0;
    res.json({
      success: true,
      data: { total, searching, ready, returned, successRate }
    });
  } catch (err) {
    console.error('getStats Error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถคำนวณสถิติได้', error: err.message });
  }
};

// GET /api/items/dropoffs - ดึงจุดรับฝากจากตาราง dropoff_points
export const getDropoffs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dropoff_points ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getDropoffs Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};