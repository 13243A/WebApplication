import React, { useState, useEffect } from 'react';
import { getDropoffs } from '../services/api';

export default function DropoffPage() {
  const [dropoffs, setDropoffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDropoffs();
  }, []);

  const loadDropoffs = async () => {
    try {
      setLoading(true);
      const res = await getDropoffs();
      setDropoffs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">จุดรับฝากใน ม. (Campus Drop-off Points)</h1>
        <p className="text-xs text-slate-500 mt-1">
          จุดบริการรับฝากสิ่งของทางการภายในมหาวิทยาลัย พร้อมเบอร์โทรศัพท์สายตรงประจำแต่ละจุด
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">กำลังโหลดจุดรับฝาก...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dropoffs.map((point) => (
            <div key={point.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{point.name}</h3>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                    {point.hours}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">📍 {point.building}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{point.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">เบอร์โทรศัพท์สายตรง:</span>
                  <a
                    href={`tel:${point.phone}`}
                    className="font-bold text-emerald-700 hover:text-emerald-800 text-sm"
                  >
                    📞 {point.phone}
                  </a>
                </div>
                <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  จุดประสานงานทางการ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
