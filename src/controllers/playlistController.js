const db = require('../models/db');

// 🎵 ✅ 创建新歌单
exports.createPlaylist = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // 获取 JWT 解析的用户 ID

    try {
        const [result] = await db.query('INSERT INTO Playlists (name, user_id) VALUES (?, ?)', [name, userId]);
        res.status(201).json({ message: 'Playlist created successfully.', playlistId: result.insertId });
    } catch (err) {
        console.error("❌ Error creating playlist:", err);
        res.status(500).json({ message: "Error creating playlist.", error: err.message });
    }
};

// 🎵 ✅ 获取当前用户的所有歌单
exports.getUserPlaylists = async (req, res) => {
    const userId = req.user.id;

    try {
        const [playlists] = await db.query('SELECT * FROM Playlists WHERE user_id = ?', [userId]);
        res.json(playlists);
    } catch (err) {
        console.error("❌ Error fetching playlists:", err);
        res.status(500).json({ message: "Error fetching playlists.", error: err.message });
    }
};

// 🎵 ✅ 添加歌曲到歌单
exports.addSongToPlaylist = async (req, res) => {
    const playlistId = req.params.id; // 从 URL 取 `playlist_id`
    const { song_id } = req.body; // 从请求体取 `song_id`

    try {
        await db.query('INSERT INTO PlaylistSongs (playlist_id, song_id) VALUES (?, ?)', [playlistId, song_id]);
        res.json({ message: 'Song added to playlist successfully.' });
    } catch (err) {
        console.error("❌ Error adding song to playlist:", err);
        res.status(500).json({ message: "Error adding song to playlist.", error: err.message });
    }
};

// 🎵 ✅ 获取某个歌单的所有歌曲
exports.getPlaylistSongs = async (req, res) => {
    const playlistId = req.params.id;

    try {
        const [songs] = await db.query(`
            SELECT Songs.* FROM Songs
            JOIN PlaylistSongs ON Songs.id = PlaylistSongs.song_id
            WHERE PlaylistSongs.playlist_id = ?`, [playlistId]);

        res.json(songs);
    } catch (err) {
        console.error("❌ Error fetching playlist songs:", err);
        res.status(500).json({ message: "Error fetching playlist songs.", error: err.message });
    }
};

// 🎵 ✅ 从歌单中删除某首歌曲
exports.removeSongFromPlaylist = async (req, res) => {
    const playlistId = req.params.id;
    const songId = req.params.songId;

    try {
        const [result] = await db.query('DELETE FROM PlaylistSongs WHERE playlist_id = ? AND song_id = ?', [playlistId, songId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Song not found in this playlist." });
        }

        res.json({ message: 'Song removed from playlist successfully.' });
    } catch (err) {
        console.error("❌ Error removing song from playlist:", err);
        res.status(500).json({ message: "Error removing song from playlist.", error: err.message });
    }
};

// 🎵 ✅ 删除整个歌单
exports.deletePlaylist = async (req, res) => {
    const playlistId = req.params.id;

    try {
        // 先删除歌单中的所有歌曲
        await db.query('DELETE FROM PlaylistSongs WHERE playlist_id = ?', [playlistId]);

        // 再删除歌单
        const [result] = await db.query('DELETE FROM Playlists WHERE id = ?', [playlistId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        res.json({ message: 'Playlist deleted successfully.' });
    } catch (err) {
        console.error("❌ Error deleting playlist:", err);
        res.status(500).json({ message: "Error deleting playlist.", error: err.message });
    }
};
