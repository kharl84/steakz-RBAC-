// const express = require('express');
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
// const router = express.Router();
// const passport = require('passport'); // Ensure this is required properly
// const User = require('../models/user.model'); // Adjust path as necessary

// // Route to get user profile, protected by JWT authentication
// router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
//   try {
//     // Access user object from req.user, which is set by Passport
//     res.json(req.user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// module.exports = router;
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;