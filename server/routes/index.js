const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');

const express = require('express');

const app = express();

app.use(usuarioRoutes);
app.use(loginRoutes);

module.exports = app;