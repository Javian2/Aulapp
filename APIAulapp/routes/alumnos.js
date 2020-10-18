const express = require('express');
const router = express.Router();

const { Alumno } = require('./../sequelize');
const { Usuario } = require('./../sequelize');

var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', (req, res) => {
    Alumno.findAll()
        .then(alumno => {
            res.send(alumno);
        });
})
router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Alumno.findAll({ offset: d, limit: 6 })
        .then(alumno => {
            res.send(alumno);
        });
})

router.get('/total', (req, res) => {
    Alumno.findAll()
        .then(alumno => {
            res.json(alumno.length);
        });

})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Alumno.create({
        id: req.body.id,
        idUsuario: req.body.idUsuario
    }).then(alumno => {
        res.send('Alumno creado');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Alumno.findOne({ where: { id: id } })
        .then(alumno => {
            res.json(alumno)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Alumno.findOne({ where: { id: id } })
        .then(alumno => {
            alumno.update(nuevosDatos)
                .then(nuevoAlumno => {
                    res.json(nuevoAlumno)
                })
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Alumno.destroy({
        where: { id: id }
    }).then(() => {
        res.send('Alumno Eliminado')
    })
})
router.get('/sacarElAlumno/:id', (req, res) => {
    let id = req.params.id
    Alumno.findOne({ where: { idUsuario: id } })
        .then(alumno => {
            res.json(alumno)
        })
})

router.get('/buscador/:nombre', (req, res) => {
    const nombreUsus = req.params.nombre

    var idAlumnos = []
        //var idUsuariosProfes = []
    var alumnos = [];

    Usuario.findAll({
        where: {
            'nombre': {
                [Op.substring]: nombreUsus
            }
        },
        order: ['nombre', 'apellidos']
    }).then(usuarios => {
        usuarios.forEach(usuario => {
            idAlumnos.push(`${usuario.id}`)
        })
        console.log(idAlumnos) // id de los Usuarios encontrados

        //Filtrar idAlumnos con idUsuario
        Alumno.findAll({
            where: {
                'idUsuario': idAlumnos
            }
        }).then(alumnosResultado => {
            alumnosResultado.forEach(alu => {
                usuarios.forEach(usu => {
                    if (usu.id == alu.idUsuario) {
                        alumnos.push(usu);
                    }
                })

            })
            res.json(alumnos);
        })
    })
})

router.put('/:id', (req, res) => {
    let aluId = req.params.id
    let nuevosDatos = req.body
    Alumno.findOne({ where: { id: aluId } })
        .then(alumnos => {
            alumnos.update(nuevosDatos)
                .then(nuevoUsuario => {
                    res.json(nuevoUsuario)
                })
        });
});

module.exports = router;