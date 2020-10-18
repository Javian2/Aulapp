import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(foto: string, tipo: string = 'usuarios'): any {
    
    let url = URL_SERVICIOS + '/imagenes';

    if(!foto){
      return url + '/usuarios/xxx';
    }
  
    
    if( foto.indexOf('https') >= 0 ){
      return foto;
    }
    switch(tipo){
      case 'usuarios':        
        return url + '/usuarios/' + foto;
      break;
    }
    
    return url;
  }

}
