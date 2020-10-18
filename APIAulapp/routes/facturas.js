const express = require('express');
const router = express.Router();

const {Factura} = require('./../sequelize');


router.get('/', (req, res) =>{
    Factura.findAll()
    .then(factura => {
        res.send(factura);
    });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Factura.create({
        id: req.body.id,
        idLineaFacturas: req.body.idLineaFacturas,
        precio: req.body.precio,
        fecha: req.body.fecha
    }). then(factura => {
        res.send('Factura creada');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Factura.findOne({where: {id: id}})
        .then(factura => {
            res.json(factura)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Factura.findOne({where: {id: id}})
        .then(factura => {
            factura.update(nuevosDatos)
                .then(nuevoFactura => {
                    res.json(nuevoFactura)
                })          
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Factura.destroy({
        where: {id: id}
    }).then(() => {
        res.send('Factura Eliminada')
    })
})


module.exports = router;