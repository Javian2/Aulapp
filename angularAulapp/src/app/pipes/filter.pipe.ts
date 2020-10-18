import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';


@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    
    const resultPosts = [];
    arg = arg.toLowerCase();
    if(arg === ''){ return null }
    for(const asig of value){
      //console.log("yi");
      if(asig.nombre.toLowerCase().indexOf(arg) > -1){
        resultPosts.push(asig);
      }
    }
    return resultPosts
  }

}
