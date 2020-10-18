import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { Profesor } from '../../models/profesor.model';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { NavbarService } from '../../services/navbar/navbar.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
              public router:Router,
              public _navmensaje: NavbarService
              ) { }
  user:Usuario;
  usuariosvar:any[] = [];
  para: boolean = false;
  nofalta: boolean = false;
  falta: number;
  profvar: Profesor[] = [];
  mensaje: string;
  editmensaje: string;
  
  deleteUser(id:string){

    swal({
      title: "¿Estás seguro?",
      text: "¿Estás seguro que quieres eliminar a este usuario con id: " + id + "?",
      icon: "warning",
      buttons: ["Volver",true],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {

        this._usuario.borrarUsuario(id)
        .subscribe((data:any) => {
          this._usuario.getUsers()
            .subscribe((data:any) => {
              this.usuariosvar = data;
              this._usuario.logout();
              this._usuario.cargarStorage();
              let mensaje = "Usuario y todos sus datos eliminados con exito";
    
              swal("Usuario eliminado", mensaje, "success");
            })
        });
      }
    });

  }

  convertir(id:string){    
    let profe = new Profesor(
      null,
      id,
    );

    swal({
      title: "¿Estás seguro?",
      text: "Estás apunto de convertirte en profesor, pero tranquilo, seguirás pudiendo pedir clases como alumno, ¿deseas continuar?",
      icon: "warning",
      buttons: ["Volver",true],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {

        this._profService.crearProfesor(profe).subscribe( resp =>{
          let mensaje = "Conversión a profesor realizada con exito";
    
          swal("Ahora eres profesor", mensaje, "success");
          this._usuario.cargarStorage();
    
        this._usuario.getUser(localStorage.getItem('id'))
        .subscribe((data:any) => {
          this.user = data
    
          this._profService.getProfs()
          .subscribe((data: Profesor[]) => {
            this.profvar = data;
            for (let index = 0; index < this.profvar.length; index++) {
              if(this.profvar[index].idUsuario == localStorage.getItem('id')){
                this.para = true;
              }
            }
          });
        });
    
        });

      }
    });
    
  }

  ngOnInit() {
    this._usuario.cargarStorage();
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
     
      this._profService.getProfs()
      .subscribe((data: Profesor[]) => {
        this.profvar = data;
        for (let index = 0; index < this.profvar.length; index++) {
          if(this.profvar[index].idUsuario == localStorage.getItem('id')){
            this.para = true;
          }
        }
      });
    });
    this.falta = 0;
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
      if(this.user.apellidos=="" || this.user.apellidos==null){
        this.falta++;
      }
      if(this.user.descripcion=="" || this.user.descripcion==null){
        this.falta++;
      }
      if(this.user.fecha_nacimiento==null){
        this.falta++;
      }
      if(this.user.foto==null){
        this.falta++;
      }
      if(this.falta != 0){
        this.nofalta=true;
      } 
    });
    
    if(localStorage.getItem('id')!=null){
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data;
      this.editmensaje = this.user.foto;
    this._navmensaje.customMensaje.subscribe(msg => this.mensaje = msg);
    this._navmensaje.changeMensaje(this.editmensaje);
    });
  }
  }
 
}
