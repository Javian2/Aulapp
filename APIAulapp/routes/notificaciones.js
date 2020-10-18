const express = require('express');
const router = express.Router();

const {Notificacion} = require('./../sequelize');


router.get('/', (req, res) =>{
    Notificacion.findAll()
    .then(notificaciones => {
        res.send(notificaciones);
    });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Notificacion.create({
        id: req.body.id,
        idUsuario: req.body.idUsuario, 
        idReserva: req.body.idReserva, 
        visto: req.body.visto, 
        texto: req.body.texto
    }). then(notificacion => {
        res.send('Notificacion creada');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Notificacion.findOne({where: {id: id}})
        .then(notificacion => {
            res.json(notificacion)
        })
})

router.get('/NotisUsuario/:idusuario', (req, res) => {
    let id = req.params.idusuario
    Notificacion.findAll({where: {idUsuario: id}})
        .then(notificacion => {
            res.json(notificacion)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Notificacion.findOne({where: {id: id}})
        .then(notificacion => {
            notificacion.update(nuevosDatos)
                .then(nuevaNotificacion => {
                    res.json(nuevaNotificacion)
                })          
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Notificacion.destroy({
        where: {id: id}
    }).then(() => {
        res.send('Notificación eliminada')
    })
})

router.delete('/NotisUsuario/:idusuario', (req, res) =>{
    let id = req.params.idusuario;
    Notificacion.destroy({
        where: {idUsuario: id}
    }).then(() => {
        res.send('Notificaciones eliminadas')
    })
})


module.exports = router;