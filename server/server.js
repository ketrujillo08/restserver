const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');
const mongoose = require('mongoose');
const path = require('path');
//Routes
const ROUTES = require('./routes/index');
const app = express();

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Servidor de base de datos funcionando");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Habilitar Carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(ROUTES);

app.listen(process.env.PORT, () => {
    console.log("Escuchando en puerto: " + process.env.PORT);
});