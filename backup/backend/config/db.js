import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection Pool (XAMPP Default: root / no password / port 3306)
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

// ตรวจสอบสถานะการเชื่อมต่อทันทีเมื่อ Server เริ่มทำงาน
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('----------------------------------------------------');
    console.log('✅ [MySQL] เชื่อมต่อกับ phpMyAdmin (unifind_db) สำเร็จแล้ว!');
    console.log(`📡 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'} | User: ${process.env.DB_USER || 'root'}`);
    console.log('----------------------------------------------------');
    connection.release();
  } catch (err) {
    console.error('----------------------------------------------------');
    console.error('❌ [MySQL] ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', err.message);
    console.error('👉 คำแนะนำ:');
    console.error('   1. ตรวจสอบว่าเปิด XAMPP Control Panel และกด Start MySQL หรือยัง');
    console.error('   2. ตรวจสอบว่าเข้า phpMyAdmin แล้วสร้าง Database ชื่อ "unifind_db" หรือยัง');
    console.error('----------------------------------------------------');
  }
})();
