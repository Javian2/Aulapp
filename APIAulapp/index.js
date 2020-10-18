const express = require('express');
var winston = require('./config/logger');

var logger = require('morgan');
var morgan = require('morgan');

const bodyParser = require('body-parser');


const app = express();

app.use(logger('dev'));
app.use(morgan('combined', { stream: winston.stream }));

const port = process.env.PORT || 4000;
var path = require('path');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });

//Conectarse al puerto
app.listen(port, () => {
    console.log('Escuchando puerto 4000');
    /* logger.info('Servidor corriendo'); */
})

app.use('/usuarios',require('./routes/usuarios'));
app.use('/profesores',require('./routes/profesores'));
app.use('/alumnos',require('./routes/alumnos'));
app.use('/asignaturas',require('./routes/asignaturas'));
app.use('/premium', require('./routes/premiums'));
app.use('/materiales',require('./routes/materiales'));
app.use('/impartes',require('./routes/impartes'));
app.use('/profesores_favoritos',require('./routes/profesores_favoritos'));
app.use('/horarios', require('./routes/horarios'));
app.use('/valoraciones', require('./routes/valoraciones'));
app.use('/facturas', require('./routes/facturas'));
app.use('/lineaFacturas', require('./routes/lineaFacturas'));
app.use('/reservas', require('./routes/reservas'));
app.use('/notificaciones', require('./routes/notificaciones'));
app.use('/reportes', require('./routes/reportes'));
app.use('/login', require('./routes/login'));
app.use('/upload', require('./routes/upload'));
app.use('/imagenes', require('./routes/imagenes'));
app.use('/samba', require('./routes/samba'));
app.use('/logs', require('./routes/logs'));


//COSAS DE LOGS



/* app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */
