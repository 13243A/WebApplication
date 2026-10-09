import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ unreadCount = 1, onOpenInbox }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium">
        🛡️ ยินดีต้อนรับสู่ระบบศูนย์กลางแจ้งของหายและรับคืนภายในมหาวิทยาลัย (UniFind) | เพื่อความเป็นส่วนตัว ประสานงานส่งมอบผ่านแชทส่วนตัวในระบบ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition">
            U
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl text-slate-900 tracking-tight">UniFind</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">Campus Hub</span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">ศูนย์ประสานงานของหายและส่งคืนในมหาวิทยาลัย</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            รายการทั้งหมด
          </Link>
          <Link
            to="/dropoffs"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/dropoffs') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            จุดรับฝากใน ม.
          </Link>
          <Link
            to="/stats"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/stats') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            สถิติ
          </Link>

          {/* Chat Inbox Button */}
          <button
            onClick={onOpenInbox}
            className="relative p-2 ml-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
            title="กล่องข้อความสนทนา"
          >
            <span className="text-xl">💬</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Action Button: Post Item */}
          <Link
            to="/create"
            className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
          >
            <span>➕</span>
            <span className="hidden sm:inline">แจ้งของหาย / พบของ</span>
            <span className="sm:hidden">แจ้ง</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
