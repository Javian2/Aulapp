import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Router } from '@angular/router';

@Pipe({
  name: 'filterAsig'
})

export class FilterAsigPipe implements PipeTransform {

  constructor(private router : Router) {}
  

  transform(value: any, arg: any): any {
   
      const resultPosts = [];
      var auxiliar = [];
      if(arg === ''){ return null }
      let i = 0;
      for(const usuario of value){
        if(auxiliar.includes(usuario.nombreAsignatura) == false){
          auxiliar.push(usuario.nombreAsignatura)
        }
        if(usuario.toLowerCase().indexOf(arg.toLowerCase()) > -1){      
          if(resultPosts.includes(usuario) == false && i < 5){
            resultPosts.push(usuario);          
            i++;
          }
        }
      }
      return resultPosts
  }

}