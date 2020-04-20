// Archivo de configuración
require('./config/config');

// Express
const express = require('express');
const app = express();

// Body Parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json (middleware)
app.use(bodyParser.json());


// Importando path (no hay que instalarlo)
const path = require('path');
// Habilitando la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));



// Importando rutas desde el archivo index en routes (Configuración global de rutas) (app.use siempre son middlewares)
app.use(require('./routes/index'));


// Mongoose
const mongoose = require('mongoose');



// Conexión a BDD
// Aunque la base de datos no exista se puede hacer una conexión ahí
// process.env.URLDB personalizado en config.js
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw (err);

    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});