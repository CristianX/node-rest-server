// Express
const express = require('express');
const app = express();

// File Upload
const fileUpload = require('express-fileupload');


// Middleware de file upload
app.use(fileUpload({ useTempFiles: true }));


// Actualizar imagen
app.put('/upload', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: 'No se ha selleccionado ningún archivo'
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


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            message: 'Imagen cargada correctamente'
        });
    });
});


module.exports = app;