-- ========================================================
-- โครงสร้างฐานข้อมูลสำหรับโปรเจกต์ UniFind (Lab 15)
-- รองรับระบบแชทแยก 1 ต่อ 1, Privacy PDPA (นิรนาม), และระบบสถิติ
-- ========================================================

CREATE DATABASE IF NOT EXISTS unifind_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE unifind_db;

-- --------------------------------------------------------
-- 1. ตารางจุดรับฝากสิ่งของทางการในมหาวิทยาลัย (dropoff_points)
-- --------------------------------------------------------
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS dropoff_points;

CREATE TABLE dropoff_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'ชื่อจุดรับฝาก',
    building VARCHAR(255) NOT NULL COMMENT 'อาคาร/สถานที่ตั้ง',
    contact_person VARCHAR(150) NOT NULL COMMENT 'เจ้าหน้าที่รับผิดชอบ',
    phone VARCHAR(50) NOT NULL COMMENT 'เบอร์โทรศัพท์ติดต่อ',
    operating_hours VARCHAR(100) NOT NULL COMMENT 'เวลาทำการ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ข้อมูลตั้งต้นสำหรับจุดรับฝาก
INSERT INTO dropoff_points (name, building, contact_person, phone, operating_hours) VALUES
('ป้อม รปภ. ประตูใหญ่', 'ประตูทางเข้าหลักมหาวิทยาลัย', 'เจ้าหน้าที่รักษาความปลอดภัย', '055-706-555 ต่อ 101', 'ทุกวัน 24 ชั่วโมง'),
('เคาน์เตอร์บริการยืมคืน หอสมุดกลาง', 'อาคารบรรณราชนครินทร์ ชั้น 1', 'เจ้าหน้าที่บรรณารักษ์', '055-706-555 ต่อ 204', 'จันทร์-ศุกร์ 08.00 - 19.00 น.'),
('สำนักงานกองพัฒนานักศึกษา', 'อาคารกิจกรรมนักศึกษา ชั้น 2', 'เจ้าหน้าที่ฝ่ายวินัยและพัฒนานักศึกษา', '055-706-555 ต่อ 305', 'จันทร์-ศุกร์ 08.30 - 16.30 น.'),
('จุดประชาสัมพันธ์ โรงอาหารกลาง', 'อาคารศูนย์อาหาร ชั้น 1', 'เจ้าหน้าที่ดูแลอาคารสถานที่', '055-706-555 ต่อ 410', 'จันทร์-เสาร์ 07.00 - 15.00 น.');

-- --------------------------------------------------------
-- 2. ตารางสิ่งของแจ้งหายและพบของ (items)
-- --------------------------------------------------------
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'ชื่อสิ่งของ',
    type ENUM('lost', 'found') NOT NULL COMMENT 'lost = แจ้งหาย, found = พบของ',
    category VARCHAR(100) NOT NULL COMMENT 'หมวดหมู่สิ่งของ',
    location VARCHAR(255) NOT NULL COMMENT 'สถานที่พบ/ทำหาย',
    sub_location VARCHAR(255) DEFAULT '' COMMENT 'จุดสังเกตเฉพาะ',
    dropoff_point VARCHAR(255) DEFAULT 'นัดรับส่งมอบโดยตรงผ่านแชท' COMMENT 'จุดรับฝาก',
    reporter_name VARCHAR(150) DEFAULT 'ผู้แจ้งนิรนาม' COMMENT 'ชื่อผู้แจ้ง (นิรนามตาม PDPA)',
    reporter_faculty VARCHAR(150) DEFAULT '' COMMENT 'สังกัด (เว้นว่างตาม PDPA)',
    status ENUM('searching', 'ready_pickup', 'returned') DEFAULT 'searching' COMMENT 'searching=ตามหา, ready_pickup=รอรับคืน, returned=ส่งมอบสำเร็จ',
    image_url LONGTEXT COMMENT 'URL รูปภาพ หรือ Base64',
    is_my_post TINYINT(1) DEFAULT 0 COMMENT 'สถานะสำหรับไคลเอนต์',
    resolved_at DATETIME NULL COMMENT 'เวลาที่ปิดเคสส่งมอบสำเร็จ',
    resolved_by VARCHAR(255) NULL COMMENT 'หลักฐานหรือเลขอ้างอิงการส่งมอบ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ข้อมูลตัวอย่างสิ่งของ
INSERT INTO items (id, name, type, category, location, sub_location, dropoff_point, reporter_name, reporter_faculty, status, image_url, created_at) VALUES
(1, 'กระเป๋าสตางค์หนังสีดำใบสั้น', 'found', 'กระเป๋า/เครื่องแต่งกาย', 'อาคารเรียนรวม 1', 'ม้านั่งหน้าห้อง 1204', 'ป้อม รปภ. ประตูใหญ่', 'ผู้แจ้งนิรนาม', '', 'returned', '', NOW() - INTERVAL 2 DAY),
(2, 'บัตรประจำตัวนักศึกษา', 'lost', 'บัตร/เอกสารสำคัญ', 'โรงอาหารกลาง', 'โต๊ะม้าหินอ่อนข้างร้านน้ำผลไม้', 'สำนักงานกองพัฒนานักศึกษา', 'ผู้แจ้งนิรนาม', '', 'searching', '', NOW() - INTERVAL 1 DAY),
(3, 'iPad Air 5 (Starlight Blue)', 'found', 'อุปกรณ์อิเล็กทรอนิกส์', 'หอสมุดกลาง', 'โต๊ะอ่านหนังสือเดี่ยว ชั้น 3', 'เคาน์เตอร์บริการยืมคืน หอสมุดกลาง', 'ผู้แจ้งนิรนาม', '', 'ready_pickup', '', NOW() - INTERVAL 5 HOUR);

-- อัปเดตข้อมูลการปิดเคสสำหรับรายการที่ส่งคืนแล้ว
UPDATE items 
SET resolved_at = NOW() - INTERVAL 1 DAY, 
    resolved_by = 'นัดส่งมอบตรงเรียบร้อย (P2P Handover) REF-8421' 
WHERE id = 1;

-- --------------------------------------------------------
-- 3. ตารางข้อความสนทนาแยกห้อง 1 ต่อ 1 (messages)
-- --------------------------------------------------------
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL COMMENT 'รหัสสิ่งของที่คุยแชท',
    room_id VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'รหัสห้องแชทแยก 1 ต่อ 1 (เช่น room_3_user_abc)',
    sender_name VARCHAR(150) NOT NULL COMMENT 'ชื่อบทบาทผู้ส่ง (เจ้าของโพสต์ / ผู้ติดต่อ)',
    sender_faculty VARCHAR(150) NULL COMMENT 'รหัส Client ID ประจำเครื่องผู้ส่ง',
    message TEXT NOT NULL COMMENT 'ข้อความสนทนา',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตัวอย่างข้อความในห้องแชท
INSERT INTO messages (item_id, room_id, sender_name, sender_faculty, message, created_at) VALUES
(3, 'room_3_demo_client_1', 'ผู้สนใจติดต่อ', 'demo_client_1', 'สวัสดีครับ คิดว่านี่เป็น iPad ของผมที่ลืมไว้ช่วงเที่ยงครับ', NOW() - INTERVAL 20 MINUTE),
(3, 'room_3_demo_client_1', 'เจ้าของโพสต์', 'owner_client', 'สวัสดีครับ นำไปฝากไว้ที่เคาน์เตอร์บริการยืมคืน หอสมุดกลาง แล้วนะครับ ลองไปติดต่อรับได้เลย', NOW() - INTERVAL 15 MINUTE);