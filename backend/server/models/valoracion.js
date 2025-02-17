const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valoracionSchema = new Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  comentario: { type: String },
  estrellas: { type: Number, min: 1, max: 5, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Valoracion', valoracionSchema);
