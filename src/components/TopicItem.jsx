function TopicItem({ topic, onToggleComplete, onDeleteTopic }) {
  return (
    <li className={`topic-item ${topic.completed ? "completed" : ""}`}>
      <div>
        <h3>{topic.name}</h3>
        <p>ระดับ: {topic.level}</p>
        <p>
          สถานะ:{" "}
          <span className={topic.completed ? "status-done" : "status-pending"}>
            {topic.completed ? "เรียนรู้แล้ว" : "ยังไม่เสร็จ"}
          </span>
        </p>
      </div>

      <div className="topic-actions">
        <button onClick={() => onToggleComplete(topic.id)}>
          {topic.completed ? "ยกเลิกสถานะ" : "ทำเครื่องหมายว่าเรียนแล้ว"}
        </button>

        <button 
          className="danger"
          onClick={() => onDeleteTopic(topic.id)}
        >
          ลบ
        </button>
      </div>
    </li>
  )
}

export default TopicItem
