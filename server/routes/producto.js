// Express
const express = require('express');
const app = express();

// Underscore, aplica las posibilidades de JAVASCRIPT; _ estandar de uso de underscore
const _ = require('underscore');


// Middleware personalizado
const { verificaToken } = require('../middlewares/autenticacion');

// Mongoose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Modelo de producto
const Producto = require('../models/producto');


// ============================
// GET Obtener producto
// ============================
app.get('/productos', verificaToken, (req, res) => {

    // Implementando paginación desde y límite que vienen desde la url
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.hasta || 0;
    limite = Number(limite);

    // Encontrando y regresando todos los productos
    // populate para mostrar informacipon asociada con el id de usuario y categoria
    Producto.find({ disponible: true }).populate('categoria', 'descripcion').populate('usuario', 'nombre email').skip(desde).limit(limite).exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (productos.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existen productos disponibles'
                }
            });
        }

        Producto.countDocuments({ disponible: true }, (err, conteo) => {
            // Devolviendo productos
            res.json({
                ok: true,
                productos,
                cuantos: conteo
            });
        });


    });

});

// ============================
// GET Obtener un producto por id
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {
    // obteniendo id de la url
    let id = req.params.id;

    // Encontrando y regresando el producto por id
    // populate para mostrar informacipon asociada con el id de usuario y categoria
    Producto.findById(id).populate('categoria', 'descripcion').populate('usuario', 'nombre email').exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// ============================
// Buscar productos por BDD
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    // Obteniendo término de la url
    let termino = req.params.termino;

    // Enviando expresión regular para búsqueda más flexible, no hay que importar nada, esto es una función de js normal
    // La i es para que sea insensible a las mayusq y minusq
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true }).populate('categoria', 'descripcion').exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    });

});

// ============================
// POST Obtener producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    // Obteniendo body de la url
    let body = req.body;

    // Pasando datos del body al modelo de usuario
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    // Guardando en la bdd
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }



        // Regresado categoría creada
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });



});

// ============================
// PUT Actualizar producto producto
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {

    // Obteniendo id de la url
    let id = req.params.id;

    // Obteniendo el body de la url y añadiendo campos a actualizar
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    // Encontrando usuario por id y actualizandoló
    // Para retornar el usuario actualizado hay que mandar en options la variable new
    // runValidators corre todas las validaciones echas en el esquema
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }




        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

// ============================
// DELETE Borrar un producto producto producto
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // Obteniendo id de la url
    let id = req.params.id;

    // Obteniendo producto y cambiando de disponibilidad
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto borrado'
        });
    });
});


module.exports = app;