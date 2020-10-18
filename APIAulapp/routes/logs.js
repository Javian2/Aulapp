const express = require('express');
const router = express.Router();

const { Log } = require('./../sequelize');

var Sequelize = require('sequelize');
const Op = Sequelize.Op

router.get('/', (req, res) => {
    Log.findAll()
        .then(log => {
            res.send(log);
        });
})

router.get('/logIdUsuario/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;
    Log.findAll({ where: { idUsuario: idUsuario } })
        .then(log => {
            res.json(log)
        })

})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Log.create({
        id: req.body.id,
        idUsuario: req.body.idUsuario,
        log: req.body.log,
        ip: req.body.ip
    }).then(log => {
        res.send('Log creado');
    })
})




module.exports = router;