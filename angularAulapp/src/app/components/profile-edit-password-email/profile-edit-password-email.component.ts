import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import swal from 'sweetalert2';


@Component({
  selector: 'app-profile-edit-password-email',
  templateUrl: './profile-edit-password-email.component.html',
  styleUrls: ['./profile-edit-password-email.component.css']
})
export class ProfileEditPasswordEmailComponent implements OnInit {

  usuariosinfo:Usuario;
  forma: FormGroup;
  titulo: string;
  valida : boolean = false;
  token : string; 

  constructor(
    public _usuario: UsuarioService, 
    public http: HttpClient,
    public router: Router,
    public rutaActiva: ActivatedRoute
    ) { 
      this.rutaActiva.params.subscribe(params => {
        this.token = params.token;
      });
    }
  ngOnInit() {

    this.forma = new FormGroup({
      contrasena: new FormControl(null, [Validators.required, 
      Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]),
    });
    this._usuario.getUserByToken(this.token)
    .subscribe ((resp:any) => {
      if(resp==null){
        swal.fire({
          icon: 'error',
          title: 'El token ha expirado',
          text: 'El token ha caducado. Por favor, vuelva a solicitar un correo de recuperación de contraseña.',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then((result) => {
          this.router.navigate(['/recuperar']);
        });
      }
      else{
        //console.log("¿Qué devuelves? "+ resp.id);
        this.usuariosinfo = resp; //el usuario entero.
        this.titulo = "Actualizando contraseña de " + this.usuariosinfo.nombre;
      }
    }), error =>{
      console.log(error);
      
    };
  }
  editarPass(){
    
    if (this.forma.invalid){                
      return;
    }
    let nuevoUsuario = new Usuario(
      this.usuariosinfo.email,
      this.forma.value.contrasena,
      this.usuariosinfo.nombre,
      this.usuariosinfo.apellidos,
      this.usuariosinfo.fecha_nacimiento,
      this.usuariosinfo.rol,
      this.usuariosinfo.foto,
      this.usuariosinfo.id,
      this.usuariosinfo.descripcion,
      null
    );
    let mensaje = "true";
    this._usuario.comprobarPass(nuevoUsuario)
    .subscribe(resp => {
      console.log("resp: "+resp);
      if (resp == mensaje){
        //console.log("¿Entras de una puta vez o que?");
        swal.fire({
          icon: 'error',
          title: "No puedes repetir contraseña",
          cancelButtonColor: '#3085d6'
        });
      }
      else{
        this._usuario.editUser(this.usuariosinfo.id, nuevoUsuario)
          .subscribe(async (data:any) => {
            console.log("¿Qué imprime el último data?: ");
            console.log(data);
            
            this._usuario.guardarStorage(this.usuariosinfo.id, this._usuario.token, nuevoUsuario);
            this.router.navigate(['/panel-usuario/gestionar-cuenta']);
            let mensaje = "Contraseña cambiada con éxito";
    
            //swal("Contraseña cambiada", mensaje, "success");
            swal.fire({
              icon: 'success',
              title: mensaje,
              cancelButtonColor: '#3085d6'
            });
        });
      }
    });
  }
}
