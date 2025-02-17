const Valoracion = require('../models/valoracion');
const Compra = require('../models/compra');

//HACER VALORACION
exports.agregarValoracion = async (req, res) => {
  const { clienteId, productoId, comentario, estrellas } = req.body;
  try {
    //OBLIGATORIO QUE LO HAYA COMPRADO AL MENOS 1 VEZ
    const compra = await Compra.findOne({ clienteId, 'productos.productoId': productoId });
    if (!compra) {
      return res.status(400).json({ mensaje: 'No has comprado este producto, no puedes valorarlo' });
    }
    //SI EXISTE VALORACIÓN PODEMOS MODIFICARLA (UNNA POR CLIENTE)
    let valoracion = await Valoracion.findOne({ clienteId, productoId });
    if (valoracion) {
      valoracion.comentario = comentario;
      valoracion.estrellas = estrellas;
    } else {
      valoracion = new Valoracion({ clienteId, productoId, comentario, estrellas });
    }
    await valoracion.save();
    res.status(201).json({ mensaje: '¡Valoración añadida correctamente!' });
  } catch (error) {
    res.status(500).json({ mensaje: '¡¡Error al agregar la valoración!!', error });
  }
};

//PROMEDIO DE VALORACIONES ¿?
exports.obtenerValoracionPromedio = async (req, res) => {
  const { productoId } = req.params;
  try {
    const valoraciones = await Valoracion.find({ productoId });
    if (valoraciones.length === 0) {
      return res.status(200).json({ promedio: 0, totalValoraciones: 0 });
    }
    const total = valoraciones.reduce((acc, curr) => acc + curr.estrellas, 0);
    const promedio = total / valoraciones.length;
    res.status(200).json({ promedio, totalValoraciones: valoraciones.length });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la media de valoraciones', error });
  }
};
exports.obtenerTodasValoraciones = async (req, res) => {
  try {
    //TODAS LAS VALORACIONES Y POPULO clienteId y nombre
    const valoraciones = await Valoracion.find() //POPULO PARA MOSTRAR ESTOS DATOS (Y TENER LA ID DEL CLIENTE) EN EL FRONTEND
    .populate('clienteId', 'nombre')
    .populate('productoId', 'nombre imagen');
  
    res.status(200).json(valoraciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener todas las valoraciones', error });
  }
};

//TODAS LAS VALORACIONES DEL PRODUCTO "X"
exports.obtenerValoracionesProducto = async (req, res) => {
  const { productoId } = req.params;
  try {
    const valoraciones = await Valoracion.find({ productoId: productoId }) //LO MISMO, POPULO TODO POR SI ES NECESARIO
      .populate('clienteId', 'nombre')
      .populate('productoId', 'nombre imagen');
  
    res.status(200).json(valoraciones);
  } catch (error) {
    res.status(500).json({ mensaje: '¡¡Error al obtener las valoraciones!!', error });
  }
};

