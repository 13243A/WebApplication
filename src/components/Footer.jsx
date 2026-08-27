function Footer({ studentName, studentId }) {
  return (
    <footer className="footer">
      <p>Lab 7: State และ Event Handling ใน React</p>
      <p>
        จัดทำโดย: {studentName || "นายภาสกร นาแก้ว"} รหัส: {studentId || "68042380101"}
      </p>
    </footer>
  )
}

export default Footer