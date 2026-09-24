function StatusMessage({ type, message, onClear }) {
  if (!message) {
    return null
  }

  return (
    <div className={`status-message ${type}`}>
      <span>{message}</span>
      {onClear && (
        <button className="close-btn" onClick={onClear} title="ปิดข้อความ">
          ✕
        </button>
      )}
    </div>
  )
}

export default StatusMessage