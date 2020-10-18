export class Notificacion{
    constructor(
        public idUsuario: string,
        public idReserva: string,
        public visto: string,
        public texto: string, 
        public id?: string,
        public createdAt?: string,
        public updatedAt?: string
    )
    {}
}