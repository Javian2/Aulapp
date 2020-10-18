export class Horario {
    constructor(
        public dia: string,
        public hora_inicio: string,
        public hora_fin: string,
        public idProfesor: string,
        public idhorarios?: string,
        public createdAt?: string,
        public updatedAt?: string,
    ){}
}