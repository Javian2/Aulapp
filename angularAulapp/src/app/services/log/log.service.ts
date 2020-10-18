import { Injectable } from '@angular/core';
import { Log } from 'src/app/models/log.model';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    public http: HttpClient,
    public router: Router,
  ) { }


  crearLog(log: Log){

    let url = URL_SERVICIOS + '/logs/nuevo';

    return this.http.post( url, log, {responseType: 'text'} );
  }

  getLogPorIdUsuario(id:any){
    return this.http.get(URL_SERVICIOS + '/logs/logIdUsuario/' + id );

  }

  getIPAddress()  
  {  
    return this.http.get("https://api.ipify.org/?format=json");  
  }  
}
