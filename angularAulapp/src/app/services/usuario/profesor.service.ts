import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Profesor } from '../../models/profesor.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { pipe, throwError } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  constructor(
    public http: HttpClient
  ) { }

  getProfs() {
    return this.http.get(URL_SERVICIOS + '/profesores');
  }

  getProfsMejorValorados(){
    return this.http.get(URL_SERVICIOS + '/profesores/mejoresValorados');

  }


  getProfsP(desde:number=0){
    return this.http.get(URL_SERVICIOS + '/profesores/paginada/' + desde);
  }
  getProfsT(){
    return this.http.get(URL_SERVICIOS + '/profesores/total');
  }

  getProf(id:string){
    return this.http.get(URL_SERVICIOS + '/profesores/' + id);
  }

  borrarProfesor(id:string){
    return this.http.delete(URL_SERVICIOS + '/profesores/' + id, {responseType: 'text'})
  }

  buscarProfesor(nombre:string){
   
    return this.http.get(URL_SERVICIOS + '/profesores/buscador/' + nombre);
  }   

  crearProfesor(profe: Profesor){

    let url = URL_SERVICIOS + '/profesores/nuevo';

    return this.http.post( url, profe, {responseType: 'text'} );
  }

  actualizarValoracionMedia(id:any, valoracionMedia:any){
    return this.http.put(URL_SERVICIOS + '/profesores/calcularMedia/' + id +'/'+ valoracionMedia, {responseType: 'text'});
  }

  obtenerIdProfesor(id:any){
    return this.http.get(URL_SERVICIOS + '/profesores/sacarProfesor/' + id);
  }

  obtenerIdProfesor2(id:any){
    return this.http.get(URL_SERVICIOS + '/profesores/sacarElProfesor/' + id);
  }

}
