import { useState } from "react"
import "./App.css"
import Header from "./components/Header"
import StudentProfile from "./components/StudentProfile"
import ProgressCounter from "./components/ProgressCounter"
import TopicForm from "./components/TopicForm"
import TopicList from "./components/TopicList"
import Footer from "./components/Footer"

function App() {
  const [topics, setTopics] = useState([
    { id: 1, name: "เข้าใจแนวคิด State", level: "Beginner", completed: true },
    { id: 2, name: "ใช้ Event Handling กับปุ่ม", level: "Beginner", completed: false },
    { id: 3, name: "จัดการข้อมูล Array ด้วย State", level: "Intermediate", completed: false }
  ])

  const addTopic = (newTopic) => {
    setTopics([...topics, newTopic])
  }

  const toggleComplete = (topicId) => {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === topicId) {
        return { ...topic, completed: !topic.completed }
      }
      return topic
    })
    setTopics(updatedTopics)
  }

  const deleteTopic = (topicId) => {
    const updatedTopics = topics.filter((topic) => topic.id !== topicId)
    setTopics(updatedTopics)
  }

  // ข้อ 1: ฟังก์ชันลบทั้งหมด
  const clearTopics = () => {
    setTopics([])
  }

  // ข้อ 2: ฟังก์ชันทำเครื่องหมายว่าเรียนแล้วทั้งหมด
  const markAllCompleted = () => {
    const updatedTopics = topics.map((topic) => ({ ...topic, completed: true }))
    setTopics(updatedTopics)
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <StudentProfile />
        <ProgressCounter />
        <TopicForm onAddTopic={addTopic} />

        {/* ปุ่มสำหรับ ข้อ 1 และ ข้อ 2 */}
        <div className="button-group" style={{ justifyContent: "center" }}>
          <button onClick={markAllCompleted}>ทำเครื่องหมายว่าเรียนแล้วทั้งหมด</button>
          <button className="danger" onClick={clearTopics}>ลบหัวข้อทั้งหมด</button>
        </div>

        <TopicList
          topics={topics}
          onToggleComplete={toggleComplete}
          onDeleteTopic={deleteTopic}
        />
      </main>
      
      {/* ข้อ 4: ส่งข้อมูลไป Footer ผ่าน Props */}
      <Footer studentName="ภาสกร" studentId="รหัสนักศึกษาของคุณ" />
    </div>
  )
}

export default App