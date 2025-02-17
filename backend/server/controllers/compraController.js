const Compra = require('../models/compra');
const CompraModel = require('../models/compra');
const Producto = require('../models/producto');

exports.realizarCompra = async (req,res) =>
{
  
  try{
    const { clienteId, productos, total } = req.body;


    //ANTES DE HACER LA COMPRA TENEMOS QUE VERIFICAR QUE HAY STOCK SUFICIENTE PARA REALIZARLA, DE LO CONTRARIO SE INDICARÁ AL USUARIO
    //EXACTAMENTE EL STOCK QUE QUEDA PARA QUE ELIMINE DEL CARRITO LO NECESARIO PARA PERMITIRLE COMPRAR..

    for (const prod of productos)
    {
      const productoBaseDeDatos = await Producto.findById(prod.productoId);
      if (prod.cantidad > productoBaseDeDatos.stock)
      {
        return res.status(400).json({mensaje: `Error, el producto ${productoBaseDeDatos.nombre} no tiene stock suficiente, quedan ${prod.cantidad} unidades y estás intentando comprar ${productoBaseDeDatos.stock}`})
      }
    }



    //CREAMOS LA COMPRA EN LA BBDD

    const nuevaCompra = new Compra({
      clienteId,
      productos,
      total
    });

    await nuevaCompra.save();

    //ACTUALIZAMOS STOCK:
    for (const p of productos)
    {
      const productoBaseDatos = await Producto.findById(p.productoId);
      if (!productoBaseDatos) continue; //SI NO EXISTE PASAMOS AL SIGUIENTE

      productoBaseDatos.stock  = Math.max(0, productoBaseDatos.stock - p.cantidad);
      await productoBaseDatos.save();
    }

    res.status(200).json({mensaje: ' TODO OK '});
  }
  catch(error)
  {
    return res.status(500).json({mensaje: 'ERROR', error});
  }

}

//GET CLIENTESCOMPRARON
exports.getCompras = async (req,res) =>{

  try{

    const compras = await CompraModel.find().populate('clienteId'); //YA TENEMOS TODOS LOS CLIENTES POPULADOS
    console.log('Compras:', compras);


    const clientes = new Set();

    for (const compra of compras)
    {
      clientes.add(compra.clienteId);
    }

    const clientesUnicosCompraron = Array.from(clientes); //ALMACENAMOS TODOS LOS CLIENTES UNICOS QUE HAN COMPRADO,
    console.log('Clientes únicos:', clientesUnicosCompraron);
    return res.status(200).json(clientesUnicosCompraron);

  }catch(error)
  {
    return res.status(500).json({mensaje: 'Error', error});
  }
}

exports.getNumeroClientes = async (req,res)=>
{
  const {productoId} =  req.body;

  try{
    const clientes = await CompraModel.find({'productos.productoId': productoId}).distinct('clienteId');
    const numero = clientes.length;
    return res.status(200).json(numero);

  }
  catch(error)
  {
    return res.status(500).json({mensaje:'error', error});
  }
}

exports.getProductosNombre = async (req,res)=>{
  const {nombreProducto} = req.body;
  try{

  
    //nombreProducto NO EXISTE COMO TAL EN EL MODELO, EN EL MODELO EXISTE productoId.nombre, según el model

    const compras = await CompraModel.find().populate('productos.productoId');
    //AHORA TOCA FILTRAR..

    let cantidad = 0
    for (const compra of compras)
    {
      for (const producto of compra.productos)
      {
        if (producto.productoId.nombre === nombreProducto )
        {
          cantidad++;
        }
      }
    }
    

    return res.status(200).json(cantidad);

  }catch(error)
  {
    return res.status(500).json({mensaje: 'Error', error});
  }
}


exports.obtenerComprasCliente = async (req, res) => {
    const clienteId = req.params.clienteId;

    try {
        const compras = await CompraModel.find({ clienteId })
        .populate('productos.productoId', '_id nombre precio categoria')

        // Formateamos los datos para que sean claros para el frontend
        const comprasConDetalles = compras.map((compra) => ({
            fecha: compra.fecha,
            total: compra.total,
            productos: compra.productos.map((producto) => ({
              nombre: producto.productoId.nombre,
              precio: producto.productoId.precio, //AÑADIDO PARA SAGIT7
              categoria: producto.productoId.categoria, //CATEGORIA AÑADIDA
              cantidad: producto.cantidad
            }))
        }));
        console.log('EEEEEEEEEEEEEEEEEE', comprasConDetalles);
        res.status(200).json(comprasConDetalles);
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ mensaje: 'Error al obtener las compras.' });
    }
};

//1 sagit FUNCIÓN PARA ELIMINAR PRODUCTOS GLOBALMENTE DE LAS COMPRAS REALIZADAS
//SE CONTINUA EN compraRoutes.js (hacemos una ruta para eliminar globalmente)
//y luego en frontend, en el servicio (compra.service.ts) solamente modificamos "hacerCompra()" en carrito.component.ts Y AÑADIMOS
//eliminarProductosUsuario o eliminarProductosGlobal.
exports.eliminarGlobal=async (req, res) =>{
  try{

    //BUSCAMOS PRODUCTOS EN EL CARRITO
    const {productos} = req.body;

    if (!productos || productos.length ===0){
      return res.status(400).json({mensaje: 'NO HAY PRODUCTOS PARA ELIMINAR'});
    }

    for (const prod of productos){
        //BUSCO TODAS LAS COMPRAS Q CONTIENENE STE PRODTO
        const compras = await CompraModel.find({'productos.productoId': prod.productoId});

        for (const compra of compras){
          const productoIndex = compra.productos.findIndex(p=>p.productoId.toString() === prod.productoId);

          if (productoIndex!=-1){

            compra.productos[productoIndex].cantidad -=prod.cantidad; //VALORAMOS OFRECER LA POSIBILIDAD DE ELEGIR CANTIDAD, EN LUGAR DE SIEMPRE -1
            //AUNQUE NO ESTÁ IMPLEMENTADO AÚN
            if (compra.productos[productoIndex].cantidad<=0){
              //ELIMINAMOS EL PRODUTO PQ NO QUEDAN CANTIDAD A QUITAR
              compra.productos.splice(productoIndex, 1);
            }

            if (compra.productos.length===0)
            {
              //SI LA COMPRA SE QUEDA SIN PRODUCTOS, LA BORRAMOS ENTERA
              await CompraModel.findByIdAndDelete(compra._id);
            }
            else{
              await compra.save();
            }
          }
        }

    }
    return res.status(200).json({mensaje: 'PRODUCTOS ELIMINADOS CORRECTAMENTE DE LAS COMPRAS'});
  }catch(error){
    return res.status(500).json({mensaje: 'ERROR', error});
  }
};

exports.getTodasLasCompras = async (req,res) =>{

  try{


      const compras = await CompraModel.find().populate('clienteId').populate('productos.productoId');
      return res.status(200).json(compras);
      
  }catch (error)
  {
    return res.status(500).json({mensaje: 'Error', error});
  }
}

//SAGIT ELIMINAMOS POR USUARIO
exports.eliminarComprasUsuario= async (req,res) =>{

  try{
    //DEBEMOS RECOGER LA ID DEL USUARIO Y SU ARRAY DE PRODUCTOS
    const {clienteId, productos}=req.body;

    if (!clienteId || !productos || productos.length===0)
    {
      return res.status(400).json({mensaje: 'Error, cliente o productos no encontrado...'});
    }

    //RECORRO PRODUCTOS:
    for (const prod of productos)
    {
      //POR CADA PRODUCTO "prod" buscamos las compras que tienen ese productoId, así no recorremos todas las compras, sino solamente las que tengan esta iD
      /** CompraModel es un método de Mongoose para buscar en la colección de "compras" o como se llame en mongo
       * los objetos que pasamos dentro de las llaves es el filtro del a búsqueda, en este caso en la coleccion tenemos 2 atributos
       * clienteId
       * y un array de productos, para acceder a productoId de cada producto en el array, se hace así: 'productos.productoId
       */
      const compras = await CompraModel.find({clienteId, 'productos.productoId':prod.productoId});

      //sagit ejemplo, si quisiese buscar la ultima compra... const ultimaCompra = await CompraModel.findOne({clienteId}).sort({fecha: -1});


      for (const compra of compras)
      {
        const indice = compra.productos.findIndex(productito=>productito.productoId.toString()===prod.productoId);

        if (indice !==-1)
        {
          compra.productos[indice].cantidad -= prod.cantidad;
          if (compra.productos[indice].cantidad <=0)
          {
            compra.productos.splice(indice, 1);
          }
          if (compra.productos.length===0)
          {
            //LO ELIMINAMOS
            await CompraModel.findByIdAndDelete(compra._id);
          }
          else
          {
            await compra.save();
          }
        }
      }
    }

    return res.status(200).json({mensaje:'TODO OK SOCIO'});
  }
  catch(error){
    return res.status(500).json({mensaje: 'Error',error});
  }
};
