import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';

export default function CreateItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'found',
    category: 'อุปกรณ์อิเล็กทรอนิกส์',
    location: '',
    sub_location: '',
    dropoff_point: 'ป้อม รปภ. ประตูใหญ่',
    image_url: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์ภาพต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.location) {
      setErrorMsg('กรุณากรอกชื่อสิ่งของและสถานที่');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createItem(formData);

      if (res.data && res.data.id) {
        const myPosts = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');
        myPosts.push(res.data.id);
        localStorage.setItem('unifind_my_posts', JSON.stringify(myPosts));
      }

      alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        
        {/* Banner PDPA Privacy Notice */}
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
          <span className="text-xl">🛡️</span>
          <div>
            <strong>ระบบนิรนามเพื่อความปลอดภัย (Anonymous System):</strong> ไม่มีการเก็บชื่อและข้อมูลส่วนบุคคลใด ๆ สามารถนัดแนะส่งมอบของผ่านระบบแชทส่วนตัวได้ทันที
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">ลงทะเบียนแจ้งของหาย / พบของ</h1>
        <p className="text-xs text-slate-500 mb-6">กรอกรายละเอียดสิ่งของเพื่อช่วยให้การประสานงานส่งคืนเป็นไปอย่างรวดเร็ว</p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">ประเภทการแจ้ง *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'found' })}
                className={`py-3 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  formData.type === 'found'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🟢</span> ฉันพบของ (Found Item)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'lost' })}
                className={`py-3 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  formData.type === 'lost'
                    ? 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🔴</span> ฉันทำของหาย (Lost Item)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อสิ่งของ *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น บัตรนักศึกษา, iPad Air สีฟ้า, เครื่องคิดเลข Casio..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่สิ่งของ *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            >
              <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
              <option value="อุปกรณ์การเรียน">อุปกรณ์การเรียน</option>
              <option value="บัตร/เอกสารสำคัญ">บัตร/เอกสารสำคัญ</option>
              <option value="กระเป๋า/เครื่องแต่งกาย">กระเป๋า/เครื่องแต่งกาย</option>
              <option value="ของมีค่า/กุญแจ">ของมีค่า/กุญแจ</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">สถานที่เกิดเหตุ / จุดที่พบ *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="เช่น หอสมุดกลาง, โรงอาหารกลาง"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">จุดสังเกตเฉพาะ (ระบุถ้ามี)</label>
              <input
                type="text"
                name="sub_location"
                value={formData.sub_location}
                onChange={handleChange}
                placeholder="เช่น ชั้น 3 ฝั่งห้องค้นคว้า, โต๊ะหน้าแล็บ 402"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">จุดรับฝากใน ม. ที่นำไปส่งมอบ</label>
            <select
              name="dropoff_point"
              value={formData.dropoff_point}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            >
              <option value="ป้อม รปภ. ประตูใหญ่">ป้อม รปภ. ประตูใหญ่</option>
              <option value="เคาน์เตอร์บริการยืมคืน หอสมุดกลาง">เคาน์เตอร์บริการยืมคืน หอสมุดกลาง</option>
              <option value="สำนักงานกองพัฒนานักศึกษา">สำนักงานกองพัฒนานักศึกษา</option>
              <option value="จุดประชาสัมพันธ์ โรงอาหารกลาง">จุดประชาสัมพันธ์ โรงอาหารกลาง</option>
              <option value="นัดรับส่งมอบโดยตรงผ่านแชท">นัดรับส่งมอบโดยตรงผ่านแชท (P2P Handover)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">รูปภาพประกอบ (ถ้ามี)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
            {previewImage && (
              <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreviewImage(null); setFormData({ ...formData, image_url: '' }); }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-sm transition"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}