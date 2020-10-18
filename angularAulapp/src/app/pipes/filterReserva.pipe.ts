import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'filterReserva'
})

export class FilterReservaPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    
    const resultPosts = [];
    
    for(const usuario of value){
      if(usuario.id.value() == arg.value()){
        resultPosts.push(usuario);
      }
    }
    return resultPosts
  }

}