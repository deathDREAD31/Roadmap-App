const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/auth');

const {
  getRoadmapList,
  getRoadmapById,
  upvoteRoadmap,
  hasUpvoted,
} = require("../services/roadmap-service");
const { findByEmail } = require("../services/user-service");

const jwt = require("jsonwebtoken");
const e = require("express");

router.get('/roadmaps', authenticateToken, async (req, res) => {
  try {
    const roadmaps = await getRoadmapList();

    const enrichedRoadmaps = await Promise.all(
      roadmaps.map(async (r) => {
        const upvoted = await hasUpvoted(req.user.id, r.id);
        return { ...r, hasUpvoted: upvoted };
      })
    );

    res.json(enrichedRoadmaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roadmap list' });
  }
});

router.get('/roadmaps/:id', authenticateToken, async (req, res) => {
  try {
    const roadmap = await getRoadmapById(req.params.id);
    if (!roadmap) return res.status(404).json({ error: 'Not found' });

    const upvoted = await hasUpvoted(req.user.id, roadmap.id);
    res.json({ ...roadmap, hasUpvoted: upvoted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

router.post("/roadmaps/upvote", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { roadMapId } = req.body;

  let userEmail;
  try {
    const decoded = jwt.verify(authHeader, "jwt_secret");
    userEmail = decoded.username;
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  const foundUser = await findByEmail(userEmail);
  if (!foundUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const alreadyUpvoted = await hasUpvoted(foundUser.id, roadMapId);
  if (alreadyUpvoted) {
    return res
      .status(400)
      .json({ error: "You have already upvoted this roadmap" });
  }

  const result = await upvoteRoadmap(foundUser.id, roadMapId);
  if (!result) {
    return res.status(500).json({ error: "Failed to upvote roadmap" });
  }
  res.json({ message: "Roadmap upvoted successfully" });
});

module.exports = router;
