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

    let body = req.body;

    res.json({
        persona: body
    });
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