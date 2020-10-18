module.exports = (sequelize, type) => {
    const Material = sequelize.define('materiale', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idprof: {
            type: type.STRING,
        },
        idasig: {
            type: type.STRING,
        },
        descripcion:{
            type: type.STRING
        }

    },{
        timestamps: true
    })
    return Material;
}