import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { Notificacion } from 'src/app/models/notificaciones.model';
import { NotificacionesService } from '../../../services/notificaciones/notificaciones.service';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/usuario/profesor.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mensaje: string;
  publicProfile: any;
  esProfesor: boolean = false;
  editmensaje: string;
  elseno;
  pantalla;
  id:any;
  para: boolean = false;
  profvar: Profesor[] = [];
  notificacion: any;
  notificacionArray: any[] = [];
  notificacionMensaje:any;

  constructor( public _usuarioService: UsuarioService,
    public _navmensaje: NavbarService,
    public _notiService: NotificacionesService,
    public _profService: ProfesorService
    ) { }
  user:Usuario;
  notificaciones: any = [];
  numNotificaciones:any = 0;

  mostrarNotificacionesDelUsuario(idusuario:any){
    this._notiService.getNotificacionesDelUsuario(idusuario)
    .subscribe((data:any[]) =>{
      console.log(data);
      console.log(this.notificacion);
      console.log(this.notificacionArray)

      this.notificacionArray = data;
      this.notificacion = this.notificacionArray.length;
    })
  }

  eliminarNoti(id:any){
    this._notiService.eliminarNotificacion(id)
    .subscribe(() =>{
      this.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    })
  }

  eliminarTodasLasNotis(idusuario:any){
    this._notiService.eliminarNotificaciones(idusuario)
    .subscribe(()=>{
      this.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    })
  }

  ngOnInit() {
    
    this._usuarioService.cargarStorage();
    this.id=localStorage.getItem('id');
    this._usuarioService.getUser(localStorage.getItem('id'))
    
    .subscribe((data:any) => {
      this.user = data;
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

    //this.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));

    //añadido notificaciones

    this._navmensaje.customMensaje.subscribe(msg => this.mensaje = msg);
    this._navmensaje.customNotificacion.subscribe(noti => this.notificacion = noti);
    this._navmensaje.customNotificacionArray.subscribe((notiArray:any) => this.notificacionArray = notiArray);
    this._navmensaje.customPubProfile.subscribe(newPubProfile => this.publicProfile = newPubProfile);
    this._navmensaje.customProfe.subscribe(newEsProfe => this.esProfesor = newEsProfe);

    


  }
 

}
