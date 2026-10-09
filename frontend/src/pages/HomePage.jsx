import React, { useState, useEffect, useRef } from 'react';
import { getItems, getInboxThreads } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function HomePage({ onOpenChat, unreadMap = {} }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [ownership, setOwnership] = useState('all'); // 'all', 'my_posts', 'others', 'inbound_messages'

  // ใช้ useRef เก็บค่าตัวกรองล่าสุดเพื่อป้องกัน Stale Closure ใน Background Polling
  const filterRef = useRef({ search: '', category: 'all', status: 'all', ownership: 'all' });

  const getClientId = () => {
    let id = localStorage.getItem('unifind_chat_client_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('unifind_chat_client_id', id);
    }
    return id;
  };

  // ดึงข้อมูลรายการสิ่งของ + กรองและจัดเรียงตามสิทธิ์และการทักแชท
  const fetchItems = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const myClientId = getClientId();
      const myPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]').map(Number);

      // 1. ดึงรายการสิ่งของจากเซิร์ฟเวอร์
      const res = await getItems({
        search: filterRef.current.search,
        category: filterRef.current.category,
        status: filterRef.current.status
      });

      let itemList = res.data || [];

      // 2. ดึงข้อมูลแชทเพื่อใช้คำนวณเวลาการทักล่าสุดของแต่ละโพสต์
      let threadMapByItem = {};
      try {
        const threadRes = await getInboxThreads(myClientId, myPostIds);
        if (threadRes.success && threadRes.data) {
          threadRes.data.forEach((t) => {
            if (t.isOwnerOfPost) {
              const itId = Number(t.itemId);
              if (!threadMapByItem[itId] || t.updatedAt > threadMapByItem[itId]) {
                threadMapByItem[itId] = t.updatedAt;
              }
            }
          });
        }
      } catch (err) {
        // เงียบไว้ถ้าแชทยังโหลดไม่ได้
      }

      // 3. กรองตามตัวเลือกความเป็นเจ้าของ / การทักแชท
      const currentOwnership = filterRef.current.ownership;
      if (currentOwnership === 'my_posts') {
        itemList = itemList.filter((item) => myPostIds.includes(Number(item.id)));
      } else if (currentOwnership === 'others') {
        itemList = itemList.filter((item) => !myPostIds.includes(Number(item.id)));
      } else if (currentOwnership === 'inbound_messages') {
        // เฉพาะโพสต์ของเราที่มีคนทักมา
        itemList = itemList.filter(
          (item) => myPostIds.includes(Number(item.id)) && threadMapByItem[item.id]
        );
        // เรียงลำดับเอาโพสต์ที่ถูกทักล่าสุดขึ้นก่อน
        itemList.sort((a, b) => (threadMapByItem[b.id] || 0) - (threadMapByItem[a.id] || 0));
      }

      setItems(itemList);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(false);

    // ตรวจสอบข้อมูลใหม่ในพื้นหลังทุก 3 วินาที
    const interval = setInterval(() => {
      fetchItems(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // เมื่อกดยืนยันการค้นหา
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterRef.current.search = search;
    fetchItems(false);
  };

  // กากบาทล้างคำค้นหา (ตัวกรองอื่นคงเดิม)
  const handleClearSearch = () => {
    setSearch('');
    filterRef.current.search = '';
    fetchItems(false);
  };

  // รีเซ็ตตัวกรองทั้งหมด (คำค้นหาคงเดิม)
  const handleResetFilters = () => {
    setOwnership('all');
    setCategory('all');
    setStatus('all');
    filterRef.current.ownership = 'all';
    filterRef.current.category = 'all';
    filterRef.current.status = 'all';
    fetchItems(false);
  };

  // เปลี่ยนตัวกรองความเป็นเจ้าของ/การทัก
  const handleOwnershipChange = (e) => {
    const val = e.target.value;
    setOwnership(val);
    filterRef.current.ownership = val;
    fetchItems(false);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    filterRef.current.category = val;
    fetchItems(false);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatus(val);
    filterRef.current.status = val;
    fetchItems(false);
  };

  const isAnyFilterActive = ownership !== 'all' || category !== 'all' || status !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
            ระบบศูนย์กลางของมหาวิทยาลัย
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold mt-3 leading-tight">
            ลืมของ หรือ เก็บของได้ในมหาวิทยาลัย?
          </h1>
          <p className="text-emerald-100 text-sm mt-2 font-light">
            UniFind ช่วยให้นักศึกษาและบุคลากรประสานงานส่งคืนของกันได้อย่างปลอดภัย ผ่านระบบแชทส่วนตัวและจุดรับฝากในมหาวิทยาลัย
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อสิ่งของ, สถานที่ที่พบ (เช่น หอสมุด, ป้อม รปภ., บัตรนักศึกษา)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            {search.trim() !== '' && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold transition"
                title="ล้างข้อความค้นหา (คงค่าตัวกรองเดิม)"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition"
          >
            ค้นหา
          </button>
        </form>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium mr-1">ตัวกรอง:</span>
          
          {/* ตัวกรองแบบใหม่: สิทธิ์และการทักแชท */}
          <select
            value={ownership}
            onChange={handleOwnershipChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="all">โพสต์ทั้งหมด</option>
            <option value="my_posts">📌 โพสต์ของฉัน</option>
            <option value="others">👥 โพสต์ของคนอื่น</option>
            <option value="inbound_messages">💬 มีคนทักฉันมา (เรียงตามล่าสุด)</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
            <option value="อุปกรณ์การเรียน">อุปกรณ์การเรียน</option>
            <option value="บัตร/เอกสารสำคัญ">บัตร/เอกสารสำคัญ</option>
            <option value="กระเป๋า/เครื่องแต่งกาย">กระเป๋า/เครื่องแต่งกาย</option>
            <option value="ของมีค่า/กุญแจ">ของมีค่า/กุญแจ</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="searching">กำลังตามหา</option>
            <option value="ready_pickup">รอรับคืน</option>
            <option value="returned">ส่งคืนสำเร็จแล้ว</option>
          </select>

          {/* ปุ่มรีเซ็ตตัวกรอง */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 border border-rose-200"
              title="ล้างตัวกรองทั้งหมด (คงคำค้นหาเดิม)"
            >
              <span>✕</span>
              <span>รีเซ็ตตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            รายการสิ่งของ ({items.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
            <p className="text-sm">กำลังโหลดข้อมูลสิ่งของ...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <p className="text-base font-medium">ไม่พบรายการสิ่งของที่ตรงกับเงื่อนไข</p>
            <p className="text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกตัวกรองอื่น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onOpenChat={onOpenChat}
                unreadCount={unreadMap[item.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}