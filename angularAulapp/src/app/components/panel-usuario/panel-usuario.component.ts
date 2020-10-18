import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { Profesor } from 'src/app/models/profesor.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ImparteService } from '../../services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from '../../services/reservas/reserva.service';
import { Notificacion } from 'src/app/models/notificaciones.model';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';

@Component({
  selector: 'app-panel-usuario',
  templateUrl: './panel-usuario.component.html',
  styleUrls: ['./panel-usuario.component.css']
})
export class PanelUsuarioComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _reservaService: ReservaService,
    public _notiService: NotificacionesService) { }

    impartesMios: Imparte[] = [];
    reservasMias: Reserva[] = [];
    nomAlumno: any;

  

  ngOnInit() {
    this._usuario.cargarStorage();
  }

}
