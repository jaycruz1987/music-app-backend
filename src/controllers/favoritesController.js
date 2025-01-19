const db = require('../models/db');
const jwt = require('jsonwebtoken');

// ✅ 添加歌曲到收藏
exports.addFavoriteSong = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ 从 JWT 解析用户 ID
        const { song_id } = req.body;

        if (!song_id) {
            return res.status(400).json({ message: "Song ID is required." });
        }

        // 检查歌曲是否已在收藏夹中
        const [existingFavorite] = await db.query(
            'SELECT * FROM Favorites WHERE user_id = ? AND song_id = ?',
            [userId, song_id]
        );

        if (existingFavorite.length > 0) {
            return res.status(400).json({ message: "Song is already in favorites." });
        }

        // 添加歌曲到收藏
        await db.query(
            'INSERT INTO Favorites (user_id, song_id) VALUES (?, ?)',
            [userId, song_id]
        );

        res.status(201).json({ message: "Song added to favorites successfully." });

    } catch (err) {
        console.error("❌ Error adding song to favorites:", err);
        res.status(500).json({ message: "Error adding song to favorites.", error: err.message });
    }
};

// ✅ 获取用户的收藏歌曲
exports.getFavoriteSongs = async (req, res) => {
    try {
        const userId = req.user.id;

        const [songs] = await db.query(
            `SELECT s.id, s.title, s.artist, s.album 
             FROM Favorites f
             JOIN Songs s ON f.song_id = s.id
             WHERE f.user_id = ?`,
            [userId]
        );

        res.json(songs);

    } catch (err) {
        console.error("❌ Error fetching favorite songs:", err);
        res.status(500).json({ message: "Error fetching favorite songs.", error: err.message });
    }
};

// ✅ 从收藏夹中移除歌曲
exports.removeFavoriteSong = async (req, res) => {
    try {
        const userId = req.user.id;
        const { song_id } = req.params;

        if (!song_id) {
            return res.status(400).json({ message: "Song ID is required." });
        }

        // 删除收藏的歌曲
        await db.query(
            'DELETE FROM Favorites WHERE user_id = ? AND song_id = ?',
            [userId, song_id]
        );

        res.json({ message: "Song removed from favorites successfully." });

    } catch (err) {
        console.error("❌ Error removing song from favorites:", err);
        res.status(500).json({ message: "Error removing song from favorites.", error: err.message });
    }
};
