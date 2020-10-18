import { Injectable } from '@angular/core';
import { Notificacion } from 'src/app/models/notificaciones.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(public http: HttpClient) { }

  getNotificacionesDelUsuario(idusuario:any){
    return this.http.get(URL_SERVICIOS + '/notificaciones/NotisUsuario/' + idusuario);
  }

  eliminarNotificacion(id:any){
    return this.http.delete(URL_SERVICIOS + '/notificaciones/' + id, {responseType: 'text'});
  }

  eliminarNotificaciones(idusuario:any){
    return this.http.delete(URL_SERVICIOS + '/notificaciones/NotisUsuario/' + idusuario, {responseType: 'text'});
  }

  crearNotificacion(noti:Notificacion){
    let url = URL_SERVICIOS + '/notificaciones/nuevo';
    return this.http.post( url, noti, {responseType: 'text'} );
  }

}
