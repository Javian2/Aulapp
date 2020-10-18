export class Reserva{
    constructor(
        public idimparte: string,
        public idusuario: string,
        public fecha_inicio: string,
        public fecha_fin: string,
        public id?: string,
        public fecha_solicitud?: string,
        public observacion?: string, 
        public estado?: string,
        public token?: string,
        public createdAt?: string,
        public updatedAt?: string
    )
    {}
}