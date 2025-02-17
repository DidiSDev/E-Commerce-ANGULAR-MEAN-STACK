const express = require('express');

const productoController = require('../controllers/productoController');
const {listarPorCategoria} = require ('../controllers/productoController');

const router = express.Router();

router.get('/categoria/:categoria', listarPorCategoria);

router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductosPorId);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto); 
router.delete('/:id', productoController.eliminarProducto); 

module.exports = router;

