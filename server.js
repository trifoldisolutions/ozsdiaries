require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const publicRoutes = require('./routes/public');
const appRoutes = require('./routes/app');
const adminRoutes = require('./routes/admin');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3009;

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'dev_resources')]);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: 'ozsdiaries' })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
} else {
  console.warn('MONGO_URI is not set — skipping MongoDB connection. Set it in .env to persist data.');
}

const facades = [
  { name: 'Public', mount: '/', router: publicRoutes },
  { name: 'App', mount: '/app', router: appRoutes },
  { name: 'Admin', mount: '/admin', router: adminRoutes },
  { name: 'Dev Resources', mount: '/dev-resources/tasks', router: tasksRoutes },
];

facades.forEach((facade) => {
  app.use(facade.mount, facade.router);
});

app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}\n`);
  console.log('Route map:');
  facades.forEach((facade) => {
    (facade.router.routes || []).forEach((route) => {
      const routePath = route.path === '/' ? '' : route.path;
      const fullPath = `${facade.mount === '/' ? '' : facade.mount}${routePath}` || '/';
      const url = `http://localhost:${PORT}${fullPath}`;
      console.log(`  [${route.method}] ${url} — ${route.label}`);
    });
  });
  console.log('');
});
