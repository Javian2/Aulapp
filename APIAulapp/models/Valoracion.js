module.exports = (sequelize, type) => {
    const Valoracion = sequelize.define('valoracione', {
        idvaloracion: {
            type: type.STRING,
            primaryKey: true
        }, 
        puntuacion: {
            type: type.STRING
        },
        mensaje: {
            type: type.STRING
        },
        idusuario: {
            type: type.STRING,
        },
        idProfesor: {
            type: type.STRING,
        },
    },{
        timestamps: true
    })
    return Valoracion
}