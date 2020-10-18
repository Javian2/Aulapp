import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Reserva } from 'src/app/models/reserva.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { Route } from '@angular/compiler/src/core';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { ImparteService } from '../../services/impartes/imparte.service';
import swal2 from 'sweetalert2'
import { FormGroup, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import 'src/assets/js/external_api.js';
import { ReservaService } from 'src/app/services/reservas/reserva.service';
import { ValoracionesService } from 'src/app/services/valoraciones/valoraciones.service';
import { Valoracion } from 'src/app/models/valoraciones.model';
import { ProfesoresFavoritos } from '../../models/profesores-fav.model';
import { ProfesoresFavService } from '../../services/profesores-fav/profesores-fav.service';
import { Notificacion } from 'src/app/models/notificaciones.model';
import { NotificacionesService } from '../../services/notificaciones/notificaciones.service';
import { LogService } from '../../services/log/log.service';
import { Log } from '../../models/log.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavbarService } from '../../services/navbar/navbar.service';
import { Profesor } from 'src/app/models/profesor.model';
import { HorariosService } from 'src/app/services/horarios/horarios.service';
import { Horario } from 'src/app/models/horario.model';

declare var paypal;

@Pipe({
  name: 'safe1'
})

@Component({
  selector: 'app-profile-profesor',
  templateUrl: './profile-profesor.component.html',
  styleUrls: ['./profile-profesor.component.css', './../../../assets/css/style-guide.css']
})
export class ProfileProfesorComponent implements OnInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;

product = {
  price: 10.00,
  description: 'esto es una descripcion'
};

paidFor=false;


  forma: FormGroup;
  
  constructor(
    public _usuario: UsuarioService,
    public _profesor: ProfesorService,
    public _imparte: ImparteService,
    public _reserva: ReservaService,
    public router: Router,
    public rutaActiva: ActivatedRoute,
    public _proffav: ProfesoresFavService,
    public _logs: LogService,
    public _valoraciones: ValoracionesService,
    public _notis: NotificacionesService,
    public sanitizer: DomSanitizer,
    public _horarioService: HorariosService,
    public _navmensaje: NavbarService
  ) { }

  profesor: Usuario; 
  idProfesor: string;
  nombresAsignaturas: any[];
  id:any;
  asigs:any[] = [];
  inputOptions:any;
  hoy:string;
  precio;
  valoraciones:Valoracion[] = [];
  alumnos: Usuario[] = [];
  alumnosIds:any[] = [];
  puntos:any;
  total:any = 0;
  i:any = 0;
  media:any = 0;
  estafav:boolean=false;
  respuesta: any[];
  mes: string;
  profDrowpdown: boolean = false;
  publicProfile: any;
  notificacion:any;
  editnoti:any;
  editNotificacionArray:any;
  notificacionArray:any[] = [];
  horasProfesor:string[] = [];
  primeraHora:string;
  horasReservadas:string[] = [];
  horarioPerfil:any[] = [];
  horaEstado = [
    {
        "hora": null,
        "estado": null
    }
    
  ];

  lunes:boolean = false;
  martes:boolean = false;
  miercoles:boolean = false;
  jueves:boolean = false;
  viernes:boolean = false;
  sabado:boolean = false;
  domingo:boolean = false;

  paypalEnable:boolean = false;
  horaSeleccionada:boolean = false;

  //logs

  ip:any = null;
  nombreUsuario:any = null;
  aparecer:boolean = false;
  url:any = null;
  comprobarVideo:boolean = false;


  quitarDisabled(asignatura){
    this.horaSeleccionada=true;
    if(asignatura || this.paypalEnable){
      document.getElementById("paypal").style.pointerEvents = "auto";
      document.getElementById("paypal").style.opacity = '1';
    }

  }
  comprobarEnable(){
    if(this.horaSeleccionada){
      this.paypalEnable=true;
      this.quitarDisabled(null);
    }
  }


  cargarAsignaturas(dato:any){
    let i = 0;
    this._imparte.sacarAsignaturasPorId(this.id)
          .subscribe((asignaturas:any[]) => {
              asignaturas.forEach(elemento => {
                this.asigs.push(elemento);
              })
          })
  }

  cambiarPrecio(asig){
    this.asigs.forEach(asignatura => {
      if(asignatura.nombreAsignatura == asig){
        this.precio=asignatura.precio; 
        this.product.price=asignatura.precio;
      }
    });

  }

  redireccion(){
    this.router.navigate(['/login']);
  }

  mostrarDatetime(datetime:any, date:any, time:any){
    console.log(datetime);
    var datetimeFinal = (date + "T" + time);
    console.log(datetimeFinal);
  }

  async mostrarHoras(date){
    
    //Comprobar todas las reservas del profesor para obtener las horas que ya estan reservadas
    this.comprobarHorasReservadas(date);

    var fecha = new Date(date);
    var diaSemanaNumero = fecha.getDay();//0 es domingo, 1 lunes,etc
    var diaSemana = 'Lunes';  

    this.horaEstado=[
    {"hora": null,
    "estado": null}
    ];

    this.primeraHora='';

    switch(diaSemanaNumero) {
      case 0:
        diaSemana = 'Domingo'; 
        break;
      case 1:
        diaSemana = 'Lunes'; 
        break;
      case 2:
        diaSemana = 'Martes'; 
        break;
      case 3:
        diaSemana = 'Miércoles'; 
        break;
      case 4:
        diaSemana = 'Jueves'; 
        break;
      case 5:
        diaSemana = 'Viernes'; 
        break;
      case 6:
        diaSemana = 'Sábado'; 
        break;
      default:
        diaSemana = 'Lunes'; 
    }
    await this.delay(100);
    
    //Obtengo todos los horarios de ese profesor
    this._horarioService.getHorasProfesor(this.id, diaSemana)
    .subscribe((horarios:any[]) => {
      this.primeraHora=horarios[0].hora_inicio;
      
        horarios.forEach(horario => {
          var horaInicio = horario.hora_inicio;
          var horaFin = horario.hora_fin;
            
          //anadir todas las horas como libres
          for (let index = 0; index < horaFin - horaInicio; index++) {
                var horaNueva = horaInicio + index;
                  this.horaEstado.push({
                      'hora': horaNueva,
                      'estado': "libre"
                    });
          }
          //Comparar todas las horas con las que hay ya reservadas y cambiarle el estado a esas ya reservadas
          for (let index = 0; index < this.horaEstado.length; index++) {
            for (let j = 0; j < this.horasReservadas.length; j++) { 
              if(this.horaEstado[index].hora == this.horasReservadas[j]){
                this.horaEstado[index].estado="ocupada";
              }
            }
          }
        });
    }); 

  }

  comprobarHorasReservadas(fecha){
    if(fecha){
      this.horasReservadas=[];

      this.asigs.forEach(asignatura => {
        
        this._imparte.getImpartesPorProfesorAsignatura(this.id,asignatura.nombreAsignatura)
        .subscribe((imparte:any) =>{          
    
          this._reserva.mostrarReservasPorIdimparte(imparte.id)
          .subscribe((reservas:any) =>{
    
            reservas.forEach(reserva => {
    
              var fechaReserva=formatDate(new Date(reserva.fecha_inicio), 'yyyy-MM-dd', 'en');
  
              if(fecha == fechaReserva && reserva.idimparte == imparte.id && (reserva.estado=='aceptada' || reserva.estado=='pendiente')){
                var horaPillada=formatDate(new Date(reserva.fecha_inicio), 'H', 'en','+0');
                this.horasReservadas.push(horaPillada);
              }
      
            }); 
          }); 
    
        });

      });

    }
    
  }

  prueba(){
    console.log("ey");
  }

  
  crearReserva(){
    var inputAsignatura = (<HTMLInputElement>document.getElementById("subject")).value;
    var inputFecha = (<HTMLInputElement>document.getElementById("fecha")).value;
    var inputHora = (<HTMLInputElement>document.getElementById("time")).value;
    var inputObservacion = (<HTMLInputElement>document.getElementById("area")).value;

    /* console.log(inputObservacion); */

    /* console.log(inputAsignatura);
    console.log(inputFecha);
    console.log(inputHora);
    console.log(form.value.date)
    console.log(form.value.time)
    console.log(form.value.asignatura) */
    
    
    let existe=false;
    let ocupada=false;
    /* if (form.invalid){
      console.log("invalido form");
      return;
    }  */

    var datetime = (inputFecha + "T" + inputHora);

        //Obtener el id de imparte, pasandole el id de prosefor y el nombre de la asignatura
        this._imparte.getImpartesPorProfesorAsignatura(this.id,inputAsignatura)
        .subscribe((imparte:any) =>{

          //Crear el model de Reserva
         this.hoy=formatDate(new Date(), 'yyyy-MM-dd', 'en');
          /* let reserva = new Reserva(
            imparte.id,
            this._usuario.id,
            form.value.fecha,
            form.value.fecha,
            null,
            this.hoy,
            form.value.observacion,
            "pendiente"
          );
 */

          let reserva = new Reserva(
            imparte.id,
            this._usuario.id,
            datetime,
            datetime,
            null,
            this.hoy,
            inputObservacion,
            "pendiente"
          );


          //Comprobar que este alumno no tiene ya una reserva pendiente igual que la que trata de hacer
          this._reserva.mostrarReservasAlumno(localStorage.getItem('id'))
          .subscribe(async (reservas:any) =>{
            reservas.forEach(reserva => {
              let fechaReserva = formatDate(new Date(reserva.fecha_inicio), 'yyyy-MM-ddTH:mm', 'en','+0' );
              
              if(fechaReserva == inputFecha && reserva.idimparte == imparte.id && reserva.estado=='pendiente'){
                console.log("Ya tienes una reserva en esa fecha");
                existe=true;
                
              }
            }); 

             this._reserva.mostrarReservasPorIdimparte(imparte.id)
            .subscribe((reservas:any) =>{
              reservas.forEach(reserva => {
                let fechaReserva = formatDate(new Date(reserva.fecha_inicio), 'yyyy-MM-ddTH:mm', 'en', '+0');
                if(fechaReserva == inputFecha && reserva.idimparte == imparte.id && reserva.estado=='aceptada'){
                  console.log("Esa hora está ocupada");
                  ocupada=true;
                }
  
              }); 
            }); 
          await this.delay(200);


            if(!existe && !ocupada){//Si no tiene ninguna reserva igual, se realiza
  
              console.log(reserva.idusuario)
              if(reserva.idusuario != ""){
                this._reserva.crearReserva(reserva)
                .subscribe(async(resp:any) =>    {



                  let notificacion = new Notificacion(
                    this.idProfesor,
                    null,
                    "0",
                    "¡Tienes una nueva solicitud de clase! Accede a Mis Solicitudes para gestionarla."
                  );
              
                  this._notis.crearNotificacion(notificacion)
                  .subscribe(()=>{
                  })

                  var MiLog = new Log(localStorage.getItem('id'), "Ha pedido una clase a " + this.nombreUsuario, this.ip);
                  this._logs.crearLog(MiLog)
                    .subscribe(correcto => {
                      
                    })

                  

                  //Cerrar el modal de la reserva
                  document.getElementById('CerrarModal').click();
          
                  //Redirigir a solicitudes

                  
                  
                  swal('¡Reserva solicitada!', 
                  "La reserva se ha solicitado, cuando el profesor acepte o rechace la reserva serás notificado.", 
                  "success");

                  



                });
              }
            } else if(existe){//Si ya tiene una clase pendiente

              swal2.fire({
                title: '¡Ya le has solicitado una clase!',
                text: "Ya has solicitado una clase a este profesor a esta hora, prueba con otra hora u otra asignatura.",
                icon: 'warning',
                confirmButtonColor: '#515FC9',
                confirmButtonText: 'Aceptar'
              }) 

            } else if(ocupada){//Si ya tiene una clase pendiente

              swal2.fire({
                title: 'Horario no disponible',
                text: "El profesor tiene esta hora ocupada, escoge otra hora.",
                icon: 'warning',
                confirmButtonColor: '#515FC9',
                confirmButtonText: 'Aceptar'
              }) 
            }

          });



         
        })

  }
    delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }


  crearfav(id:string){

    this._profesor.obtenerIdProfesor(id)
    .subscribe((data:any) => {  
      
    let profefav = new ProfesoresFavoritos(
      data,
      localStorage.getItem('id'),
      null,
    );

        this._proffav.crearProfesorFav(profefav).subscribe( resp =>{
          this.estafav=true;
        });

    
  }); 
  }
  borrarfav(id:string){

    this._proffav.getProfFavUsu(localStorage.getItem('id'))
    .subscribe((favs:any)=>{
   
    this._profesor.obtenerIdProfesor(id)
    .subscribe((data:any) => {  
      favs.forEach(joder=>{
        if(joder.idprofesor==data){

          this._proffav.borrarProfesorFav(joder.id).subscribe( resp =>{
  
            this.estafav=false;
          });
          
        }
        
      });
         
  }); 

    });
  }



  traduFecha(){
    let html = `<span class="font-weight-bold">Usuario desde</span> <br> ${this.mes} del ${this.respuesta[0]} `;
    document.getElementById("fechaProf").innerHTML = html;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
}
  async ngOnInit() {
    //horario
    
    //logs
    if(localStorage.getItem('id') != null){
      this._logs.getIPAddress()
        .subscribe((ip:any) => {
          this.ip = ip.ip;
          this.rutaActiva.params.subscribe((parametros:any) => {
            this._usuario.getUser(parametros.id)
              .subscribe((user:any) => {
                this.nombreUsuario = user.nombre;
                var MiLog = new Log(localStorage.getItem('id'), "Ha entrado al perfil de " +  user.nombre, ip.ip);
                this._logs.crearLog(MiLog)
                  .subscribe((correcto:any) => {

                  });
              });
          });
        });
        //para mirar el perfil público del profesor
        this._usuario.getUser(localStorage.getItem('id'))
        .subscribe((data:any) => {
          //this.user = data;
          //this.editmensaje = this.user.foto;
          //this._navmensaje.customMensaje.subscribe(msg => this.mensaje = msg);
          //this._navmensaje.changeMensaje(this.editmensaje);

          //para saber en el dropdown si es profesor
          this._navmensaje.customPubProfile.subscribe(newEsProfe => this.publicProfile = newEsProfe);
          this._navmensaje.changePublicProfile(data.id);
        });
        //para saber si es profesor
        this._profesor.getProfs()
        .subscribe((data2: Profesor[]) => {
          let stop = false;
          for (let i = 0; (i < data2.length&&stop==false); i++){
            if(data2[i] != null && data2[i].idUsuario == localStorage.getItem('id')){
              //es profesor
              this._navmensaje.customProfe.subscribe(newPubProfile => this.profDrowpdown = newPubProfile);
              this._navmensaje.changeEsProfesor(true);
              stop = true;
              
            }
            else{
              this._navmensaje.customProfe.subscribe(newPubProfile => this.profDrowpdown = newPubProfile);
              this._navmensaje.changeEsProfesor(false);
            }
          }
        });
        //notificaciones 
        this._navmensaje.customNotificacion.subscribe(noti => this.notificacion = noti);
        this._navmensaje.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
        await this.delay(400);
        this.editnoti = this._navmensaje.numNotificaciones;
        this._navmensaje.newNoti(this.editnoti)
    
        this._navmensaje.customNotificacionArray.subscribe((notiArray:any) => this.notificacionArray = notiArray)
        this.editNotificacionArray = this._navmensaje.notificaciones;
        this._navmensaje.newArrayNotis(this.editNotificacionArray);
    }

    paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.product.description,
              amount: {
                currency_code: "EUR",
                value: this.product.price
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        this.paidFor = true;
        this.crearReserva();


      },
      onError: err => {
        console.log(err);
      }
    })
    .render(this.paypalElement.nativeElement);


    this.rutaActiva.params.subscribe( parametros =>{
      this.idProfesor = parametros.id;
      this._usuario.getUser(this.idProfesor)
      .subscribe(async(resultado: Usuario) =>{
        //Para el perfil público
        /*this._navmensaje.customPubProfile.subscribe(newEsProfe => this.publicProfile = newEsProfe);
        this._navmensaje.changePublicProfile(resultado.id);*/
        this.profesor = resultado;
        this.respuesta = this.profesor.createdAt.toString().split("-");
        if(resultado.video != null){
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(resultado.video.replace("watch?v=", "embed/"));
          if(resultado.video.includes("https://www.youtube.com") || resultado.video.includes("http://www.youtube.com")){
            this.comprobarVideo = true;
          }
          else{
            this.comprobarVideo = false;
          }
        }
     
        if(this.respuesta[1]=="01"){
          this.mes = "enero";
        }
        else if(this.respuesta[1]=="02"){
          this.mes = "febrero";
        }
        else if(this.respuesta[1]=="03"){
          this.mes = "marzo";
        }
        else if(this.respuesta[1]=="04"){
          this.mes = "abril";
        }
        else if(this.respuesta[1]=="05"){
          this.mes = "mayo";
        }
        else if(this.respuesta[1]=="06"){
          this.mes = "junio";
        }
        else if(this.respuesta[1]=="07"){
          this.mes = "julio";
        }
        else if(this.respuesta[1]=="08"){
          this.mes = "agosto";
        }
        else if(this.respuesta[1]=="09"){
          this.mes = "septiembre";
        }
        else if(this.respuesta[1]=="10"){
          this.mes = "octubre";
        }
        else if(this.respuesta[1]=="11"){
          this.mes = "noviembre";
        }
        else if(this.respuesta[1]=="12"){
          this.mes = "diciembre";
        }
        await this.delay(100);
        this.traduFecha();
      })
    })



    this._profesor.obtenerIdProfesor(this.idProfesor)
      .subscribe((data:any) => {
        this.id = data;
        this.cargarAsignaturas(this.id);


          this._valoraciones.mostrarValoracionesProfesor(this.id)
          .subscribe((data:any[]) =>{
            this.valoraciones = data;
             //Datos del alumno que le ha puntuado
            this.valoraciones.forEach((valoracion:Valoracion)=> {

              //calcular la media
              this.i = this.i+1;
              this.puntos = valoracion.puntuacion;
              this.total = this.total + valoracion.puntuacion;
              this.media = this.total / this.i;
              this.media = Math.trunc(this.media);

              //ARREGLAR
              this._usuario.getUser(valoracion.idusuario)
              .subscribe((data:any)=>{
                if(this.alumnosIds.includes(data.id) == false){
                  this.alumnosIds.push(data.id);
                  this.alumnos.push(data);
                }
              })
            })
            
        }) 
      }) 
      
      this._proffav.getProfFavUsu(localStorage.getItem('id'))
    .subscribe((favs:any)=>{
  
    this._profesor.obtenerIdProfesor(this.idProfesor)
    .subscribe((data:any) => {  
      favs.forEach(joder=>{
        if(joder.idprofesor==data){
        this.estafav=true;  
        }
        
      });
         

    
  }); 

    });

    this.rutaActiva.params.subscribe((parametros:any) => {
      this._profesor.obtenerIdProfesor(parametros.id)
        .subscribe((idprofe:any) => {
          this._horarioService.getHorarioProfesor(idprofe)
          .subscribe((hor:any) => {
            this.horarioPerfil = hor;
            hor.forEach((dias:any) => {
                if(dias.dia == "Lunes"){
                  this.lunes = true;
                }
                if(dias.dia == "Martes"){
                  this.martes = true;
                }
                if(dias.dia == "Miércoles"){
                  this.miercoles = true;
                }
                if(dias.dia == "Jueves"){
                  this.jueves = true;
                }
                if(dias.dia == "Viernes"){
                  this.viernes = true;
                }
                if(dias.dia == "Sabado"){
                  this.sabado = true;
                }
                if(dias.dia == "Domingo"){
                  this.domingo = true;
                }
            });
          })
        })
    });
  }
  
}
