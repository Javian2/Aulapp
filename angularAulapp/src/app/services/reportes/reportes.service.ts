import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Reporte } from '../../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(public http: HttpClient) { }


  crearReporte(reporte:Reporte){
    let url = URL_SERVICIOS + '/reportes/nuevo';
    return this.http.post( url, reporte, {responseType: 'text'} );
  }

  getReportes(){
    return this.http.get(URL_SERVICIOS + '/reportes');
  }
  getReportesPorID(id:string){
    return this.http.get(URL_SERVICIOS + '/reportes/' + id);
  }

  getReportesPaginada(desde:number=0) {
    return this.http.get(URL_SERVICIOS + '/reportes/paginada/' + desde);
  }
  getReportesTotal(){
    return this.http.get(URL_SERVICIOS + '/reportes/total');
  }

  borrarReporte(id:any){
    return this.http.delete(URL_SERVICIOS + '/reportes/' + id, {responseType: 'text'})
  }

}
