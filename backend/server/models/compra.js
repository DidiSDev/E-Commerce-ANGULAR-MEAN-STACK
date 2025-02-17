const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    productos: [
        {
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            cantidad: { type: Number, default: 1 }
        }
    ],
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: true }
});

module.exports = mongoose.model('Compra', compraSchema);
