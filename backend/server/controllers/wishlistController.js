const Wishlist = require('../models/wishlist');
const Producto = require('../models/producto');

//CON ESTE AGREGO UN PRODUCTO A LA LISTA DE DESEADOS
exports.agregarDeseado = async (req, res) => {
  const { clienteId, productoId } = req.body;
  try {
    //COMPRUEBO SI ESTÁ O NO AGREGADO
    const existe = await Wishlist.findOne({ clienteId, productoId });
    if (existe) {
      return res.status(400).json({ mensaje: '¡¡Este producto ya está en tu lista de deseados!!' });
    }
    const nuevoDeseo = new Wishlist({ clienteId, productoId });
    await nuevoDeseo.save();
    res.status(201).json({ mensaje: 'Producto agregado a la lista de deseados' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar a la lista de deseados', error });
  }
};

//FUNCIÓN PARA OBTENER MI LISTA DE DESEADOS (YO COMO USUARIO "X")

exports.obtenerWishlistUsuario = async (req, res) => {
    const { clienteId } = req.params;
    try {
      const lista = await Wishlist.find({ clienteId }).populate('productoId', 'nombre imagen precio categoria');
      res.status(200).json(lista);
    } catch (error) {
      res.status(500).json({ mensaje: '¡¡Error al obtener tu lista de deseados!!', error });
    }
  };

//5 PROD MAS DESEADOS EN ORDEN DESC AGRUPANDO X CANTIDAD
exports.obtenerTopDeseados = async (req, res) => {
  try {
    const topDeseados = await Wishlist.aggregate([
      { $group: { _id: "$productoId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },
      {
        $project: {
          _id: 0,
          productoId: "$_id",
          count: 1,
          nombre: "$producto.nombre",
          imagen: "$producto.imagen",
          precio: "$producto.precio",
          categoria: "$producto.categoria"
        }
      }
    ]);
    res.status(200).json(topDeseados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos deseados', error });
  }
};

//CONTROLLER PARA ELIMINAR PRODUCTO DE LA LISTA DE DESEADOS
exports.eliminarDeseado = async (req, res) => {
  const { clienteId, productoId } = req.body;
  try {
    await Wishlist.findOneAndDelete({ clienteId, productoId });
    res.status(200).json({ mensaje: 'Producto eliminado de la lista de deseados' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar de la lista de deseados', error });
  }
};
