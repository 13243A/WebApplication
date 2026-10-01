import { useEffect, useState } from "react";

const initialFormData = {
  code: "",
  name_th: "",
  name_en: "",
  credit: "3(2-2-5)",
  category: "Web Development",
  description: ""
};

function CourseForm({ onSubmitCourse, editingCourse, onCancelEdit, submitting }) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        code: editingCourse.code || "",
        name_th: editingCourse.name_th || "",
        name_en: editingCourse.name_en || "",
        credit: editingCourse.credit || "3(2-2-5)",
        category: editingCourse.category || "Web Development",
        description: editingCourse.description || ""
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingCourse]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.code.trim() === "") {
      setError("กรุณากรอกรหัสวิชา");
      return;
    }
    if (formData.name_th.trim() === "") {
      setError("กรุณากรอกชื่อวิชาภาษาไทย");
      return;
    }
    if (formData.name_en.trim() === "") {
      setError("กรุณากรอกชื่อวิชาภาษาอังกฤษ");
      return;
    }
    if (formData.credit.trim() === "") {
      setError("กรุณากรอกจำนวนหน่วยกิต");
      return;
    }
    if (formData.category.trim() === "") {
      setError("กรุณาเลือกหมวดหมู่");
      return;
    }

    onSubmitCourse({
      ...formData,
      code: formData.code.trim(),
      name_th: formData.name_th.trim(),
      name_en: formData.name_en.trim(),
      credit: formData.credit.trim(),
      category: formData.category.trim(),
      description: formData.description.trim()
    });

    setError("");
    if (!editingCourse) {
      setFormData(initialFormData);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError("");
    onCancelEdit();
  };

  return (
    <section className="card">
      <div className="section-heading">
        <h2>{editingCourse ? "แก้ไขข้อมูลรายวิชา" : "เพิ่มข้อมูลรายวิชา"}</h2>
        <p>กรอกข้อมูลรายวิชาเพื่อบันทึกลงฐานข้อมูลผ่าน Backend API</p>
      </div>

      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="code">รหัสวิชา</label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              placeholder="เช่น 4123307"
            />
          </div>
          <div className="form-group">
            <label htmlFor="credit">หน่วยกิต</label>
            <input
              id="credit"
              name="credit"
              type="text"
              value={formData.credit}
              onChange={handleChange}
              placeholder="เช่น 3(2-2-5)"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name_th">ชื่อวิชาภาษาไทย</label>
          <input
            id="name_th"
            name="name_th"
            type="text"
            value={formData.name_th}
            onChange={handleChange}
            placeholder="กรอกชื่อวิชาภาษาไทย"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name_en">ชื่อวิชาภาษาอังกฤษ</label>
          <input
            id="name_en"
            name="name_en"
            type="text"
            value={formData.name_en}
            onChange={handleChange}
            placeholder="กรอกชื่อวิชาภาษาอังกฤษ"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">หมวดหมู่</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="Database">Database</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">คำอธิบายรายวิชา</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="กรอกคำอธิบายรายวิชา"
            rows="4"
          ></textarea>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "กำลังบันทึก..."
              : editingCourse
              ? "บันทึกการแก้ไข"
              : "เพิ่มรายวิชา"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={handleReset}
          >
            {editingCourse ? "ยกเลิกการแก้ไข" : "ล้างข้อมูล"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CourseForm;