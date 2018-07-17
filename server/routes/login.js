const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const _ = require('underscore');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let idtoken = req.body.idtoken;
    let googleUser = await verify(idtoken)
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                error: err
            });
        }
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(200).json({
                    exito: true,
                    mensaje: "El correo ya esta en uso",
                    email: usuarioDB.email
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, 'BATMAN', { expiresIn: 60 * 60 * 24 * 30 });

                return res.json({
                    exito: true,
                    mensaje: "Login con Google",
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe crear

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.google = googleUser.google;
            usuario.img = googleUser.picture;
            usuario.password = ":)";

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        exito: false,
                        error: err
                    });
                }
                let token = jwt.sign({ usuario: usuarioDB }, 'BATMAN', { expiresIn: 60 * 60 * 24 * 30 });
                return res.json({
                    exito: true,
                    mensaje: "Usuario creado con autentificación de Google",
                    usuario: usuarioGuardado,
                    token
                });

            });
        }
    })
});
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