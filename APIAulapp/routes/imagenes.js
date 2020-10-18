const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');


router.get('/:tipo/:foto', (req, res) =>{

    var tipo = req.params.tipo;
    var foto = req.params.foto;    


    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${foto}`);
    
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);        
    } else{
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = router;