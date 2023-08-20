const express = require('express');
const router = express.Router();

const db = require('../models');
const todo = db.todo;

router.get('/', (req, res, next) => {
  return todo
    .findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true,
    })
    .then((todos) => {
      res.render('todos', {
        todos,
      });
    })
    .catch((err) => {
      err.errorMessage = 'something went wrong!';
      next(err);
    });
});

router.get('/new', (req, res, next) => {
  res.render('new');
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return todo
    .findByPk(id, { raw: true })
    .then((todo) => {
      res.render('detail', { todo });
    })
    .catch((err) => console.log(err));
});

router.post('/', (req, res, next) => {
  const { isComplete, name } = req.body;
  return todo
    .create({ name, isComplete: isComplete ? 1 : 0 })
    .then(() => {
      req.flash('success', 'Add new successfully!');
      res.redirect('/todos');
    })
    .catch((err) => {
      err.errorMessage = '新增失敗!';
      next(err);
    });
});

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  return todo
    .findByPk(id, { attributes: ['id', 'name', 'isComplete'], raw: true })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, isComplete } = req.body;
  return todo
    .update({ name, isComplete: isComplete ? 1 : 0 }, { where: { id } })
    .then((result) => {
      req.flash('success', 'Update successfully!');
      res.redirect(`/todos/${id}`);
    })
    .catch((err) => {
      err.errorMessage = 'something went wrong!';
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  return todo
    .destroy({ where: { id } })
    .then(() => {
      req.flash('success', 'Delete successfully!');
      res.redirect('/todos');
    })
    .catch((err) => {
      err.errorMessage = 'something went wrong!';
      next(err);
    });
});

module.exports = router;
