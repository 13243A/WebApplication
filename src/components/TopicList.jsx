import TopicItem from './TopicItem'
function TopicList({ topics, onToggleComplete, onDeleteTopic }) { 
    const completedCount = topics.filter((topic) => topic.completed).length
return (
<section>
<div>
รายการหัวข้อการเรียนรู้
    <p>จำนวนหัวข้อทั้งหมด: {topics.length}</p>
    <p>เรียนรู้แล้ว: {completedCount}</p>
    <p>คงเหลือ: {topics.length - completedCount}</p>
  </div>

  {topics.length === 0 ? (
    <p className="empty-message">ยังไม่มีหัวข้อการเรียนรู้</p>
  ) : (
    <ul className="topic-list">
      {topics.map((topic) => (
        <TopicItem
          key={topic.id}
          topic={topic}
          onToggleComplete={onToggleComplete}
          onDeleteTopic={onDeleteTopic}
        />
      ))}
    </ul>
  )}
</section>
) }
export default TopicList
