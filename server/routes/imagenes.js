// Express
const express = require('express');
const app = express();

// Fyle System
const fs = require('fs');

// Path para path absoluto
const path = require('path');


// Middlewares epersonalizados
const { verificaTokenImg } = require('../middlewares/autenticacion');


// Ruta para desplegar informació
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    // Obteniendo paramatros de la url
    let tipo = req.params.tipo;
    let img = req.params.img;



    // Construyendo un path para llegar a uploads
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        // __dirname se utiliza con path
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

        // Lee el contentType de un archivo y la regresa
        res.sendFile(noImagePath);
    }






})



module.exports = app;