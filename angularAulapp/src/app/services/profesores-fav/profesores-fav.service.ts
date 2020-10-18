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
import { ProfesoresFavoritos } from '../../models/profesores-fav.model';


@Injectable({
  providedIn: 'root'
})
export class ProfesoresFavService {

  constructor(
    public http: HttpClient
    ) { }

  crearProfesorFav(profeFav: ProfesoresFavoritos){

    let url = URL_SERVICIOS + '/profesores_favoritos/nuevo';

    return this.http.post( url, profeFav, {responseType: 'text'} );
  }
  getProfFavUsu(id:string){
    return this.http.get(URL_SERVICIOS + '/profesores_favoritos/sacarporusu/' + id);
  }

  borrarProfesorFav(id:string){
    return this.http.delete(URL_SERVICIOS + '/profesores_favoritos/' + id, {responseType: 'text'})
  }

  borrarProfesor(id:string){
    return this.http.delete(URL_SERVICIOS + '/profesores_favoritos/profesor/' + id, {responseType: 'text'})
  }
}
