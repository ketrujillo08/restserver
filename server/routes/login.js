const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const _ = require('underscore');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                error: err,
                mensaje: "Error en la consulta"
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                exito: false,
                mensaje: "(Usuario) o Contraseña Incorrectos"
            });
        }

        if (bcrypt.compareSync(body.email, usuarioDB.password)) {
            return res.status(400).json({
                exito: false,
                mensaje: "(Usuario) o Contraseña Incorrectos"
            });

        } else {
            usuarioDB.password = undefined;

            let token = jwt.sign({ usuario: usuarioDB }, 'BATMAN', { expiresIn: 60 * 60 * 24 * 30 });

            res.status(200).json({
                exito: true,
                usuario: usuarioDB,
                token
            });

        }



    });




});



module.exports = app;