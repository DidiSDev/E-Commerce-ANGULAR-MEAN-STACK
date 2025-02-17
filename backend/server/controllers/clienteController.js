// 3- 

const ClienteModel= require('../models/cliente'); //ESTO SE USARA CMO OBJETO DE CLIENTE PARA LAS GESTIONES DE LOS CONTROLADORES


//REGISTRAR CLIENTE:

/**
 * 10-
 * En registrar usuario hacemos la consulta asyncrona con req y res. lo unico que necesitamos es generar el objeto:
 * const cliente = new ClienteModel(req.body);
 * en try{const existeMail=await ClienteModel.findOne({email:cliente,email}), if(existeMail) ERROR, si no.. await cliente.save() y mostramos que todo ha ido OK SIN NECESIDAD almacenar
 * esta respuesta en una variable y mostrarla en el (200)}catch
 */

exports.registrarUsuario= async(req,res)=>
{
    const cliente=new ClienteModel(req.body);

    console.log(cliente);
    //TRYCATCH
    try
    {   
        //EXISTE EL MAIL?
        const existeMail=await ClienteModel.findOne({email: cliente.email});
        if (existeMail)
        {
            return res.status(400).json({mensaje: 'Ese correo electrónico ya está registrado'});
        }
        //EN CASO CONTRARIO, NO RETORNAMOS, PODEMOS REGISTRAR:

       
        console.log("ESTA ENTRANDO AQUI¿?¿?¿?¿?¿? 17:46"+cliente);
        await cliente.save();

        res.status(201).json({mensaje: '¡Registrado correctamente!'});
    }
    catch(error)
    {
        console.error('ERROR AL REGISTRAR', error);
        res.status(500).json({mensaje: 'ERROR AL REGISTRAR AL CLIENTE'});

    }
};

exports.eliminarArrayClientes = async(req,res)=>{
    const {clientes} = req.body;
    try{


        const eliminar = await ClienteModel.deleteMany({_id: {$in : clientes}});
        return res.status(200).json(eliminar);
    }catch(error)
    {
        return res.status(500).json({mensaje: 'error', error});
    }
}
exports.getClientes = async (req,res)=>{
    try{


        const todosLosClientes = await ClienteModel.find();
        return res.status(200).json(todosLosClientes); //DEVOLVEMOS TODOS LOS CLIENTES QUE HAY REGISTRADOS
    }
    catch(error)
    {
        return res.status(500).json({mensaje: 'error', error});
    }
}



// LOGIN DEL CLIENTE

/**
 * Aquí llegamos porque en clienteRoutes tenemos esto:
 * const clienteController = require('../controllers/clienteController');
router.post('/login', clienteController.login);
Esto significa que desde las rutas, router.post llama en la ruta /login a la funcion login de clienteController
 * 
 * Finalmente, desde el .ts del login, vamos al servicio y el servicio llama a este login, de forma asíncrona recibe un req que es
 * lo que intentamos hacer y dará una res.
 * el req que recibe es usuario y pass, asi que así lo almacenamos con req.body
 * 
 * finalmente hacemos una constante para la respuesta..
 * const cliente = await ClienteModel.findOne({nombre:usuario, password});
 * if (cliente)
 * {
 *  respuesta está OK}, return res.status(200).json(cliente)
 */
exports.login = async (req, res) => {
    const { usuario, password } = req.body;

    // VALIDACIÓN DE CAMPOS VACÍOS
    if (!usuario || !password) 
    {
        console.log("ESTO ES EL LOGIN SOCIO");
        return res.status(400).json({ mensaje: '¡ERROR DEBES RELLENAR TODOS LOS CAMPOS!' });
    }

    try {
        const cliente = await ClienteModel.findOne({ nombre: usuario, password });
        if (!cliente) 
            {
            // EL CLIENTE NO COINCIDE
            return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }
        // ENVIAR EL OBJETO CLIENTE Junto con el mensaje
        res.status(200).json({ mensaje: '¡Conectado!', cliente });
    } catch (error) {
        // DEPURACIÓN
        console.error('ERROR LOGIN', error);
        res.status(500).json({ mensaje: 'ERROR EN LOGIN' });
    }
}

exports.eliminarCliente = async (req,res)=>{
    const {_id} = req.body;

    try{

        const eliminar = await ClienteModel.deleteOne({_id});
    }catch(error)
    {
        return res.status(500).json({mensaje: 'error', error});
    }
}

//LO INTEGRAMOS EN EL INDEX.JS -> 4- 