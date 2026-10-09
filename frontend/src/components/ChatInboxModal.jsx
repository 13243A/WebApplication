import React, { useState, useEffect } from 'react';
import { getInboxThreads } from '../services/api';

export default function ChatInboxModal({ isOpen, onClose, onSelectThread, myClientId, filterItem }) {
  const [filter, setFilter] = useState('all'); // 'all', 'inbound', 'outbound'
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const myPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');

  useEffect(() => {
    if (isOpen) {
      loadThreads();
      const interval = setInterval(loadThreads, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadThreads = async () => {
    try {
      const res = await getInboxThreads(myClientId, myPostIds);
      setThreads(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // กรองเฉพาะโพสต์นั้น (ถ้ากดเปิดมาจากการ์ดโพสต์ของตัวเอง)
  const filteredThreads = threads.filter((t) => {
    if (filterItem && Number(t.itemId) !== Number(filterItem.id)) {
      return false;
    }
    if (filter === 'all') return true;
    if (filter === 'inbound') return t.isOwnerOfPost === true; // คนทักโพสต์ของฉัน
    if (filter === 'outbound') return t.isOwnerOfPost === false; // โพสต์ที่ฉันทักไป
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {filterItem ? `ผู้ติดต่อ: ${filterItem.name}` : 'กล่องข้อความสนทนา (Chat Inbox)'}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {filteredThreads.length} บทสนทนา
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {filterItem 
                  ? `แสดงเฉพาะรายการที่มีคนทักเข้ามาเกี่ยวกับ "${filterItem.name}"`
                  : 'แชทแยกส่วนตัว 1 ต่อ 1 รายบุคคล ปลอดภัย ไม่ปะปนกัน'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Filters (แสดงเฉพาะเมื่อดูรวมจาก Navbar) */}
        {!filterItem && (
          <div className="px-6 pt-4 pb-2 flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilter('inbound')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                filter === 'inbound'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              คนทักโพสต์ของฉัน
            </button>
            <button
              onClick={() => setFilter('outbound')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                filter === 'outbound'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              โพสต์ที่ฉันทักไป
            </button>
          </div>
        )}

        {/* Thread List */}
        <div className="p-6 space-y-3 max-h-[380px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">กำลังโหลดบทสนทนา...</div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {filterItem 
                ? 'ยังไม่มีใครทักเข้ามาเกี่ยวกับสิ่งของชิ้นนี้' 
                : 'ยังไม่มีบทสนทนาในหมวดหมู่นี้'}
            </div>
          ) : (
            filteredThreads.map((t) => {
              const displayName = t.isOwnerOfPost
                ? (t.inquirerName || t.lastSenderName || 'ผู้สนใจติดต่อ')
                : (t.reporterName ? `${t.reporterName} (เจ้าของ)` : 'เจ้าของโพสต์');
              const avatarLetter = (displayName || 'U').charAt(0);

              // ตรวจสอบว่าแชทนี้มีข้อความใหม่ที่ยังไม่ได้อ่านหรือไม่
              const isFromOther = t.lastSenderClientId !== myClientId;
              const lastReadId = parseInt(localStorage.getItem(`unifind_read_${t.roomId}`) || '0', 10);
              const isUnread = isFromOther && t.lastMessageId > lastReadId;

              return (
                <div
                  key={t.roomId}
                  onClick={() => onSelectThread(t)}
                  className={`group p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                    isUnread
                      ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl ${t.isOwnerOfPost ? 'bg-emerald-600' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                      {avatarLetter}
                    </div>
                    {/* จุดสถานะสีเขียวหรือแดง */}
                    <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${
                      isUnread ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                    }`}></span>
                    {isUnread && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                          {displayName}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          t.isOwnerOfPost ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {t.isOwnerOfPost ? 'คนทักโพสต์ฉัน' : 'โพสต์ที่ฉันทักไป'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">{t.lastTime || ''}</span>
                        {/* ป้ายวงกลมสีแดงแจ้งเตือนข้อความใหม่ */}
                        {isUnread && (
                          <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                            1
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-emerald-800 mt-1 line-clamp-1">
                      เรื่อง: {t.itemName || 'สิ่งของ'}
                    </p>

                    <p className={`text-xs mt-1 line-clamp-1 ${
                      isUnread ? 'font-medium text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      {t.lastMessage || 'ไม่มีข้อความ'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Notice */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span>🛡️</span>
            <span>ระบบแชทแยก 1 ต่อ 1 ปลอดภัยสูงสุด</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>🔒</span>
            <span>ไม่แสดงเบอร์โทรศัพท์</span>
          </div>
        </div>

      </div>
    </div>
  );
}