require('dotenv').config();
console.log("✅ Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "**** (Hidden)" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "**** (Hidden)" : "Not Set");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const db = require('./models/db');

const userRoutes = require('./routes/userRoutes');  // ✅ 确保路径正确
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes'); // ✅ 引入歌单路由
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ **改进 CORS 处理**
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ **确保解析 JSON**
app.use(bodyParser.json());

// ✅ **注册 API 路由**
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes); // ✅ 注册路由
app.use('/api/favorites', favoriteRoutes);

// ✅ **健康检查路由**
app.get('/', (req, res) => {
  res.send('✅ Music App Backend is running!');
});

// ✅ **处理未找到的路由**
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// ✅ **通用错误处理**
app.use((err, req, res, next) => {
  console.error("❌ Unexpected Error:", err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ✅ **启动服务器**
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT} (accessible from external)`);
});

app.post('/webhook', express.json(), (req, res) => {
    console.log("✅ Received GitHub Webhook:", req.body);
    res.status(200).json({ message: "Webhook received successfully!" });

    // 这里可以添加自动拉取代码、重启服务的逻辑
});
