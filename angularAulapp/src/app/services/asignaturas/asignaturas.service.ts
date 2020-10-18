import { Injectable } from '@angular/core';
import { Asignatura } from 'src/app/models/asignaturas.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(
    public http: HttpClient
  ) { }

  getAsigs() {
    return this.http.get(URL_SERVICIOS + '/asignaturas');
  }
  getAsigsP(desde:number=0){
    return this.http.get(URL_SERVICIOS + '/asignaturas/paginada/' + desde);
  }
  getAsigsT(){
    return this.http.get(URL_SERVICIOS + '/asignaturas/total');
  }

  getAsig(id:string){
    return this.http.get(URL_SERVICIOS + '/asignaturas/' + id );
  }

  borrarAsignatura(id:string){
    return this.http.delete(URL_SERVICIOS + '/asignaturas/' + id, {responseType: 'text'})
  }

  buscarAsignatura(nombre:string){

    return this.http.get(URL_SERVICIOS + '/asignaturas/buscador/' + nombre);
  }  


  crearAsignatura(asignatura: Asignatura){

    let url = URL_SERVICIOS + '/asignaturas/nuevo';

    return this.http.post( url, asignatura, {responseType: 'text'} );
  }

  editAsig(id:string, asignatura: Asignatura){
    let url = URL_SERVICIOS + '/asignaturas/' + id;
    
    if(asignatura.id == id){
      return this.http.put( url, asignatura, {responseType: 'text'});
    }
  } 
}
