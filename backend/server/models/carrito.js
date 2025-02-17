const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//ESQUEMA DEL CARRITO:
const carritoSchema = new Schema({
    idUsuario: {type:String, required:true}, //DUEÑO DEL CARRO
    items: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Producto',
                required:true
            },
            cantidad: {type: Number, default:1} //CANT DE PRODUCTO
        }
    ]
}, {
    timestamps:true //AÑADIMOS CAMPOS "createdAt" "updatedAt"
});

module.exports = mongoose.model ('carrito', carritoSchema);