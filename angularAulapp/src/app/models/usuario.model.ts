export class Usuario {
    constructor(
    public email: string,
    public contrasena: string,
    public nombre: string,
    public apellidos?: string,
    public fecha_nacimiento?: string,
    public rol?: string,
    public foto?: string,
    public id?: string,
    public descripcion?: string,
    public tokenTemp?: string,
    public verificada?: string,
    public video?: string,
    public createdAt?: string,
    public updatedAt?: string,
    ){}
}