const express = require ('express');
const carritoController = require ('../controllers/carritoController');
const carrito = require('../models/carrito');

const router = express.Router();


//SAGIT3 EJEMPLO IMPORTANTISIMO, LAS RUTAS DEBEN TENER UN ORDEN, SI PONEMOS /toditos DEBAJO DE /:idUsuario, POR EJEMPLO, NO FUNCIONARÁ...
//
router.get('/toditos', carritoController.obtenerTodosLosCarritos );

router.get ('/:idUsuario', carritoController.obtenerCarrito);
router.post ('/agregar', carritoController.agregarProducto);
router.post('/decrementar', carritoController.decrementarProducto);
router.post('/vaciar', carritoController.vaciarCarrito);

module.exports = router;