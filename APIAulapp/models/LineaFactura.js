module.exports = (sequelize, type) => {
    const LineaFactura = sequelize.define('linea_Factura', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idReserva: {
            type: type.STRING,
        }

    },{
        timestamps: true
    })
    return LineaFactura;
}