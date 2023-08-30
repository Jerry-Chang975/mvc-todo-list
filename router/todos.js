const express = require('express');
const router = express.Router();

const db = require('../models');
const todo = db.Todo;

router.get('/', (req, res, next) => {
  let { page, limit } = req.query;
  const userId = req.user.id;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  return todo
    .findAndCountAll({
      attributes: ['id', 'name', 'isComplete'],
      where: { userId },
      raw: true,
      offset: (page - 1) * limit,
      limit,
    })
    .then((result) => {
      const { count, rows } = result;
      rows.page = page;
      rows.prevPage = page > 1 ? page - 1 : null;
      rows.nextPage = rows.length === 10 ? page + 1 : null;
      res.render('todos', {
        todos: rows,
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
  const userId = req.user.id;
  return todo
    .findByPk(id, { raw: true })
    .then((td) => {
      if (!td) {
        req.flash('error', 'Todo not found!');
        return res.redirect('/todos');
      }
      if (td.userId !== userId) {
        req.flash('error', 'Permission denied!');
        return res.redirect('/todos');
      }
      res.render('detail', { todo: td });
    })
    .catch((err) => console.log(err));
});

router.post('/', (req, res, next) => {
  const { isComplete, name } = req.body;
  const userId = req.user.id;
  return todo
    .create({ name, userId, isComplete: isComplete ? 1 : 0 })
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
  const userId = req.user.id;
  return todo
    .findByPk(id, { raw: true })
    .then((td) => {
      if (!td) {
        req.flash('error', 'Todo not found!');
        return res.redirect('/todos');
      }
      if (td.userId !== userId) {
        req.flash('error', 'Permission denied!');
        return res.redirect('/todos');
      }
      res.render('edit', { todo: td });
    })
    .catch((err) => console.log(err));
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  const { name, isComplete } = req.body;
  return todo.findByPk(id).then((td) => {
    if (!td) {
      req.flash('error', 'Todo not found!');
      return res.redirect('/todos');
    }
    if (td.userId !== userId) {
      req.flash('error', 'Permission denied!');
      return res.redirect('/todos');
    }
    td.update({ name, isComplete: isComplete ? 1 : 0 })
      .then((result) => {
        req.flash('success', 'Update successfully!');
        res.redirect(`/todos/${id}`);
      })
      .catch((err) => {
        err.errorMessage = 'something went wrong!';
        next(err);
      });
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  return todo.findByPk(id).then((td) => {
    if (!td) {
      req.flash('error', 'Todo not found!');
      return res.redirect('/todos');
    }
    if (td.userId !== userId) {
      req.flash('error', 'Permission denied!');
      return res.redirect('/todos');
    }
    td.destroy()
      .then(() => {
        req.flash('success', 'Delete successfully!');
        res.redirect('/todos');
      })
      .catch((err) => {
        err.errorMessage = 'something went wrong!';
        next(err);
      });
  });
});

module.exports = router;
