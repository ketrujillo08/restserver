const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth')
app.get('/usuario', [verificaToken], (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limit) || 5;
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    exito: false,
                    error: err,
                    mensaje: "Error en la consulta"
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.status(200).json({
                    exito: true,
                    usuarios,
                    total: conteo,
                    usuario: req.usuario
                });

            });

        });
});

app.post('/usuario', [verificaToken], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioAlmacenado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                error: err,
                mensaje: "No se puedo almacenar el usuario"
            });
        }
        usuarioAlmacenado.password = undefined;
        res.status(200).json({
            exito: true,
            mensaje: 'Usuario Almacénado',
            usuario: usuarioAlmacenado
        });
    });

});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                error: err,
                mensaje: "No se puedo actualizar el usuario"
            });
        }
        if (!usuarioActualizado) {
            return res.status(404).json({
                exito: false,
                mensaje: "El usuario no existe"
            });
        }
        usuarioActualizado.password = undefined;
        res.status(200).json({
            exito: true,
            mensaje: 'Usuario Almacénado',
            usuario: usuarioActualizado
        });
    });
});
app.delete('/usuario/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                error: err,
                mensaje: "No se puedo eliminar el usuario"
            });
        }
        if (!usuarioEliminado) {
            return res.status(404).json({
                exito: false,
                error: {
                    mensaje: 'Usuario no encontrado'
                },
            });

        }

        res.status(200).json({
            exito: true,
            mensaje: 'Usuario Eliminado',
            usuario: usuarioEliminado
        });

    })

    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                exito: false,
                error: err,
                mensaje: "No se puedo eliminar el usuario"
            });
        }
        if (!usuarioBorrado) {
            return res.status(404).json({
                exito: false,
                error: {
                    mensaje: 'Usuario no encontrado'
                },
            });

        }

        res.status(200).json({
            exito: true,
            mensaje: 'Usuario Eliminado',
            usuario: usuarioBorrado
        });
    });*/

});

module.exports = app;