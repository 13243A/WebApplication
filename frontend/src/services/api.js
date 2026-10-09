const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getItems = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/items?${query}`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดรายการสิ่งของได้');
  return await res.json();
};

export const getItemById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/items/${id}`);
  if (!res.ok) throw new Error('ไม่พบข้อมูลรายการที่ระบุ');
  return await res.json();
};

export const createItem = async (itemData) => {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'ไม่สามารถบันทึกข้อมูลได้');
  }
  return await res.json();
};

// ฟังก์ชันส่งข้อมูลแก้ไขโพสต์
export const updateItem = async (id, itemData) => {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'ไม่สามารถแก้ไขข้อมูลได้');
  }
  return await res.json();
};

export const resolveItem = async (id, payload = {}) => {
  const res = await fetch(`${API_BASE_URL}/items/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('ไม่สามารถอัปเดตสถานะการปิดเคสได้');
  return await res.json();
};

export const deleteItem = async (id) => {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('ไม่สามารถลบรายการได้');
  return await res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_BASE_URL}/items/stats`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลสถิติได้');
  return await res.json();
};

export const getDropoffs = async () => {
  const res = await fetch(`${API_BASE_URL}/items/dropoffs`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลจุดรับฝากได้');
  return await res.json();
};

export const getRoomMessages = async (roomId) => {
  const res = await fetch(`${API_BASE_URL}/chat/room/${roomId}`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อความในห้องนี้ได้');
  return await res.json();
};

export const sendRoomMessage = async (roomId, msgData) => {
  const res = await fetch(`${API_BASE_URL}/chat/room/${roomId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msgData)
  });
  if (!res.ok) throw new Error('ไม่สามารถส่งข้อความได้');
  return await res.json();
};

export const getInboxThreads = async (clientId, myPostIds) => {
  const res = await fetch(`${API_BASE_URL}/chat/inbox-threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, myPostIds })
  });
  if (!res.ok) throw new Error('ไม่สามารถโหลดกล่องข้อความได้');
  return await res.json();
};