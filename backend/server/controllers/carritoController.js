const Carrito = require ('../models/carrito');
const Producto = require ('../models/producto');

exports.obtenerCarrito = async (req,res) => {

    const {idUsuario} = req.params;

    try{
        const carrito = await Carrito.findOne ({idUsuario}).populate('items.producto');
        if (!carrito)
        {
            const nuevoCarrito =  new Carrito ({idUsuario, items:[]});
            return res.status(200).json(nuevoCarrito);
        }
        
        //SI CARRITO.. TODO OK.
        res.status(200).json(carrito);
    }
    catch(error)
    {
    
        res.status(500).json({mensaje: 'Error al obtener el carrito', error});
    }
};

//SAGIT3
exports.obtenerTodosLosCarritos = async (req,res) =>{
    try{
        //BUSCO EN TODOS LOS CARRITOS Y POPULAMOS (CARGAMOS) EL CAMPO "PRODUCTO" CON NOMBRE Y CON PRECIO
        //PORQUE ASI ESTÁ DEFINIDO EN MONGO, items: qe sona arrays que contienen un atributo "producto" y otro "cantidad"
        const carritos = await Carrito.find().populate('items.producto', 'nombre precio');

        //SI HAY CARRITOS, DEVOLVEMOS EL ARRAY, SI NO, (FALSE) DEVOLVEMOS ARRAY VACIO
        res.status(200).json(carritos?.length ? carritos : []);
    }
    catch(error){res.status(500).json({mensaje: 'ERROR AL OBTENER TODOS LOS CARRITOS', error})};
}

  



exports.agregarProducto = async (req, res) => {
    const { idUsuario, productoId, cantidad } = req.body;
  
    try {
      const producto = await Producto.findById(productoId);
      if (!producto || producto.stock <= 0) {
        return res.status(400).json({ mensaje: 'No hay stock suficiente para este producto' });
      }
  
      let carrito = await Carrito.findOne({ idUsuario });
  
      if (!carrito) {
        carrito = new Carrito({ idUsuario, items: [] });
      }
  
      const indiceItems = carrito.items.findIndex(item => item.producto.toString() === productoId);
  
      if (indiceItems > -1) {
        carrito.items[indiceItems].cantidad += cantidad || 1;
      } else {
        carrito.items.push({ producto: productoId, cantidad: cantidad || 1 });
      }
  
      await carrito.save();
  
      // **Al final tengo q usar populate para devolver datos completos del producto, porque si no la vista lo cogía como "undefined" y no lo mostraba al pulsar sobre 
      // "Añadir al carritO" en productos.component**
      const carritoPopulado = await Carrito.findOne({ idUsuario }).populate('items.producto');
  
      res.status(200).json(carritoPopulado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al agregar producto al carrito', error });
    }
  };
  

//NO ELIMINAMOS UN PRODUCTO COMPLETO, DECREMENTAMOS 1, SI HAY 1 SE ELIMINA Y SI HAY VARIOS SE QUEDA
exports.decrementarProducto = async (req,res ) => {

    const { idUsuario } = req.body;

    const { productoId, cantidad } =req.body;

    try{

        const carrito =  await Carrito.findOne({idUsuario}); //CARRITO DEL USUARIO

        if (!carrito) //NO HAY, INFORMAMOS, NO HAY NADA QUE BORRAR
        {
            return res.status(404).json({mensaje: 'CARIRTO NO ENCONTRADO'});
        }

        const indiceItems = carrito.items.findIndex(item=> item.producto.toString() === productoId);

        if (indiceItems > -1){
            //EXISTE, AÑADIMOS CANTIDAD SI NOS LA ENVIAN, EN CASO CONTRARIO, SOLAMENTE 1.
            carrito.items[indiceItems].cantidad -= 1;
            if (carrito.items[indiceItems].cantidad <=0)
            {
                //LO ELIMINAMOS SI NOS HEMOS QUEDADO CON 0
                carrito.items.splice(indiceItems,1);
            }
            await carrito.save();
            /**HAY QUE AÑADIR EL .populate PORQUE SI NO, CUANDO PULSO SOBRE "ELIMINAR UNIDAD" DESAPARECEN LOS NOMBRES */
            const carritoActualizado = await Carrito.findOne({idUsuario}).populate('items.producto');
            res.status(200).json(carritoActualizado);
        }
        else{
            res.status(404).json({mensaje: 'Error, no se ha encontrado el producto en el carrito'});
        }
    }
    catch (error)
    {
        res.status(500).json({mensaje: 'Error', error});
    }
};

exports.vaciarCarrito = async (req,res) => {

    const { idUsuario } = req.body;

    try{

        const vaciamosCarrito = await Carrito.findOne({idUsuario});
        if (!vaciamosCarrito)
        {
            return res.status(404).json({mensaje: 'CARRITO NO ENCONTRADO PARA ESTE USUARIO'});
        }
            //HAY CARRITO, LO VACIAMOS.
            vaciamosCarrito.items=[]; 
            await vaciamosCarrito.save();
            res.status(200).json(vaciamosCarrito);
        
    }
    catch (error)
    {
        res.status(500).json({mensaje: 'Error', error});
    }
};