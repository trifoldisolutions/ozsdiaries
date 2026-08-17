const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  const mongoConfigured = Boolean(process.env.MONGO_URI);
  const tasks = mongoConfigured ? await Task.find().sort({ createdAt: -1 }) : [];
  res.render('tasks', { title: 'Task Board', tasks, mongoConfigured });
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  await Task.create({ title, description });
  res.redirect('/dev-resources/tasks');
});

router.post('/:id/edit', async (req, res) => {
  const { title, description, status } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, description, status });
  res.redirect('/dev-resources/tasks');
});

router.post('/:id/delete', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/dev-resources/tasks');
});

router.routes = [
  { method: 'GET', path: '/', label: 'Task board' },
  { method: 'POST', path: '/', label: 'Create task' },
  { method: 'POST', path: '/:id/edit', label: 'Edit task' },
  { method: 'POST', path: '/:id/delete', label: 'Delete task' },
];

module.exports = router;
