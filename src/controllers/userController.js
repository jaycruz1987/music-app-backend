
const db = require('../models/db'); // 确保数据库连接正确
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 用户注册
exports.registerUser = async (req, res) => {
    const { name, email, password, membership_level } = req.body;

    try {
        // 检查用户是否已存在
        const [existingUser] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query(
            'INSERT INTO Users (name, email, password_hash, membership_level) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, membership_level || 'Silver']
        );

        res.status(201).json({ message: 'User registered successfully.' });

    } catch (err) {
        console.error('❌ Registration Error:', err);
        res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
};

// 用户登录
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user[0].id, email: user[0].email, membership_level: user[0].membership_level },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error('❌ Login Error:', err);
        res.status(500).json({ message: 'Login failed.', error: err.message });
    }
};

// 获取所有用户（仅管理员）
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, name, email, membership_level FROM Users');
        res.json(users);
    } catch (err) {
        console.error('❌ Fetching Users Error:', err);
        res.status(500).json({ message: 'Error fetching users.' });
    }
};


exports.test = (req, res) => {
    res.json({ message: "User Controller is working!" });
};
