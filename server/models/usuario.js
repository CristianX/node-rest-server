const mongoose = require('mongoose');

// Obteniendo esquemas de mongoose
let Schema = mongoose.Schema;

// Declarando esquema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']

    },

    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }


});

// Se exporta el modelo Usuario con la funcionalidad de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);