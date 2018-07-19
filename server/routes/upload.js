const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
//MODELS
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.json(400).json({
            exito: false,
            error: {
                mensaje: "No se há seleccionado ningún archivo."
            }
        })
    }
    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            exito: false,
            error: {
                mensaje: "Este tipo no es valido"
            }
        });

    }

    let archivo = req.files.archivo;
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            exito: false,
            error: {
                mensaje: "Este tipo de archivo no es valido"
            }
        });
    }

    //Cambiar nombre del archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`upload/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.json(400).json({
                exito: false,
                err
            });
        }
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;

            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;

        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                exito: false,
                error: err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                exito: false,
                mensaje: "El usuario no existe"
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                exito: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });




    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                exito: false,
                error: err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                exito: false,
                mensaje: "El producto no existe"
            });
        }
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                exito: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });

}

function borrarArchivo(nombreImagen, tipo) {
    let pathUrl = path.resolve(__dirname, `../../upload/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;