const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var SEED = require('../config/config').SEED;

const { Reserva } = require('./../sequelize');
const { Profesor } = require('./../sequelize');
const { Imparte } = require('./../sequelize');
const { Usuario } = require('./../sequelize');

var Sequelize = require('sequelize');
const Op = Sequelize.Op


router.get('/', (req, res) => {
    Reserva.findAll()
        .then(reservas => {
            res.send(reservas);
        });
})

router.get('/total', (req, res) => {
    Reserva.findAll().then(reservas => {
        res.send(reservas.length.toString());
    })
})

router.post('/nuevo', (req, res) => {
    console.log(req.body);
    Reserva.create({
        id: req.body.id,
        idimparte: req.body.idimparte,
        idusuario: req.body.idusuario,
        fecha_solicitud: req.body.fecha_solicitud,
        observacion: req.body.observacion,
        estado: req.body.estado,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin
    }).then(reserva => {
        res.send('Reserva creada');
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Reserva.findOne({ where: { id: id } })
        .then(reserva => {
            res.json(reserva)
        })
})

//obtener reservas pasando el usuario que la realiza
router.get('/alumnos/:id', (req, res) => {
    let idusuario = req.params.id
    Reserva.findAll({ where: { idusuario: idusuario } })
        .then(reserva => {
            res.json(reserva)
        })
})

//obtener reservas pasando el idimparte
router.get('/impartes/:idimparte', (req, res) => {
    let idimparte = req.params.idimparte
    Reserva.findAll({ where: { idimparte: idimparte } })
        .then(reserva => {
            res.json(reserva)
        })
})

router.put('/:id', (req, res) => {
    let reservaId = req.params.id
    let nuevosDatos = req.body
    Reserva.findOne({ where: { id: reservaId } })
        .then(reserva => {
            reserva.update(nuevosDatos)
                .then(nuevaReserva => {
                    res.json(nuevaReserva)
                })
        })
})

router.put('/aceptarReserva/:id/:email/:nombreProfesor/:nombreAsignatura', (req, res) => {
    let idreserva = req.params.id
    let email = req.params.email
    let nombreProfesor = req.params.nombreProfesor
    let nombreAsignatura = req.params.nombreAsignatura


    let nuevosDatos = req.body
    Reserva.findOne({ where: { id: idreserva } })
        .then(reserva => {
            nuevosDatos.estado = "aceptada"

            //Datos de nuestro correo
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true para 465, falso para otros puertos
            auth: {
                user: 'abp.inkwell@gmail.com',
                pass: 'inkaulapp@2.'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let emailOptions = {
            from: '"Inkwell" <abp.inkwell@gmail.com>',
            to: email, // CAMBIAR AL CORREO DEL USUARIO QUE SE REGISTRE
            subject: "¡"+nombreProfesor+" ha aceptado tu solicitud de clase!", // Subject line
            text: "¡Un profesor ha aceptado tu clase!", // plain text body
            html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <title>¡Un profesor ha aceptado tu clase!</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    footer { text-align: center; font-size: 13px;}
                    footer>a { font-size: 14px; text-decoration: none; margin-right: 20px; font-weight: bold; }
            
                    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    table { border-collapse: collapse !important; }
                    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
  
                    header{
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    }
  
                    header>div:first-of-type{
                      margin-right: 1em;
                    }
  
  
            
                    u + #body a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                    }
                    #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                    }
            
                    a { color: #B200FD; font-weight: 600; text-decoration: underline; }
                    a:hover { color: #000000 !important; text-decoration: none !important; }
                    a.button:hover { color: #ffffff !important; background-color: #000000 !important; }
            
                    @media screen and (min-width:600px) {
                        h1 { font-size: 48px !important; line-height: 48px !important; }
                        .intro { font-size: 24px !important; line-height: 36px !important; }
                    }
                </style>
              </head>
              <body style="margin: 0 !important; padding: 0 !important;">
                <div role="article" aria-label="An email from Your Brand Name" lang="en" style="background-color: white; color: #2b2b2b; font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 18px; font-weight: 400; line-height: 28px; margin: 0 auto; max-width: 720px; padding: 40px 20px 40px 20px;">
                    <header>
                        
                      <div><center><img src="https://i.ibb.co/2gBw75x/logoalternativo.png" alt="" height="80" width="80"></center></div>
                        
                      <div><h1 style="color: #000000; font-size: 32px; font-weight: 800; line-height: 32px; margin: 20px 10; text-align: center;">
                            Aulapp
                      </h1></div>
  
                    </header>
                    <main>
                            <h2 style="color: #000000; font-size: 28px; font-weight: 600; line-height: 32px; margin: 48px 0 24px 0; text-align: center;">
                            ¡Buenas noticias! `+nombreProfesor+` ha aceptado tu solicitud de clase. 🎉
                        </h2>
                        <center><p>Tu solicitud de clase a `+nombreProfesor+` para la asignatura de `+nombreAsignatura+` ha sido aceptada. 
                        Accede ahora mismo a la aplicación para ver más información sobre la reserva con este profesor.</p> 
                            <div style="margin: 48px 0;">
                                <a class="button" href="https://aulapp.ovh"
                                style="background-color:#5727ac;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:18px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:300px;-webkit-text-size-adjust:none;">Acceder a Aulapp</a>
                            </div>

                        </center>
                        <p style="color: grey; font-size: 14px;">¿No sabes de qué estamos hablando? ¡Que no cunda el pánico! Si no te has registrado en esta
                    aplicación, simplemente ignora este mensaje y ya nos encargaremos de eliminar tu email de nuestros datos. Puedes consultar más información
                    aquí: <a href='https://aulapp.ovh/inkwell/politica-de-privacidad/' target='_blank'>Politica de Privacidad</a>.
                        </p>
                        <img alt="" src="https://storage.pardot.com/31032/208019/product_2x.png" width="600" border="0" style="border-radius: 4px; display: block; max-width: 100%; min-width: 100px; width: 100%;">
                    </main>
                    <footer>
                        <hr>
                &copy; 2020 Inkwell Corp.<br>
                         <a href="https://www.instagram.com/inkwellabp/" target="_blank">Instagram</a>
                        <a  href="https://twitter.com/inkwellabp/" target="_blank">Twitter</a>
                        <a href="mailto:abp.inkwell@gmail.com" target="_blank">E-mail</a>
                    </footer>
            
                </div>
              </body>
            </html>` // html body
        };

        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });




            reserva.update(nuevosDatos)
                .then(nuevaReserva => {
                    res.json(nuevaReserva)
                })
        })
});

router.put('/pagarReserva/:id', (req, res) => {
    let idreserva = req.params.id
    let nuevosDatos = req.body
    Reserva.findOne({ where: { id: idreserva } })
        .then(reserva => {
            nuevosDatos.token = null
            nuevosDatos.estado = "pagada"
            reserva.update(nuevosDatos)
                .then(nuevaReserva => {
                    res.json(nuevaReserva)
                });
        });
});

router.put('/rechazarReserva/:id', (req, res) => {
    let idreserva = req.params.id
    let nuevosDatos = req.body
    Reserva.findOne({ where: { id: idreserva } })
        .then(reserva => {
            nuevosDatos.estado = "rechazada"
            reserva.update(nuevosDatos)
                .then(nuevaReserva => {
                    res.json(nuevaReserva)
                })
        })
})

router.delete('/:id', (req, res) => {
    let reservaId = req.params.id
    Reserva.destroy({
        where: { id: reservaId }
    }).then(() => {
        res.send('Reserva eliminada')
    })
})

router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Reserva.findAll({ offset: d, limit: 6 })
        .then(reserva => {
            res.send(reserva);
        });
})

router.put('/crearToken/:id', (req, res) => {
    let idreserva = req.params.id
    let nuevodatos = req.body;

    var usuarios = [];
    var imparte = [];
    var profesor = [];
    var usuario2 = [];


    Reserva.findOne({ where: { id: idreserva } })
        .then((reservas) => {

            Usuario.findOne({ where: { id: reservas.idusuario } })
                .then((usu) => {
                    usuarios.push(usu);

                    Imparte.findOne({ where: { id: reservas.idimparte } })
                        .then((imp) => {
                            imparte.push(imp);

                            Profesor.findOne({ where: { id: imp.idprofesor } })
                                .then((prof) => {
                                    profesor.push(prof);

                                    Usuario.findOne({ where: { id: prof.idUsuario } })
                                        .then((usu2) => {
                                            usuario2.push(usu2);


                                        });

                                });

                        });

                });

            var token = jwt.sign({ nombre: usuarios.nombre, correo: usuario2.email, nombre2: usuario2.nombre, correo2: usuarios.email }, SEED)
            console.log(token)
            req.body.token = token;

            reservas.update(nuevodatos)
                .then(nuevareserva => {
                    res.json(nuevareserva)
                })
        });

})





module.exports = router;