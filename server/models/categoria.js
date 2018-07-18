const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaModel = new Schema({
    nombre: { type: String, required: [true, "El nombre es requerido"], unique: true },
    estado: { type: Boolean, default: true },
    usuario: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categoriaModel);