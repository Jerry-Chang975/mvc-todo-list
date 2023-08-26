const express = require('express');
const router = express.Router();

const todos = require('./todos');
const users = require('./users');

router.use(users);
router.use('/todos', todos);

router.get('/', (req, res) => res.render('index'));

module.exports = router;
