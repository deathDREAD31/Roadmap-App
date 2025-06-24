const pool = require('../db');

async function getRoadmapList() {
    const query = 'SELECT * FROM roadmap';
    const [rows] = await pool.query(query);
    return rows;
}
async function getRoadmapById(roadmapId) {
    const query = 'SELECT * FROM roadmap WHERE id = ?';
    const [rows] = await pool.query(query, [roadmapId]);
    return rows[0] || null;
}

async function upvoteRoadmap(userId, roadmapId) {
    const query = 'UPDATE roadmap SET vote = vote + 1 WHERE id = ?';
    const [result] = await pool.query(query, [roadmapId]);
    insertUpvote(userId, roadmapId).catch(err => {
        console.error('Error inserting upvote:', err);
    });
    return result.affectedRows > 0;
}

async function hasUpvoted(userId, roadmapId) {
    const query = 'SELECT 1 FROM upvotes WHERE user_id = ? AND roadmap_id = ? LIMIT 1';
    const [rows] = await pool.query(query, [userId, roadmapId]);
    return rows.length > 0;
}

async function insertUpvote(userId, roadmapId) {
    const query = 'INSERT INTO upvotes (user_id, roadmap_id) VALUES (?, ?)';
    const [result] = await pool.query(query, [userId, roadmapId]);
    return result.affectedRows > 0;
}

module.exports = {
    getRoadmapList,
    upvoteRoadmap,
    hasUpvoted,
    getRoadmapById
};