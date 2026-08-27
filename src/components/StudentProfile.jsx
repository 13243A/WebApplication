import { useState } from "react"

function StudentProfile() {
  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")

  return (
    <section className="card">
      <h2>ข้อมูลผู้เรียน</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="studentName">ชื่อ - สกุล</label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder="กรอกชื่อ - สกุล"
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentId">รหัสนักศึกษา</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="กรอกรหัสนักศึกษา"
          />
        </div>
      </div>
      <div className="profile-preview">
        <h3>ตัวอย่างข้อมูลที่จะแสดง</h3>
        {studentName.trim() === "" && studentId.trim() === "" ? (
          <p className="empty-message">ยังไม่มีข้อมูลผู้เรียน</p>
        ) : (
          <p>
            ผู้เรียน: <strong>{studentName || "ยังไม่ระบุชื่อ"}</strong>{" "}
            รหัสนักศึกษา: <strong>{studentId || "ยังไม่ระบุรหัส"}</strong>
          </p>
        )}
      </div>
    </section>
  )
}

export default StudentProfile