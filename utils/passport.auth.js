// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user.model');

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//     },
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email });

//         if (!user) {
//           return done(null, false, { message: 'Username/email not registered' });
//         }

//         const isMatch = await user.isValidPassword(password);
        
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: 'Incorrect password' });
//         }
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// module.exports = passport;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect email or password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
