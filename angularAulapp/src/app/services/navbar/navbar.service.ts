import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { ProfesorService } from '../usuario/profesor.service';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  notificaciones: any = [];
  numNotificaciones:any = 0;

  //observables

  private mensaje = new BehaviorSubject<string>(null);
  public customMensaje = this.mensaje.asObservable();

  //numero de notificaciones

  private notificacion = new BehaviorSubject<string>(null);
  public customNotificacion = this.notificacion.asObservable();

  //array de notificaciones

  private notificacionArray = new BehaviorSubject<string>(null);
  public customNotificacionArray = this.notificacionArray.asObservable();

  //Perfil público
  private publicProfile = new BehaviorSubject<string>(null);
  public customPubProfile = this.publicProfile.asObservable();

  //Es profe
  private esProfesor = new BehaviorSubject<boolean>(null);
  public customProfe = this.esProfesor.asObservable();




  public changeMensaje(msg: string): void{
    this.mensaje.next(msg);
  }

  public newNoti(newNoti:any){
    this.notificacion.next(newNoti);
  }

  public newArrayNotis(newArrayNoti:any){
    this.notificacionArray.next(newArrayNoti)
  }

  public changePublicProfile(newPubProfile: any){
    this.publicProfile.next(newPubProfile);
  }
  public changeEsProfesor(newEsProfe:boolean){
    this.esProfesor.next(newEsProfe);
  }

  constructor(
    public _notiService: NotificacionesService,
    public _profService: ProfesorService
  ) {
    
  }

  //funciones 

  

  public mostrarNotificacionesDelUsuario(idusuario:any){
    this._notiService.getNotificacionesDelUsuario(idusuario)
    .subscribe((data:any[]) =>{
      this.notificaciones = data;
      this.numNotificaciones = this.notificaciones.length;
    })    
  }

  public eliminarNoti(id:any){
    this._notiService.eliminarNotificacion(id)
    .subscribe(() =>{
      this.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    })
  }

  
  


}
