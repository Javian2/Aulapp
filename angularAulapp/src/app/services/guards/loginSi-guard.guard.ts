import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LoginSiGuardGuard implements CanActivate {
  
  constructor( 
    public _usuarioService: UsuarioService,
    public router: Router
    ){}
  
  async canActivate(){    
    
    if(!this._usuarioService.estaLogueado()){
      
      return true;
    } else{
     
      this.router.navigate(['/home']);
      return false;
    }
    
  }
  
}
