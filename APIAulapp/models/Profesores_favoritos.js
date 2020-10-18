module.exports = (sequelize, type) => {
    const ProfesoresFavoritos = sequelize.define('profesores_favorito', {
        id: {
            type: type.STRING,
            primaryKey: true
        },
        idprofesor: {
            type: type.STRING,

        },
        idusuario: {
            type: type.STRING,
        }
    }, {
        timestamps: true
    })
    return ProfesoresFavoritos
}