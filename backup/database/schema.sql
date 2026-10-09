-- ============================================================
-- UniFind: University Lost & Found Centralized Hub
-- Database Schema for MySQL / phpMyAdmin (XAMPP)
-- วิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน (Lab 15)
-- ============================================================

CREATE DATABASE IF NOT EXISTS unifind_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unifind_db;

-- 1. ตารางรายการสิ่งของ (items)
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'ชื่อสิ่งของ',
    type ENUM('lost', 'found') NOT NULL COMMENT 'lost = แจ้งของหาย, found = แจ้งพบของ',
    category VARCHAR(100) NOT NULL COMMENT 'หมวดหมู่สิ่งของ',
    location VARCHAR(255) NOT NULL COMMENT 'สถานที่เกิดเหตุ/ที่พบ',
    sub_location VARCHAR(255) NULL COMMENT 'จุดสังเกตเฉพาะ',
    dropoff_point VARCHAR(255) NULL COMMENT 'จุดรับฝากใน ม. ที่นำไปส่งมอบ',
    reporter_name VARCHAR(150) NOT NULL COMMENT 'ชื่อผู้แจ้ง',
    reporter_faculty VARCHAR(150) NOT NULL COMMENT 'คณะ/สังกัด',
    status ENUM('searching', 'ready_pickup', 'returned') DEFAULT 'searching' COMMENT 'searching = ตามหา, ready_pickup = รอรับคืน, returned = ส่งคืนแล้ว',
    image_url LONGTEXT NULL COMMENT 'รูปภาพ Base64 หรือ URL',
    is_my_post TINYINT(1) DEFAULT 0 COMMENT 'ธงสถานะโพสต์ของฉัน',
    resolved_at DATETIME NULL COMMENT 'วันเวลาที่ส่งมอบเสร็จสิ้น',
    resolved_by VARCHAR(150) NULL COMMENT 'ผู้ส่งมอบ/ปิดเคส',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ตารางข้อความแชทส่วนตัว (messages)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL COMMENT 'รหัสสิ่งของที่คุยแชท',
    sender_name VARCHAR(150) NOT NULL COMMENT 'ชื่อผู้ส่ง',
    sender_faculty VARCHAR(150) NULL COMMENT 'คณะ/สังกัดผู้ส่ง',
    message TEXT NOT NULL COMMENT 'ข้อความสนทนา',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ตารางจุดรับฝากในมหาวิทยาลัย (dropoff_points)
CREATE TABLE IF NOT EXISTS dropoff_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(255) NOT NULL,
    hours VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ข้อมูลตัวอย่างเริ่มต้น (Initial Seed Data)
-- ============================================================

INSERT INTO dropoff_points (name, building, hours, phone, description) VALUES
('ป้อม รปภ. ประตูใหญ่', 'หน้ามหาวิทยาลัย ประตู 1', '24 ชั่วโมง', '055-123-456', 'จุดบริการรับฝากกลางพร้อมเจ้าหน้าที่ รปภ. ดูแลตลอด 24 ชม.'),
('เคาน์เตอร์บริการยืมคืน หอสมุดกลาง', 'หอสมุดกลาง ชั้น 1', '08:00 - 20:00 น.', '055-778-899', 'จุดรับฝากสิ่งของที่พบบริเวณพื้นที่การเรียนรู้และห้องสมุด'),
('สำนักงานกองพัฒนานักศึกษา', 'อาคารกิจการนักศึกษา ชั้น 2', '08:30 - 16:30 น. (วันทำการ)', '055-445-566', 'ศูนย์ประสานงานรับคืนเอกสารสำคัญ บัตรนักศึกษา และของมีค่า'),
('จุดประชาสัมพันธ์ โรงอาหารกลาง', 'โรงอาหารกลาง โซน A', '07:00 - 18:00 น.', '055-998-877', 'จุดรับฝากสิ่งของตกหล่นในโซนโรงอาหารและร้านค้า');

INSERT INTO items (name, type, category, location, sub_location, dropoff_point, reporter_name, reporter_faculty, status, is_my_post, created_at) VALUES
('Casio FX-991EX Calculator', 'found', 'อุปกรณ์การเรียน', 'คณะวิศวกรรมศาสตร์', 'แล็บคอมพิวเตอร์ 402', 'ป้อม รปภ. ประตูใหญ่', 'รปภ. วิเชียร', 'หน่วยงานรักษาความปลอดภัย', 'ready_pickup', 0, NOW()),
('iPad Air 5 (Starlight Blue)', 'found', 'อุปกรณ์อิเล็กทรอนิกส์', 'หอสมุดกลาง', 'โต๊ะอ่านหนังสือเดี่ยว ชั้น 3 ฝั่งค้นคว้า', 'เคาน์เตอร์บริการยืมคืน หอสมุดกลาง', 'เจ้าหน้าที่บรรณารักษ์', 'สำนักวิทยบริการและเทคโนโลยีสารสนเทศ', 'ready_pickup', 0, NOW()),
('บัตรประจำตัวนักศึกษา (คณะวิทยาการคอมพิวเตอร์)', 'lost', 'บัตร/เอกสารสำคัญ', 'โรงอาหารกลาง', 'โต๊ะม้าหินอ่อนข้างร้านน้ำผลไม้', 'สำนักงานกองพัฒนานักศึกษา', 'ภาสกร นาแก้ว', 'คณะวิทยาศาสตร์และเทคโนโลยี', 'searching', 1, NOW()),
('กระเป๋าสตางค์หนังสีดำใบสั้น', 'found', 'กระเป๋า/เครื่องแต่งกาย', 'อาคารเรียนรวม 1', 'ม้านั่งหน้าห้อง 1204', 'ป้อม รปภ. ประตูใหญ่', 'นางสาวพิมพ์ใจ มีน้ำใจ', 'คณะวิทยาการจัดการ', 'returned', 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO messages (item_id, sender_name, sender_faculty, message) VALUES
(3, 'ปิยะ (ผู้พบของ)', 'คณะวิศวกรรมศาสตร์', 'สวัสดีครับ บัตรนักศึกษารายการนี้มีเพื่อนเก็บได้อยู่ที่โต๊ะโรงอาหาร เดี๋ยวเอาไปฝากไว้ที่กองพัฒนานักศึกษานะครับ');
