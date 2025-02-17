//EXPRESS SIMPLIFICA LA CREACIÓN DE SERVIDORES Y EL MANEJO DE RUTAS Y FACILITA LA DEFINICION DE ENDPOINTS PARA LA API
//LA CUAL SE ENCARGARÁ DE CONECTAR TODOS LOS COMPONENTES DEL CÓDIGO

//NECESITAMOS ESTABLECER LA CONEXION ENTRE Node.js Y MongoDB PARA ALMACENAR O RECUPERAR/MODIFICAR DATOS DE LOS PRODUCTOS

//EL NOMBRE ME DICES SI TE PARECE BIEN, PROVISIONALMENTE LO LLAMARÉ mean-productos

const mongoose = require('mongoose'); //REQUERIMOS MONGOOSE

//DAMOS UN URI:
const URI = 'mongodb://127.0.0.1:27017/mean-productos'; //NO HACE FALTA CREARLA EN mongoDB, SE CREA SOLA A LA PRIMERA INSERCIÓN DE DATOS
 



//IMPORTANTE: ESTABLECEMOS LA CONEXIÓN:
mongoose.connect(URI).then(() => console.log('Conectado a la BBDD')).catch(err => console.error('Error al conectar a la BBDD', err));

module.exports =mongoose;
//EN PPIO, database queda así, requerimos mongoose, metemos la URI, y hacemos mongoose.connect(URI).then.catch, así las promesas nos indican si está todo OK o no

//AHORA YA PODEMOS HACER mongod EN CONSOLA PARA ACTIVARLO.

