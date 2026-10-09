import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'unifind_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL] เชื่อมต่อกับ phpMyAdmin (unifind_db) สำเร็จแล้ว!');

    // ระบบเพิ่มคอลัมน์ room_id ในตาราง messages อัตโนมัติ เพื่อรองรับแชทแยก 1 ต่อ 1
    try {
      await connection.query("ALTER TABLE messages ADD COLUMN room_id VARCHAR(100) DEFAULT '' AFTER item_id");
      console.log('✅ [MySQL] สร้างคอลัมน์ room_id สำหรับระบบแชทแยกเรียบร้อย');
    } catch (colErr) {
      // ถ้ามีคอลัมน์อยู่แล้วให้ข้าม
    }

    connection.release();
  } catch (err) {
    console.error('❌ [MySQL] ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', err.message);
  }
})();