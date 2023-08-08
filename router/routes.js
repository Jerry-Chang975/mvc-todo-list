const express = require('express');
const router = express.Router();

const db = require('../models');
const todo = db.todo;

router.get('/', (req, res) => {
  return todo
    .findAll({
      attributes: ['id', 'name'],
      raw: true,
    })
    .then((todos) => {
      res.render('todos', { todos });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/:id', (req, res) => {
  res.send(`todos: ${req.params.id}`);
});

router.post('/', (req, res) => {
  const name = req.body.name;
  return todo
    .create({ name })
    .then(() => {
      res.redirect('/todos');
    })
    .catch((err) => console.log(err));
});

router.get('/:id/edit', (req, res) => {
  res.send('edit page');
});

router.put('/:id', (req, res) => {
  res.send(`update todos: ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`delete todos: ${req.params.id}`);
});

module.exports = router;
