const express = require('express');
const router = express.Router();
const passport = require('../passport'); // Adjust path as necessary
const User = require('../models/user.model'); // Adjust path as necessary

// Route to get user profile, protected by JWT authentication
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Access user object from req.user, which is set by Passport
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
