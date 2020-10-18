import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import swal from 'sweetalert2';
import { ImparteService } from 'src/app/services/impartes/imparte.service';
import { ProfesorService } from 'src/app/services/usuario/profesor.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css', './../../../assets/css/style-guide.css']
})
export class ProfileEditComponent implements OnInit {

  id:string;
  rol:string;
  usuariosinfo:Usuario;
  forma: FormGroup;
  titulo: string;
  imagenSubir:File;
  imagenTemp: string;
  editNombre:boolean = false;

  constructor(
    public usuario: UsuarioService, 
    public http: HttpClient,
    public router: Router,
    public rutaActiva: ActivatedRoute,
    public _imparte:ImparteService,
    public _profesor:ProfesorService
  ) 
  { 
    
    this.rutaActiva.params.subscribe(params => {
      this.id = params.id;
      if (this.id!=localStorage.getItem('id')) this.router.navigate(['/panel-usuario/gestionar-cuenta']);;
      this.usuario.getUser(this.id)
      .subscribe((data:any) => {
        this.usuariosinfo = data;
       
      });
    })
  }

   editarUsuario(){
    //ESTO SE HACE PORQUE POR DEFECTO NO COGE LOS VALORES DEL VALUE DE LOS INPUTS
    //SE PODRÁ OPTIMIZAR BASTANTE

    if(this.forma.value.nombre == null){
      this.forma.value.nombre = this.usuariosinfo.nombre;
    }
    else{//Cambia el nombre del usuario, por lo que hay que cambiar sus impartes
      this.editNombre = true;
    }
    if(this.forma.value.apellidos == null){
      this.forma.value.apellidos = this.usuariosinfo.apellidos;
    }
    if(this.forma.value.email == null){
      this.forma.value.email = this.usuariosinfo.email;
    }
    if(this.forma.value.fecha == null){
      this.forma.value.fecha = this.usuariosinfo.fecha_nacimiento;
    }
    if(this.forma.value.contrasena == null){
      this.forma.value.contrasena = this.usuariosinfo.contrasena;
    }
    if(this.forma.value.descripcion == null){
      this.forma.value.descripcion = this.usuariosinfo.descripcion;
    }
    if(this.forma.value.foto == null){
      this.forma.value.foto = this.usuariosinfo.foto;
    }
    
    if(this.forma.value.id == null){
      this.forma.value.id = this.usuariosinfo.id;
    }
  
    //A PARTIR DE AQUÍ YA BIEN TODO
    if(this.usuario.esAdmin()){
      this.rol = '1';
    }
    else{
      this.rol= '0';
    }    
    let nuevoUsuario = new Usuario(
      this.forma.value.email,
      this.forma.value.contrasena,
      this.forma.value.nombre,
      this.forma.value.apellidos,
      this.forma.value.fecha,
      this.rol,
      this.forma.value.foto,
      this.forma.value.id,
      this.forma.value.descripcion
    );
    this.usuario.cambiarImagen(this.imagenSubir, localStorage.getItem('id'));
    this.usuario.editUser(this.usuariosinfo.id, nuevoUsuario)
      .subscribe(async (data:any) => {
        console.log("Editar perfil");
        
        await this.delay(2000);

        // this.usuario.guardarStorage(this.usuariosinfo.id, this.usuario.token, nuevoUsuario);
        this.router.navigate(['/panel-usuario/gestionar-cuenta']);
        this.usuario.cargarStorage();
        swal.fire({
          title: 'Perfil editado',
          text: "Perfil editado con exito",
          icon: 'success',
          confirmButtonColor: '#515FC9',
          confirmButtonText: 'Aceptar'
        })

        if(this.editNombre){//Si se ha editado el nombre, editar también el imparte del nombre
          this.usuario.getUser(localStorage.getItem('id'))
          .subscribe((usuario:any) => {
            this._profesor.obtenerIdProfesor(usuario.id)
              .subscribe((idProfesor:any) => {
                this._imparte.sacarAsignaturasPorId(idProfesor)
                  .subscribe((impartes:any) => {
                    impartes.forEach(imparte => {
                      imparte.nombreProfesor= this.forma.value.nombre;
                      this._imparte.editarImparte(imparte.id, imparte)
                      .subscribe( ok=>{//Editado ok
                      })
                    });
                  })
              })
          })
        }
       
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
      swal.fire({
        title: 'Solo imágenes',
        text: "El archivo seleccionado no es una imagen",
        icon: 'error',
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

  ngOnInit() {

    this.forma = new FormGroup({
      //id: new FormControl(),
      nombre: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fecha: new FormControl(null, Validators.required),
      descripcion: new FormControl(null),
      foto: new FormControl(null),
    });
  }
}
