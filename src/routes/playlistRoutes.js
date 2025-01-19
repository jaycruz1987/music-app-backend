const express = require('express');
const { 
    createPlaylist, 
    getUserPlaylists, 
    addSongToPlaylist, 
    getPlaylistSongs,
    removeSongFromPlaylist, 
    deletePlaylist 
} = require('../controllers/playlistController');

const authMiddleware = require('../middleware/auth'); // 🛡️ 保护 API

const router = express.Router();

// 🎵 ✅ 创建新歌单
router.post('/', authMiddleware, createPlaylist);

// 🎵 ✅ 获取当前用户的所有歌单
router.get('/', authMiddleware, getUserPlaylists);

// 🎵 ✅ 添加歌曲到指定歌单（更 RESTful）
router.post('/:id/songs', authMiddleware, addSongToPlaylist);

// 🎵 ✅ 获取指定歌单中的所有歌曲
router.get('/:id/songs', authMiddleware, getPlaylistSongs);

// 🎵 ✅ 从指定歌单中删除某首歌曲
router.delete('/:id/songs/:songId', authMiddleware, removeSongFromPlaylist);

// 🎵 ✅ 删除整个歌单
router.delete('/:id', authMiddleware, deletePlaylist);

module.exports = router;
