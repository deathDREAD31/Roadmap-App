const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authenticateToken = require('../middleware/auth');

router.get('/:roadmapId',authenticateToken, async (req, res) => {
  const { roadmapId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.id, c.content, c.parent_comment_id, c.roadmap_id, u.email as author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.roadmap_id = ?
       ORDER BY c.created_at ASC`,
      [roadmapId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: 'Failed to load comments' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { roadmapId, content, parentCommentId = null } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      `INSERT INTO comments (roadmap_id, user_id, parent_comment_id, content)
       VALUES (?, ?, ?, ?)`,
      [roadmapId, userId, parentCommentId, content]
    );

    res.json({ message: 'Comment posted successfully' });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;
