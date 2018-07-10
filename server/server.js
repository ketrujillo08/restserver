const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');
const mongoose = require('mongoose');
//Routes
const usuarioRoutes = require('./routes/usuario');
const app = express();

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Servidor de base de datos funcionando");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/usuario', usuarioRoutes);

app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto: " + process.env.PORT);
});