const express = require('express');
const router = express.Router();

const { Horario } = require('./../sequelize');


router.get('/', (req, res) => {
    Horario.findAll()
        .then(horarios => {
            res.send(horarios);
        });
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Horario.create({
        idhorarios: req.body.idhorarios,
        dia: req.body.dia,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        idProfesor: req.body.idProfesor
    }).then(horario => {
        res.send('Horario creado');
    })
})

router.get('/:idhorarios', (req, res) => {
    let idhorarios = req.params.idhorarios;
    Horario.findOne({ where: { idhorarios: idhorarios } })
        .then(horario => {
            res.json(horario)
        })
})

//Recuperar horarios de un profesor con idProfesor
router.get('/profesor/:idprofesor', (req, res) => {
    let idprof = req.params.idprofesor;
    Horario.findAll({ where: { idProfesor: idprof } })
        .then(horario => {
            res.json(horario)
        })
})

//Recuperar horas de un profesor con idProfesor y dia de la semana
router.get('/horasProfesor/:idprofesor/:dia', (req, res) => {
    let diaSemana = req.params.dia;
    let idprof = req.params.idprofesor;
    console.log(diaSemana);

    Horario.findAll({
            where: { idProfesor: idprof, dia: diaSemana },
            order: ['hora_inicio']
        })
        .then(horas => {
            res.json(horas)
        })
})

router.put('/:idhorarios', (req, res) => {
    let horarioId = req.params.idhorarios
    let nuevosDatos = req.body
    Horario.findOne({ where: { idhorarios: horarioId } })
        .then(horario => {
            horario.update(nuevosDatos)
                .then(nuevoHorario => {
                    res.json(nuevoHorario)
                })
        })
})

router.delete('/:idhorarios', (req, res) => {
    let horarioId = req.params.idhorarios
    Horario.destroy({
        where: { idhorarios: horarioId }
    }).then(() => {
        res.send('Horario eliminado')
    })
})


module.exports = router;