// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');




app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            // Error 500 es un internal server error, error interno del servidor
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // Comparando contraseña ingresada con la contraseña grabada en bcrypt
        // Regresa un true si hacen match
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            toke: '123'
        });

    });

});







// para exportar un objeto ya implementado
module.exports = app;