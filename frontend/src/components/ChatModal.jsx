import React, { useState, useEffect } from 'react';
import { getRoomMessages, sendRoomMessage, resolveItem } from '../services/api';

export default function ChatModal({ chatData, onClose, onItemResolved, myClientId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const { item, roomId, isOwnerOfPost } = chatData;

  useEffect(() => {
    if (!roomId) return;
    loadMessages();

    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  const loadMessages = async () => {
    try {
      const res = await getRoomMessages(roomId);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setSending(true);

      const senderDisplayName = isOwnerOfPost ? 'เจ้าของโพสต์' : 'ผู้ติดต่อ';

      const newMsg = {
        itemId: item.id,
        sender_name: senderDisplayName,
        sender_client_id: myClientId,
        message: inputText.trim()
      };

      await sendRoomMessage(roomId, newMsg);
      setInputText('');
      await loadMessages();
    } catch (err) {
      alert('ไม่สามารถส่งข้อความได้');
    } finally {
      setSending(false);
    }
  };

  const handleP2PResolve = async () => {
    if (!window.confirm('คุณยืนยันว่าได้ส่งมอบหรือได้รับสิ่งของชิ้นนี้คืนเรียบร้อยแล้วใช่หรือไม่?')) return;
    try {
      await resolveItem(item.id, {
        resolved_by: `นัดส่งมอบตรงเรียบร้อยผ่านแชทห้อง ${roomId}`
      });
      alert('ปิดเคสสำเร็จ! ปรับสถานะเป็น "ส่งคืนแล้ว" เรียบร้อย');
      if (onItemResolved) onItemResolved();
      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการปิดเคส');
    }
  };

  if (!chatData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* ใช้ h-[92vh] sm:h-[600px] ปรับให้เข้ากับความสูงของหน้าจอมือถืออัตโนมัติ */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full flex flex-col h-[92vh] sm:h-[600px] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base truncate">{item.name}</span>
              {isOwnerOfPost && (
                <span className="bg-amber-400 text-slate-900 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                  โพสต์ของฉัน
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              {isOwnerOfPost
                ? 'คุยส่วนตัว 1 ต่อ 1 กับผู้ติดต่อ'
                : 'คุยส่วนตัว 1 ต่อ 1 กับเจ้าของโพสต์'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isOwnerOfPost && item.status !== 'returned' && (
              <button
                onClick={handleP2PResolve}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg transition"
                title="คลิกเมื่อนัดรับคืนของเรียบร้อย"
              >
                🤝 ปิดเคส
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-base sm:text-lg w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] px-3 sm:px-4 py-1.5 flex items-center gap-1.5">
          <span>🔒</span>
          <span className="truncate">ห้องแชทส่วนตัว 1 ต่อ 1 ปลอดภัยสูงสุด</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50">
          {loading ? (
            <div className="text-center text-slate-400 text-xs py-10">กำลังโหลดบทสนทนา...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 text-xs py-10">
              เริ่มต้นบทสนทนาเพื่อนัดแนะและตรวจสอบหลักฐานได้เลย
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_faculty === myClientId;

              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {isMe ? 'ฉัน (ผู้ส่ง)' : m.sender_name}
                  </span>
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}>
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestions (เลื่อนแนวนอนบนมือถือได้) */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            type="button"
            onClick={() => setInputText('👋 สวัสดีครับ คิดว่านี่เป็นของผมครับ')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 shrink-0"
          >
            👋 คิดว่านี่เป็นของผมครับ
          </button>
          <button
            type="button"
            onClick={() => setInputText('📍 สะดวกนัดรับที่โรงอาหารกลางช่วงเที่ยงไหมครับ?')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 shrink-0"
          >
            📍 นัดรับที่โรงอาหารกลาง
          </button>
          <button
            type="button"
            onClick={() => setInputText('🏢 นำไปฝากไว้ที่ป้อม รปภ. เรียบร้อยแล้วครับ')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700 shrink-0"
          >
            🏢 ฝากไว้ที่ป้อม รปภ. แล้ว
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-2 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์ข้อความเพื่อนัดหมาย..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition shrink-0"
          >
            {sending ? '...' : 'ส่ง'}
          </button>
        </form>

      </div>
    </div>
  );
}