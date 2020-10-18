module.exports = (sequelize, type) => {
    const Notificacion = sequelize.define('notificacione', {
        id: {
            type: type.STRING,
            primaryKey: true
        }, 
        idUsuario: {
            type: type.STRING
        },
        idReserva: {
            type: type.STRING
        },
        visto: {
            type: type.STRING,
        },
        texto: {
            type: type.STRING
        }
    },{
        timestamps: true
    })
    return Notificacion
}