import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(
    public http: HttpClient
  ) { }

  getHorarioProfesor(id:string){
    return this.http.get(URL_SERVICIOS + '/horarios/profesor/' + id );
  }
  getHorasProfesor(id:string, diaSemana:string){
    return this.http.get(URL_SERVICIOS + '/horarios/horasProfesor/' + id +'/'+ diaSemana);
  }

  setHorarioProfesor(horario:any){
    return this.http.post(URL_SERVICIOS + '/horarios/nuevo', horario);
  }

  putHorarioProfesor(horario:any, id:string){
    return this.http.put(URL_SERVICIOS + '/horarios/' + id, horario);
  }

  deleteHorarioProfesor(id:string){
    return this.http.delete(URL_SERVICIOS + '/horarios/' + id );
  }
}
