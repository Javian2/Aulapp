import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { pipe, throwError } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { LogService } from '../log/log.service';
import { Log } from '../../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  id: string;
  usuariosvar:any[] = [];
  variable: Usuario;

  ip:any = null;

  


  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService,
    public _log: LogService
  ) { 
    this.cargarStorage();
  }



  borrarVariable(){
    this.variable=null;
  }

  guardarStorage( id: string, token: string, usuario: Usuario){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
   
    this.usuario = usuario;
    this.token = token;
    this.id = id;
  }

  async logout(){


    this._log.getIPAddress()
      .subscribe((ip:any) => {
        var miLog = new Log(localStorage.getItem('id'), "El usuario ha cerrado sesión", ip.ip);
        this._log.crearLog(miLog)
          .subscribe((correcto:any) => {
          })
      })

    await this.delay(1500);

    this.usuario = null;
    this.token = '';
    this.id = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');


    
    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ){


     let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, {token})
          .pipe(map( async (resp:any) =>{
            await this.delay(300);
            this.guardarStorage(resp.usuario.id,resp.token,resp.usuario);
            localStorage.setItem('google', '1');
         
            return true;
          }),
          catchError( this.handleError)
          );
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  handleError(error: HttpErrorResponse) {
    
     let errorMessage = 'Este usuario ya se registró con el formulario de registro, por favor, logueate introduciendo tu email y contraseña';
 
     //window.alert(errorMessage);
     swal("Oops" , errorMessage ,  "error");
    
    return throwError(errorMessage);
  }

  login( usuario: Usuario, recordar: boolean = false){
    
    if(recordar){
      localStorage.setItem('email',usuario.email);
    }else{
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
            .pipe(map( (resp: any) =>{

              this.guardarStorage(resp.usuario.id,resp.token,resp.usuario);
              
              return true;
            }));
  
  }

  passIguales(usuario: Usuario){
    let url = URL_SERVICIOS + '/login/pass';
    return this.http.post(url, usuario)
            .pipe(map( (resp: any) =>{            

              //this.guardarStorage(resp.usuario.id,resp.token,resp.usuario);
             
              return true;
            }));
  }
  
  crearUsuario(usuario: Usuario){

    let url = URL_SERVICIOS + '/usuarios/nuevo';

    return this.http.post( url, usuario, {responseType: 'text'} );
  }
  recuperarContra(email : string){
    console.log("¿Qué pasa a API? " + email);
    let url = URL_SERVICIOS + '/usuarios/recuperar/' + email;
    return this.http.put(url, email, {responseType : 'text'});
  }

  verificarUsuario(token: any){
    let url = URL_SERVICIOS + '/usuarios/activar/' + token;
    return this.http.put(url, {responseType: 'text'});
  }
  /*verificarContra(token: any){
    let url = URL_SERVICIOS + '/usuarios/comprobar/' + token; //TODO
    console.log("¿Es el token? " + token);
    return this.http.get(url);
  }*/


 
  estaLogueado() {
    return (this.token.length >5) ? true : false;
  }

  estaVerificado(){
    return (this.usuario.verificada) ? true : false;
  }

  esAdmin(){      
    if(this.usuario == null) return false;
    return (this.usuario.rol=='1') ? true : false;
  }
  cargarStorage(){
    
    if(localStorage.getItem('token')){
      this.token=localStorage.getItem('token');
      this.usuario=JSON.parse(localStorage.getItem('usuario'));
      this.id = localStorage.getItem('id');
    

    } else{
      this.token = '';
      this.usuario = null;
      this.id = '';
    }
  }
  
  cambiarImagen(archivo:File, id:string){

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
        .then( resp =>{
       
        this.cargarStorage();
        
        })
        .catch( resp =>{
          
          
        })
  }
  reenviarCorreo(email:string){
    let url = URL_SERVICIOS + '/usuarios/reenviar/' + email;
    console.log(email)
    return this.http.post( url, {responseType: 'text'} );
  }



  getUsers(){
    return this.http.get(URL_SERVICIOS + '/usuarios');
  }

  getUsersP(desde:number=0){
    return this.http.get(URL_SERVICIOS + '/usuarios/paginada/' + desde);
  }
  getUsersT(){
    return this.http.get(URL_SERVICIOS + '/usuarios/total');
  }
  
  getUser(id:string){
    return this.http.get(URL_SERVICIOS + '/usuarios/' +  id);
  }
  getUserByToken(token:string){
    return this.http.get(URL_SERVICIOS + '/usuarios/recuperarToken/' + token);
  }

  getIdPorEmail(email:string){
    return this.http.get(URL_SERVICIOS + '/usuarios/sacarId/' + email)
  }
  getUserPorNombre(email:string){
    return this.http.get(URL_SERVICIOS + '/usuarios/buscarPorNombre/' + email)
  }

  getVerPorEmail(email:string){
    return this.http.get(URL_SERVICIOS + '/usuarios/sacarVerificada/' + email)
  }

  cambiarToken(email:string){
    let url = URL_SERVICIOS + '/usuarios/modificarToken/' + email;
    return this.http.put( url, {responseType: 'text'})
  }

  borrarUsuario(id:string){
    return this.http.delete(URL_SERVICIOS +'/usuarios/' + id, {responseType: 'text'})
  }

  editUser(id:string, usuario:Usuario){
    let url = URL_SERVICIOS + '/usuarios/' + id;
    
    if(usuario.id == id){
      return this.http.put( url, usuario, {responseType: 'text'});
    }
  } 
  buscarUsuario(nombre:string){
   
    return this.http.get(URL_SERVICIOS + '/usuarios/buscarUsu/' + nombre)
  } 
  
  comprobarPass(usuario: Usuario){
    let url = URL_SERVICIOS + '/usuarios/comprobarPass';
    return this.http.post(url, usuario, {responseType: 'text'});
  }

  autenticoUser(){
    if(this.id == this.usuario.id){
        return true;
    }
    else{
      return false;
    }
  }
}