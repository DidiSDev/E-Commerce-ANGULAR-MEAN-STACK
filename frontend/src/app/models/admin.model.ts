export interface Admin 
{
    id: string;
    nombre: string;
    email: string;
    password?: string; 
    admin: boolean;

    
    //LA INTERROGACIÓN LO Q HACE ES PERMITIR LA FLEXIBILIDDAD DE OBLIGAR A TENER EL ATRIBUTO AL INSTANCIAR EL OBJETO O NO
}

//DEFINE QUE ES UN USUARIO DE TIPO ADMIN. (ESPECIE DE CONSTRUCTOR PARA UNA INTERFACE)
const defaultAdmin: Admin = {
    id: '',
    nombre: '',
    email: '',
    admin: true // Valor predeterminado
  };