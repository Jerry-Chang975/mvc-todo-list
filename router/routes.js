const express = require('express');
const router = express.Router();

const db = require('../models');
const todo = db.todo;

router.get('/', (req, res) => {
  return todo
    .findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true,
    })
    .then((todos) => {
      res.render('todos', { todos, message: req.flash('success') });
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
      res.render('detail', { todo, message: req.flash('success') });
    })
    .catch((err) => console.log(err));
});

router.post('/', (req, res) => {
  const { isComplete, name } = req.body;
  return todo
    .create({ name, isComplete: isComplete ? 1 : 0 })
    .then(() => {
      req.flash('success', 'Add new successfully!');
      res.redirect('/todos');
    })
    .catch((err) => console.log(err));
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  return todo
    .findByPk(id, { attributes: ['id', 'name', 'isComplete'], raw: true })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, isComplete } = req.body;
  return todo
    .update({ name, isComplete: isComplete ? 1 : 0 }, { where: { id } })
    .then((result) => {
      req.flash('success', 'Update successfully!');
      res.redirect(`/todos/${id}`);
    })
    .catch((err) => console.log(err));
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  return todo
    .destroy({ where: { id } })
    .then(() => {
      req.flash('success', 'Delete successfully!');
      res.redirect('/todos');
    })
    .catch((err) => console.log(err));
});

module.exports = router;
