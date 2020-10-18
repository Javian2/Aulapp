const express = require('express');
const router = express.Router();

const { ProfesoresFavoritos } = require('./../sequelize');


router.get('/', (req, res) => {
    ProfesoresFavoritos.findAll()
        .then(profesoresFavoritos => {
            res.send(profesoresFavoritos);
        });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    ProfesoresFavoritos.create({
        id: req.body.id,
        idprofesor: req.body.idprofesor,
        idusuario: req.body.idusuario
    }).then(profesoresFavoritos => {
        res.send('Profesor favorito creado');
    })
})

router.get('/sacarporusu/:id', (req, res) => {
    let id = req.params.id
    ProfesoresFavoritos.findAll({ where: { idusuario: id } })
        .then(profesoresFavoritos => {
            res.json(profesoresFavoritos)
        })
})
router.get('/:id', (req, res) => {
    let id = req.params.id
    ProfesoresFavoritos.findOne({ where: { id: id } })
        .then(profesoresFavoritos => {
            res.json(profesoresFavoritos)
        })
})

router.put('/:id', (req, res) => {
    let profesoresFavoritosId = req.params.id
    let nuevosDatos = req.body
    ProfesoresFavoritos.findOne({ where: { id: profesoresFavoritosId } })
        .then(profesoresFavoritos => {
            profesoresFavoritos.update(nuevosDatos)
                .then(nuevoProfesoresFavoritos => {
                    res.json(nuevoProfesoresFavoritos)
                })
        })
})

router.delete('/:id', (req, res) => {
    let profesoresFavoritosId = req.params.id
    ProfesoresFavoritos.destroy({
        where: { id: profesoresFavoritosId }
    }).then(() => {
        res.send('Profesor favorito eliminado')
    })
})

router.delete('/profesor/:idprofesor', (req, res) => {
    let profesoresFavoritosId = req.params.idprofesor
    ProfesoresFavoritos.destroy({
        where: { idprofesor: profesoresFavoritosId }
    }).then(() => {
        res.send('Profesor favorito eliminado')
    })
})


module.exports = router;