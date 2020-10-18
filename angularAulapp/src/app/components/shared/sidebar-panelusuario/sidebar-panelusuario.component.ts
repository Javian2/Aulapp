import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { SolicitudesService } from '../../../services/solicitudes/solicitudes.service';
import { Reserva } from '../../../models/reserva.model';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { subscribeOn } from 'rxjs/operators';
import { Imparte } from '../../../models/imparte.model';
import { ReservaService } from '../../../services/reservas/reserva.service';
import { LogService } from '../../../services/log/log.service';
import { Log } from '../../../models/log.model';


@Component({
  selector: 'app-sidebar-panelusuario',
  templateUrl: './sidebar-panelusuario.component.html',
  styleUrls: ['./sidebar-panelusuario.component.css', './../../../../assets/css/style-guide.css']
})
export class SidebarPanelusuarioComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
    public _reserva: ReservaService,
    public _solicitudService: SolicitudesService,
    public _logService: LogService,
    public _imparteService: ImparteService) { }
  user:Usuario;
  user2:Usuario;
  user3:Usuario;
  imp:Imparte;
  para: boolean = false;
  profvar: Profesor[] = [];
  variableFecha:boolean;
  prof2:Profesor;
  nombrevariable:string;
  variableReserva:Reserva
  variableUsuario:any;
  idReserva:any; //variable que saca la id de la reserva para un profe
  idReservaAlu:any
  //alumno

  variableFechaAlumno:boolean;
  variableReservaAlumno:Reserva

  ip:any = null;

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  crearLog(){
    var MiLog = new Log(localStorage.getItem('id'), "Ha accedido a la clase con " + this.nombrevariable, this.ip)
    this._logService.crearLog(MiLog)
      .subscribe(correcto => {
        
      })
  }




  async ngOnInit() {
    //log

    this._logService.getIPAddress()
      .subscribe((ip:any) => {
        this.ip = ip.ip;
      })


    this._usuario.cargarStorage();
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
    });
    this._profService.getProfs()
    .subscribe((data: Profesor[]) => {
      this.profvar = data;
      for (let index = 0; index < this.profvar.length; index++) {
        if(this.profvar[index].idUsuario == localStorage.getItem('id')){
          this.para = true;
        }
      }
    });

    //que salga el botón para alumno
   
    this._solicitudService.misSolicitudesAlumno();
    await this.delay(800);
    this.variableFechaAlumno = this._solicitudService.variableFechaAlumno;
    if(this.variableFechaAlumno==true){
      this.idReservaAlu=this._solicitudService.variableReservaAlumno.id;
    }
    if(this._solicitudService.taspasadoAlu==true){
      console.log("aqui");
      /* this._reserva.pagarReserva(this._solicitudService.ReservataspadadoAlu.id).subscribe((data:any) => {

    
    }); */
    }
    
    //que salga el botón para profe

    this._solicitudService.reservasProfesor()
    await this.delay(800);
    this.variableFecha = this._solicitudService.variableFecha;
    if(this.variableFecha==true){
    this.idReserva=this._solicitudService.variableReserva.id
  }
  if(this._solicitudService.taspasadoProf==true){
      console.log("aqui2");
      /* this._reserva.pagarReserva(this._solicitudService.ReservataspadadoProf.id).subscribe((data:any) => {
      }); */
    }
    
    if(this.variableFecha==false && this._solicitudService.variableReservaAlumno){
      
      this._imparteService.getImpartePorId(this._solicitudService.variableReservaAlumno.idimparte)
      .subscribe((data:any)=>{
      this.imp=data;

      this._profService.getProf(this.imp.idprofesor)
      .subscribe((data:any)=>{
        this.prof2=data;

        this._usuario.getUser(this.prof2.idUsuario)
        .subscribe((data:any)=>{
        this.user2=data;
        this.nombrevariable=this.user2.nombre;
        });
      });
      });
    }else if(this._solicitudService.variableReserva){
    this._usuario.getUser(this._solicitudService.variableReserva.idusuario)
    .subscribe((data:any)=>{
      this.user3=data;
      this.nombrevariable=this.user3.nombre;
    });
    }
    
  }

}
