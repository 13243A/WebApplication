function CourseTable({ courses, onEditCourse, onDeleteCourse }) {
  if (courses.length === 0) {
    return (
      <section className="card">
        <div className="section-heading">
          <h2>รายการรายวิชา</h2>
          <p className="empty-message">ยังไม่มีข้อมูลรายวิชาในระบบ</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>รายการรายวิชา</h2>
        <p>ข้อมูลนี้ถูกอ่านจากฐานข้อมูล MySQL ผ่าน Backend API</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชาภาษาไทย</th>
              <th>ชื่อวิชาภาษาอังกฤษ</th>
              <th>หน่วยกิต</th>
              <th>หมวดหมู่</th>
              <th>อัปเดตล่าสุด</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td><strong>{course.code}</strong></td>
                <td>{course.name_th}</td>
                <td>{course.name_en}</td>
                <td>{course.credit}</td>
                <td>{course.category}</td>
                {/* ช่องแสดงวันที่และเวลาที่แก้ไขล่าสุด */}
                <td>
                  {course.updated_at
                    ? new Date(course.updated_at).toLocaleString("th-TH", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })
                    : "-"}
                </td>
                {/* ช่องปุ่มจัดการ */}
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onEditCourse(course)}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDeleteCourse(course.id)}
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CourseTable;