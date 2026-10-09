import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-200">UniFind - ระบบศูนย์กลางแจ้งของหายและรับคืนภายในมหาวิทยาลัย</p>
          <p className="text-xs text-slate-500 mt-1">โครงงานพัฒนาเว็บแอปพลิเคชันแบบ Full Stack ด้วย React (Lab 15)</p>
        </div>
        <div className="text-xs text-slate-400 flex flex-col sm:items-end">
          <span>ความปลอดภัยและความเป็นส่วนตัวสูงสุด | ติดต่อประสานงานผ่านระบบแชทส่วนตัว</span>
          <span className="text-emerald-400 mt-1">● ระบบทำงานร่วมกับ Backend API & Database</span>
        </div>
      </div>
    </footer>
  );
}
