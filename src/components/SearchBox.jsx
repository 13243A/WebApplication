function SearchBox({ searchText, onSearchChange }) {
  return (
    <section className="search-box">
      <div>
        <h2>ค้นหารายวิชา</h2>
        <p>พิมพ์คำค้นหา เช่น React, Database, Backend หรือ UI</p>
      </div>
      <div className="search-control">
        <input
          type="text"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ค้นหารายวิชาหรือหมวดหมู่..."
          aria-label="ค้นหารายวิชา"
        />
        {searchText && (
          <button type="button" onClick={() => onSearchChange("")}>
            ล้างคำค้นหา
          </button>
        )}
      </div>
    </section>
  )
}
export default SearchBox