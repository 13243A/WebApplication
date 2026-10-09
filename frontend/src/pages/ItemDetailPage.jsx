import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem, resolveItem, deleteItem } from '../services/api';

export default function ItemDetailPage({ onOpenChat }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const myPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');
  const isMyPost = item ? myPostIds.includes(item.id) : false;

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const res = await getItemById(id);
      setItem(res.data);
      setEditFormData({
        name: res.data.name || '',
        type: res.data.type || 'found',
        category: res.data.category || 'อุปกรณ์อิเล็กทรอนิกส์',
        location: res.data.location || '',
        sub_location: res.data.sub_location || '',
        dropoff_point: res.data.dropoff_point || 'ป้อม รปภ. ประตูใหญ่',
        image_url: res.data.image_url || ''
      });
      setPreviewImage(res.data.image_url || null);
    } catch (err) {
      alert(err.message);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดรูปภาพต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditFormData({ ...editFormData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.location) {
      alert('กรุณากรอกชื่อสิ่งของและสถานที่');
      return;
    }

    try {
      setSaving(true);
      await updateItem(item.id, editFormData);
      alert('แก้ไขข้อมูลโพสต์เรียบร้อยแล้ว!');
      setIsEditing(false);
      await loadItem();
    } catch (err) {
      alert(err.message || 'ไม่สามารถแก้ไขข้อมูลได้');
    } finally {
      setSaving(false);
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
              {isMyPost && (
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

          {/* Grid รายละเอียด (จัดระเบียบเหลือ 3 ช่องหลัก ไม่แสดงสังกัด) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          {isMyPost ? (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
              <h3 className="font-bold text-amber-900 text-sm mb-1">แผงควบคุมสำหรับเจ้าของโพสต์ (Owner Controls)</h3>
              <p className="text-xs text-amber-700 mb-4">
                คุณสามารถแก้ไขข้อมูลสิ่งของ, กดยืนยันเมื่อได้รับของคืนเรียบร้อย, หรือลบโพสต์ออกจากระบบ
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>✏️</span> แก้ไขข้อมูลโพสต์
                </button>

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

      {/* Modal ฟอร์มแก้ไข (ไม่มีช่องสังกัด) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">✏️ แก้ไขข้อมูลสิ่งของ</h2>
                <p className="text-xs text-slate-500 mt-0.5">ปรับปรุงข้อมูลรายละเอียดหรืออัปเดตรูปภาพใหม่</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ประเภท</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, type: 'found' })}
                    className={`py-2 rounded-xl border text-xs font-semibold transition ${
                      editFormData.type === 'found'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🟢 พบของ
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, type: 'lost' })}
                    className={`py-2 rounded-xl border text-xs font-semibold transition ${
                      editFormData.type === 'lost'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🔴 แจ้งหาย
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อสิ่งของ *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
                  <option value="อุปกรณ์การเรียน">อุปกรณ์การเรียน</option>
                  <option value="บัตร/เอกสารสำคัญ">บัตร/เอกสารสำคัญ</option>
                  <option value="กระเป๋า/เครื่องแต่งกาย">กระเป๋า/เครื่องแต่งกาย</option>
                  <option value="ของมีค่า/กุญแจ">ของมีค่า/กุญแจ</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">สถานที่ *</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">จุดสังเกตเฉพาะ</label>
                  <input
                    type="text"
                    name="sub_location"
                    value={editFormData.sub_location}
                    onChange={handleEditChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">จุดรับฝาก</label>
                <select
                  name="dropoff_point"
                  value={editFormData.dropoff_point}
                  onChange={handleEditChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="ป้อม รปภ. ประตูใหญ่">ป้อม รปภ. ประตูใหญ่</option>
                  <option value="เคาน์เตอร์บริการยืมคืน หอสมุดกลาง">เคาน์เตอร์บริการยืมคืน หอสมุดกลาง</option>
                  <option value="สำนักงานกองพัฒนานักศึกษา">สำนักงานกองพัฒนานักศึกษา</option>
                  <option value="จุดประชาสัมพันธ์ โรงอาหารกลาง">จุดประชาสัมพันธ์ โรงอาหารกลาง</option>
                  <option value="นัดรับส่งมอบโดยตรงผ่านแชท">นัดรับส่งมอบโดยตรงผ่านแชท</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">รูปภาพประกอบ</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {previewImage && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreviewImage(null); setEditFormData({ ...editFormData, image_url: '' }); }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-xl transition shadow-sm"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}