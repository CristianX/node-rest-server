// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// Underscore, aplica las posibilidades de JAVASCRIPT; _ estandar de uso de underscore
const _ = require('underscore');

// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');

// GET
app.get('/usuario', function(req, res) {

    // Para indicar desde donde se muestra la paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Para indicar cuantos registros se muestra por página
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // find regresa todos los registros y exec ejecuta el comando
    // Para usar paginación (obtener los siguientes registros) se usa skip
    Usuario.find({ /* aquí va una condición como google:true si se desea */ }).skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Recuperando número total de registros
        Usuario.count({ /* aquí va una condición como google:true si se desea */ }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });

        });



    });


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

    // Añadiendo campos que si se pueden actualizar 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Encontrando el usuario por su id y actualizandoló
    // Para retornar el usuario actualizado hay que mandar en options la variable new
    // runValidators corre todas las validaciones echas en el esquema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

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