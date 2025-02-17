const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
