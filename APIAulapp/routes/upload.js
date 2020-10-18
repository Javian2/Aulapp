const express = require('express');
const router = express.Router();

const {Usuario} = require('./../sequelize');

const fileUpload = require('express-fileupload');
const fs = require('fs');

var webp=require('webp-converter');

// default options
router.use(fileUpload());

router.put('/:tipo/:id', (req, res) =>{

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleccion
    var tiposValidos = ['materiales', 'usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: {message: 'Tipo de colección no válida'}
        });
    }

    if( !req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.foto;
    var nombreCortado = archivo.name.split('.');//Para obtener la extension
    var extensionArchivo = nombreCortado[nombreCortado.length-1];

    //Solo aceptamos estas etensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'webp'];

    if(extensionesValidas.indexOf(extensionArchivo)  <0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            extensionArchivo: extensionArchivo,
            errors: {message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ')},
            
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;


    //Mover el archivo de temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv( path, err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }



        subirPorTipo( tipo, id, nombreArchivo, req, res);




        

/*         res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreCortado: nombreCortado
        });  */
    });


});

function subirPorTipo( tipo, id, nombreArchivo, req, res){

    if(tipo == 'usuarios'){
        
        Usuario.findOne({where: {id: id}})
            .then(usuario => {

            var pathViejo = './uploads/usuarios/' + usuario.foto;
            console.log('pre -> ' + pathViejo);
            
            //Si ya existe la imagen, la elimina
             if(fs.existsSync(pathViejo)){
                pathViejo = fs.unlinkSync(pathViejo);
            } 
            console.log('post -> ' + pathViejo);
            console.log('NombreArchivo: ' + nombreArchivo);

            var nombreArchivoWebp = `${id}-${ new Date().getMilliseconds()}.webp`;

            //Convertir la imagen a formato webp
            webp.cwebp(`./uploads/${tipo}/${nombreArchivo}`,`./uploads/${tipo}/${nombreArchivoWebp}`,"-q 80",function(status,error)
            {
                 //if conversion successful status will be '100'
                //if conversion fails status will be '101'
                
                //Borrar imagen jpg
                if(`./uploads/${tipo}/${nombreArchivo}`){
                fs.unlinkSync('./uploads/usuarios/' + nombreArchivo);
                }
                console.log(status,error);
                	
            });
            
            //Subir la imagen nueva
            console.log("NombreArchivo: " + nombreArchivoWebp);


            req.body.foto =nombreArchivoWebp;
            usuario.update( req.body)
                .then(usuarioActualizado => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizado',
                        usuarioActualizado: usuarioActualizado
                    });  
            });          
        });
        
    }
    
    if(tipo == 'materiales'){
        return res.status(400).json({
            ok: false,
            mensaje: 'Aún no está implementada la subida de materiales'
        }); 
    }
}


module.exports = router;