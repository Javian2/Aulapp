import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id:string;
  usuariosinfo:Usuario;
  forma: FormGroup;
  imagenSubir:File;
  imagenTemp: string;

  constructor(
    public usuario: UsuarioService, 
    public http: HttpClient,
    public rutaActiva: ActivatedRoute,
    public router: Router
  ) 
  { 
    this.rutaActiva.params.subscribe(params => {
      this.id = params.id;
      this.usuario.getUser(this.id)
      .subscribe((data:Usuario) => {
        this.usuariosinfo = data
     
      });
    })
  }

  editarUsuario(){
    //ESTO SE HACE PORQUE POR DEFECTO NO COGE LOS VALORES DEL VALUE DE LOS INPUTS
    //SE PODRÁ OPTIMIZAR BASTANTE

    if(this.forma.value.nombre == null){
      this.forma.value.nombre = this.usuariosinfo['nombre'];
    }
    if(this.forma.value.apellidos == null){
      this.forma.value.apellidos = this.usuariosinfo['apellidos'];
    }
    if(this.forma.value.email == null){
      this.forma.value.email = this.usuariosinfo['email'];
    }
    if(this.forma.value.fecha == null){
      this.forma.value.fecha = this.usuariosinfo['fecha'];
    }
    if(this.forma.value.contrasena == null){
      this.forma.value.contrasena = this.usuariosinfo['contrasena'];
    }
    if(this.forma.value.descripcion == null){
      this.forma.value.descripcion = this.usuariosinfo['descripcion'];
    }
    if(this.forma.value.foto == null){
      this.forma.value.foto = this.usuariosinfo['foto'];
    }

    //A PARTIR DE AQUÍ YA BIEN TODO
    
    let nuevoUsuario = new Usuario(
      this.forma.value.email,
      this.forma.value.contrasena,
      this.forma.value.nombre,
      this.forma.value.apellidos,
      this.forma.value.fecha,
      '0', //Rol de usuario
      this.forma.value.foto,
      this.usuariosinfo['id'],
      this.forma.value.descripcion
    );
   
    this.usuario.editUser(this.usuariosinfo['id'], nuevoUsuario)
      .subscribe(async (data:any) => {
        await this.delay(300);
      
        this.router.navigate(['/admin/crud-usuario']);
        let mensaje = "Usuario editado con exito";

        swal("Usuario editado", mensaje, "success");
    })
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
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir=null;
      return;
    }
    
    this.imagenSubir=archivo;
  
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
    
  }

  cambiarImagen(){  
        
    this.usuario.cambiarImagen(this.imagenSubir, this.usuariosinfo['id']);
    //this.usuario.cambiarImagen(this.imagenSubir, localStorage.getItem('id'));
  }

  ngOnInit() {

    this.forma = new FormGroup({
      //id: new FormControl(),
      nombre: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fecha: new FormControl(null, Validators.required),
      contrasena: new FormControl(null, [Validators.required, 
        Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]),
      descripcion: new FormControl(null),
      foto: new FormControl(null),
    },  {
        });
    }
}
