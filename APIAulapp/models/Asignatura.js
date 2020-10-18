module.exports = (sequelize, type) => {
    const Asignatura = sequelize.define('asignatura', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        nombre: {
            type: type.STRING,
        }

    },{
        timestamps: true
    })
    return Asignatura;
}