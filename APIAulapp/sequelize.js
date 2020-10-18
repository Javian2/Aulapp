const Sequelize = require('sequelize')

const UsuarioModel = require('./models/Usuario');
const ProfesorModel = require('./models/Profesor');
const AlumnoModel = require('./models/Alumno');
const AsignaturaModel = require('./models/Asignatura');
const PremiumModel = require('./models/Premium');
const MaterialModel = require('./models/Material');
const ImparteModel = require('./models/Imparte');
const ProfesoresFavoritosModel = require('./models/Profesores_favoritos');
const HorarioModel = require('./models/Horario');
const ValoracionModel = require('./models/Valoracion');
const LineaFacturasModel = require('./models/LineaFactura');
const FacturaModel = require('./models/Factura');
const ReservaModel = require('./models/Reserva');
const NotificacionModel = require('./models/Notificacion');
const ReporteModel = require('./models/Reporte');
const LogModel = require('./models/Log');

const DBURL = 'mysql://root:@localhost:3306/aulapp';

const sequelize = new Sequelize(DBURL);

const Usuario = UsuarioModel(sequelize, Sequelize);
const Profesor = ProfesorModel(sequelize, Sequelize);
const Alumno = AlumnoModel(sequelize, Sequelize);
const Asignatura = AsignaturaModel(sequelize, Sequelize);
const Premium = PremiumModel(sequelize, Sequelize);
const Material = MaterialModel(sequelize, Sequelize);
const Imparte = ImparteModel(sequelize, Sequelize);
const ProfesoresFavoritos = ProfesoresFavoritosModel(sequelize, Sequelize);
const Horario = HorarioModel(sequelize, Sequelize);
const Valoracion = ValoracionModel(sequelize, Sequelize);
const LineaFactura = LineaFacturasModel(sequelize, Sequelize);
const Factura = FacturaModel(sequelize, Sequelize);
const Reserva = ReservaModel(sequelize, Sequelize);
const Notificacion = NotificacionModel(sequelize, Sequelize);
const Reporte = ReporteModel(sequelize, Sequelize);
const Log = LogModel(sequelize, Sequelize);

module.exports = {
    Usuario,
    Profesor,
    Alumno,
    Asignatura,
    Premium,
    Material,
    Imparte,
    ProfesoresFavoritos,
    Horario,
    Valoracion,
    Factura,
    LineaFactura,
    Reserva,
    Notificacion,
    Reporte,
    Log
}