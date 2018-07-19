const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { verificaTokenImg } = require('../middlewares/auth');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../upload/${tipo}/${img}`);
    console.log(pathImage);
    let noImagePath = path.resolve(__dirname, '../assets/images/no-image.jpg');

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(noImagePath);
    }



});

module.exports = app;