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
  const [message, setMessage] = useState({ type: "", text: "" });

  // ฟังก์ชันค้นหา & กรองหมวดหมู่
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setMessage({ type: "loading", text: "กำลังโหลดข้อมูลรายวิชา..." });
      const data = await getCourses();
      setCourses(data);
      setMessage({ type: "success", text: "โหลดข้อมูลรายวิชาสำเร็จ" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานอยู่"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

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

  // คัดกรองข้อมูล
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const keyword = searchText.toLowerCase();
      const matchSearch =
        course.code.toLowerCase().includes(keyword) ||
        course.name_th.toLowerCase().includes(keyword) ||
        course.name_en.toLowerCase().includes(keyword);
      const matchCat =
        selectedCategory === "ALL" || course.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [courses, searchText, selectedCategory]);

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
            <h3>{filteredCourses.length}</h3>
            <p>ที่แสดงผล</p>
          </article>
          <article className="summary-card">
            <h3>Express</h3>
            <p>Backend</p>
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
          onCancelEdit={() => setEditingCourse(null)}
          submitting={submitting}
        />

        <section className="card">
          <div className="section-heading">
            <h2>ค้นหาและคัดกรองข้อมูล</h2>
            <p>ค้นหารายวิชาหรือเลือกดูเฉพาะหมวดหมู่ที่ต้องการ</p>
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
          </div>
        </section>

        {loading ? (
          <div className="card spinner-container">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูลรายวิชา...</p>
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
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
      <Footer />
    </div>
  );
}

export default App;