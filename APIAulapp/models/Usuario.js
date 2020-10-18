module.exports = (sequelize, type) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: type.STRING,
            primaryKey: true
        }, 
        nombre: {
            type: type.STRING
        },
        apellidos: {
            type: type.STRING
        },
        email: {
            type: type.STRING
        },
        fecha_nacimiento: {
            type: type.STRING
        },
        contrasena: {
            type: type.STRING
        },
        descripcion: {
            type: type.STRING
        },
        foto: {
            type: type.STRING
        },
        rol: {
            type: type.STRING
        },
        tokenTemp: {
            type: type.STRING
        },
        verificada: {
            type: type.STRING
        }, 
        video: {
            type: type.STRING
        }
        
    },{
        timestamps: true
    })
    return Usuario
}