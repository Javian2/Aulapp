import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { Alumno } from '../../models/alumno.model';
import { Profesor } from '../../models/profesor.model';
import { AlumnoService } from '../../services/usuario/alumno.service';
import Swal from 'sweetalert2'
import { async } from '@angular/core/testing';

declare const gapi: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css','./register.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;
  imagenSubir:File;
  imagenTemp: string;
  password;
  show = false;
  email: string;
  recuerdame: boolean = false;
  yaesta: boolean = false;

  auth2: any;

  constructor(
    public _usuarioService: UsuarioService,
    public _profService: ProfesorService,
    public _AluService: AlumnoService,
    public router: Router
  ) { }

  ngOnInit() {

    this.googleInit();
    this.password = 'password';

    // this._usuarioService.guardarStorage(this._usuarioService.id, this._usuarioService.token, this._usuarioService.usuario);
     this.email = localStorage.getItem('email') || '';
     if(this.email.length >1){
       this.recuerdame=true;
     }

  this.forma = new FormGroup({
    //id: new FormControl(),
    nombre: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    contrasena: new FormControl(null, [Validators.required, 
      Validators.pattern('((?=.*\\d)(?=.*[a-z]).{6,20})')]),
    foto: new FormControl(null),
    serprofe: new FormControl(null),
    check: new FormControl(null, Validators.required),
  })
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }


  googleInit(){
    gapi.load('auth2', () =>{
      this.auth2 = gapi.auth2.init({
        client_id: '689375913021-9771n74h53lln12a27ev2s26053g4b8d.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSigin( document.getElementById('btnGoogle'));

    });
  }

  attachSigin( element ){

    this.auth2.attachClickHandler( element, {}, (googleUser) =>{
      let token = googleUser.getAuthResponse().id_token;
      this._usuarioService.loginGoogle(token)
      .subscribe( () => window.location.href = '');
    
    } );
  }

  async comprobarEmail(value:any){
    this._usuarioService.getIdPorEmail(value)
    .subscribe(correcto =>{
      if(correcto != null){
        this.yaesta=true;
      }else{
        this.yaesta=false;
      }
      console.log(this.yaesta);
      
    });
    
    
  }

  registrarUsuario(){
 
    if (this.forma.invalid){
      return;
    }

    if(this.yaesta==true){
     
      Swal.fire({
        title: '¡Vaya!',
        text: "Revisa si has puesto el correo correctamente o ya esta en uso",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#515FC9',
        confirmButtonText: 'Aceptar'
      })
      return;
    }

    let usuario = new Usuario(
      this.forma.value.email,
      this.forma.value.contrasena,
      this.forma.value.nombre,
      this.forma.value.apellidos,
      this.forma.value.fecha,
      '0', //Rol de usuario
      'default',
      this.forma.value.id,
      this.forma.value.descripcion,
    );

    const input = document.getElementById("radio-2") as HTMLInputElement;
    
    if(input.checked == true){

      this._usuarioService.variable = usuario;
      this._usuarioService.crearUsuario(usuario)
      .subscribe( resp =>{
        this._usuarioService.getIdPorEmail(usuario.email)
          .subscribe(async correcto =>{
            
            await this.delay(300)
            let profe = new Profesor(null, correcto.toString());
            this._profService.crearProfesor(profe).subscribe( resp =>{
              console.log(resp)
            });

            Swal.fire({
              title: '¡Te has registrado correctamente!',
              text: "Revisa tu bandeja de correo y encontrarás un email para validar tu cuenta.",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#515FC9',
              confirmButtonText: 'Aceptar'
            })

            this.router.navigate(['/register-step2']);
          });
        }); 

    }


    else{
      this._usuarioService.crearUsuario(usuario)
      .subscribe(resp => {
        //console.log(usuario.email);
        //console.log(resp.email);

        this._usuarioService.getIdPorEmail(usuario.email)
          .subscribe(async data =>{  
            console.log(data);
            await this.delay(300);
           
            let alumno = new Alumno(data.toString(), null, null);
            console.log(alumno);
            this._AluService.crearAlumno(alumno).subscribe( resp =>{
              console.log(resp)
            });
        
            Swal.fire({
              title: '¡Te has registrado correctamente!',
              text: "Revisa tu bandeja de correo y encontrarás un email para validar tu cuenta.",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#515FC9',
              confirmButtonText: 'Aceptar'
            })
            this.router.navigate(['/login']);
          });
        }); 
    }
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
seleccionImagen( archivo:File){

  if(!archivo){
    this.imagenSubir=null;
    return;
  } 

  if(archivo.type.indexOf('image') < 0){

    Swal.fire({
      title: 'Sólo imágenes',
      text: "El archivo seleccionado no es una imagen",
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#515FC9',
      confirmButtonText: 'Aceptar'
    })
    this.imagenSubir=null;
    return;
  }
  
  this.imagenSubir=archivo;

  let reader = new FileReader();
  let urlImagenTemp = reader.readAsDataURL(archivo);

  reader.onloadend = () => this.imagenTemp = reader.result.toString();
  
}

  cambiarImagen(){  
    //this._usuarioService.cambiarImagen(this.imagenSubir, null/* usuarioID */);
  }

}

 


