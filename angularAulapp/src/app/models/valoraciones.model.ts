export class Valoracion {
    constructor(
    public puntuacion: string,
    public mensaje: string,
    public idusuario: string,
    public idProfesor: string,
    public createdAt?: string,
    public updatedAt?: string,
    ){}
}