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
      res.render('todos', {
        todos,
        message: req.flash('success'),
        error: req.flash('error'),
      });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

router.get('/new', (req, res) => {
  res.render('new', { error: req.flash('error') });
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
  try {
    const { isComplete, name } = req.body;
    return todo
      .create({ name, isComplete: isComplete ? 1 : 0 })
      .then(() => {
        req.flash('success', 'Add new successfully!');
        res.redirect('/todos');
      })
      .catch((err) => {
        req.flash('error', 'Something went wrong!');
        console.log(err);
        res.redirect('back');
      });
  } catch (err) {
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  return todo
    .findByPk(id, { attributes: ['id', 'name', 'isComplete'], raw: true })
    .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { name, isComplete } = req.body;
    return todo
      .update({ name, isComplete: isComplete ? 1 : 0 }, { where: { id } })
      .then((result) => {
        req.flash('success', 'Update successfully!');
        res.redirect(`/todos/${id}`);
      })
      .catch((err) => {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
      });
  } catch (err) {
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    return todo
      .destroy({ where: { id } })
      .then(() => {
        req.flash('success', 'Delete successfully!');
        res.redirect('/todos');
      })
      .catch((err) => {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
      });
  } catch (err) {
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
});

module.exports = router;
