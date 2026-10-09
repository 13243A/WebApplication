import React, { useState, useEffect } from 'react';
import { getChatMessages, sendChatMessage, resolveItem } from '../services/api';

// รหัสระบุตัวตนประจำเบราว์เซอร์
const getClientId = () => {
  let id = localStorage.getItem('unifind_chat_client_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('unifind_chat_client_id', id);
  }
  return id;
};

export default function ChatModal({ item, onClose, onItemResolved }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const myClientId = getClientId();

  // ตรวจสอบจาก localStorage ของเครื่องนี้ ว่าใช่คนสร้างโพสต์นี้จริงหรือไม่
  const myCreatedPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');
  const isReallyOwner = myCreatedPostIds.includes(item.id);

  useEffect(() => {
    if (!item) return;
    loadMessages();

    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [item]);

  const loadMessages = async () => {
    try {
      const res = await getChatMessages(item.id);
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

      // ถ้าเป็นเครื่องที่สร้างโพสต์จริง ให้ใช้ชื่อเจ้าของ ถ้าไม่ใช่ ให้เป็น "ผู้สนใจติดต่อ"
      const senderDisplayName = isReallyOwner
        ? `${item.reporter_name} (เจ้าของโพสต์)`
        : 'ผู้สนใจติดต่อ';

      const newMsg = {
        sender_name: senderDisplayName,
        sender_faculty: myClientId, // ใช้ client id แยกฝั่งซ้าย-ขวา
        message: inputText.trim()
      };

      await sendChatMessage(item.id, newMsg);
      setInputText('');
      await loadMessages();
    } catch (err) {
      alert('ไม่สามารถส่งข้อความได้');
    } finally {
      setSending(false);
    }
  };

  const handleQuickSend = (text) => {
    setInputText(text);
  };

  const handleP2PResolve = async () => {
    if (!window.confirm('คุณยืนยันว่าได้ส่งมอบหรือได้รับสิ่งของชิ้นนี้คืนเรียบร้อยแล้วใช่หรือไม่?')) return;
    try {
      await resolveItem(item.id, {
        resolved_by: `นัดส่งมอบตรงเรียบร้อยผ่านแชท (REF-${Math.floor(1000 + Math.random() * 9000)})`
      });
      alert('ปิดเคสสำเร็จ! ระบบได้ปรับสถานะเป็น "ส่งคืนแล้ว" เรียบร้อย');
      if (onItemResolved) onItemResolved();
      onClose();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการปิดเคส');
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col h-[600px] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">{item.name}</span>
              {isReallyOwner && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  โพสต์ของฉัน
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isReallyOwner
                ? 'กล่องข้อความพูดคุยกับผู้ที่ติดต่อเข้ามา'
                : `คุยแชทส่วนตัวกับผู้แจ้ง: ${item.reporter_name} (${item.reporter_faculty || 'ผู้แจ้ง'})`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isReallyOwner && item.status !== 'returned' && (
              <button
                onClick={handleP2PResolve}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                title="คลิกเมื่อนัดรับคืนของเรียบร้อย"
              >
                🤝 คืนของแล้ว (ปิดเคส)
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-[11px] px-4 py-1.5 flex items-center gap-1.5">
          <span>🔒</span>
          <span>สนทนาส่วนตัว ปลอดภัย ไม่มีการเปิดเผยเบอร์โทรศัพท์สู่สาธารณะ</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {loading ? (
            <div className="text-center text-slate-400 text-xs py-10">กำลังโหลดบทสนทนา...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 text-xs py-10">
              ยังไม่มีข้อความ เริ่มต้นทักทายเพื่อนัดแนะสถานที่ส่งมอบของกันได้เลย
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_faculty === myClientId;

              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {isMe ? 'ฉัน (ผู้ส่ง)' : m.sender_name}
                  </span>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
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

        {/* Quick Suggestions */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleQuickSend('👋 สวัสดีครับ คิดว่านี่เป็นของผมครับ')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700"
          >
            👋 คิดว่านี่เป็นของผมครับ
          </button>
          <button
            onClick={() => handleQuickSend('📍 สะดวกนัดรับที่โรงอาหารกลางช่วงเที่ยงไหมครับ?')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700"
          >
            📍 นัดรับที่โรงอาหารกลาง
          </button>
          <button
            onClick={() => handleQuickSend('🏢 นำไปฝากไว้ที่ป้อม รปภ. เรียบร้อยแล้วครับ')}
            className="bg-white border border-slate-300 hover:border-emerald-500 rounded-full px-2.5 py-1 whitespace-nowrap text-slate-700"
          >
            🏢 ฝากไว้ที่ป้อม รปภ. แล้ว
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์ข้อความเพื่อนัดหมายส่งมอบของ..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            {sending ? '...' : 'ส่ง'}
          </button>
        </form>

      </div>
    </div>
  );
}