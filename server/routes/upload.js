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

    let archivo = req.files.archivo;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv('uploads/filename.jpg', (err) => {
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