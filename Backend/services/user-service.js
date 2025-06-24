const db = require('../db'); // Adjust the path to your DB connection

async function findUser(email, password) {
    const query = 'SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1';
    const [rows] = await db.execute(query, [email, password]);
    return rows.length > 0 ? rows[0] : null;
}

async function findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await db.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
}

async function createUser(email, password) {
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const [result] = await db.execute(query, [email, password]);
    return { id: result.insertId, email };
}

module.exports = {
    findUser,
    findByEmail,
    createUser
};