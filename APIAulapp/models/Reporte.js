module.exports = (sequelize, type) => {
    const Reporte = sequelize.define('reporte', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idReserva: {
            type: type.STRING,
        },
        razon: {
            type: type.STRING,
        },
        comentario: {
            type: type.STRING,
        },
        solucionado: {
            type: type.STRING,
        }

    },{
        timestamps: true
    })
    return Reporte;
}