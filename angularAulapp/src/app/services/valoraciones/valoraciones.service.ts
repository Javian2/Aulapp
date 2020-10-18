import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Valoracion } from '../../models/valoraciones.model';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {

  constructor(public http: HttpClient) { }

  crearValoracion(valoracion:Valoracion){
    let url = URL_SERVICIOS + '/valoraciones/nuevo';
    return this.http.post( url, valoracion, {responseType: 'text'} );
  }

  mostrarValoracionesProfesor(idProfesor:string){
    let url = URL_SERVICIOS + '/valoraciones/ValoracionProfe/' + idProfesor;
    return this.http.get(url);
  }

  getValoraciones(){
    return this.http.get(URL_SERVICIOS + '/valoraciones');
  }
  getValoracionesPorID(id:string){
    return this.http.get(URL_SERVICIOS + '/valoraciones/' + id);
  }

  getValoracionesPaginada(desde:number=0) {
    return this.http.get(URL_SERVICIOS + '/valoraciones/paginada/' + desde);
  }
  getValoracionesTotal(){
    return this.http.get(URL_SERVICIOS + '/valoraciones/total');
  }

  borrarValoraciones(id:any){
    return this.http.delete(URL_SERVICIOS + '/valoraciones/' + id, {responseType: 'text'})
  }



}
