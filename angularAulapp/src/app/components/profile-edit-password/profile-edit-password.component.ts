import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import swal from 'sweetalert';


@Component({
  selector: 'app-profile-edit-password',
  templateUrl: './profile-edit-password.component.html',
  styleUrls: ['./profile-edit-password.component.css']
})
export class ProfileEditPasswordComponent implements OnInit {

  id:string;
  usuariosinfo:Usuario;
  forma: FormGroup;
  titulo: string;
  valida : boolean = false;

  constructor(
    public _usuario: UsuarioService, 
    public http: HttpClient,
    public router: Router,
    public rutaActiva: ActivatedRoute
    ) { 
      
      this.rutaActiva.params.subscribe(params => {
        this.id = params.id;
        if (this.id!=localStorage.getItem('id')) this.router.navigate(['/panel-usuario/gestionar-cuenta']);;
        this._usuario.getUser(this.id)
        .subscribe((data:any) => {
          this.usuariosinfo = data;
          this.titulo = "Actualizando Contraseña: " + this.usuariosinfo.nombre;
         
        });
        
      })

    }
    
    editarPassword(forma2: NgForm){

        if (forma2.invalid){        
          return;
        }
                
        let usuario = new Usuario(JSON.parse(localStorage.getItem('usuario')).email, forma2.value.contrasena, null, null, null, null, null);
        
        this._usuario.passIguales(usuario)
        .subscribe( correcto =>{
          this.valida=true;
          //this.router.navigate(['/profile']);
        });

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
        this.usuariosinfo.descripcion
      );


      this._usuario.editUser(this.usuariosinfo.id, nuevoUsuario)
        .subscribe(async (data:any) => {
          
          this._usuario.guardarStorage(this.usuariosinfo.id, this._usuario.token, nuevoUsuario);
          this.router.navigate(['/panel-usuario/gestionar-cuenta']);
          let mensaje = "Contraseña cambiada con exito";

          swal("Contraseña cambiada", mensaje, "success");
      })

    }


    ngOnInit() {

      this.forma = new FormGroup({
        
        contrasena: new FormControl(null, [Validators.required, 
          Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]),
      });
    }

    sonIguales(campo1:string, campo2:string){
      return (group: FormGroup) => {
  
        let pass1 = group.controls[campo1].value;
        let pass2 = group.controls[campo2].value;
  
        if(pass1 === pass2) { 
          return null;
        }
        return {
          sonIguales: true
        };
      }
    }

}
