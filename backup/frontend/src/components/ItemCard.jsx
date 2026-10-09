import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item, onOpenChat }) {
  const isFound = item.type === 'found';
  const isReturned = item.status === 'returned';

  return (
    <div className={`bg-white rounded-2xl border transition hover:shadow-md flex flex-col overflow-hidden ${
      isReturned ? 'border-slate-200 opacity-80' : 'border-slate-200 hover:border-emerald-300'
    }`}>
      {/* Card Header & Badge */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isFound ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {isFound ? '🟢 พบของ' : '🔴 แจ้งหาย'}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {item.category}
          </span>
        </div>

        {item.is_my_post && (
          <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            โพสต์ของฉัน
          </span>
        )}
      </div>

      {/* Image Preview if available */}
      {item.image_url ? (
        <div className="h-44 bg-slate-100 overflow-hidden">
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-28 bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
          📦 ไม่มีรูปภาพแนบ
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 text-base line-clamp-1">{item.name}</h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span>📍 {item.location}</span>
          {item.sub_location && <span className="text-slate-400">({item.sub_location})</span>}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div><span className="text-slate-400">ผู้แจ้ง:</span> {item.reporter_name} ({item.reporter_faculty})</div>
          <div><span className="text-slate-400">จุดรับฝาก:</span> {item.dropoff_point}</div>
        </div>

        {/* Status indicator */}
        <div className="mt-3">
          {isReturned ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              ✅ ส่งมอบคืนเรียบร้อยแล้ว
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
              isFound ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
            }`}>
              {isFound ? '📦 รอเจ้าของติดต่อรับ' : '🔍 กำลังตามหา'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/items/${item.id}`}
            className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 rounded-lg transition"
          >
            ดูรายละเอียด
          </Link>
          
          <button
            onClick={() => onOpenChat(item)}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-2 rounded-lg transition flex items-center gap-1"
            title="คุยแชทส่วนตัวกับผู้แจ้ง"
          >
            <span>💬</span>
            <span>แชท</span>
          </button>
        </div>
      </div>
    </div>
  );
}
