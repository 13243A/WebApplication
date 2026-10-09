import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, resolveItem, deleteItem } from '../services/api';

export default function ItemDetailPage({ onOpenChat }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await getItemById(id);
      setItem(res.data);
    } catch (err) {
      alert(err.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm('คุณยืนยันว่าได้ส่งมอบหรือได้รับของชิ้นนี้คืนเรียบร้อยแล้วใช่หรือไม่?')) return;
    try {
      await resolveItem(item.id, {
        resolved_by: `นัดส่งมอบตรงเรียบร้อย (P2P Handover) REF-${Math.floor(1000 + Math.random() * 9000)}`
      });
      alert('ปิดเคสสำเร็จ! สถานะเปลี่ยนเป็น "ส่งคืนแล้ว"');
      loadItem();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการปิดเคส');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้ออกจากระบบ?')) return;
    try {
      await deleteItem(item.id);
      alert('ลบโพสต์เรียบร้อยแล้ว');
      navigate('/');
    } catch (err) {
      alert('ไม่สามารถลบโพสต์ได้');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">กำลังโหลดรายละเอียด...</div>;
  }

  if (!item) return null;

  const isFound = item.type === 'found';
  const isReturned = item.status === 'returned';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isFound ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isFound ? '🟢 แจ้งพบของ' : '🔴 แจ้งของหาย'}
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                {item.category}
              </span>
              {item.is_my_post && (
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  โพสต์ของฉัน
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{item.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChat(item)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <span>💬</span> คุยแชทส่วนตัวกับผู้แจ้ง
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {item.image_url && (
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={item.image_url} alt={item.name} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">สถานที่เกิดเหตุ / จุดที่พบ</span>
              <p className="font-semibold text-slate-800">{item.location}</p>
              {item.sub_location && <p className="text-xs text-slate-500 mt-1">{item.sub_location}</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">จุดรับฝากส่งมอบใน ม.</span>
              <p className="font-semibold text-slate-800">{item.dropoff_point}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">ผู้ลงทะเบียนข้อมูล</span>
              <p className="font-semibold text-slate-800">{item.reporter_name}</p>
              <p className="text-xs text-slate-500 mt-1">{item.reporter_faculty}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">สถานะปัจจุบัน</span>
              <p className="font-semibold text-slate-800">
                {isReturned ? '✅ ส่งมอบคืนเรียบร้อยแล้ว' : isFound ? '📦 รอเจ้าของติดต่อรับ' : '🔍 กำลังตามหา'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                บันทึกเมื่อ: {new Date(item.created_at).toLocaleString('th-TH')}
              </p>
            </div>
          </div>

          {/* Returned Log */}
          {isReturned && (
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-700 mb-1">หลักฐานการส่งมอบสิ่งของ:</h4>
              <p className="text-xs text-slate-600">{item.resolved_by}</p>
              {item.resolved_at && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  เสร็จสิ้นเมื่อ: {new Date(item.resolved_at).toLocaleString('th-TH')}
                </p>
              )}
            </div>
          )}

          {/* Owner Controls */}
          {item.is_my_post ? (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
              <h3 className="font-bold text-amber-900 text-sm mb-1">แผงควบคุมสำหรับเจ้าของโพสต์ (Owner Controls)</h3>
              <p className="text-xs text-amber-700 mb-4">
                คุณสามารถกดยืนยันเมื่อได้รับของหรือส่งมอบของคืนเรียบร้อยแล้ว หรือลบโพสต์เมื่อธุระเสร็จสิ้น
              </p>

              <div className="flex flex-wrap gap-3">
                {!isReturned && (
                  <button
                    onClick={handleResolve}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    🤝 ได้รับของคืนแล้ว / ส่งคืนสำเร็จ (ปิดเคส)
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  🗑️ ลบโพสต์นี้
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-800">
              💡 <strong>ต้องการติดต่อรับสิ่งของหรือคิดว่าเป็นของของคุณ?</strong> คลิกปุ่ม <em>"คุยแชทส่วนตัวกับผู้แจ้ง"</em> ด้านบนเพื่อสอบถามรายละเอียดและนัดหมายส่งมอบของได้ทันที
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            ← กลับหน้ารายการทั้งหมด
          </button>
        </div>

      </div>
    </div>
  );
}
