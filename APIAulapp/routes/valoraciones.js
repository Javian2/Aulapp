const express = require('express');
const router = express.Router();

const {Valoracion} = require('./../sequelize');



router.get('/', (req, res) =>{
    Valoracion.findAll()
    .then(valoraciones => {
        res.send(valoraciones);
    });
})

router.get('/total', (req, res) => {
    Valoracion.findAll().then(valoraciones => {
        res.send(valoraciones.length.toString());
    })
})


router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Valoracion.create({
        idvaloracion: req.body.idvaloracion,
        puntuacion: req.body.puntuacion, 
        mensaje: req.body.mensaje, 
        idusuario: req.body.idusuario,
        idProfesor: req.body.idProfesor
    }). then(valoracion => {
        res.send('Valoración creada');
    })
})

router.get('/:idvaloracion', (req, res) => {
    let idvaloracion = req.params.idvaloracion
    Valoracion.findOne({where: {idvaloracion: idvaloracion}})
        .then(valoracion => {
            res.json(valoracion)
        })
})

router.get('/ValoracionProfe/:idProfesor', (req, res) => {
    let idProfesor = req.params.idProfesor
    Valoracion.findAll({where: {idProfesor: idProfesor}})
        .then(valoracion => {
            res.json(valoracion)
        })
})

router.put('/:idvaloracion', (req, res) => {
    let valoracionId = req.params.idvaloracion
    let nuevosDatos = req.body
    Valoracion.findOne({where: {idvaloracion: valoracionId}})
        .then(valoracion => {
            valoracion.update(nuevosDatos)
                .then(nuevaValoracion => {
                    res.json(nuevaValoracion)
                })          
        })
})

router.delete('/:idvaloracion', (req, res) => {
    let valoracionId = req.params.idvaloracion
    Valoracion.destroy({
        where: {idvaloracion: valoracionId}
    }).then(() => {
        res.send('Valoracion eliminada')
    })
})

router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Valoracion.findAll({ offset: d, limit: 6 })
        .then(valoracion => {
            res.send(valoracion);
        });
})


module.exports = router;