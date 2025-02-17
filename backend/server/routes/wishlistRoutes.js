const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/agregar', wishlistController.agregarDeseado);
router.get('/top', wishlistController.obtenerTopDeseados);
router.get('/usuario/:clienteId', wishlistController.obtenerWishlistUsuario); 
router.post('/eliminar', wishlistController.eliminarDeseado);


module.exports = router;
