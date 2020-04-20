// Express
const express = require('express');
const app = express();

// Bcrypt, encriptación de contraseñas
const bcrypt = require('bcrypt');

// Underscore, aplica las posibilidades de JAVASCRIPT; _ estandar de uso de underscore
const _ = require('underscore');

// Llamando el modelo de usuario, la nomenclatura es con mayuscula al comienzo
const Usuario = require('../models/usuario');

// Llamando middleware personalizado
//{ } para usar la destructuración a dentro de esto mando verificaToken por que es lo que quiero obtener
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//Mongooose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// GET
// No se necesita parentesis ni nada por que no se esta ejecutando, es el middleware que se va a disparar cuando se acceda a esa ruta
app.get('/usuario', verificaToken, (req, res) => {

    // Para indicar desde donde se muestra la paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Para indicar cuantos registros se muestra por página
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // find regresa todos los registros y exec ejecuta el comando
    // Para usar paginación (obtener los siguientes registros) se usa skip
    // en el campo'nombre email' solo se retorna los campos que se resean mostrar
    // el { estado: true } es para encontrar registros que cumplan unicamente con esa condición
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Recuperando número total de registros
        // el { estado: true } es para encontrar registros que cumplan unicamente con esa condición
        Usuario.countDocuments({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });

        });



    });


});

// POST
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

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
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

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


// DELETE DEFINITIVO
// app.delete('/usuario/:id', function(req, res) {
//     // res.json('delete usuario')

//     let id = req.params.id;

//     // Eliminación física; busca y elimina
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });


//     });


// });

// DELETE  de cambio de estado
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    // res.json('delete usuario')

    let id = req.params.id;

    // Eliminación física; busca y elimina
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


    // Para actualizar el estado
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });


    });


});

// para exportar un objeto ya implementado
module.exports = app;