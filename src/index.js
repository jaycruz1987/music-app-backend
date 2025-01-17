require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const userRoutes = require('./routes/userRoutes');  // ✅ 重要：添加用户路由

const app = express();
const PORT = process.env.PORT || 3000;

// **✅ 关键代码：注册 API 路由**
app.use('/api/users', userRoutes);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ Music App Backend is running!');
});


app.listen(PORT, '0.0.0.0', () => {
-  console.log(`✅ Server is running on http://127.0.0.1:${PORT}`);
+  console.log(`✅ Server is running on http://0.0.0.0:${PORT} (accessible from external)`);
});
