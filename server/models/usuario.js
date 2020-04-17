const mongoose = require('mongoose');

// Obteniendo esquemas de mongoose
let Schema = mongoose.Schema;

// Validador unico: para hacer user friendly al error que sale cuando se duplica el correo
const uniqueValidator = require('mongoose-unique-validator');

// Roles válidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    // Usando mongoose unique validator
    message: '{VALUE} no es un rol válido'
}

// Declarando esquema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']

    },

    email: {
        type: String,
        unique: true,
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
        default: 'USER_ROLE',
        enum: rolesValidos
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

// Impidiendo que se regrese la contraseña
// Mandando toda la impresion de los campos a un esquema JSON
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Usando pluguin para validar el error de duplicado de correo
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// Se exporta el modelo Usuario con la funcionalidad de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);