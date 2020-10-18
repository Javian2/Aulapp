module.exports = (sequelize, type) => {
    const Alumno = sequelize.define('alumno', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idUsuario: {
            type: type.STRING,
        },
        banner: {
            type: type.STRING
        }


    }, {
        timestamps: true
    })
    return Alumno;
}