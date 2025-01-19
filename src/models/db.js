require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mysql = require('mysql2');

console.log("✅ Database Config:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "**** (Hidden)" : "Not Set");
console.log("DB_NAME:", process.env.DB_NAME);

// ✅ 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'music_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ 连接池测试（仅用于本地调试，生产环境请移除）
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Error:", err);
  } else {
    console.log("✅ Database Connected Successfully!");
    connection.release(); // 释放连接
  }
});

// ✅ 修复问题：正确导出 `pool.promise()`
const promisePool = pool.promise();
module.exports = promisePool;
