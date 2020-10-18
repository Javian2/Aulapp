const express = require('express');
const router = express.Router();

const {LineaFactura} = require('./../sequelize');


router.get('/', (req, res) =>{
    LineaFactura.findAll()
    .then(lineaFactura => {
        res.send(lineaFactura);
    });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    LineaFactura.create({
        id: req.body.id,
        idReserva: req.body.idReserva
    }). then(lineaFactura => {
        res.send('LineaFactura creada');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    LineaFactura.findOne({where: {id: id}})
        .then(lineaFactura => {
            res.json(lineaFactura)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    LineaFactura.findOne({where: {id: id}})
        .then(lineaFactura => {
            lineaFactura.update(nuevosDatos)
                .then(nuevoLineaFactura => {
                    res.json(nuevoLineaFactura)
                })          
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    LineaFactura.destroy({
        where: {id: id}
    }).then(() => {
        res.send('LineaFactura Eliminada')
    })
})


module.exports = router;