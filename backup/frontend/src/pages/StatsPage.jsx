import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';

export default function StatsPage() {
  const [stats, setStats] = useState({
    total: 0,
    searching: 0,
    ready: 0,
    returned: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">แดชบอร์ดสถิติระบบ (UniFind Analytics)</h1>
        <p className="text-xs text-slate-500 mt-1">
          ภาพรวมประสิทธิภาพการแจ้งสิ่งของตกหล่นและอัตราการส่งคืนสำเร็จภายในมหาวิทยาลัย
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">กำลังคำนวณสถิติ...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">รายการทั้งหมดในระบบ</span>
            <div className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</div>
            <p className="text-[11px] text-slate-500 mt-1">รายการแจ้งหายและพบของ</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm">
            <span className="text-xs text-amber-600 font-medium">กำลังติดตามหาเจ้าของ</span>
            <div className="text-3xl font-bold text-amber-700 mt-2">{stats.searching}</div>
            <p className="text-[11px] text-slate-500 mt-1">อยู่ระหว่างการค้นหา</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sky-200 shadow-sm">
            <span className="text-xs text-sky-600 font-medium">อยู่ที่จุดรับฝากรอรับ</span>
            <div className="text-3xl font-bold text-sky-700 mt-2">{stats.ready}</div>
            <p className="text-[11px] text-slate-500 mt-1">พร้อมให้ติดต่อรับของ</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm">
            <span className="text-xs text-emerald-600 font-medium">ส่งคืนเจ้าของสำเร็จแล้ว</span>
            <div className="text-3xl font-bold text-emerald-700 mt-2">{stats.returned}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              อัตราความสำเร็จ: {stats.successRate}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
