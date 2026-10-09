import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ unreadCount = 0, onOpenInbox }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Name */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              U
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-base leading-tight flex items-center gap-1.5">
                UniFind
                <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Campus Hub
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-light hidden sm:block">
                ศูนย์ประสานงานของหายและส่งคืนในมหาวิทยาลัย
              </span>
            </div>
          </Link>

          {/* Desktop & iPad Navigation Links (ซ่อนบนมือถือ) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive('/') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              รายการทั้งหมด
            </Link>
            <Link
              to="/dropoffs"
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive('/dropoffs') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              จุดรับฝากใน ม.
            </Link>
            <Link
              to="/stats"
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive('/stats') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              สถิติ
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Chat Inbox Button (พร้อมตัวเลขแจ้งเตือนสีแดง) */}
            <button
              onClick={onOpenInbox}
              className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center justify-center"
              title="กล่องข้อความสนทนา"
            >
              <span className="text-xl">💬</span>
              {unreadCount > 0 && (
                <span className="absolute 0 top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Create Post Button (Desktop/iPad) */}
            <Link
              to="/create"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <span>➕</span>
              <span>แจ้งของหาย / พบของ</span>
            </Link>

            {/* Mobile Hamburger Toggle Button (แสดงเฉพาะบนมือถือ) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              aria-label="เปิดเมนู"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (พับเปิด-ปิดสำหรับหน้าจอมือถือ) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-xs font-medium ${
              isActive('/') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            📋 รายการสิ่งของทั้งหมด
          </Link>
          <Link
            to="/dropoffs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-xs font-medium ${
              isActive('/dropoffs') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            🏢 จุดรับฝากในมหาวิทยาลัย
          </Link>
          <Link
            to="/stats"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-xl text-xs font-medium ${
              isActive('/stats') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
          >
            📊 สรุปสถิติ
          </Link>
          <div className="pt-2">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm"
            >
              <span>➕</span>
              <span>แจ้งของหาย / พบของ</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}