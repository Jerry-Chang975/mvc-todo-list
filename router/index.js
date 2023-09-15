const express = require('express');
const router = express.Router();
const passport = require('passport');

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const todos = require('./todos');
const users = require('./users');

const authHandler = require('../middleware/auth-handler');

require('../config/passport');

router.use(users);
router.use('/todos', authHandler, todos);

router.get('/', (req, res) => res.render('index'));

module.exports = router;
