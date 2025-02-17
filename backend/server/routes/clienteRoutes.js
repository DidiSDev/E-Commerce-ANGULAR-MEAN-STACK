// 2-
const express=require('express');
const router= express.Router();
const clienteController = require('../controllers/clienteController');

//SOLAMENTE HACE FALTA GESTIONAR LAS ALTAS DE LOS CLIENTES, BIEN DESDE LA VISTA DEL USUARIO O DEL ADMIN

router.post('/register', clienteController.registrarUsuario); 
/**
 * 9- Este nos envía a clienteController.js, accedemos al objeto instanciado aquí clienteController y su función registrarusuario
 */

router.get('/getClientes', clienteController.getClientes);

router.post('/login', clienteController.login);


router.post('/eliminarlos', clienteController.eliminarArrayClientes);
router.post('eliminarUno', clienteController.eliminarCliente);
module.exports= router;

//AHORA AL CONTROLLERS -> 3-