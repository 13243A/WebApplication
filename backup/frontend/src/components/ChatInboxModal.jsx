import React, { useState } from 'react';

export default function ChatInboxModal({ isOpen, onClose, onSelectThread }) {
  const [filter, setFilter] = useState('all'); // 'all', 'inbound', 'outbound'

  if (!isOpen) return null;

  // รายการบทสนทนาจำลองในระบบตามภาพ
  const threads = [
    {
      id: 1,
      type: 'outbound', // โพสต์ที่ฉันทักไป
      badgeText: 'โพสต์ที่ฉันทักไป',
      badgeColor: 'bg-blue-100 text-blue-700',
      avatarColor: 'bg-blue-600',
      senderName: 'นางสาวกานดา (จนท. หอสมุด)',
      time: '14:45',
      unread: 1,
      item: {
        id: 2,
        name: 'iPad Air 5 (Starlight Blue)',
        category: 'อุปกรณ์อิเล็กทรอนิกส์',
        location: 'หอสมุดกลาง',
        dropoff_point: 'เคาน์เตอร์บริการยืมคืน หอสมุดกลาง ชั้น 1',
        reporter_name: 'นางสาวกานดา (จนท. หอสมุด)',
        reporter_faculty: 'สำนักวิทยบริการ',
        is_my_post: false,
        status: 'ready_pickup'
      },
      lastMessage: 'สวัสดีครับ เจ้าหน้าที่เก็บรักษา iPad เครื่องนี้ไว้ที่เคาน์เตอร์ชั้น 1 ให้แล้วนะครับ สะดวกเข้ามารับได้เลย'
    },
    {
      id: 2,
      type: 'inbound', // คนทักโพสต์ของฉัน
      badgeText: 'คนทักโพสต์ฉัน',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      avatarColor: 'bg-emerald-600',
      senderName: 'นายปิยะ (ผู้พบของ)',
      time: '12:10',
      unread: 1,
      item: {
        id: 3,
        name: 'บัตรประจำตัวนักศึกษา (คณะวิทยาการคอมพิวเตอร์)',
        category: 'บัตร/เอกสารสำคัญ',
        location: 'โรงอาหารกลาง',
        dropoff_point: 'สำนักงานกองพัฒนานักศึกษา',
        reporter_name: 'นายปิยะ (ผู้พบของ)',
        reporter_faculty: 'คณะวิศวกรรมศาสตร์',
        is_my_post: true,
        status: 'searching'
      },
      lastMessage: 'สวัสดีครับ เห็นโพสต์แจ้งของหาย ผมเจอบัตรนักศึกษาของคุณตกอยู่ที่โต๊ะโรงอาหารกลางครับ'
    }
  ];

  const filteredThreads = threads.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">กล่องข้อความสนทนา (Chat Inbox)</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {threads.length} บทสนทนา
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ข้อความจากผู้ที่สนใจหรือติดต่อเกี่ยวกับโพสต์ของคุณ
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

        {/* Tab Filters (ตรงตามภาพเป๊ะ) */}
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

        {/* Thread List */}
        <div className="p-6 space-y-3 max-h-[380px] overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              ไม่มีบทสนทนาในหมวดหมู่นี้
            </div>
          ) : (
            filteredThreads.map(t => (
              <div
                key={t.id}
                onClick={() => onSelectThread(t.item)}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md bg-white transition cursor-pointer flex items-start gap-4 relative"
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl ${t.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                    {t.senderName.charAt(0)}
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{t.senderName}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${t.badgeColor}`}>
                        {t.badgeText}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{t.time}</span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-800 mt-1 line-clamp-1">
                    เรื่อง: {t.item.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 group-hover:text-slate-700">
                    {t.lastMessage}
                  </p>
                </div>

                {t.unread > 0 && (
                  <div className="self-center ml-2">
                    <span className="w-5 h-5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {t.unread}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Notice */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span>🛡️</span>
            <span>สนทนาส่วนตัว ปลอดภัย ไม่แสดงเบอร์โทร</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>🔒</span>
            <span>เข้ารหัสเฉพาะใน ม.</span>
          </div>
        </div>

      </div>
    </div>
  );
}