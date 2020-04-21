// Express
const express = require('express');
const app = express();

// File Upload
const fileUpload = require('express-fileupload');


// Middleware de file upload
app.use(fileUpload({ useTempFiles: true }));


// Importando models
const usuario = require('../models/usuario');

// Actualizar imagen
app.put('/upload/:tipo/:id', (req, res) => {

    // Obteniendo parametros del url
    let tipo = req.params.tipo;
    // Obteniendo id de la url
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: 'No se ha selleccionado ningún archivo'
        });

    }

    // Validando tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });

    }


    // Obtetiendo archivo de body form data
    let archivo = req.files.archivo;

    // Obteniendo extensión
    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cabiar nombre al archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aquí imagen cargada
        // Se almacena solo el nombre del archivo para la base de datos
        imagenUsuario(id, res, nombreArchivo);

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        usuarioDB.img = nombreArchivo;

        // Guardando imagen en la bdd
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });



    });

}

function imagenProducto() {

}


module.exports = app;