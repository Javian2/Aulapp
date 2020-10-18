module.exports = (sequelize, type) => {
    const Imparte = sequelize.define('imparte', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idprofesor: {
            type: type.STRING,
        },
        idasignatura: {
            type: type.STRING,
        },
        precio: {
            type: type.STRING,
        },
        nombreProfesor: {
            type: type.STRING,
        },
        nombreAsignatura: {
            type: type.STRING,
        },
        descripcion: {
            type: type.STRING,
        }

    }, {
        timestamps: true
    })
    return Imparte;
}