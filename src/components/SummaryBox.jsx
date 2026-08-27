function SummaryBox({ registers }) {
  const total = registers.length
  const beginnerCount = registers.filter(
    (item) => item.skillLevel === "Beginner"
  ).length
  const intermediateCount = registers.filter(
    (item) => item.skillLevel === "Intermediate"
  ).length
  const advancedCount = registers.filter(
    (item) => item.skillLevel === "Advanced"
  ).length

  return (
    <section className="summary-grid">
      <div className="summary-card">
        <h3>{total}</h3>
        <p>จำนวนผู้ลงทะเบียนทั้งหมด</p>
      </div>

      <div className="summary-card">
        <h3>{beginnerCount}</h3>
        <p>Beginner</p>
      </div>

      <div className="summary-card">
        <h3>{intermediateCount}</h3>
        <p>Intermediate</p>
      </div>

      <div className="summary-card">
        <h3>{advancedCount}</h3>
        <p>Advanced</p>
      </div>
    </section>
  )
}

export default SummaryBox
