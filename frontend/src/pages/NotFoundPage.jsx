import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-xs text-slate-500 mt-1">URL อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายไปแล้ว</p>
      <Link
        to="/"
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
