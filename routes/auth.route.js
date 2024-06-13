const router = require('express').Router();
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { registerValidator } = require('../utils/validators');

// Render login page
router.get(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  (req, res) => {
    res.render('login');
  }
);

// Handle login
router.post(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

// Render register page
router.get(
  '/register',
  ensureLoggedOut({ redirectTo: '/' }),
  (req, res) => {
    res.render('register');
  }
);

// Handle registration
router.post(
  '/register',
  ensureLoggedOut({ redirectTo: '/' }),
  registerValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        return res.render('register', {
          email: req.body.email,
          messages: req.flash(),
        });
      }

      const { email } = req.body;
      const doesExist = await User.findOne({ where: { email } });
      if (doesExist) {
        req.flash('warning', 'Email already exists');
        return res.redirect('/auth/register');
      }

      const user = new User(req.body);
      await user.save();
      req.flash('success', `${user.email} registered successfully, you can now login`);
      return res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  }
);

// Handle logout
router.get(
  '/logout',
  ensureLoggedIn({ redirectTo: '/' }),
  (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  }
);

module.exports = router;
