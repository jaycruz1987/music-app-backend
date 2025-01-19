const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController');

const router = express.Router();

// 定义用户相关的路由
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);

module.exports = router;  // ✅ 只导出 `router`
