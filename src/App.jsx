import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import StatusMessage from "./components/StatusMessage"
import ApiInfo from "./components/ApiInfo"
import CourseForm from "./components/CourseForm"
import CourseList from "./components/CourseList"
import Footer from "./components/Footer"
import { initialCourses } from "./data/initialCourses"
import { fetchPostsWithFetch, createPostWithFetch } from "./services/fetchCourseApi"
import { fetchPostsWithAxios, createPostWithAxios } from "./services/axiosCourseApi"

function App() {
  const [courses, setCourses] = useState(initialCourses)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({
    type: "",
    text: ""
  })

  // State เพิ่มเติมสำหรับฟังก์ชันค้นหา และกรองตาม Source (ปรับปรุงตอนที่ 18)
  const [searchText, setSearchText] = useState("")
  const [selectedSource, setSelectedSource] = useState("ALL")

  useEffect(() => {
    document.title = `API Courses: ${courses.length} รายการ`
  }, [courses.length])

  const clearMessage = () => {
    setMessage({ type: "", text: "" })
  }

  const loadWithFetch = async () => {
    try {
      setLoading(true)
      setMessage({ type: "loading", text: "กำลังโหลดข้อมูลด้วย fetch..." })
      const apiCourses = await fetchPostsWithFetch()
      setCourses(apiCourses)
      setMessage({ type: "success", text: "โหลดข้อมูลด้วย fetch สำเร็จ" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const loadWithAxios = async () => {
    try {
      setLoading(true)
      setMessage({ type: "loading", text: "กำลังโหลดข้อมูลด้วย Axios..." })
      const apiCourses = await fetchPostsWithAxios()
      setCourses(apiCourses)
      setMessage({ type: "success", text: "โหลดข้อมูลด้วย Axios สำเร็จ" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.statusText || "ไม่สามารถโหลดข้อมูลด้วย Axios ได้"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetLocalCourses = () => {
    setCourses(initialCourses)
    setMessage({ type: "info", text: "กลับไปใช้ข้อมูลรายวิชาเริ่มต้นแล้ว" })
  }

  const submitCourseWithFetch = async (courseData) => {
    try {
      setSubmitting(true)
      setMessage({ type: "loading", text: "กำลังส่งข้อมูลไปยัง API ด้วย fetch..." })
      const createdCourse = await createPostWithFetch(courseData)
      setCourses((prevCourses) => [createdCourse, ...prevCourses])
      setMessage({ type: "success", text: "ส่งข้อมูลด้วย fetch สำเร็จ" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const submitCourseWithAxios = async (courseData) => {
    try {
      setSubmitting(true)
      setMessage({ type: "loading", text: "กำลังส่งข้อมูลไปยัง API ด้วย Axios..." })
      const createdCourse = await createPostWithAxios(courseData)
      setCourses((prevCourses) => [createdCourse, ...prevCourses])
      setMessage({ type: "success", text: "ส่งข้อมูลด้วย Axios สำเร็จ" })
    } catch (error) {
      setMessage({
        type: "error",
        text: "ไม่สามารถส่งข้อมูลด้วย Axios ได้"
      })
    } finally {
      setSubmitting(false)
    }
  }

  // ปรับปรุงตอนที่ 18: มี Confirm Dialog ก่อนลบจริง
  const deleteCourse = (courseId) => {
    const confirmDelete = window.confirm("ยืนยันการลบรายการรายวิชานี้หรือไม่?")
    if (!confirmDelete) return

    const updatedCourses = courses.filter((course) => course.id !== courseId)
    setCourses(updatedCourses)
    setMessage({ type: "info", text: "ลบข้อมูลออกจากรายการบนหน้าเว็บแล้ว" })
  }

  // ตัวกรอง Search และ Source (ตอนที่ 18)
  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase()
    const matchKeyword =
      course.code.toLowerCase().includes(keyword) ||
      course.name.toLowerCase().includes(keyword) ||
      course.category.toLowerCase().includes(keyword)

    const matchSource =
      selectedSource === "ALL" || course.source.toUpperCase().includes(selectedSource)

    return matchKeyword && matchSource
  })

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ApiInfo />

        <section className="toolbar card">
          <div>
            <h2>เครื่องมือเชื่อมต่อ API</h2>
            <p>เลือกวิธีการโหลดข้อมูลจาก API หรือกลับไปใช้ข้อมูลเริ่มต้น</p>
          </div>
          <div className="button-group">
            <button onClick={loadWithFetch} disabled={loading}>
              โหลดด้วย fetch
            </button>
            <button onClick={loadWithAxios} disabled={loading}>
              โหลดด้วย Axios
            </button>
            <button className="secondary" onClick={resetLocalCourses}>
              ข้อมูลเริ่มต้น
            </button>
          </div>
        </section>

        <StatusMessage
          type={message.type}
          message={message.text}
          onClear={clearMessage}
        />

        <CourseForm
          onSubmitCourse={submitCourseWithFetch}
          submitting={submitting}
        />

        <section className="card">
          <div className="section-heading">
            <h2>ทดลองส่งข้อมูลด้วย Axios</h2>
            <p>ปุ่มด้านล่างเป็นตัวอย่างการส่งข้อมูลคงที่ไปยัง API ด้วย Axios</p>
          </div>
          <button
            className="secondary"
            disabled={submitting}
            onClick={() =>
              submitCourseWithAxios({
                code: "412API",
                name: "การเชื่อมต่อ API ในเว็บแอปพลิเคชัน",
                englishName: "API Integration in Web Application",
                credit: "Lab",
                category: "Backend"
              })
            }
          >
            ส่งข้อมูลตัวอย่างด้วย Axios
          </button>
        </section>

        {/* Search & Filter Toolbar (ปรับปรุงเพิ่มเติม) */}
        <section className="card filter-section">
          <div className="search-box">
            <label htmlFor="mainSearch">ค้นหารายวิชา:</label>
            <input
              id="mainSearch"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาด้วยรหัสวิชา, ชื่อวิชา, หรือหมวดหมู่"
            />
          </div>
          <div className="source-filter">
            <label htmlFor="sourceFilter">ที่มาของข้อมูล (Source):</label>
            <select
              id="sourceFilter"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="ALL">ทั้งหมดทุกแหล่งข้อมูล</option>
              <option value="LOCAL">ข้อมูลในเครื่อง (Local)</option>
              <option value="FETCH">มาจาก Fetch API</option>
              <option value="AXIOS">มาจาก Axios</option>
            </select>
          </div>
          <div className="total-badge">
            จำนวนข้อมูลที่แสดง: <strong>{filteredCourses.length}</strong> จากทั้งหมด {courses.length} รายการ
          </div>
        </section>

        <CourseList courses={filteredCourses} onDeleteCourse={deleteCourse} />
      </main>
      <Footer />
    </div>
  )
}

export default App