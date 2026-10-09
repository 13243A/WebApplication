import { pool } from '../config/db.js';

// GET /api/chat/:itemId - ดึงข้อความแชททั้งหมดของ item_id
export const getMessagesByItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const [rows] = await pool.query('SELECT * FROM messages WHERE item_id = ? ORDER BY id ASC', [itemId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getMessagesByItem Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/chat/:itemId - บันทึกข้อความแชทใหม่ลง MySQL
export const sendMessage = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { sender_name, sender_faculty, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'ข้อความไม่สามารถเว้นว่างได้' });
    }

    const sql = 'INSERT INTO messages (item_id, sender_name, sender_faculty, message) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [
      itemId,
      sender_name || 'ฉัน (ผู้ติดต่อ)',
      sender_faculty || 'นักศึกษา',
      message.trim()
    ]);

    const [newMsg] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newMsg[0] });
  } catch (err) {
    console.error('sendMessage Error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถส่งข้อความได้', error: err.message });
  }
};
