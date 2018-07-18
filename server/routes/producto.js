const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/auth');

const app = express();

app.get('/producto', [verificaToken], (req, res) => {
    let limit = req.query.limit || 20;
    let skip = req.query.skip || 0;
    Producto.find({ disponible: true })
        .limit(limit)
        .skip(skip)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al guardar producto",
                    error: err
                });
            }
            Producto.count({ disponible: true }, (err, total) => {
                res.json({
                    exito: true,
                    mensaje: "Cosulta exitosa",
                    productos,
                    total
                });
            });
        });
});
app.get('/producto/busqueda/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ disponible: true, nombre: regex })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al guardar producto",
                    error: err
                });
            }
            Producto.count({ disponible: true }, (err, total) => {
                res.json({
                    exito: true,
                    mensaje: "Cosulta exitosa",
                    productos,
                    total
                });
            });
        });
});
app.get('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    Producto.findById(id, { runValidators: true })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al guardar producto",
                    error: err
                });
            }
            if (!productoDB) {
                return res.status(404).json({
                    exito: false,
                    mensaje: "El producto no existe",
                    error: err
                });
            }
            res.json({
                exito: true,
                producto: productoDB
            });

        });

});
app.post('/producto', [verificaToken], (req, res) => {
    let body = req.body;
    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.precio = body.precio;
    producto.descripcion = body.descripcion;
    producto.disponible = body.disponible;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;

    producto.save((err, productoGuardado) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar producto",
                error: err
            });
        }
        res.json({
            exito: true,
            mensaje: "Éxito al guardar",
            producto: productoGuardado,
        });
    });
});
app.put('/producto', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descProducto = {
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion
    }
    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoActualziado) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar producto",
                error: err
            });
        }
        if (!productoActualziado) {
            return res.status(404).json({
                exito: false,
                mensaje: "El producto no existe",
                error: err
            });
        }
        res.json({
            exito: true,
            mensaje: "Producto actualizado",
            producto: productoActualziado
        });

    });



});
app.delete('/producto', [verificaToken], (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoActualziado) => {
        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al guardar producto",
                error: err
            });
        }
        if (!productoActualziado) {
            return res.status(404).json({
                exito: false,
                mensaje: "El producto no existe",
                error: err
            });
        }
        res.json({
            exito: true,
            mensaje: "Producto actualizado",
            producto: productoActualziado
        });

    });

});

module.exports = app;