//MANEJO DE CRUD PARA PRODUCTO (crear, leer, actualizar y eliminar)

const Producto = require('../models/producto'); //IMPORTAMOS DESDE MODELS

//AQUI RECOGEMOS TODOSS LOS PRODUCTOS, de forma asíncrona y ordenada
//ES DECIR, RECUPERAMOS TODOS LOS PRODUCTOS DE LA BBDD Y LOS ENVIAMOS COMO RESPUESTA JSON 
exports.obtenerProductos = async (req,res) => {
    try{
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch(error)
    {
        res.status(500).json({mensaje: "Error al obtener productos", error});
    }
};

//IMAGINO Q PARA HACER COSAS LO MEJOR ES USAR ID, ASI QUE USAMOS EL "RECOGIMIENTO" DE LOS PRODUCTOS POR ID

exports.obtenerProductosPorId = async(req,res)=>
{
    try
    {
        const producto = await Producto.findById(req.params.id); //EN PRODUCTO GUARDAFMOS EL PRODUCTO BUSCADO POR ID
        if (!producto)
        {
            return res.status(404).json({mensaje: "Producto NO encontrado"});
        }
        res.status(200).json(producto);
    }catch(error)
    {
        res.status(500).json({mensaje: "Error al obtener el producto", error});
    }
};

//CREAR PRODUCTO
exports.crearProducto = async(req,res) =>
{
    const { nombre, descr, stock, precio, imagen, categoria } = req.body;
    try
    {
        
        const producto = new Producto({ nombre, descr, stock, precio, imagen, categoria });
        const guardar = await producto.save();
        res.status(201).json(guardar);
    }catch(error)
    {
        console.error('Error al crear el producto:', error); // Agregar este console.error
        res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
};

exports.actualizarProducto = async (req,res)=>
{
    try
    {
        const productoActualizado=await Producto.findByIdAndUpdate(req.params.id, req.body,{ //BUSCAMOS POR ID, REQUERIMOS SU ID Y SU BODY (ES DECIR, TODOS SUS ATRIBUTOS)
            new:true
        });
        if (!productoActualizado)
        {
            return res.status(404).json({mensaje: "Producto NO encontrado"});
        }
        res.status(200).json(productoActualizado);
    }catch(error)
    {
        res.status(500).json({mensaje: "Error al actualizar el producto", error});
    }
};

exports.eliminarProducto =async(req,res)=>
{
    try
    {
        const productoEliminado=await Producto.findByIdAndDelete(req.params.id); //COMO AQUI QUEREMOS ELIMINAR, CON LLAMAR A LA ID ME VALE
        if (!productoEliminado) return res.status(404).json({mensaje:"Producto NO encontrado"});
        res.status(200).json({mensaje:"Producto eliminado correctamente"});

    }catch(error)
    {
        res.status(500).json({mensaje: "Error al eliminar el producto", error});
    }
};

exports.listarPorCategoria = async (req,res)  =>{

    const { categoria } = req.params
    try{
        const listar= await Producto.find({categoria});
        if (listar.length ===0)
        {
            return res.status(404).json({mensaje: 'Error, no existe esa categoria'});
        }

       
        res.status(200).json(listar);
       

            
    }catch (error)
    {
        res.status(500).json({mensaje: 'Error', error});
    }
}

//Ahora nos toca ir a las rutas, que es donde se vinculan estos controladores ... routes/productoRoutes.js