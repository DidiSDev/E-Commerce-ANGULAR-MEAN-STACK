export interface Cliente 
{
    _id?: string | null;

    nombre: string;
    email: string;
    password?: string;
    admin?:boolean
    //LA INTERROGACIÓN LO Q HACE ES PERMITIR LA FLEXIBILIDDAD DE OBLIGAR A TENER EL ATRIBUTO AL INSTANCIAR EL OBJETO O NO
}

