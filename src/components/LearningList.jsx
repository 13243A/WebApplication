import LearningItem from "./LearningItem"
function LearningList({ learnings, onToggleComplete, onDeleteLearning }) {
  return (
    <section className="learning-list-container">
      <div className="learning-list">
        {learnings.length === 0 ? (
          <div className="empty-message">ยังไม่มีหัวข้อการเรียนรู้ กรุณาเพิ่มหัวข้อใหม่</div>
        ) : (
          learnings.map((item) => (
            <LearningItem key={item.id} item={item} onToggleComplete={onToggleComplete} onDeleteLearning={onDeleteLearning} />
          ))
        )}
      </div>
    </section>
  )
}
export default LearningList