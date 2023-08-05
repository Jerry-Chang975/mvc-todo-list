const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('todos');
});

router.get('/new', (req, res) => {
  res.send('new todos page');
});

router.get('/:id', (req, res) => {
  res.send(`todos: ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('new todos');
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
