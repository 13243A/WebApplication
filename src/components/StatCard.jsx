function StatCard({ title, value, description }) {
  return (
    <article className="stat-card">
      <h3>{value}</h3>
      <p className="stat-title">{title}</p>
      <p className="stat-description">{description}</p>
    </article>
  )
}
export default StatCard