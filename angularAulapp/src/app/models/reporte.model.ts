export class Reporte{
    constructor(
        public idReserva: string,
        public razon: string,
        public comentario: string,
        public solucionado: string,
        public id?: string,
        public createdAt?: string,
        public updatedAt?: string
    )
    {}
}