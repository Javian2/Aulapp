module.exports = (sequelize, type) => {
    const Log = sequelize.define('log', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idUsuario: {
            type: type.STRING,
        },
        log: {
            type: type.STRING,
        },
        ip: {
            type: type.STRING,
        }
    },{
        timestamps: true
    })
    return Log;
}