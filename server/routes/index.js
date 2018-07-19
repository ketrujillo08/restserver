const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');
const categoriaRoutes = require('./categoria');
const productoRoutes = require('./producto');
const uploadRoutes = require('./upload');
const imagenRoutes = require('./imagen');

const express = require('express');

const app = express();

app.use(usuarioRoutes);
app.use(loginRoutes);
app.use(categoriaRoutes);
app.use(productoRoutes);
app.use(uploadRoutes);
app.use(imagenRoutes);

module.exports = app;