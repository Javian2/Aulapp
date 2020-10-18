const express = require('express');
const router = express.Router();

const {Profesor} = require('../sequelize');
const {Usuario} = require('../sequelize');

// mas funcionalidades para filtrar usuarios
var Sequelize = require('sequelize');
const Op = Sequelize.Op

    router.post('/', (req, res) =>{

        if(req){
            var pregunta = req.body.queryResult.parameters.profe;
            console.log("param: " + req.body.queryResult.parameters.profe);
            
        }
        if(pregunta){
            console.log("pregunta "  + pregunta);
            
            if(pregunta =='profesores'){
                Profesor.findAll()
                .then(profesores => {
                    return res.json({
                        fulfillmentMessages: [
                            {
                              text: {
                                text: [
                                  "Aqui tienes una lista de los profesores:"
                                ]
                              }
                            },
                            {
                              card: {
                                title: 1,
                                buttons: [
                                  {
                                    text: "Ir al profe",
                                    postback: "https://aulapp.ovh/profile-profesor/" + 1
                                  }
                                ]
                              }
                            }
                        ]
                    });

            
                });
            }
        }
        
    });



module.exports = router;