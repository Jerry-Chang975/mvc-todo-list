const express = require('express');
const router = express.Router();
const passport = require('passport');

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const todos = require('./todos');
const users = require('./users');

const authHandler = require('../middleware/auth-handler');

const LocalStrategy = require('passport-local');

const db = require('../models');
const User = db.User;

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    return User.findOne({
      attributes: ['id', 'email', 'password'],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user || user.password !== password) {
          return done(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        return done(null, user);
      })
      .catch((error) => {
        error.errorMessage = 'login failed';
        done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

router.use(users);
router.use('/todos', authHandler, todos);

router.get('/', (req, res) => res.render('index'));

module.exports = router;
