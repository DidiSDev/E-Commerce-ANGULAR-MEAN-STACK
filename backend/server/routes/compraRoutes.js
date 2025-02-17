const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// REALIZAR COMPRA
router.post('/realizar', compraController.realizarCompra); //NECESITAMOS EL ENDPOINT /realizar PARA EJECUTAR LA FUNCIÓN DE HACER COMPRAS

//  GESTIONES DE LOS CLIENTES 
router.get('/cliente/:clienteId', compraController.obtenerComprasCliente);

router.get('/todasLasCompras', compraController.getTodasLasCompras);

router.post('/numeroClientes', compraController.getNumeroClientes);

router.post('/eliminar/global', compraController.eliminarGlobal);
router.post('/eliminar/usuario', compraController.eliminarComprasUsuario);

module.exports = router;
