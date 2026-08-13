import SectionTitle from "./SectionTitle"
import CourseCard from "./CourseCard"

function CourseList({ courses }) { 
  return (
    <section className="section">
      <SectionTitle 
        title="รายวิชาที่เปิดสอน" 
        description="รายการวิชาทั้งหมดในระบบ"
      />
      
      {courses.length === 0 ? (
        <div className="empty-message">ไม่พบข้อมูลรายวิชา</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              code={course.code}
              name={course.name}
              englishName={course.englishName}
              credit={course.credit}
              category={course.category}
              isCore={course.isCore}
              year={course.year}          
              semester={course.semester}  
            />
          ))}
        </div>
      )}
    </section>
  ) 
}

export default CourseList