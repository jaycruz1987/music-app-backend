const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ 获取所有歌曲
exports.getSongs = async (req, res) => {
    try {
        const [songs] = await db.query('SELECT * FROM Songs');
        res.json(songs);
    } catch (err) {
        console.error("❌ Fetching Songs Error:", err);
        res.status(500).json({ message: "Error fetching songs." });

    }
};

// ✅ 添加新歌曲
exports.addSong = async (req, res) => {
    const { title, artist, album } = req.body;
    try {
        await db.query('INSERT INTO Songs (title, artist, album) VALUES (?, ?, ?)', [title, artist, album]);
        res.status(201).json({ message: "Song added successfully." });
    } catch (err) {
        console.error("❌ Add Song Error:", err);
        res.status(500).json({ message: "Error adding song." });
    }
};

// ✅ 删除歌曲
exports.deleteSong = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Songs WHERE id = ?', [id]);
        res.json({ message: "Song deleted successfully." });
    } catch (err) {
        console.error("❌ Delete Song Error:", err);
        res.status(500).json({ message: "Error deleting song." });
    }
};

// ✅ 更新歌曲信息
exports.updateSong = async (req, res) => {
    const { id } = req.params;
    const { title, artist, album } = req.body;

    try {
        await db.query(
            'UPDATE Songs SET title=?, artist=?, album=? WHERE id=?',
            [title, artist, album, id]
        );
        res.json({ message: "Song updated successfully." });

    } catch (err) {
        console.error("❌ Error updating song:", err);
        res.status(500).json({ message: "Error updating song.", error: err.message });
    }
};
