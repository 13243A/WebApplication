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
import { getInboxThreads } from './services/api';

const getClientId = () => {
  let id = localStorage.getItem('unifind_chat_client_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('unifind_chat_client_id', id);
  }
  return id;
};

export default function App() {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxFilterItem, setInboxFilterItem] = useState(null);
  const [activeChatData, setActiveChatData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMap, setUnreadMap] = useState({}); // เก็บจำนวนข้อความยังไม่อ่านแยกตาม itemId

  const myClientId = getClientId();

  // ตรวจสอบข้อความใหม่ในพื้นหลังทุกๆ 2 วินาที
  useEffect(() => {
    const checkUnreadMessages = async () => {
      try {
        const myPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');
        const res = await getInboxThreads(myClientId, myPostIds);
        if (res.success && res.data) {
          let count = 0;
          const newUnreadMap = {};

          res.data.forEach((thread) => {
            const isFromOther = thread.lastSenderClientId !== myClientId;
            const lastReadId = parseInt(localStorage.getItem(`unifind_read_${thread.roomId}`) || '0', 10);

            if (isFromOther && thread.lastMessageId > lastReadId) {
              count++;
              const itId = Number(thread.itemId);
              newUnreadMap[itId] = (newUnreadMap[itId] || 0) + 1;
            }
          });

          setUnreadCount(count);
          setUnreadMap(newUnreadMap);
        }
      } catch (err) {
        // ignore
      }
    };

    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 2000);
    return () => clearInterval(interval);
  }, [myClientId]);

  // 1. กดไอคอน 💬 ที่ Navbar มุมขวาบน (เปิดดูรวมทุกโพสต์)
  const handleOpenGlobalInbox = () => {
    setInboxFilterItem(null);
    setIsInboxOpen(true);
  };

  // 2. กดปุ่มแชทตรงการ์ดสิ่งของ
  const handleOpenChatDirect = (item) => {
    const myPostIds = JSON.parse(localStorage.getItem('unifind_my_posts') || '[]');
    const isOwner = myPostIds.includes(item.id);

    if (isOwner) {
      // เจ้าของโพสต์: เปิดกล่องข้อความที่กรองเฉพาะโพสต์นี้
      setInboxFilterItem(item);
      setIsInboxOpen(true);
    } else {
      // คนอื่นทัก: เปิดห้องแชทเดี่ยว 1 ต่อ 1 กับเจ้าของโพสต์
      const roomId = `room_${item.id}_${myClientId}`;
      setActiveChatData({
        item,
        roomId,
        isOwnerOfPost: false
      });
    }
  };

  // เลือกห้องคุยจากกล่อง Inbox
  const handleSelectThreadFromInbox = (thread) => {
    setIsInboxOpen(false);
    localStorage.setItem(`unifind_read_${thread.roomId}`, thread.lastMessageId.toString());
    
    // เคลียร์ยอดแจ้งเตือนแบบเรียลไทม์
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setUnreadMap((prev) => {
      const next = { ...prev };
      const itId = Number(thread.itemId);
      if (next[itId] > 1) {
        next[itId] -= 1;
      } else {
        delete next[itId];
      }
      return next;
    });

    setActiveChatData({
      item: {
        id: thread.itemId,
        name: thread.itemName,
        reporter_name: thread.reporterName,
        status: thread.itemStatus
      },
      roomId: thread.roomId,
      isOwnerOfPost: thread.isOwnerOfPost
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        unreadCount={unreadCount}
        onOpenInbox={handleOpenGlobalInbox}
      />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage onOpenChat={handleOpenChatDirect} unreadMap={unreadMap} />} />
          <Route path="/create" element={<CreateItemPage />} />
          <Route path="/items/:id" element={<ItemDetailPage onOpenChat={handleOpenChatDirect} />} />
          <Route path="/dropoffs" element={<DropoffPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* 1. กล่องข้อความรวม */}
      <ChatInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onSelectThread={handleSelectThreadFromInbox}
        myClientId={myClientId}
        filterItem={inboxFilterItem}
      />

      {/* 2. ห้องแชท 1 ต่อ 1 */}
      {activeChatData && (
        <ChatModal
          chatData={activeChatData}
          onClose={() => setActiveChatData(null)}
          myClientId={myClientId}
          onItemResolved={() => setActiveChatData(null)}
        />
      )}
    </div>
  );
}