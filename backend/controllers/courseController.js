import pool from "../config/db.js";

// GET /api/courses
export async function getAllCourses(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM courses ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลรายวิชาได้", error: error.message });
  }
}

// GET /api/courses/:id
export async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM courses WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรายวิชา" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลรายวิชาได้", error: error.message });
  }
}

// POST /api/courses
export async function createCourse(req, res) {
  try {
    // 1. ดึงข้อมูลจาก req.body เข้ามาก่อน
    const { code, name_th, name_en, credit, category, description } = req.body;

    // 2. ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
    if (!code || !name_th || !name_en || !credit || !category) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลรายวิชาให้ครบถ้วน" });
    }

    // 3. ตรวจสอบว่ารหัสวิชาซ้ำหรือไม่ (ตอนที่ 21)
    const [exist] = await pool.query(
      "SELECT id FROM courses WHERE code = ?",
      [code]
    );
    if (exist.length > 0) {
      return res.status(409).json({ message: `รหัสวิชา ${code} มีอยู่ในระบบแล้ว` });
    }

    // 4. บันทึกข้อมูลลงตาราง
    const [result] = await pool.query(
      `INSERT INTO courses (code, name_th, name_en, credit, category, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, name_th, name_en, credit, category, description]
    );

    const [createdRows] = await pool.query(
      "SELECT * FROM courses WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "เพิ่มข้อมูลรายวิชาสำเร็จ",
      course: createdRows[0]
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ message: "ไม่สามารถเพิ่มข้อมูลรายวิชาได้", error: error.message });
  }
}

// PUT /api/courses/:id
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { code, name_th, name_en, credit, category, description } = req.body;

    if (!code || !name_th || !name_en || !credit || !category) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลรายวิชาให้ครบถ้วน" });
    }

    const [result] = await pool.query(
      `UPDATE courses 
       SET code = ?, name_th = ?, name_en = ?, credit = ?, category = ?, description = ?
       WHERE id = ?`,
      [code, name_th, name_en, credit, category, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรายวิชาที่ต้องการแก้ไข" });
    }

    const [updatedRows] = await pool.query(
      "SELECT * FROM courses WHERE id = ?",
      [id]
    );

    res.json({
      message: "แก้ไขข้อมูลรายวิชาสำเร็จ",
      course: updatedRows[0]
    });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถแก้ไขข้อมูลรายวิชาได้", error: error.message });
  }
}

// DELETE /api/courses/:id
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM courses WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลรายวิชาที่ต้องการลบ" });
    }

    res.json({ message: "ลบข้อมูลรายวิชาสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบข้อมูลรายวิชาได้", error: error.message });
  }
}