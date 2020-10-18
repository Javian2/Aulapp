module.exports = (sequelize, type) => {
    const Profesor = sequelize.define('profesore', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idUsuario: {
            type: type.STRING,
        },
        valoracionMedia: {
            type: type.STRING,
        }

        
    },{
        timestamps: true
    })
    return Profesor
}