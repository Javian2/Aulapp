const express = require('express');
const router = express.Router();

const {Premium} = require('./../sequelize');

router.get('/', (req, res) =>{
    Premium.findAll()
    .then(premium => {
        res.send(premium);
    });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Premium.create({
        idpremium: req.body.idpremium,
        idprofesor: req.body.idprofesor, 
        fecha_registro: req.body.fecha_registro
    }). then(premium => {
        res.send('Premium creado');
    })
})

router.get('/:idpremium', (req, res) => {
    let idpremium = req.params.idpremium
    Premium.findOne({where: {idpremium: idpremium}})
        .then(premium => {
            res.json(premium)
        })
})

router.put('/:idpremium', (req, res) => {
    let premiumId = req.params.idpremium
    let nuevosDatos = req.body
    Premium.findOne({where: {idpremium: premiumId}})
        .then(premium => {
            premium.update(nuevosDatos)
                .then(nuevoPremium => {
                    res.json(nuevoPremium)
                })          
        })
})

router.delete('/:idpremium', (req, res) => {
    let idpremium = req.params.idpremium;
    Premium.destroy({
        where: {idpremium: idpremium}
    }).then(() => {
        res.send('Premium eliminado')
    })
})


module.exports = router;