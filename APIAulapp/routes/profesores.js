const express = require('express');
const router = express.Router();

const { Profesor } = require('./../sequelize');
const { Usuario } = require('./../sequelize');

// mas funcionalidades para filtrar usuarios
var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', (req, res) => {
    Profesor.findAll()
        .then(profesores => {
            res.send(profesores);
        });
})

router.get('/mejoresValorados', (req, res) => {
    Profesor.findAll({
            limit: 8,
            order: [
                ['valoracionMedia', 'DESC']
            ]
        })
        .then(profesores => {
            res.send(profesores);
        });
})

router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Profesor.findAll({ offset: d, limit: 6 })
        .then(profesores => {
            res.send(profesores);
        });
})

router.get('/total', (req, res) => {
    Profesor.findAll()
        .then(profesores => {
            res.json(profesores.length);
        });

})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Profesor.create({
        id: req.body.id,
        idUsuario: req.body.idUsuario
    }).then(profesor => {
        res.send('Profesor creado');
    })
})


router.get('/:id', (req, res) => {
    let id = req.params.id
    Profesor.findOne({ where: { id: id } })
        .then(profesor => {
            res.json(profesor)
        })
})

//sacar el id de un profesor pasando como parametro el id de un usuario

router.get('/sacarProfesor/:id', (req, res) => {

    let id = req.params.id
    Profesor.findOne({ where: { idUsuario: id } })
        .then(profesor => {
            if (profesor)
                res.json(profesor.id)
        })
})
router.get('/sacarElProfesor/:id', (req, res) => {
    let id = req.params.id
    Profesor.findOne({ where: { idUsuario: id } })
        .then(profesor => {
            res.json(profesor)
        })
})

//Buscar por nombre
router.get('/buscador/:nombre', (req, res) => {
    const nombreUsus = req.params.nombre

    var idProfesores = []
        //var idUsuariosProfes = []
    var profesores = [];

    Usuario.findAll({
        where: {
            'nombre': {
                [Op.substring]: nombreUsus
            }
        },
        order: ['nombre', 'apellidos']
    }).then(usuarios => {
        usuarios.forEach(usuario => {
            idProfesores.push(`${usuario.id}`)
        })
        console.log(idProfesores) // id de los Usuarios encontrados

        //Filtrar idProfesores con idUsuario
        Profesor.findAll({
            where: {
                'idUsuario': idProfesores
            }
        }).then(profesoresResultado => {
            profesoresResultado.forEach(prof => {
                //idUsuariosProfes.push(`${prof.idUsuario}`)
                usuarios.forEach(usu => {
                    if (usu.id == prof.idUsuario) {
                        profesores.push(usu);
                    }
                })

            })
            res.json(profesores);
        })
    })
})


router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Profesor.findOne({ where: { id: id } })
        .then(profesor => {
            profesor.update(nuevosDatos)
                .then(nuevoProfesor => {
                    res.json(nuevoProfesor)
                })
        })
})

router.put('/calcularMedia/:id/:valoracionMedia', (req, res) => {
    let id = req.params.id
    let valoracionMedia = req.params.valoracionMedia;
    let nuevosDatos = req.body
    Profesor.findOne({ where: { id: id } })
        .then(profesor => {
            req.body.valoracionMedia = valoracionMedia;
            profesor.update(nuevosDatos)
                .then(nuevoProfesor => {
                    res.json(nuevoProfesor)
                })
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Profesor.destroy({
        where: { id: id }
    }).then(() => {
        res.send('Profesor Eliminado')
    })
})


module.exports = router;