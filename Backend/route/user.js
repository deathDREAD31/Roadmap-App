const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user-service');

const router = express.Router();


// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userService.createUser(email, hashedPassword);

    return res.status(201).json({ message: 'User signed up successfully. Now Login.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ username: user.email }, 'jwt_secret', { expiresIn: '2h' });
    res.json({ token });
});

module.exports = router;