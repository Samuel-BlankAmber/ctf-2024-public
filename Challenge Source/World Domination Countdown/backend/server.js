const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const JWT_KEY = crypto.randomBytes(64).toString('hex');
const CLAY_PW = crypto.randomBytes(64).toString('hex');
const CLAY_FAV_NUMBER = crypto.randomBytes(8).readBigInt64BE(0);

const users = {
    clay: {
        password: CLAY_PW,
        resetPasswordQuestion: "What is your favourite 64-bit number?",
        resetPasswordAnswer: CLAY_FAV_NUMBER.toString(),
    },
};

const FLAG = "FLAG{REDACTED}";

const userToCountdown = {
    clay: {
        year: 2026,
        month: 12,
        day: 25,
        title: "World Domination",
        description: FLAG,
    },
};

function getJwtToken(username) {
    return jwt.sign({ username }, JWT_KEY, { expiresIn: '1h' });
}

app.post('/api/register', (req, res) => {
    const {
        username, password,
        resetPasswordQuestion, resetPasswordAnswer,
        year, month, day, title, description,
    } = req.body;
    if (!username || !password) {
        return res.status(400).json('Username and password are required');
    }
    if (password.length < 8) {
        return res.status(400).json('Password must be at least 8 characters');
    }
    if (!resetPasswordQuestion || !resetPasswordAnswer) {
        return res.status(400).json('Forgot password question and answer are required');
    }
    if (!year || !month || !day || !title || !description) {
        return res.status(400).json('Year, month, day, title, and description are required');
    }
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return res.status(400).json('Year, month, and day must be numbers');
    }
    if (users[username]) {
        return res.status(400).json('User already exists');
    }
    users[username] = {
        password: password,
        resetPasswordQuestion,
        resetPasswordAnswer,
    };
    userToCountdown[username] = {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        title, description
    };
    const token = getJwtToken(username);
    res.json({ token });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json('Username and password are required');
    }
    if (users[username].password !== password) {
        return res.status(401).json('Invalid username or password');
    }
    const token = getJwtToken(username);
    res.json({ token, countdown: userToCountdown[username] });
});

app.get('/api/users', (req, res) => {
    res.json(Object.keys(users));
});

app.get('/api/countdown', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json('Authorization header is required');
    }
    try {
        const { username } = jwt.verify(token, JWT_KEY);
        const countdown = userToCountdown[username];
        if (!countdown) {
            return res.status(404).json('Countdown not found');
        }
        res.json(countdown);
    } catch (error) {
        res.status(401).json('Invalid token');
    }
});

app.get('/api/reset-password-question', (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json('Username is required');
    }
    if (!users[username]) {
        return res.status(404).json('User not found');
    }
    res.json(users[username].resetPasswordQuestion);
});

app.post('/api/reset-password-token', (req, res) => {
    const { username, resetPasswordAnswer } = req.body;
    if (!username) {
        return res.status(400).json('Username is required');
    }
    if (!users[username]) {
        return res.status(404).json('User not found');
    }
    if (!resetPasswordAnswer) {
        return res.status(400).json('Forgot password answer is required');
    }
    if (resetPasswordAnswer !== users[username].resetPasswordAnswer) {
        return res.status(401).json('Invalid forgot password answer');
    }
    const token = jwt.sign({ username }, JWT_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.post('/api/reset-password', (req, res) => {
    const { username, password } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(400).json('Token is required');
    }
    if (!username) {
        return res.status(400).json('Username is required');
    }
    if (!password) {
        return res.status(400).json('Password is required');
    }
    if (password.length < 8) {
        return res.status(400).json('Password must be at least 8 characters');
    }
    if (!users[username]) {
        return res.status(404).json('User not found');
    }
    try {
        jwt.verify(token, JWT_KEY);
        users[username].password = password;
        res.json('Password reset');
    } catch (error) {
        res.status(401).json('Invalid token');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
