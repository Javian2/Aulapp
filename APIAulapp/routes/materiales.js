const express = require('express');
const router = express.Router();

const {Material} = require('./../sequelize');


router.get('/', (req, res) =>{
    Material.findAll()
    .then(material => {
        res.send(material);
    });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Material.create({
        id: req.body.id,
        idprof: req.body.idprof,
        idasig: req.body.idasig,
        descripcion: req.body.descripcion
    }). then(material => {
        res.send('Material creado');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Material.findOne({where: {id: id}})
        .then(material => {
            res.json(material)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Material.findOne({where: {id: id}})
        .then(material => {
            material.update(nuevosDatos)
                .then(nuevoMaterial => {
                    res.json(nuevoMaterial)
                })          
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Material.destroy({
        where: {id: id}
    }).then(() => {
        res.send('Material Eliminado')
    })
})


module.exports = router;