import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'filterBuscador'
})

export class FilterBuscadorPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    
    const resultPosts = [];
    if(arg.length < 2){ return value }
    for(const usuario of value){
      if(usuario.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultPosts.push(usuario); 
      }
    }
    return resultPosts
  }

}