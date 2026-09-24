import { useState } from "react"
import CourseCard from "../components/CourseCard"
import { courses } from "../data/courses"

function CoursesPage() {
  const [searchText, setSearchText] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("ALL")

  const filteredCourses = courses.filter((course) => {
    const keyword = searchText.toLowerCase()
    const matchesKeyword =
      course.code.toLowerCase().includes(keyword) ||
      course.name.toLowerCase().includes(keyword) ||
      course.englishName.toLowerCase().includes(keyword) ||
      course.category.toLowerCase().includes(keyword)

    const matchesLevel =
      selectedLevel === "ALL" || course.level.toUpperCase() === selectedLevel

    return matchesKeyword && matchesLevel
  })

  return (
    <section className="page-section">
      <div className="section-heading">
        <h1>รายการรายวิชา</h1>
        <p>
          แสดงข้อมูลรายวิชาที่เกี่ยวข้องกับการพัฒนาเว็บแอปพลิเคชันและพื้นฐานทางคอมพิวเตอร์
        </p>
      </div>

      <div className="filter-container">
        <div className="search-box">
          <label htmlFor="courseSearch">ค้นหารายวิชา</label>
          <div className="search-input-group">
            <input
              id="courseSearch"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาด้วยรหัสวิชา ชื่อวิชา หรือหมวดหมู่"
            />
            {searchText && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchText("")}
              >
                ✕ ล้างคำค้น
              </button>
            )}
          </div>
        </div>

        <div className="level-filter">
          <label>ระดับความยาก:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="ALL">ทั้งหมด</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <p className="search-count">
        พบข้อมูลทั้งหมด <strong>{filteredCourses.length}</strong> รายการ
      </p>

      {filteredCourses.length === 0 ? (
        <p className="empty-message">ไม่พบรายวิชาที่ตรงกับเงื่อนไขการค้นหา</p>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CoursesPage