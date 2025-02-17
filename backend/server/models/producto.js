//AQUI COMO PRIMER MODEL TENDREMOS PRODUCTO

//IMPORTAMOS SIEMPRE BBDD
const mongoose=require('mongoose');
const {Schema} = mongoose; //Desestructuramos el Schema, para tratar mejor los datitos

const productoEsquema = new Schema({
    nombre: { type: String, required: true },
    descr: { type: String, required: true },       
    precio: { type: Number, required: true },     
    stock: { type: Number, default: 0 },           
    imagen: { type: String },                      //CON ESTAS 4 COSAS VALE NO? O METEMOS ALGO MÁS?
    categoria: { type: String, enum: ['League of Legends', 'Valorant'], required: true }
});

module.exports=mongoose.model('Producto', productoEsquema); //-> ASÍ EXPORTAMOS EL MODELO BASADO EN Schema