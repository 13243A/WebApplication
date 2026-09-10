import { useEffect, useState } from "react"

function WindowSizeInfo() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    
    // 3. เพิ่ม Event Listener 
    window.addEventListener("resize", handleResize)
    
    // 4. เพิ่ม Cleanup Function
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="card" style={{ padding: '16px', textAlign: 'center', backgroundColor: '#e8f0fe', borderColor: '#174ea6' }}>
      <p style={{ margin: 0, color: '#174ea6', fontWeight: 'bold' }}>
        💻 ความกว้างหน้าจอปัจจุบัน: {width}px
      </p>
    </div>
  )
}
export default WindowSizeInfo