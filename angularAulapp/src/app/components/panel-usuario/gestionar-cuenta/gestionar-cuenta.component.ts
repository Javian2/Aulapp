import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { HorariosService } from 'src/app/services/horarios/horarios.service';
import { NgForm } from '@angular/forms';
import { Horario } from 'src/app/models/horario.model';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Imparte } from '../../../models/imparte.model';
import { Alumno } from '../../../models/alumno.model';
import { AlumnoService } from '../../../services/usuario/alumno.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'safe'
})

@Component({
  selector: 'app-gestionar-cuenta',
  templateUrl: './gestionar-cuenta.component.html',
  styleUrls: ['./gestionar-cuenta.component.css', './../../../../assets/css/style-guide.css']
})
export class GestionarCuentaComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
              public _profService: ProfesorService,
              public _horarioService: HorariosService,
              public _imparteService: ImparteService,
              public router:Router,
              public _alu:AlumnoService,
              public sanitizer: DomSanitizer,
              public _navmensaje: NavbarService) { }

             
             
  forma: FormGroup;
  user:Usuario;
  usuariosvar:any[] = [];
  para: boolean = false;
  nofalta: boolean = false;
  falta: number;
  profvar: Profesor[] = [];
  mensaje: string;
  publicProfile: any;
  profDrowpdown: boolean = false;
  editmensaje: string;
  idProfesor:string;
  horariosProfesor:any[] = [];
  horariosProfesorInicial:any[] = [];
  dias:any = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  iteracion=-1;
  borrarHorarios:any[] =[];
  alumBanner:string;
  alum:Alumno;

  asignaturasImpartidas:any[] = [];

  //notis

  notificacion:any;
  editnoti:any;

  notificacionArray:any[] = [];
  editNotificacionArray:any;

  url:any = null;
  url1:any = null;
  comprobarEnlace:boolean = null;


  comprobarURL(url:any){
    var element = <HTMLInputElement> document.getElementById("seis");

    if(url.includes("https://www.youtube.com") || url.includes("http://www.youtube.com")){
      element.disabled = false;
      this.comprobarEnlace = true;
    }
    else{
      element.disabled = true;
      this.comprobarEnlace = false;
    }
  }

  guardarURL(url:any){

    this._usuario.getUser(localStorage.getItem('id'))
      .subscribe((user:any) => {
        var MiUsuario = new Usuario(user.email, user.contrasena, user.nombre, user.apellidos, user.fecha_nacimiento, user.rol, user.foto, user.id, user.descripcion, user.tokenTemp, user.verificada, url, user.createdAt, user.updatedAt);
        this._usuario.editUser(localStorage.getItem('id'), MiUsuario)
          .subscribe(correcto => {
            this.url1 = MiUsuario.video;

            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(MiUsuario.video.replace("watch?v=", "embed/"));
          })        
      })
  }

  eliminarURL(){
    var element = <HTMLInputElement> document.getElementById("seis");
    this._usuario.getUser(localStorage.getItem('id'))
      .subscribe((user:any) => {
        var MiUsuario = new Usuario(user.email, user.contrasena, user.nombre, user.apellidos, user.fecha_nacimiento, user.rol, user.foto, user.id, user.descripcion, user.tokenTemp, user.verificada, null, user.createdAt, user.updatedAt);
        this._usuario.editUser(localStorage.getItem('id'), MiUsuario)
          .subscribe(correcto => {
            this.url1 = "";
            element.disabled = true;

          })        
      })
  }


  deleteUser(id:string){


    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Nos pone muy tristes las despedidas! ¿Estás seguro que deseas eliminar tu cuenta? Esta acción es irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B7B7B7',
      cancelButtonColor: '#515FC9',
      confirmButtonText: 'Eliminar cuenta',
      cancelButtonText: 'Cancelar'
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
              Swal.fire({
                title: 'Cuenta eliminada correctamente',
                text: "Esperamos volver a verte pronto. 😭",
                imageUrl: 'https://media.tenor.com/images/6103aabda8a39325a3e1dd577b4cfeec/tenor.gif',
                imageWidth: 400,
                imageHeight: 250,
                imageAlt: 'Gato llorando',
                confirmButtonColor: '#515FC9',
                confirmButtonText: 'Aceptar'
              })
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

    Swal.fire({
      title: 'Estás a punto de convertirte en profesor',
      text: "¡Hora de dar clase! Esta acción es irreversible, pero tranquilo, seguirás pudiendo recibir clases de otros profesores. ¿Deseas continuar?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#B7B7B7',
      cancelButtonColor: '#515FC9',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Convertir'
    })
    .then(willDelete => {
      if (willDelete) {
        this.setPara();

        this._profService.crearProfesor(profe).subscribe( resp =>{
        
          Swal.fire({
            title: 'Te has convertido en profesor',
            text: "Ahora podrás dar clase a otros alumnos, añade las asignaturas que quieres impartir en Gestionar cuenta, ¡manos a la obra!",
            icon: 'success',
            confirmButtonColor: '#515FC9',
            confirmButtonText: 'Aceptar'
          })
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
                this.idProfesor=this.profvar[index].id;

              }
            }
          });
        });
    
        });

      }
    });
    
  }

  setPara(){
  this.alumBanner="1";

  let nuevoalumno = new Alumno(
    this.alum.idUsuario,
    "1",
    this.alum.id
  );

  this._alu.editAlu(this.alum.id, nuevoalumno)
  .subscribe((data)=>{
  })
  }

  obtenerHorario(){
    //Recuperar horarios del profesor
    //Si es profesor
    if(this.para){
      
      //Obtengo todos los horarios de ese profesor
      this._horarioService.getHorarioProfesor(this.idProfesor)
      .subscribe((horarios:any[]) => {

          this.horariosProfesor = horarios;
          this.horariosProfesorInicial = horarios;

      });
    }
  }

  //Guarda toda la informacion de los horarios
  guardarHorario(form:NgForm){
    

    if(form==null){//Al clickar en el boton de guardar horario entra y llama a esta misma funcion para cada horario
      for (let index = 0; index <this.horariosProfesor.length; index++) {
        let id = 'enviar-form' + index;
        document.getElementById(id).click();
      }
      this.iteracion=-1;

    }else{//Para cada horario entra aqui y va guardando los valores 

      if (form.invalid){
        return;
      }  
      this.iteracion++;

        //Si los campos están llenos se añade o actualiza
        if(Object.values(form.value)[1] != null || Object.values(form.value)[2]!=null){
          
            if((this.horariosProfesor[this.iteracion].idhorarios == null)){
              //Nuevo horario
              let horarioNuevo = new Horario(
                Object.values(form.value)[0].toString(),
                Object.values(form.value)[1].toString(),
                Object.values(form.value)[2].toString(),
                this.idProfesor,
                null
              );
              this._horarioService.setHorarioProfesor(horarioNuevo)
              .subscribe(resp =>{

              });

            }else{
              //Actualizar horario
              let horarioNuevo = new Horario(
                Object.values(form.value)[0].toString(),
                Object.values(form.value)[1].toString(),
                Object.values(form.value)[2].toString(),
                this.idProfesor,
                null
              );

              this._horarioService.putHorarioProfesor(horarioNuevo, this.horariosProfesor[this.iteracion].idhorarios)
              .subscribe(resp =>{

              });              

            }

        }
        this.borrarHorarios.forEach(element => {
          this._horarioService.deleteHorarioProfesor(element)
          .subscribe(resp=>{
          });
        });

      let mensaje= "";
      swal("Horario guardado", mensaje, "success"); 
      document.getElementById('CerrarModal').click();
    }

  }

  addHora(){
    console.log("Añado hora");
    this.horariosProfesor.push({"dia":'Lunes',"nuevo":true});   
  }

  eliminarHorario(i){
    let id='horario' + i;
    document.getElementById(id).style.display='none';
    this.borrarHorarios.push(this.horariosProfesor[i].idhorarios);
  }

  editarimparte(id){

        
    this._imparteService.getImpartePorId(id)
    .subscribe((data:any)=>{

      if(this.forma.value.precio == null){
        this.forma.value.precio = data.precio;
      }
      
      let nuevoImparte = new Imparte(
        data.idprofesor,
        data.idasignatura,
        id,
        this.forma.value.precio,
        data.nombreProfesor,
        data.nombreAsignatura
      );
    
      console.log(nuevoImparte);
    
      this._imparteService.editarImparte(id, nuevoImparte)
      .subscribe( (data:any)=>{
        this.recargar();
        
    
      });
    
      
      
    }); 
  }

  recargar(){

    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((usuario:any) => {
      this._profService.obtenerIdProfesor(usuario.id)
        .subscribe((idProfesor:any) => {
          this._imparteService.sacarAsignaturasPorId(idProfesor)
            .subscribe((asignaturas:any) => {
              this.asignaturasImpartidas = asignaturas;
            })
        })
    })
  }
  
  quitarDisabled(i:number){
    var element = <HTMLInputElement> document.getElementsByClassName("botonGuardar")[i];
    if(i != undefined){
      element.disabled = false;
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async ngOnInit() {

    this.forma = new FormGroup({
      precio: new FormControl(null),
    });



    this._usuario.cargarStorage();
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
     
      this._profService.getProfs()
      .subscribe((data2: Profesor[]) => {
        this.profvar = data2;
        for (let index = 0; index < this.profvar.length; index++) {
          if( this.profvar[index] != null && this.profvar[index].idUsuario == localStorage.getItem('id')){
            this.para = true;
            this.alumBanner = "1";
            this.idProfesor=this.profvar[index].id;
            //para saber en el dropdown si es profesor
            this._navmensaje.customProfe.subscribe(newPubProfile => this.profDrowpdown = newPubProfile);
            this._navmensaje.changeEsProfesor(true);
          }
        }
        if(this.para==false){
          this._alu.obtenerIdAlumno(localStorage.getItem('id'))
          .subscribe((data3:any)=>{
            
          this.alumBanner=data3.banner;
          this.alum=data3;
  
           });
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
      //Para la foto
    this._navmensaje.customMensaje.subscribe(msg => this.mensaje = msg);
    this._navmensaje.changeMensaje(this.editmensaje);
    //Para el perfil público
      this._navmensaje.customPubProfile.subscribe(newEsProfe => this.publicProfile = newEsProfe);
      this._navmensaje.changePublicProfile(this.user.id);
    
    });
  }

    //sacar asignaturas

    this._usuario.getUser(localStorage.getItem('id'))
      .subscribe((usuario:any) => {
        this._profService.obtenerIdProfesor(usuario.id)
          .subscribe((idProfesor:any) => {
            this._imparteService.sacarAsignaturasPorId(idProfesor)
              .subscribe((asignaturas:any) => {
                this.asignaturasImpartidas = asignaturas;
              })
          })
      })

    
    //notificaciones 

    this._navmensaje.customNotificacion.subscribe(noti => this.notificacion = noti);
    this._navmensaje.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    await this.delay(400);
    this.editnoti = this._navmensaje.numNotificaciones;
    this._navmensaje.newNoti(this.editnoti)

    this._navmensaje.customNotificacionArray.subscribe((notiArray:any) => this.notificacionArray = notiArray)
    this.editNotificacionArray = this._navmensaje.notificaciones;
    this._navmensaje.newArrayNotis(this.editNotificacionArray);

    this._usuario.getUser(localStorage.getItem('id'))
      .subscribe((user:any) => {
        this.url1 = user.video;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(user.video.replace("watch?v=", "embed/"));
        /* console.log(this.url); */
        
      })




  }

}
