import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { Premium } from '../../models/premium.model';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {

  constructor(public http: HttpClient) { }

  getPremium(){
    return this.http.get(URL_SERVICIOS + '/premium');
  }
}


