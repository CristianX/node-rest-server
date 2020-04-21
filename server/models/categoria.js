// Mongoose
const mongoose = require('mongoose');


//Obteniendo schemas de mongoose
let Schema = mongoose.Schema;





// Declaración de esquema
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },

    usuario: {
        // Para llamar id de otra tabla
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

// No aplicar este código cuando se necesita cambiar un aprámetro con propiedad unique ya que lo vuelve de solo lectura
// Validando el error duplicado de nombre de la categoria
// categoriaSchema.plugin(uniqueValidator, {
//     message: '{PATH} debe ser único'
// });

// Exportando el modelo Categoria con la funcionalidad de categoriaSchema
module.exports = mongoose.model('Categoria', categoriaSchema);