//1- REQUERIMOS A MONGOOSE Y DECLARAMOS EL SCHEMA PARA TRANSPORTAR LA INFO

const mongoose= require('mongoose');

const clienteSchema = new mongoose.Schema(
    {
        nombre:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required:true},
        admin:{type:Boolean, required:false} //EL ADMIN NO ES OBLIGATORIO PORQUE EL CLIENTE NO PUEDE SELECCIONAR SI SER ADMIN ONO
        //SOLO EL ADMIN PODRÁ REGISTRAR A UN USUARIO CON ESTA CARACTERÍSTICA.
    }
);

module.exports=mongoose.model('Cliente', clienteSchema);

// AHORA AL ROUTES -> 2-