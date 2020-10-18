const express = require('express');
const router = express.Router();

const {Reporte} = require('./../sequelize');


router.get('/', (req, res) =>{
    Reporte.findAll()
    .then(reportes => {
        res.send(reportes);
    });
})

router.get('/total', (req, res) => {
    Reporte.findAll().then(reportes => {
        res.send(reportes.length.toString());
    })
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Reporte.create({
        id: req.body.id,
        idReserva: req.body.idReserva,
        razon: req.body.razon,
        comentario: req.body.comentario,
        solucionado: req.body.solucionado
    }). then(reportes => {
        res.send('Reporte creado');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Reporte.findOne({where: {id: id}})
        .then(reportes => {
            res.json(reportes)
        })
})

router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Reporte.findAll({ offset: d, limit: 6 })
        .then(reporte => {
            res.send(reporte);
        });
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    let nuevosDatos = req.body
    Reporte.findOne({where: {id: id}})
        .then(reportes => {
            reportes.update(nuevosDatos)
                .then(nuevoReporte => {
                    res.json(nuevoReporte)
                })          
        })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    Reporte.destroy({
        where: {id: id}
    }).then(() => {
        res.send('Reporte Eliminado')
    })
})


module.exports = router;