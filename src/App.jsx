import { useEffect, useState } from "react"
import "./App.css"
import Header from "./components/Header"
import UsageTimer from "./components/UsageTimer"
import LearningForm from "./components/LearningForm"
import LearningList from "./components/LearningList"
import CourseLoader from "./components/CourseLoader"
import SummaryBox from "./components/SummaryBox"
import Footer from "./components/Footer"
import WindowSizeInfo from "./components/WindowSizeInfo"

const STORAGE_KEY = "lab9-learnings"

function App() {
  const [learnings, setLearnings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const savedLearnings = localStorage.getItem(STORAGE_KEY)
    if (savedLearnings) {
      setLearnings(JSON.parse(savedLearnings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnings))
  }, [learnings])

  useEffect(() => {
    document.title = `หัวข้อการเรียนรู้: ${learnings.length} รายการ`
  }, [learnings.length])

  const addLearning = (newLearning) => {
    setLearnings([...learnings, newLearning])
  }

  const toggleComplete = (learningId) => {
    const updatedLearnings = learnings.map((item) => {
      if (item.id === learningId) {
        return { ...item, completed: !item.completed }
      }
      return item
    })
    setLearnings(updatedLearnings)
  }

  const deleteLearning = (learningId) => {
    const updatedLearnings = learnings.filter((item) => item.id !== learningId)
    setLearnings(updatedLearnings)
  }

  const clearAllLearnings = () => {
    const confirmClear = window.confirm("ต้องการลบหัวข้อทั้งหมดหรือไม่")
    if (confirmClear) {
      setLearnings([])
    }
  }

  // NEW: 16.1 ปุ่มเรียนรู้แล้วทั้งหมด
  const markAllCompleted = () => {
    const updatedLearnings = learnings.map((item) => ({ ...item, completed: true }))
    setLearnings(updatedLearnings)
  }

  // NEW: 16.2 ล้างเฉพาะรายการที่เรียนรู้แล้ว
  const removeCompleted = () => {
    const updatedLearnings = learnings.filter((item) => !item.completed)
    setLearnings(updatedLearnings)
  }

  // NEW: กรองข้อมูลตามคำค้นหา (ตัวพิมพ์เล็ก/ใหญ่มีค่าเท่ากัน)
  const filteredLearnings = learnings.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <UsageTimer />
        <WindowSizeInfo />
        <SummaryBox learnings={learnings} />
        <LearningForm onAddLearning={addLearning} />

        <div className="card">
          <h2>🔍 ค้นหาหัวข้อ</h2>
          <input
            type="text"
            placeholder="พิมพ์เพื่อค้นหาหัวข้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          />
        </div>

        <div className="list-toolbar">
          <h2>หัวข้อที่บันทึกไว้</h2>
          {learnings.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={markAllCompleted} style={{ backgroundColor: '#34a853' }}>
                เรียนรู้แล้วทั้งหมด
              </button>
              <button onClick={removeCompleted} style={{ backgroundColor: '#fbbc05', color: '#000' }}>
                ล้างที่เรียนแล้ว
              </button>
              <button className="danger" onClick={clearAllLearnings}>
                ลบทั้งหมด
              </button>
            </div>
          )}
        </div>
        
        <LearningList
          learnings={filteredLearnings}
          onToggleComplete={toggleComplete}
          onDeleteLearning={deleteLearning}
        />
        <CourseLoader />
      </main>
      <Footer />
    </div>
  )
}

export default App