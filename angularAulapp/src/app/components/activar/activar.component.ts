import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-activar',
  templateUrl: './activar.component.html',
  styleUrls: ['./activar.component.css']
})
export class ActivarComponent implements OnInit {
  usuario:Usuario;
  tokenTemp:string;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    public rutaActiva: ActivatedRoute
  ) {

    this.rutaActiva.params.subscribe(params => {
      this.tokenTemp = params.token;
    })

   }

  ngOnInit() {

      this._usuarioService.verificarUsuario(this.tokenTemp)
      .subscribe((resp:any) =>{

        console.log("Se valida usuario: " + resp);
        
        this.usuario=resp;

        this.verificar(resp);
        //No valida
        }, error =>{
        console.log(error);
      });
  }

 verificar(usuario:any) {
    this._usuarioService.guardarStorage(usuario.id,this.tokenTemp,usuario);
    this.router.navigate(['/home']);
  }

}
