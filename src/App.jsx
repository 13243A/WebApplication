import "./App.css"
import Header from "./components/Header"
import CourseList from "./components/CourseList"
import ToolList from "./components/ToolList"
import Footer from "./components/Footer"
import CourseSummary from "./components/CourseSummary"

function App() {
  // 1. ประกาศตัวแปร courses ก่อน
  const courses = [
    {
      id: 1,
      code: "4123307",
      name: "การพัฒนาเว็บแอปพลิเคชัน",
      englishName: "Web Application Development",
      credit: "3(2-2-5)",
      category: "Web Development",
      isCore: true
    },
    {
      id: 2,
      code: "4121306",
      name: "การเขียนโปรแกรมเชิงวัตถุ",
      englishName: "Object-Oriented Programming",
      credit: "3(2-2-5)",
      category: "Programming",
      isCore: true
    },
    {
      id: 3,
      code: "4122205",
      name: "ระบบฐานข้อมูลและการออกแบบ",
      englishName: "Database Systems and Design",
      credit: "3(2-2-5)",
      category: "Database",
      isCore: false
    },
    {
      id: 4,
      code: "4121205",
      name: "อัลกอริทึมและการออกแบบโปรแกรม",
      englishName: "Algorithms and Program Design",
      credit: "3(2-2-5)",
      category: "Computer Science",
      isCore: true
    },
    {
      id: 5,
      code: "4121206",
      name: "โปรแกรมอะไรสักอย่าง",
      englishName: "ProgrameSomthing",
      credit: "3(2-2-5)",
      category: "Computer Science",
      isCore: true
    },
    {
      id: 6,
      code: "4121207", // ผมขออนุญาตเปลี่ยน id กับ code ให้ไม่ซ้ำกันนะครับ
      name: "โปรแกรมอะไรสักอย่างV.2",
      englishName: "ProgrameSomthingV.2",
      credit: "3(2-2-5)",
      category: "Computer Science",
      isCore: true
    }
  ]

  // 2. ค่อยเอา courses มาคำนวณ (ต้องอยู่ใต้ courses)
  const totalCourses = courses.length
  const coreCourses = courses.filter((course) => course.isCore).length

  const tools = [
    { id: 1, name: "HTML", type: "frontend" },
    { id: 2, name: "CSS", type: "frontend" },
    { id: 3, name: "JavaScript", type: "frontend" },
    { id: 4, name: "React", type: "frontend" },
    { id: 5, name: "Vite", type: "tool" },
    { id: 6, name: "Node.js", type: "backend" },
    { id: 7, name: "npm", type: "tool" },
    { id: 8, name: "VS Code", type: "tool" }
  ]

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* 3. เอา CourseSummary มาแสดงผลตรงนี้ครับ */}
        <CourseSummary 
          totalCourses={totalCourses} 
          coreCourses={coreCourses} 
        />
        
        <CourseList courses={courses} />
        <ToolList tools={tools} />
      </main>

      <Footer
        studentName="เปลี่ยนเป็นชื่อตัวเองตรงนี้นะครับ"
        studentId="เปลี่ยนรหัสตรงนี้นะครับ"
      />
    </div>
  )
}

export default App