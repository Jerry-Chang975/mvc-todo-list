const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.User;

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/users', (req, res, next) => {
  
});

router.post('/login', (req, res, next) => {});

router.post('/logout', (req, res, next) => {});

module.exports = router;
