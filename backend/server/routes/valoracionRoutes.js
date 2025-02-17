const express = require('express');
const router = express.Router();
const valoracionController = require('../controllers/valoracionController');


router.post('/agregar', valoracionController.agregarValoracion);
router.get('/promedio/:productoId', valoracionController.obtenerValoracionPromedio);
router.get('/producto/:productoId', valoracionController.obtenerValoracionesProducto);
router.get('/todas', valoracionController.obtenerTodasValoraciones);

module.exports = router;
