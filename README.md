# UniFind - ระบบศูนย์กลางแจ้งของหายและรับคืนภายในมหาวิทยาลัย
โครงงานพัฒนาเว็บแอปพลิเคชันแบบ Full Stack ด้วย React & Node.js + MySQL (XAMPP phpMyAdmin)
วิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน (Lab 15)

## 1. วิธีติดตั้งฐานข้อมูลใน XAMPP (phpMyAdmin)
1. เปิดโปรแกรม **XAMPP Control Panel** แล้วกดคลิกปุ่ม **Start** ที่โมดูล **Apache** และ **MySQL**
2. เปิดเบราว์เซอร์ไปที่: `http://localhost/phpmyadmin`
3. คลิกแท็บ **SQL** ด้านบน
4. ก๊อปปี้ข้อความทั้งหมดในไฟล์ `database/schema.sql` มาวางในช่องคำสั่ง แล้วกดปุ่ม **Go (ลงมือทำ)**
5. ตรวจสอบจะพบฐานข้อมูลชื่อ `unifind_db` พร้อมตาราง `items`, `messages`, `dropoff_points` และข้อมูลตัวอย่างพร้อมใช้งานทันที

## 2. การติดตั้งและรันระบบ Backend (Express + mysql2)
```bash
cd backend
npm install
npm run dev
```
*ระบบจะเชื่อมต่อกับ MySQL port 3306 อัตโนมัติ (Default user: root, password: ไม่มี)*

## 3. การติดตั้งและรันระบบ Frontend (React + Vite)
เปิด Terminal อีกหน้าต่างหนึ่ง:
```bash
cd frontend
npm install
npm run dev
```
*เปิดดูเว็บได้ที่: `http://localhost:5173`*
