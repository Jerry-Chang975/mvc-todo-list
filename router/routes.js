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
  const id = req.params.id;
  return todo
    .findByPk(id, { raw: true })
    .then((todo) => {
      res.render('detail', { todo });
    })
    .catch((err) => console.log(err));
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
  const id = req.params.id;
  return todo
    .findByPk(id, { attributes: ['id', 'name'], raw: true })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  return todo
    .update({ name }, { where: { id } })
    .then((result) => {
      res.redirect(`/todos/${id}`);
    })
    .catch((err) => console.log(err));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  return todo
    .destroy({ where: { id } })
    .then(() => {
      res.redirect('/todos');
    })
    .catch((err) => console.log(err));
});

module.exports = router;
