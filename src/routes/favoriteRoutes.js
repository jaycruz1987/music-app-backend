const express = require('express');
const { addFavoriteSong, getFavoriteSongs, removeFavoriteSong } = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, addFavoriteSong);  // 添加收藏
router.get('/', authMiddleware, getFavoriteSongs);  // 获取收藏列表
router.delete('/:song_id', authMiddleware, removeFavoriteSong);  // 删除收藏

module.exports = router;
