module.exports = (sequelize, type) => {
    const Horario = sequelize.define('horario', {
        idhorarios: {
            type: type.STRING,
            primaryKey: true
        }, 
        dia: {
            type: type.STRING,
        },
        hora_inicio: {
            type: type.STRING,
        },
        hora_fin: {
            type: type.STRING,
        },
        idProfesor: {
            type: type.STRING,
        }
    },{
        timestamps: true
    })
    return Horario
}