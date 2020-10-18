import { Injectable } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(
    public http: HttpClient
  ) { }

  getAlumnos(){
    return this.http.get(URL_SERVICIOS + '/alumnos');
  }
  getAlumnosP(desde:number=0){
    return this.http.get(URL_SERVICIOS + '/alumnos/paginada/' + desde);
  }
  getAlumnosT(){
    return this.http.get(URL_SERVICIOS + '/alumnos/total');
  }
  borrarAlumno(id:string){
    return this.http.delete(URL_SERVICIOS + '/alumnos/' + id, {responseType: 'text'})
  }
  crearAlumno(alu: Alumno){

    let url = URL_SERVICIOS + '/alumnos/nuevo';

    return this.http.post( url, alu, {responseType: 'text'} );
  }
  obtenerIdAlumno(id:any){
    return this.http.get(URL_SERVICIOS + '/alumnos/sacarElAlumno/' + id);
  }
  buscarAlumno(nombre:string){
   
    return this.http.get(URL_SERVICIOS + '/alumnos/buscador/' + nombre);
  }  

  editAlu(id:string, alumno:Alumno){
    let url = URL_SERVICIOS + '/alumnos/' + id;
    
    if(alumno.id == id){
      return this.http.put( url, alumno, {responseType: 'text'});
    }
  }
}
