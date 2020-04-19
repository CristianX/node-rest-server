// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');




app.post('/login', (req, res) => {
    res.json({
        ok: true,
    });
});







// para exportar un objeto ya implementado
module.exports = app;