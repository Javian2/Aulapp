module.exports = (sequelize, type) => {
    const Premium = sequelize.define('prem', {
        idpremium: {
            type: type.STRING,
            primaryKey: true
        },
        idprofesor: {
            type: type.STRING,
        },
        fecha_registro: {
            type: type.STRING,
        },
    },{
        timestamps: true
    })
    return Premium;
}