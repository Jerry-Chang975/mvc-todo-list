const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models');
const User = db.User;

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/users', (req, res, next) => {});

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

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    return res.redirect('/login');
  });
});

module.exports = router;
