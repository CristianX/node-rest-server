// Express
const express = require('express');
const app = express();

// Fyle System
const fs = require('fs');

// Path para path absoluto
const path = require('path');


// Ruta para desplegar informació
app.get('/imagen/:tipo/:img', (req, res) => {

    // Obteniendo paramatros de la url
    let tipo = req.params.tipo;
    let img = req.params.img;


    // Añadiendo pagth donde se encuentran las imagenes
    let pathImg = `./uploads/${ tipo }/${ img }`;

    // __dirname se utiliza con path
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

    // Lee el contentType de un archivo y la regresa
    res.sendFile(noImagePath);




})



module.exports = app;