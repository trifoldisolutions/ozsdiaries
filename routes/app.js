const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('app/index', { title: 'App' });
});

router.get('/login', (req, res) => {
  res.render('app/login', { title: 'Log In / Sign Up' });
});

router.get('/diaries', (req, res) => {
  res.render('app/diaries', { title: 'Diaries' });
});

router.routes = [
  { method: 'GET', path: '/', label: 'App index' },
  { method: 'GET', path: '/login', label: 'Login / Sign up' },
  { method: 'GET', path: '/diaries', label: 'Diaries (placeholder)' },
];

module.exports = router;
