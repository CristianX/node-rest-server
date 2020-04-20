// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// NPM JSON WEB TOKEN
const jwt = require('jsonwebtoken');


// Google Auth Client
// CLIENT_ID importando desde config/config.js
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');



// Login Normal
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

        // Generando token con jason web token (Generando Payload)
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // 60 * 60 * 24 * 30 es decir que expira en 30 días

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

// Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // Payload recibe todos los datos del usuario
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
}



// Login con Google
app.post('/google', (req, res) => {

    let token = req.body.idtoken;


    // llamando verify
    verify(token);

    res.json({
        token
    })

});






// para exportar un objeto ya implementado
module.exports = app;