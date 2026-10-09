import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/itemRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import './config/db.js'; // เรียกเพื่อทดสอบการเชื่อมต่อ MySQL

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/items', itemRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'UniFind API Server with MySQL', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`🚀 UniFind Backend API running on http://localhost:${PORT}`);
  console.log(`📦 REST API: http://localhost:${PORT}/api/items`);
});
