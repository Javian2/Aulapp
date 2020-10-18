module.exports = (sequelize, type) => {
    const Factura = sequelize.define('factura', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idLineaFacturas: {
            type: type.STRING,
        },
        precio: {
            type: type.STRING,
        },
        fecha: {
            type: type.STRING,
        }

    },{
        timestamps: true
    })
    return Factura;
}