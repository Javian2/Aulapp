var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const express = require('express');

var SEED = require('../config/config').SEED;
const { Usuario } = require('./../sequelize');
const router = express.Router();
//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


//------------- AUTENTICACION GOOGLE -----------------------

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload: payload
    }
}

router.post('/google', async(req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });



    Usuario.findOne({ where: { email: googleUser.email } })
        .then((usuarioDB, err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (usuarioDB) {
                if (usuarioDB.contrasena != ':)') {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe usar su autenticacion normal',
                        google: 'Fue creado con google signin'

                    });
                } else {
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token
                    });
                }
            } else { //El usuario no existe, hay que crearlo
                Usuario.create({

                    nombre: googleUser.nombre,
                    apellidos: googleUser.family_name,
                    email: googleUser.email,
                    //fecha_nacimiento: googleUser.fecha,
                    contrasena: ':)',
                    //google: true,
                    //descripcion: req.body.descripcion,
                    foto: googleUser.img,
                    verificada: true
                }).then(usuarioDB => {
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas
                    return res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token
                            //googleUser: googleUser
                    });
                })
            }
        })

})

//------------- AUTENTICACION NORMAL -----------------------

router.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ where: { email: body.email } })
        .then((usuarioDB, err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }


            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - contrasena',
                    errors: err
                });
            }

            //Crear un token
            usuarioDB.contrasena = ':)'; //para no mandar la pass en el token
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token
            });
        })

});


router.post('/pass', (req, res) => {

    var body = req.body;

    Usuario.findOne({ where: { email: body.email } })
        .then((usuarioDB, err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }


            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - contrasena',
                    errors: err
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'OK'
                });
            }

        })

});

module.exports = router;