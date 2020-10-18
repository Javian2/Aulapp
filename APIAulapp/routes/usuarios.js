var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const logger = require('./../config/logger');
const nodemailer = require('nodemailer');
var mdAutenticacion = require('../middlewares/autenticacion');
const express = require('express');
const router = express.Router();
var SEED = require('../config/config').SEED;

var cuerpo1 = require('../config/config').cuerpo1;
var cuerpo2 = require('../config/config').cuerpo2;
var url = require('../config/config').url;

const { Usuario } = require('./../sequelize');
var Sequelize = require('sequelize');
const Op = Sequelize.Op




router.get('/', (req, res) => {
    Usuario.findAll()
        .then(usuarios => {
            res.send(usuarios);
        });
})
router.get('/paginada/:desde', (req, res) => {
    let cadena = req.params.desde;
    var d = parseInt(cadena);

    Usuario.findAll({ offset: d, limit: 6 })
        .then(usuarios => {
            res.send(usuarios);
        });
})

router.get('/total', (req, res) => {
    Usuario.findAll()
        .then(usuarios => {
            res.json(usuarios.length);
        });
});

//EMAIL DE RECUPERACION DE CONTRASENYA
router.put('/recuperar/:email', (req, res) => {
    //let user = Usuario.findOne({ where: { email: req.body.email } });
    let email = req.params.email;
    let user = req.body;
    console.log("¿Sacas el email? " + email);
    Usuario.findOne({ where: { email: email } })
        .then(usuario => {
            var token = jwt.sign({ nombre: usuario.name, correo: usuario.email }, SEED, { expiresIn: '24h' });
            console.log("¿Creo el token? " + token);
            console.log("¿Sabes qué es usuario? " + usuario);
            user.tokenTemp = token;
            usuario.update(user)
                .then(nuevoChico => {
                    res.json(nuevoChico);
                    console.log("¿Nuevo chico? " + nuevoChico);
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'abp.inkwell@gmail.com',
                            pass: 'inkaulapp@2.'
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    let emailOptions = {
                        from: '"Inkwell" <abp.inkwell@gmail.com>',
                        to: nuevoChico.email, // CAMBIAR AL CORREO DEL USUARIO QUE SE REGISTRE
                        subject: "Restablecer Contraseña de Aulapp", // Subject line
                        text: "Restablece tu contraseña", // plain text body
                        html: cuerpo1 + `Restablecimiento de contraseña de Inkwell
                        </h2>
                        <p>
                            Sentimos que hayas perdido u olvidado tu contraseña. Para restaurar tu contraseña, clica en el siguiente botón.</p> 
                        <center>
                            <div style="margin: 48px 0;">
                                <a class="button" href="` + url + `/profile-edit-password-email/` + token + `"
                                style="background-color:#5727ac;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:18px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:300px;-webkit-text-size-adjust:none;">Restablecer contraseña</a>
                            </div>
                            <p style="font-size: 16px;">¿No funciona el botón? Copia y pega este enlace en la barra de búsqueda de tu navegador: ` + url + `/profile-edit-password-email/` + token + `</p>
                        </center>` + cuerpo2
                    };
                    transporter.sendMail(emailOptions, (error, info) => {
                        res.send(emailOptions.to);
                        if (error) {
                            console.log("hay un error");
                            return console.log(error);
                        }
                    });
                });
        }).catch(error => {
            res.json({
                ok: false
            });
            return res;
        });
    //console.log("holaaaa");
    //var token = jwt.sign({ nombre: user.nombre, correo: req.body.email }, SEED, { expiresIn: '24h' }); //TODO MIRAR ESTO.
});
//sacar un usuario por el token. ESTO SE UTILIZA PARA LA RECUPERACION DE LA CONTRASENYA
router.get('/recuperarToken/:token', (req, res) => {
    let token = req.params.token;
    //console.log("¿Entras aquí?" + token);
    Usuario.findOne({ where: { tokenTemp: token } }).then(usuario => {
        //console.log("¿Devuelves el usuario? " + usuario);
        res.json(usuario); //Esto devuelve todo el usuario.
    });
});
router.post('/comprobarPass', (req, res) => {
    let user = req.body;
    let variable;
    Usuario.findOne({ where: { email: user.email } })
        .then(usuario => {
            console.log("¿Aquí llegas API?1");
            variable = bcrypt.compareSync(user.contrasena, usuario.contrasena);
            res.json(variable);
        });
});

//EMAIL PARA NUEVO USUARIO
router.post('/nuevo', /*  mdAutenticacion.verificaToken , */ (req, res) => {
    console.log(req.body);

    var token = jwt.sign({ nombre: req.body.nombre, correo: req.body.email }, SEED, { expiresIn: '24h' })

    Usuario.create({
        id: req.body.id,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        fecha_nacimiento: req.body.fecha_nacimiento,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        descripcion: req.body.descripcion,
        foto: req.body.foto,
        rol: 0,
        tokenTemp: token,
        verificada: false,
        video: null
    }).then(usuario => {
        res.send('usuario creado');
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
            to: req.body.email, // CAMBIAR AL CORREO DEL USUARIO QUE SE REGISTRE
            subject: "Bienvenido a Aulapp", // Subject line
            text: "Bienvenido!", // plain text body
            html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <title>¡Bienvenido a Aulapp!</title>
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
                            ¡Bienvenido a Aulapp, ` + req.body.nombre + `! 🎉✨
                        </h2>
                        <p>
                            Nos alegra que formes parte de nuestra comunidad. Pero, antes de nada, debes validar tu cuenta para poder acceder y
                      comenzar a usar la aplicación.</p> 
                        <center>
                            <div style="margin: 48px 0;">
                            <a class="button" href="` + url + `/activar/` + token + `"
                            style="background-color:#5727ac;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:18px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:300px;-webkit-text-size-adjust:none;">Validar cuenta</a>
                         </div>
                            <p style="font-size: 16px;">¿No puedes ver el botón? Valida tu cuenta a través de este enlace: ` + url + `/activar/` + token + `</p>
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
    })

    router.post('/reenviar/:email', (req, res) => {
        console.log("entra en la ruta")

        let email = req.params.email
        Usuario.findOne({ where: { email: email } })
            .then(usuario => {
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
                    to: usuario.email, // CAMBIAR AL CORREO DEL USUARIO QUE SE REGISTRE
                    subject: "Bienvenido a Aulapp", // Subject line
                    text: "Bienvenido!", // plain text body
                    html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <title>¡Bienvenido a Aulapp!</title>
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
                          ¡Bienvenido a Aulapp, ` + usuario.nombre + `! 🎉✨
                      </h2>
                      <p>
                          Nos alegra que formes parte de nuestra comunidad. Pero, antes de nada, debes validar tu cuenta para poder acceder y
                    comenzar a usar la aplicación.</p> 
                      <center>
                          <div style="margin: 48px 0;">
                          <a class="button" href="` + url + `/activar/` + usuario.tokenTemp + `"
                          style="background-color:#5727ac;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:18px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:300px;-webkit-text-size-adjust:none;">Validar cuenta</a>
                       </div>
                          <p style="font-size: 16px;">¿No puedes ver el botón? Valida tu cuenta a través de este enlace: ` + url + `/activar/` + usuario.tokenTemp + `</p>
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
            })
    })
});


router.put('/modificarToken/:email', (req, res) => {
    let email = req.params.email
    let nuevoUsu = req.body;


    Usuario.findOne({ where: { email: email } })
        .then((usuario) => {

            var token = jwt.sign({ nombre: usuario.nombre, correo: usuario.email }, SEED, { expiresIn: '24h' })
            console.log(token)
            req.body.tokenTemp = token;

            usuario.update(nuevoUsu)
                .then(nuevoUsuario => {
                    res.json(nuevoUsuario)
                })
        });
})



router.put('/activar/:token', (req, res) => {
    let token = req.params.token;
    let nuevoUsu = req.body;

    Usuario.findOne({ where: { tokenTemp: token } })
        .then((usuario) => {

            jwt.verify(token, SEED, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        mensaje: 'Token incorrecto',
                        errors: err
                    });
                } else {
                    req.body.verificada = true;
                    req.body.tokenTemp = false;

                    usuario.update(nuevoUsu)
                        .then(nuevoUsuario => {
                            res.json(nuevoUsuario)
                        })
                }
            });
        })
});

router.get('/comprobar/:token', (req, res) => {
    let token = req.params.token;
    console.log("¿El token ha llegado? " + token);
    let newUser = req.body;

    Usuario.findOne({ where: { tokenTemp: token } })
        .then((usuario) => {
            jwt.verify(token, SEED, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        ok: false,
                        mensaje: 'Token incorrecto',
                        errors: err
                    });
                } else {
                    /*console.log("Antes: " + usuario.tokenTemp);
                    usuario.tokenTemp = false;
                    console.log("Después: " + usuario.tokenTemp);
                    usuario.update(nuevoUsu)
                    .then(nuevoUsuario => {
                        res.json(nuevoUsuario)
                    });*/
                }
            });
        });
});

//a
router.get('/:id', (req, res) => {
    let id = req.params.id
    Usuario.findOne({ where: { id: id } })
        .then(usuario => {
            res.json(usuario)
        })
});

router.get('/sacarId/:email', (req, res) => {
    let email = req.params.email
    Usuario.findOne({ where: { email: email } })
        .then(usuario => {
            if (usuario == null) {
                res.json(null)
            } else {
                res.json(usuario.id)
            }

        })
})

router.get('/buscarPorNombre/:nombre', (req, res) => {
    let nombre = req.params.nombre
    Usuario.findOne({
            where: {
                'nombre': nombre
            }
        })
        .then(usuario => {
            res.json(usuario)
        })
})
router.get('/buscarUsu/:nombre', (req, res) => {
    let nombre = req.params.nombre
    Usuario.findAll({
            where: {
                'nombre': {
                    [Op.substring]: nombre
                }
            },
            order: ['nombre']
        })
        .then(usuario => {
            res.json(usuario)
        })
})



router.get('/sacarVerificada/:email', (req, res) => {
    let email = req.params.email
    Usuario.findOne({ where: { email: email } })
        .then(usuario => {
            res.json(usuario.verificada)
        })
})

router.put('/:id', (req, res) => {
    let usuarioId = req.params.id
    if (req.body.contrasena.length < 21 && req.body.contrasena != ':)')
        req.body.contrasena = bcrypt.hashSync(req.body.contrasena, 10)
    let nuevosDatos = req.body
    Usuario.findOne({ where: { id: usuarioId } })
        .then(usuario => {
            usuario.update(nuevosDatos)
                .then(nuevoUsuario => {
                    res.json(nuevoUsuario)
                })
        });
});




router.delete('/:id', (req, res) => {
    let usuarioId = req.params.id
    Usuario.destroy({
        where: { id: usuarioId }
    }).then(() => {
        res.send('Usuario Eliminado')
    })
})


module.exports = router;