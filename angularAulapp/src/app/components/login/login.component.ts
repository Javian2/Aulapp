import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import swal from 'sweetalert2'
import { ProfesorService } from '../../services/usuario/profesor.service';
import { LogService } from '../../services/log/log.service';
import { Log } from 'src/app/models/log.model';


declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;
  fallo: boolean = false;

  confirmacionEmail:boolean = false;
  comprobarLogin:boolean = false;

  ip:any = null;

  constructor( 
    public router: Router,
    public _usuarioService: UsuarioService,
    public _profesor:ProfesorService,
    public _log:LogService
    ) { }


  //-------  LOGIN GOOGLE ----------
  
  ngOnInit() {
    this.googleInit();

   // this._usuarioService.guardarStorage(this._usuarioService.id, this._usuarioService.token, this._usuarioService.usuario);
    this.email = localStorage.getItem('email') || '';
    if(this.email.length >1){
      this.recuerdame=true;
    }

    this._log.getIPAddress()
      .subscribe((ip:any) => {
        this.ip = ip.ip;
        //console.log(this.ip);
      })
  }


  googleInit(){
    gapi.load('auth2', () =>{
      this.auth2 = gapi.auth2.init({
        client_id: '689375913021-9771n74h53lln12a27ev2s26053g4b8d.apps.googleusercontent.com',
        /* cookiepolicy: 'single_host_origin', */
        scope: 'profile email'
      });

      this.attachSigin( document.getElementById('btnGoogle'));

    });
  }

  attachSigin( element ){

    this.auth2.attachClickHandler( element, {}, (googleUser) =>{
      
      //let profile = googleUser.getBasicProfile();
      
      let token = googleUser.getAuthResponse().id_token;
      
      this._usuarioService.loginGoogle(token)
      .subscribe( async () => {
          await this.delay(400);
          this.router.navigate(['/home']);
      });
    
      
    } );
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  //------- LOGIN NORMAL --------

  async ingresar( forma: NgForm){

    if (forma.invalid){
      return;
    }
    
    let usuario = new Usuario(forma.value.email, forma.value.contrasena, null, null, null, null, null);


    this._usuarioService.getVerPorEmail(forma.value.email)
      .subscribe(resp =>{
        if(resp == false){
          this.confirmacionEmail = true;
          swal.fire({
            icon: 'error',
            title: 'Cuenta no activada',
            text: 'No has validado el email asociado a esta cuenta, revisa tu bandeja de correo.',
            showCancelButton: true,
            cancelButtonText: '¡Voy a ello!',
            confirmButtonColor: '#B7B7B7',
            cancelButtonColor: '#515FC9',
            confirmButtonText: 'Reenviar correo'
          }).then((result) => {
            if (result.value) {
                this._usuarioService.cambiarToken(forma.value.email)
                .subscribe(resp =>{
                  console.log(resp);
                  this._usuarioService.reenviarCorreo(forma.value.email)
                  .subscribe(resp =>{
                    console.log(resp);
                  })
                })
            }
          })

        } else{
          this._usuarioService.login(usuario, forma.value.recuerdame)
          .subscribe(async correcto =>{
            this.fallo=false;
            await this.delay(300);
            var miLog:Log = new Log(localStorage.getItem('id'), "El usuario ha iniciado sesión", this.ip);
            this._log.crearLog(miLog)
              .subscribe((correcto:any) => {
                //console.log("creo mi log");
              })
      
            
            this._profesor.obtenerIdProfesor(localStorage.getItem('id'))
              .subscribe(correcto => {
                this.router.navigate(['/panel-usuario/gestionar-cuenta']);
                this.comprobarLogin = true;
              })
            
            await this.delay(200);
            if(this.comprobarLogin == false){
              this.router.navigate(['/home']);
            }
            
      
          }, error =>{
            //Si falla el login
            this.fallo=true;
          });
        }
      }, error => {
        console.log("Entro");
        this.fallo = true;
      })

    
    if(!localStorage.getItem('id')){
      await this.delay(1200);
      if(this.confirmacionEmail == false){
        this.fallo = true;
      }
    }
  }
}
