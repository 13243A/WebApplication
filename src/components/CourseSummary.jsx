function CourseSummary({ totalCourses, coreCourses }) { 
  return (
    <section className="section">
      <h2>สรุปรายวิชา</h2>
      <p>จำนวนรายวิชาทั้งหมด: {totalCourses}</p>
      <p>จำนวนรายวิชาหลัก: {coreCourses}</p>
    </section>
  ) 
}

export default CourseSummary