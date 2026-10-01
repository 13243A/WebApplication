import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Header from "./components/Header";
import StatusMessage from "./components/StatusMessage";
import CourseForm from "./components/CourseForm";
import CourseTable from "./components/CourseTable";
import Footer from "./components/Footer";
import { getCourses, createCourse, updateCourse, deleteCourse } from "./services/courseApi";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null); // ฟังก์ชัน 3: Popup ดูรายละเอียด
  const [message, setMessage] = useState({ type: "", text: "" });

  // ฟังก์ชัน 1 & 2 & 4: ตัวกรอง, ค้นหา, และเรียงลำดับ
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("code_asc"); // code_asc, code_desc, name_asc

  const loadCourses = async () => {
    try {
      setLoading(true);
      setMessage({ type: "loading", text: "กำลังโหลดข้อมูลรายวิชา..." });

      const data = await getCourses();
      setCourses(data);
      setMessage({ type: "success", text: "โหลดข้อมูลรายวิชาสำเร็จ" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    document.title = `Full Stack Courses: ${courses.length} รายการ`;
  }, [courses.length]);

  const handleSubmitCourse = async (courseData) => {
    try {
      setSubmitting(true);

      if (editingCourse) {
        const result = await updateCourse(editingCourse.id, courseData);
        setCourses(
          courses.map((course) =>
            course.id === editingCourse.id ? result.course : course
          )
        );
        setEditingCourse(null);
        setMessage({ type: "success", text: "แก้ไขข้อมูลรายวิชาสำเร็จ" });
      } else {
        const result = await createCourse(courseData);
        setCourses([result.course, ...courses]);
        setMessage({ type: "success", text: "เพิ่มข้อมูลรายวิชาสำเร็จ" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setMessage({ type: "info", text: `กำลังแก้ไขรายวิชา ${course.code}` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm("ยืนยันการลบข้อมูลรายวิชานี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      await deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
      setMessage({ type: "success", text: "ลบข้อมูลรายวิชาสำเร็จ" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  // ประมวลผลการกรองและเรียงลำดับข้อมูล (Search + Category Filter + Sort)
  const processedCourses = useMemo(() => {
    let result = courses.filter((course) => {
      const keyword = searchText.toLowerCase();
      const matchesSearch =
        course.code.toLowerCase().includes(keyword) ||
        course.name_th.toLowerCase().includes(keyword) ||
        course.name_en.toLowerCase().includes(keyword) ||
        course.category.toLowerCase().includes(keyword);

      const matchesCategory =
        selectedCategory === "ALL" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // เรียงลำดับข้อมูล
    return result.sort((a, b) => {
      if (sortBy === "code_asc") return a.code.localeCompare(b.code);
      if (sortBy === "code_desc") return b.code.localeCompare(a.code);
      if (sortBy === "name_asc") return a.name_th.localeCompare(b.name_th);
      return 0;
    });
  }, [courses, searchText, selectedCategory, sortBy]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <section className="summary-grid">
          <article className="summary-card">
            <h3>{courses.length}</h3>
            <p>จำนวนทั้งหมด</p>
          </article>
          <article className="summary-card">
            <h3>{processedCourses.length}</h3>
            <p>ที่แสดงผล</p>
          </article>
          <article className="summary-card">
            <h3>Express</h3>
            <p>Backend API</p>
          </article>
          <article className="summary-card">
            <h3>MySQL</h3>
            <p>Database</p>
          </article>
        </section>

        <StatusMessage type={message.type} message={message.text} />

        <CourseForm
          onSubmitCourse={handleSubmitCourse}
          editingCourse={editingCourse}
          onCancelEdit={handleCancelEdit}
          submitting={submitting}
        />

        {/* แผงควบคุม: ค้นหา / ตัวกรองหมวดหมู่ / เรียงลำดับ */}
        <section className="card filter-section">
          <div className="section-heading">
            <h2>ค้นหาและคัดกรองข้อมูล</h2>
            <p>ค้นหาตามคำสำคัญ กรองตามหมวดหมู่ หรือจัดเรียงลำดับข้อมูล</p>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="search">ค้นหารายวิชา</label>
              <input
                id="search"
                type="text"
                placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryFilter">หมวดหมู่วิชา</label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">-- ทุกหมวดหมู่ --</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sortBy">เรียงลำดับตาม</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="code_asc">รหัสวิชา (น้อยไปมาก)</option>
                <option value="code_desc">รหัสวิชา (มากไปน้อย)</option>
                <option value="name_asc">ชื่อวิชา (ก-ฮ)</option>
              </select>
            </div>
            <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                className="secondary"
                style={{ width: "100%" }}
                onClick={() => {
                  setSearchText("");
                  setSelectedCategory("ALL");
                  setSortBy("code_asc");
                }}
              >
                รีเซ็ตตัวกรอง
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="status-message loading" style={{ textAlign: "center" }}>
            <span className="spinner">⏳</span> กำลังโหลดข้อมูลจากเซิร์ฟเวอร์...
          </div>
        ) : (
          <CourseTable
            courses={processedCourses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onViewDetail={(course) => setSelectedCourseDetail(course)}
          />
        )}

        <section className="card">
          <div className="section-heading">
            <h2>ทดสอบการเชื่อมต่อระบบ</h2>
            <p>กดปุ่มด้านล่างเพื่อโหลดข้อมูลล่าสุดจากฐานข้อมูลอีกครั้ง</p>
          </div>
          <button onClick={loadCourses} disabled={loading}>
            โหลดข้อมูลใหม่
          </button>
        </section>
      </main>

      {/* Modal หน้าต่างดูรายละเอียดรายวิชา */}
      {selectedCourseDetail && (
        <div className="modal-overlay" onClick={() => setSelectedCourseDetail(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="section-heading">
              <h2>รายละเอียดรายวิชา</h2>
              <p>{selectedCourseDetail.code} - {selectedCourseDetail.name_en}</p>
            </div>
            <div className="detail-content">
              <p><strong>ชื่อภาษาไทย:</strong> {selectedCourseDetail.name_th}</p>
              <p><strong>หน่วยกิต:</strong> {selectedCourseDetail.credit}</p>
              <p><strong>หมวดหมู่:</strong> {selectedCourseDetail.category}</p>
              <p><strong>คำอธิบายรายวิชา:</strong></p>
              <blockquote className="detail-description">
                {selectedCourseDetail.description || "ไม่มีคำอธิบาย"}
              </blockquote>
              <p style={{ fontSize: "13px", color: "var(--gray)", marginTop: "16px" }}>
                สร้างเมื่อ: {selectedCourseDetail.created_at ? new Date(selectedCourseDetail.created_at).toLocaleString("th-TH") : "-"}<br />
                อัปเดตล่าสุด: {selectedCourseDetail.updated_at ? new Date(selectedCourseDetail.updated_at).toLocaleString("th-TH") : "-"}
              </p>
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button onClick={() => setSelectedCourseDetail(null)}>ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;