const express = require('express');
const { getSongs, addSong, deleteSong, updateSong } = require('../controllers/songController');
const authenticateToken = require('../middleware/auth'); // ✅ 引入 JWT 认证中间件

const router = express.Router();

router.get('/', getSongs);
router.post('/', authenticateToken, addSong); // ✅ 需要登录才能添加歌曲
router.put('/:id', authenticateToken, updateSong); // ✅ 需要登录才能更新
router.delete('/:id', authenticateToken, deleteSong); // ✅ 需要登录才能删除


module.exports = router;
