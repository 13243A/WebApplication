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
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE'
  });
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

export const getChatMessages = async (itemId) => {
  const res = await fetch(`${API_BASE_URL}/chat/${itemId}`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อความแชทได้');
  return await res.json();
};

export const sendChatMessage = async (itemId, msgData) => {
  const res = await fetch(`${API_BASE_URL}/chat/${itemId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msgData)
  });
  if (!res.ok) throw new Error('ไม่สามารถส่งข้อความได้');
  return await res.json();
};
