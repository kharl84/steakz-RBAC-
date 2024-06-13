// const router = require('express').Router();

// router.get('/profile', async (req, res, next) => {
//   // console.log(req.user);
//   const person = req.user;
//   res.render('profile', { person });
// });

// module.exports = router;

// routes/user.route.js

const express = require('express');
const router = express.Router();
const pool = require('../utils/db'); // Import PostgreSQL pool
const { roles } = require('../utils/constants'); // Assuming you have roles defined

// GET profile route
router.get('/profile', async (req, res, next) => {
  try {
    const client = await pool.connect();
    const { id } = req.user; // Assuming req.user contains the authenticated user's details

    // Fetch user data from PostgreSQL based on user id
    const query = 'SELECT id, username, email, role FROM users WHERE id = $1';
    const result = await client.query(query, [id]);
    const person = result.rows[0];

    if (!person) {
      req.flash('error', 'User not found');
      return res.redirect('/'); // Redirect to homepage or handle as needed
    }

    res.render('profile', { person });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
});

module.exports = router;
