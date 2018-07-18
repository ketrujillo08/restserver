const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken } = require('../middlewares/auth');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 20;
    Categoria.find({})
        .skip(skip)
        .limit(limit)
        .populate('usuario')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error en la consulta",
                    error: err
                });
            }

            Categoria.count({ estado: true }, (err, total) => {
                res.json({
                    exito: true,
                    mensaje: "Consulta Exitosa",
                    categorias,
                    total
                });
            })

        });

});

app.get("/categoria/:id", [verificaToken], (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error en la consulta",
                error: err
            });
        }
        res.json({
            exito: true,
            mensaje: "Éxito en consulta",
            categoria: categoriaDB,
            usuario: req.usuario
        });

    });
})

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria();
    categoria.nombre = body.nombre;
    categoria.usuario = req.usuario._id;

    categoria.save({ runValidators: true }, (err, categoriaGuardada) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar categoria",
                error: err
            });
        }
        res.json({
            exito: true,
            mensaje: "Éxito al guardar",
            categoria: categoriaGuardada,
        });

    });

});

app.put("/categoria/:id", [verificaToken], (req, res) => {
    let body = req.body;
    let id = req.params.id;

    let descCategoria = {
        nombre: body.nombre
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar categoria",
                error: err
            });
        }

        res.json({
            exito: true,
            mensaje: "Éxito al guardar",
            categoria: categoriaActualizada,
        });

    });

});
app.delete("/categoria:id", [verificaToken], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar categoria",
                error: err
            });
        }

        res.json({
            exito: true,
            mensaje: "Éxito al guardar",
            categoria: categoriaActualizada,
        });

    });

});

module.exports = app;