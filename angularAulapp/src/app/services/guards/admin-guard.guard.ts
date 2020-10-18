import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  
  constructor( 
    public _usuarioService: UsuarioService,
    public router: Router
    ){}
  
  canActivate(){    
    if(this._usuarioService.esAdmin()){
      
      return true;
    } else{
     
      this.router.navigate(['/home']);
      return false;
    }
  }
  
}
