const express = require('express');
const router = express.Router();

const { Imparte } = require('./../sequelize');
const { Profesor } = require('./../sequelize');
const { Usuario } = require('./../sequelize');

var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', (req, res) => {
    Imparte.findAll()
        .then(imparte => {
            res.send(imparte);
        });
})

router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Imparte.findAll({ offset: d, limit: 6 })
        .then(imparte => {
            res.send(imparte);
        });
})

router.get('/total', (req, res) => {
    Imparte.findAll()
        .then(imparte => {
            res.json(imparte.length);
        });

})
router.post('/nuevo', (req, res) => {
    // console.log(req.body);
    Imparte.create({
        id: req.body.id,
        idprofesor: req.body.idprofesor,
        idasignatura: req.body.idasignatura,
        precio: req.body.precio,
        nombreProfesor: req.body.nombreProfesor,
        nombreAsignatura: req.body.nombreAsignatura,
        descripcion: req.body.descripcion
    }).then(imparte => {
        res.send('Imparte creado');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Imparte.findOne({ where: { id: id } })
        .then(imparte => {
            res.json(imparte)
        })
})

//con el id de un profesor obtenemos las asignaturas
router.get('/sacarAsignaturas/:id', (req, res) => {
    let id = req.params.id
    let variable = new Array();
    Imparte.findAll({ where: { idprofesor: id } })
        .then(imparte => {

            for (let i = 0; i < imparte.length; i++) {
                variable.push(imparte[i])
            }
            res.json(variable)
        })
})

//con el id de un profesor obtenemos las asignaturas
router.get('/profesor/:idprofesor', (req, res) => {
    let idprofesor = req.params.idprofesor
    let variable = new Array();
    Imparte.findAll({ where: { idprofesor: idprofesor } })
        .then(imparte => {

            for (let i = 0; i < imparte.length; i++) {
                variable.push(imparte[i])
            }
            res.json(variable)
        })
})


router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Imparte.findOne({ where: { id: id } })
        .then(imparte => {
            imparte.update(nuevosDatos)
                .then(nuevoImparte => {
                    res.json(nuevoImparte)
                })
        })
})



router.delete('/:id', (req, res) => {
    let id = req.params.id
    Imparte.destroy({
        where: { id: id }
    }).then(() => {
        res.send('Imparte Eliminado')
    })
})




//Buscar por nombre
/* 
router.get('/buscador/:nombre', (req, res) => {
    const nombreUsus = req.params.nombre

    var idProfesores = []
    var idProfesImparten = []
    var idProfesImpartenFiltrados = []

    Usuario.findAll({
        where: {
            'nombre': {
                [Op.substring]: nombreUsus
            }
        }
    }).then(usuarios => {
        usuarios.forEach(usuario => {
                idProfesores.push(`${usuario.id}`)
            })
            //console.log(idProfesores) // id de los Usuarios encontrados

        Imparte.findAll().then(imparten => {

            imparten.forEach(profsimparten => {
                    idProfesImparten.push(`${profsimparten.idprofesor}`)
                })
                //console.log(idProfesImparten);
                //console.log("Id usuario" + idProfesores)

            Profesor.findAll({
                where: {
                    'id': idProfesImparten
                }
            }).then(prf => {
                prf.forEach(prfs => {
                    idProfesImpartenFiltrados.push(`${prfs.idUsuario}`)
                })

                //Filtra los profesores que estan en imparte y los usuarios
                idProfesImpartenFiltrados.find((valor) => {
                    return valor == idProfesores;
                });

                console.log(idProfesImpartenFiltrados);


                Usuario.findAll({
                    where: {
                        'id': idProfesImpartenFiltrados
                    },
                    order: ['nombre', 'apellidos']
                }).then(final => {
                    res.json(final)
                })
            })

        })

    })

}); */

//Busca en imparte todos los resultados que tengan la asignatura que se le pasa por parametro
router.get('/buscadorAsignatura/:asignatura', (req, res) => {
    const asignatura = req.params.asignatura;

    Imparte.findAll({
        where: {
            'nombreAsignatura': {
                [Op.substring]: asignatura
            }
        }
    }).then(impartes => {
        res.json(impartes);
    });

});

//borrar imparte pasando idusuario e idasignatura
router.delete('/borrar/:idprofesor/:idasignatura', (req, res) => {
    let idprofesor = req.params.idprofesor;
    let idasignatura = req.params.idasignatura;
    Imparte.destroy({
        where: {
            idprofesor: idprofesor,
            idasignatura : idasignatura
        }
    }).then(() => {
        res.send('Imparte Eliminado')
    })
})

//Buscar imparte pasandole idprofesor e idasignatura
router.get('/profesorAsignatura/:idprofesor/:asignatura', (req, res) => {
    const idprofesor = req.params.idprofesor;
    const asignatura = req.params.asignatura;

    Imparte.findOne({
        where: {
            'nombreAsignatura': asignatura,
            'idprofesor': idprofesor,
        }
    }).then(impartes => {
        res.json(impartes);
    });

});

module.exports = router;