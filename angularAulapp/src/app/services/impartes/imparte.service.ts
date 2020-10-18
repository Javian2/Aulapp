import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Imparte } from '../../models/imparte.model';

import { map, catchError } from 'rxjs/operators';
import { pipe, throwError } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class ImparteService {

  variableBusqueda:any;

  constructor(
    public http: HttpClient
  ) { }

  getImpartes() {
    return this.http.get(URL_SERVICIOS + '/impartes');
  }

  getImpartePorId(id:string){
    return this.http.get(URL_SERVICIOS + '/impartes/' + id);
  }

  getImpartesPorProfesor(idprofesor:string){
    return this.http.get(URL_SERVICIOS + '/impartes/profesor/' + idprofesor);
  }
  getImpartesP(desde:number=0) {
    return this.http.get(URL_SERVICIOS + '/impartes/paginada/' + desde);
  }
  getImpartesT(){
    return this.http.get(URL_SERVICIOS + '/impartes/total');
  }

  getImparteAsig(asignatura:string){
    return this.http.get(URL_SERVICIOS + '/impartes/buscadorAsignatura/' + asignatura);
  }

  sacarAsignaturasPorId(id:any){
    return this.http.get(URL_SERVICIOS + '/impartes/sacarAsignaturas/' + id);
  }

  crearImparte(imparte: Imparte){
    
    let url = URL_SERVICIOS + '/impartes/nuevo';

    return this.http.post( url, imparte, {responseType: 'text'} );
  }

  borrarImparte(id:any){
    return this.http.delete(URL_SERVICIOS + '/impartes/' + id, {responseType: 'text'})
  }

  editarImparte(id:any, imparte:any){
    let url = URL_SERVICIOS + '/impartes/' + id;

    return this.http.put(url, imparte, {responseType: 'text'})
  }

  getImpartesPorProfesorAsignatura(idprofesor:string, asignatura:string){
    return this.http.get(URL_SERVICIOS + '/impartes/profesorAsignatura/' + idprofesor +'/'+ asignatura);
  }

  borrarImparteGestion(idprofesor:any, idasignatura:any){
    return this.http.delete(URL_SERVICIOS + '/impartes/borrar/' + idprofesor + '/' +  idasignatura, {responseType: 'text'})
  }
}
