import './App.css'
import Header from './components/Header'
import Navigation from './components/Navigation'
import CourseInfo from './components/CourseInfo'
import TopicList from './components/TopicList'
import ToolList from './components/ToolList'
import LearningOutcome from './components/LearningOutcome'
import Footer from './components/Footer'
import InstructorInfo from './components/InstructorInfo'

function App() {
  return (
    <div className="app">
      <Header />
      <Navigation />

      <main className="main-content">
         <InstructorInfo />
        <CourseInfo />
        <TopicList />
        <ToolList />
        <LearningOutcome />
      </main>

      <Footer />
    </div>
  )
}

export default App
