const express = require('express');
const router = express.Router();

const { Asignatura } = require('./../sequelize');

// mas funcionalidades para filtrar
var Sequelize = require('sequelize');
const Op = Sequelize.Op

router.get('/', (req, res) => {
    Asignatura.findAll()
        .then(asignatura => {
            res.send(asignatura);
        });
})
router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Asignatura.findAll({ offset: d, limit: 6 })
        .then(asignatura => {
            res.send(asignatura);
        });
})

router.get('/total', (req, res) => {
    Asignatura.findAll()
        .then(asignatura => {
            res.json(asignatura.length);
        });

})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Asignatura.create({
        id: req.body.id,
        nombre: req.body.nombre
    }).then(asignatura => {
        res.send('Asignatura creada');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Asignatura.findOne({ where: { id: id } })
        .then(asignatura => {
            res.json(asignatura)
        })
})

//Buscar por nombre
router.get('/buscador/:nombre', (req, res) => {
    const nombreAsignatura = req.params.nombre

    Asignatura.findAll({
        where: {
            'nombre': {
                [Op.substring]: nombreAsignatura
            }
        }
    }).then(asignatura => {
        res.json(asignatura)
    })
})





router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Asignatura.findOne({ where: { id: id } })
        .then(asignatura => {
            asignatura.update(nuevosDatos)
                .then(nuevoAsignatura => {
                    res.json(nuevoAsignatura)
                })
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Asignatura.destroy({
        where: { id: id }
    }).then(() => {
        res.send('Asignatura Eliminada')
    })
})


module.exports = router;