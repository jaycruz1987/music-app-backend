const jwt = require('jsonwebtoken');

// JWT 认证中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token." });
        req.user = user; // 将用户数据存入 `req.user`
        next(); // 继续执行后续路由
    });
};

module.exports = authenticateToken;
