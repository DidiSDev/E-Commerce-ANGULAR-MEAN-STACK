//4-

const express = require('express');                                           
const mongoose = require('mongoose');             
const cors = require('cors');                       
const morgan = require('morgan');                   

const app = express();  

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// URI de conexión a MongoDB
const MONGODB_URI = 'mongodb://127.0.0.1:27017/mean-productos';

// CONEXION A MONGOD 
mongoose.connect(MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a MongoDB');


    //AQUI METO TODAS LAS RUTAS, PRODUCTOS YA ESTABA, AÑADO CLIENTES -> 4-
    app.use('/api/productos', require('./routes/productoRoutes.js')); 
    app.use('/api/cliente', require('./routes/clienteRoutes.js'));
    app.use('/api/carrito', require('./routes/carritoRoutes.js'));
    app.use('/api/compras', require('./routes/compraRoutes.js'));
    app.use('/api/wishlist', require('./routes/wishlistRoutes.js'));
    app.use('/api/valoracion', require('./routes/valoracionRoutes.js'));
    
    //ES POSIBLE QUE AQUI TENGAMOS QUE METER /carrito para gestionar el envio a mis compras desde /carrito


    //PUERTO
    const PORT = process.env.PORT || 3000; 
    
  

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
})
.catch(err => {
    console.error('Error al conectar a MongoDB:', err.message);
});
