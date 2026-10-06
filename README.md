# Full Stack Course Management System

ระบบจัดการข้อมูลรายวิชาแบบ Full Stack พัฒนาด้วย React (Vite), Express และ MySQL สำหรับรายวิชา 4123307 การพัฒนาเว็บแอปพลิเคชัน

## โครงสร้างโปรเจกต์
- `frontend/`: พัฒนาด้วย React + Vite พร้อมระบบทดสอบ Vitest และ React Testing Library
- `backend/`: RESTful API พัฒนาด้วย Node.js, Express และเชื่อมต่อ MySQL ผ่าน Connection Pool
- `database/`: ฐานข้อมูล MySQL ชื่อ `webapp_lab13` ตาราง `courses`

## ความต้องการของระบบ (Prerequisites)
- Node.js version 18 ขึ้นไป
- MySQL Server 8.0 หรือ MariaDB (ผ่าน XAMPP / MySQL Community Server)

## การติดตั้งและการเริ่มระบบ (Getting Started)

### 1. การติดตั้งและรัน Backend
```bash
cd backend
npm install
npm run dev   # สำหรับ Development (Port 3000)
npm start     # สำหรับ Production