import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../../services/asignaturas/asignaturas.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/models/asignaturas.model';
import { FilterPipe } from '../../pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { Profesor } from '../../models/profesor.model';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { ImparteService } from '../../services/impartes/imparte.service';
import { Imparte } from '../../models/imparte.model';
import swal from 'sweetalert';
import { element } from 'protractor';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.css','../login/login.component.css']
})
export class RegisterStep2Component implements OnInit {

  public asignaturas:Asignatura[] = []; //variable que utilizamos para mostrar en un for todas las asignaturas. Son las que salen cuando realizamos una búsqueda
  mostrarMensaje:boolean = false; //variable que utilizamos para comprobar si el input del modal de añadir asignatura está vacío o no. Si está vacío no saldrá nada, si no está vacío mostrará un mensaje con la asignatura añadida
  nuevaAsignatura:Asignatura; //nueva asignatura que se crea y se añade a la bd después de dar añadir en el modal de añadir asignatura
  nombreAsignatura:string; //variable que empleamos para mostrar la asignatura introducida en el modal de añadir asignatura
  pageActual:number = 1; //variable para la paginación
  filterPost = '';//variable para el pipe
  asignaturasElegidas:any[] = []; //vector donde se almacenan los Ids de las asignaturas a impartir por un profesor
  nombreAsignaturasElegidas:string[] = []; //vector donde se almacenan los nombres de las asignaturas a impartir por un profesor
  imparte:Imparte; //variable para mandar imparte
  noExisteAsignatura:any

  //gestion de asignaturas

  idProfesor:any;
  nombreProfesor:any;
  imparteGestion:Imparte;
  vectorInicialIdsAsignaturas:any[] = [];
  gestionarCuenta:boolean;


  noExiste(asignatura:string){
    if(this.nombreAsignaturasElegidas.includes(asignatura)){
      console.log();
    }
    else{
      this.noExisteAsignatura = asignatura;
    }
  }

  mostrarVectores(){
    console.log(this.asignaturasElegidas);
    console.log(this.nombreAsignaturasElegidas);
    //console.log(this._usuario.variable.nombre);
  }

  borrarNombreVector(badge:string){
    let i = this.nombreAsignaturasElegidas.indexOf(badge);
    //borramos nombre vector
    this.nombreAsignaturasElegidas.splice(i, 1);

    //obtenemos las asignaturas y buscamos el id de la asignatura que tiene el nombre pasado por parametro
    this._asignatura.getAsigs()
      .subscribe((data:Asignatura[]) => {
        data.forEach(asignaturas => {
            if(asignaturas.nombre === badge){
              let i:any = asignaturas.id;
              this.vectorIdsAsignaturas(i);
            }
        });
        //cada vez que se añade desde el modal de añadir asignatura se añade el id del último elemento al vector de Ids
      }); 
  }

  //Función que se encarga de rellenar y borrar el array de los IDs de las asignaturas elegidas por un profesor
  vectorIdsAsignaturas(id:number){
    if(this.asignaturasElegidas.includes(id)){
      let i = this.asignaturasElegidas.indexOf(id);
      this.asignaturasElegidas.splice(i, 1);
    }
    else{
      this.asignaturasElegidas.push(id);
      
    }
  }

  //Función que se encarga de rellenar y borrar el array de los nombres de las asignaturas elegidas por un profesor
  vectorNombresAsignaturas(name:string){
    if(this.nombreAsignaturasElegidas.includes(name)){
      let i = this.nombreAsignaturasElegidas.indexOf(name);
      this.nombreAsignaturasElegidas.splice(i, 1);
    }
    else{
      this.nombreAsignaturasElegidas.push(name);
      
    }
  }

  //función que se ejecuta al añadir una asignatura en el modal de añadir asignatura
  anadirAsignatura(nombre:string){
    if(nombre != ''){
      this.nuevaAsignatura = new Asignatura(null, nombre)
      this._asignatura.crearAsignatura(this.nuevaAsignatura)
      .subscribe( resp => {
        this.nombreAsignatura = this.nuevaAsignatura.nombre;
        this.mostrarMensaje = true;
        this.nombreAsignaturasElegidas.push(nombre);

        
        //Para no tener que actualizar para que salgan las asignaturas recién introducidas
        this._asignatura.getAsigs()
          .subscribe((data:Asignatura[]) => {
            //solo añado el último elemento introducido
            this.asignaturas.push(data[data.length -1]);
            //cada vez que se añade desde el modal de añadir asignatura se añade el id del último elemento al vector de Ids
            this.asignaturasElegidas.push(this.asignaturas[this.asignaturas.length - 1].id)
          });  
      })
    }
    //input vacío, ni se añade ni se muestra el mensaje
    else{
      this.mostrarMensaje = false;
    }
  }

  //limpia el formulario una vez añadida una asignatura
  limpiarFormulario(selector){
    var elemento = document.querySelector(selector);
    elemento.value = '';
  }



  
  constructor(
    public _asignatura:AsignaturaService,
    public _usuario:UsuarioService,
    public _imparte:ImparteService,
    public _prof:ProfesorService,
    public router: Router,
    public rutaActiva: ActivatedRoute
  ) {
    this._asignatura.getAsigs()
      .subscribe((data:Asignatura[]) => {
      
            data.forEach(asignaturas => {
                this.asignaturas.push(asignaturas);        
            });
      });    
   }


  volver(){
    this._usuario.borrarVariable();
  }

  /* crearProfesor(){
    this._usuario.crearUsuario(this._usuario.variable)
    .subscribe( resp =>{
      
      this._usuario.login(this._usuario.variable, null)
      .subscribe(correcto =>{
      
        this._usuario.cargarStorage();
        let profe = new Profesor(null, localStorage.getItem('id'));
        this._usuario.logout();
        this._prof.crearProfesor(profe).subscribe( resp =>{
          console.log(resp)
        });

        let mensaje = "Revisa tu bandeja de correo y encontrarás un email para validar tu cuenta.";
        swal("¡Te has registrado correctamente!", mensaje, "success");
        this.router.navigate(['/login']);
      });
    }); 
  } */

  saltarPaso(){
    this.router.navigate(['/login']);
  }

  crearImparte(){
    console.log(this.vectorInicialIdsAsignaturas);
    console.log(this.asignaturasElegidas)
    let j = 0;
    this.rutaActiva.params.subscribe(async params => {
      if(params.id != null){
        //gestion de asignaturas
       
        //Añadir nuevas asignaturas
        this.asignaturasElegidas.forEach(async(element:any) => {
          if(this.vectorInicialIdsAsignaturas.includes(element) == false){
            console.log("Esta tengo que añadirla")
            await this.delay(1000);
            this.imparteGestion = new Imparte(this.idProfesor, element, null, '10', this.nombreProfesor, this.nombreAsignaturasElegidas[j])
            this._imparte.crearImparte(this.imparteGestion)
              .subscribe((correcto:any) => {
                this.router.navigate(['/panel-usuario/gestionar-cuenta']);
              })
          }
          j++;
        });

        //Eliminación de asignaturas
        this.vectorInicialIdsAsignaturas.forEach(async(inicial:any) => {
          if(this.asignaturasElegidas.includes(inicial) == false){
            console.log(inicial)
            await this.delay(1000);
            this._imparte.borrarImparteGestion(this.idProfesor, inicial)
              .subscribe((correcto:any) => {
                this.router.navigate(['/panel-usuario/gestionar-cuenta']);
              })
          }
        });
        await this.delay(1100);
        this.router.navigate(['/panel-usuario/gestionar-cuenta']);
      }
      else{
        //nuevo profesor

        if(this.asignaturasElegidas.length == 0){
          Swal.fire({
            title: '!Tienes que seleccionar alguna asignatura!',
            text: "En caso de no querer en este momento puedes omitir paso y seleccionarlas más tarde",
            icon: 'warning',
            confirmButtonColor: '#3085d6'
          }) 
        }
        else{
          let i = 0;
          this.asignaturasElegidas.forEach(async(element:any) => {
            await this.delay(1000);     
  
            //obtendo el último id de profesores
            this._prof.getProfs()
              .subscribe((data:Profesor[]) => {
                this.imparte = new Imparte(data[data.length - 1].id, element, null, '10', this._usuario.variable.nombre, this.nombreAsignaturasElegidas[i])
                i++;
                this._imparte.crearImparte(this.imparte)
                  .subscribe((correcto:any) => {
                    this.router.navigate(['/login']);
                  })
              })
          });
        }
      }
    })
  }

  



  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async ngOnInit() {
    this.gestionarCuenta = false;
    this.rutaActiva.params.subscribe(params => {
      if(params.id != null){
        this.gestionarCuenta = true;
        console.log("gestionar cuentaa");
        this._prof.obtenerIdProfesor(params.id)
          .subscribe((data:any) => {
            this.idProfesor = data;
            if(data){
              this._imparte.sacarAsignaturasPorId(data)
                .subscribe((asignaturas:any) => {
                  asignaturas.forEach((nombreAsig:any) => {
                    this.nombreAsignaturasElegidas.push(nombreAsig.nombreAsignatura);
                    this.asignaturasElegidas.push(nombreAsig.idasignatura)
                  });
                })
              this._usuario.getUser(params.id)
                .subscribe((profesor:any) => {
                  this.nombreProfesor = profesor.nombre
                })
            }
          })
      }
    })

    //vector inicial de ids de las asignaturas
    await this.delay(700);  
    this.asignaturasElegidas.forEach(async (ids:any) => {
      this.vectorInicialIdsAsignaturas.push(ids);
    });
  }


}
