//Express
const express = require('express');
let app = express();

// Middlewares de autenticación
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


// Mongoose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Modelos
const Categoria = require('../models/categoria');

// ==================================
// GET Mostrar todas las categorias
// =================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find().exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    });

});


// ==================================
// GET Mostrar categoria por id
// ==================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    // Obteniendo id de la url
    let id = req.params.id;




    Categoria.findById(id).exec((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});



// ==================================
// POST Crear nueva categoria
// ==================================
app.post('/categoria', verificaToken, (req, res) => {

    // obteniendo data del body de la url
    let body = req.body;



    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    // Guardando en bdd
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    // regresa la nueva categoria

});

// ==================================
// PUT Actualizar nombre de la categoria
// ==================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    // Obteniendo id de la url
    let id = req.params.id;

    // Obteniendo el body de la url
    let body = req.body;

    // Capos a actualizar
    let descCategoria = {
        descripcion: body.descripcion
    }

    //Encontrando id de categoria y retornando la categoria actualizada
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }



        // Regredando toda la categoriaDB

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// ==================================
// DELETE Borrar categoría
// ==================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Obteniendo id de la url
    let id = req.params.id;

    // Eliminación física
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        });
    });


});



module.exports = app;