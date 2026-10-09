import { pool } from '../config/db.js';

// GET /api/chat/room/:roomId - ดึงข้อความในห้อง 1 ต่อ 1
export const getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM messages WHERE room_id = ? ORDER BY id ASC',
      [roomId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getMessagesByRoom Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/chat/room/:roomId - ส่งข้อความเข้าห้อง 1 ต่อ 1
export const sendMessageToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { itemId, sender_name, sender_client_id, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'ข้อความไม่สามารถเว้นว่างได้' });
    }

    const sql = 'INSERT INTO messages (item_id, room_id, sender_name, sender_faculty, message) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [
      itemId || 0,
      roomId,
      sender_name || 'ผู้ใช้งาน',
      sender_client_id || '',
      message.trim()
    ]);

    const [newMsg] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newMsg[0] });
  } catch (err) {
    console.error('sendMessageToRoom Error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถส่งข้อความได้', error: err.message });
  }
};

// POST /api/chat/inbox-threads - ดึงรายการห้องแชทพร้อมระบบกรองความเป็นส่วนตัวรายบุคคล
export const getInboxThreads = async (req, res) => {
  try {
    const { clientId, myPostIds = [] } = req.body;
    const postIds = Array.isArray(myPostIds) ? myPostIds.map(Number) : [];

    const sql = `
      SELECT m.*, i.name as item_name, i.category as item_category, 
             i.reporter_name, i.location, i.dropoff_point, i.status as item_status
      FROM messages m
      JOIN items i ON m.item_id = i.id
      WHERE m.room_id != ''
      ORDER BY m.id ASC
    `;

    const [allMessages] = await pool.query(sql);

    const threadMap = {};
    for (const msg of allMessages) {
      const rId = msg.room_id;
      
      // ดึงรหัส client_id ของคนที่ริเริ่มทักห้องนี้ (room_{itemId}_{initiatorClientId})
      const parts = rId.split('_');
      const initiatorClientId = parts.length >= 3 ? parts.slice(2).join('_') : '';
      
      const isInitiator = initiatorClientId === clientId;
      const isOwnerOfPost = postIds.includes(Number(msg.item_id));

      // 🔒 ระบบล็อกความเป็นส่วนตัว: ถ้าเราไม่ใช่คนทัก และไม่ใช่เจ้าของโพสต์ ห้ามเห็นห้องนี้เด็ดขาด!
      if (!isInitiator && !isOwnerOfPost) {
        continue;
      }

      const contactPersonName = isOwnerOfPost
        ? (msg.sender_name && !msg.sender_name.includes('เจ้าของ') ? msg.sender_name : 'ผู้สนใจติดต่อ')
        : (msg.reporter_name ? `${msg.reporter_name} (เจ้าของ)` : 'เจ้าของโพสต์');

      if (!threadMap[rId]) {
        threadMap[rId] = {
          roomId: rId,
          itemId: msg.item_id,
          itemName: msg.item_name || 'สิ่งของ',
          itemCategory: msg.item_category || 'ทั่วไป',
          itemStatus: msg.item_status || 'searching',
          reporterName: msg.reporter_name || 'ผู้แจ้ง',
          inquirerName: contactPersonName,
          isOwnerOfPost: isOwnerOfPost,
          lastSenderClientId: msg.sender_faculty,
          lastSenderName: msg.sender_name,
          lastMessageId: msg.id,
          lastMessage: msg.message,
          lastTime: new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          updatedAt: new Date(msg.created_at).getTime()
        };
      } else {
        threadMap[rId].lastSenderClientId = msg.sender_faculty;
        threadMap[rId].lastSenderName = msg.sender_name;
        threadMap[rId].lastMessageId = msg.id;
        threadMap[rId].lastMessage = msg.message;
        threadMap[rId].lastTime = new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        threadMap[rId].updatedAt = new Date(msg.created_at).getTime();
        if (isOwnerOfPost && msg.sender_name && !msg.sender_name.includes('เจ้าของ')) {
          threadMap[rId].inquirerName = msg.sender_name;
        }
      }
    }

    const threads = Object.values(threadMap).sort((a, b) => b.updatedAt - a.updatedAt);
    res.json({ success: true, data: threads });
  } catch (err) {
    console.error('getInboxThreads Error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};