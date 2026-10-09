import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatInboxModal from './components/ChatInboxModal';
import ChatModal from './components/ChatModal';
import HomePage from './pages/HomePage';
import CreateItemPage from './pages/CreateItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import DropoffPage from './pages/DropoffPage';
import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [activeChatItem, setActiveChatItem] = useState(null);

  // 1. ดึงจำนวนที่ยังไม่ได้อ่านจาก localStorage (ถ้าไม่มี ให้เริ่มที่ 0 เพื่อไม่ให้เด้งกลับมาเลข 2)
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem('unifind_unread_count');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // 2. ระบบเช็คข้อความใหม่ในพื้นหลังอัตโนมัติ (Polling ทุก 4 วินาที)
  useEffect(() => {
    const checkNewMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/chat/3'); 
        const result = await res.json();
        
        if (result.success && result.data) {
          const lastMsgCount = parseInt(localStorage.getItem('unifind_last_msg_count') || '0', 10);
          const currentCount = result.data.length;

          // ถ้ามีข้อความใหม่เพิ่มขึ้น และไม่ได้กำลังเปิดคุยในห้องนั้นอยู่
          if (currentCount > lastMsgCount && !activeChatItem) {
            const diff = currentCount - lastMsgCount;
            setUnreadCount((prev) => {
              const nextCount = prev + diff;
              localStorage.setItem('unifind_unread_count', nextCount);
              return nextCount;
            });
            localStorage.setItem('unifind_last_msg_count', currentCount);
          }
        }
      } catch (err) {
        // เซิร์ฟเวอร์ไม่พร้อม ปล่อยผ่าน
      }
    };

    const interval = setInterval(checkNewMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChatItem]);

  // 3. เมื่อกดเปิดกล่องข้อความ ให้เคลียร์ตัวเลขสีแดงเป็น 0 และบันทึกลง localStorage
  const handleOpenInbox = () => {
    setIsInboxOpen(true);
    setUnreadCount(0);
    localStorage.setItem('unifind_unread_count', '0');
  };

  const handleCloseInbox = () => {
    setIsInboxOpen(false);
  };

  const handleSelectThread = (item) => {
    setIsInboxOpen(false);
    setActiveChatItem(item);
  };

  const handleOpenChatDirect = (item) => {
    setActiveChatItem(item);
  };

  const handleCloseChat = () => {
    setActiveChatItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        unreadCount={unreadCount}
        onOpenInbox={handleOpenInbox}
      />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage onOpenChat={handleOpenChatDirect} />} />
          <Route path="/create" element={<CreateItemPage />} />
          <Route path="/items/:id" element={<ItemDetailPage onOpenChat={handleOpenChatDirect} />} />
          <Route path="/dropoffs" element={<DropoffPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* 1. หน้าต่างรวมกล่องข้อความสนทนา (Chat Inbox Center) */}
      <ChatInboxModal
        isOpen={isInboxOpen}
        onClose={handleCloseInbox}
        onSelectThread={handleSelectThread}
      />

      {/* 2. หน้าต่างห้องคุยแชทส่วนตัว (Private Chat Room) */}
      {activeChatItem && (
        <ChatModal
          item={activeChatItem}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}