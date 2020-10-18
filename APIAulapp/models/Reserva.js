module.exports = (sequelize, type) => {
    const Reserva = sequelize.define('reserva', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idimparte: {
            type: type.STRING
        },
        idusuario: {
            type: type.STRING
        },
        fecha_solicitud: {
            type: type.STRING,
        },
        observacion: {
            type: type.STRING
        },
        estado: {
            type: type.STRING
        },
        fecha_inicio: {
            type: type.STRING
        },
        fecha_fin: {
            type: type.STRING
        },
        token: {
            type: type.STRING
        },
    }, {
        timestamps: true
    })
    return Reserva
}