// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');

// Get
app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {

    // Para obtener los heders que se mandan en la url
    let body = req.body;


    // POST
    // Pasando datos del body (headers) al modelo de usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // Encriptando directo sin uso de callbacks hashSync, recibiendo la data y el número de vueltas a dar
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    // Grabando en la base de datos
    // Se puede recibir un error o el parametro usuarioDB
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        // Regresando todo el usuarioDB
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



    // if (body.nombre === undefined) {

    //     // si no se manda un parámetro 
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });

    // } else {

    //     res.json({
    //         persona: body
    //     });

    // }




});

// PUT
app.put('/usuario/:id', function(req, res) {

    // captando el id de la url
    let id = req.params.id;
    let body = req.body;

    // Encontrando el usuario por su id y actualizandoló
    // Para retornar el usuario actualizado hay que mandar en options la variable new
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Regresando todo el usuarioDB
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});

// para exportar un objeto ya implementado
module.exports = app;