const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('./utils/passport.auth'); // Assuming this correctly initializes Passport
const connectPgSimple = require('connect-pg-simple');
const { ensureLoggedIn } = require('connect-ensure-login');
const { Pool } = require('pg');
const { roles } = require('./utils/constants');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(morgan('dev')); // Logging HTTP requests
app.set('view engine', 'ejs'); // Using EJS as the view engine
app.use(express.static('public')); // Serving static files from 'public' directory
app.use(express.json()); // Parsing JSON bodies
app.use(express.urlencoded({ extended: false })); // Parsing URL-encoded bodies

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Session store using connect-pg-simple
const PgSession = connectPgSimple(session);
const pgSession = new PgSession({
  pool,
  tableName: 'sessions', // Specify the table name for storing sessions
});

// Initialize Session middleware
app.use(
  session({
    store: pgSession,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true, // Enable secure cookies in production with HTTPS
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to pass user data to views
app.use((req, res, next) => {
  res.locals.user = req.user; // Make user data available in views
  next();
});

// Connect Flash for flash messages
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.use('/', require('./routes/index.route')); // Main routes
app.use('/auth', require('./routes/auth.route')); // Authentication routes
app.use(
  '/user',
  ensureLoggedIn({ redirectTo: '/auth/login' }), // Ensure user is logged in for '/user' routes
  require('./routes/user.route') // User-specific routes
);
app.use(
  '/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }), // Ensure user is logged in for '/admin' routes
  require('./routes/admin.route') // Admin-specific routes
);

// Error handling middleware - 404 Not Found
app.use((req, res, next) => {
  next(createHttpError(404, 'Not Found'));
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(err.status || 500); // Set response status based on error status or default to 500 (Internal Server Error)
  res.render('error_40x', { error: err }); // Render error page with error object
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

