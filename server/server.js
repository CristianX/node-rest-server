// Express
const express = require('express');
const app = express();

// Body Parser
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json (middleware)
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get usuario')
});

app.post('/usuario', function(req, res) {

    // Para obtener los heders que se mandan en la url
    let body = req.body;

    if (body.nombre === undefined) {

        // si no se manda un parámetro 
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {

        res.json({
            persona: body
        });

    }




});
app.put('/usuario/:id', function(req, res) {

    // captando el id de la url
    let id = req.params.id;

    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});

app.listen(3000, () => {
    console.log('Escuchando puerto', 3000);
});