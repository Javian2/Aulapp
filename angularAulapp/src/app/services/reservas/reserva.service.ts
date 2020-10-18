import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Reserva } from 'src/app/models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    public http: HttpClient
  ) { }

  crearReserva(reserva:Reserva){
    let url = URL_SERVICIOS + '/reservas/nuevo';
    return this.http.post( url, reserva, {responseType: 'text'} );
  }

  mostrarReservasAlumno(id:any){
    let url = URL_SERVICIOS + '/reservas/alumnos/';
    return this.http.get(url + id);
  }

  mostrarReservasPorIdimparte(id:any){
    let url = URL_SERVICIOS + '/reservas/impartes/';
    return this.http.get(url + id);
  }

  cancelarReserva(id:any){
    let url = URL_SERVICIOS + '/reservas/';
    return this.http.delete(url + id, {responseType: 'text'});
  }

  getReservas(){
    return this.http.get(URL_SERVICIOS + '/reservas');
  }
  getReservaPorID(id:string){
    return this.http.get(URL_SERVICIOS + '/reservas/' + id);
  }

  getReservaPaginada(desde:number=0) {
    return this.http.get(URL_SERVICIOS + '/reservas/paginada/' + desde);
  }
  getReservasTotal(){
    return this.http.get(URL_SERVICIOS + '/reservas/total');
  }

  borrarReserva(id:any){
    return this.http.delete(URL_SERVICIOS + '/reservas/' + id, {responseType: 'text'})
  }

  aceptarReserva(id:any, email:any, nombreProfesor:any, nombreAsignatura:any){
    let url = URL_SERVICIOS + '/reservas/aceptarReserva/' + id +'/'+ email+'/'+ nombreProfesor+'/'+ nombreAsignatura;
    return this.http.put(url, {responseType: 'text'});
  }

  rechazarReserva(id:any){
    let url = URL_SERVICIOS + '/reservas/rechazarReserva/' + id;
    return this.http.put(url, {responseType: 'text'});
  }

  pagarReserva(id:any){
    let url = URL_SERVICIOS + '/reservas/pagarReserva/' + id;
    return this.http.put(url, {responseType: 'text'});
  }

  crearToken(id:any){
    let url = URL_SERVICIOS + '/reservas/crearToken/' + id;
    return this.http.put( url, {responseType: 'text'})
  }
}

