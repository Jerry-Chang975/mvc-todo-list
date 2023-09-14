const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/users', (req, res, next) => {
  const { name, email, password, passwordCheck } = req.body;
  if (!email || !password || !name) {
    req.flash('error', 'All fields are required!');
    return res.redirect('back');
  }
  if (password !== passwordCheck) {
    req.flash('error', 'password do not match!');
    return res.redirect('back');
  }
  return User.count({ where: { email } }).then((count) => {
    if (count > 0) {
      req.flash('error', 'email already exists!');
      return res.redirect('back');
    }
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ email, name, password: hash });
      req.flash('success', 'Registered successfully!');
      return res.redirect('back');
    });
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: 'todos',
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect('/');
  }
);

// facebook login
router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/oauth2/redirect/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/todos',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    return res.redirect('/login');
  });
});

module.exports = router;
