import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { Profesor } from 'src/app/models/profesor.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from '../../../services/reservas/reserva.service';
import Swal from 'sweetalert2'
import { element } from 'protractor';
import { AlertService } from '../../../_alert';
import { Notificacion } from 'src/app/models/notificaciones.model';
import { NotificacionesService } from '../../../services/notificaciones/notificaciones.service';
import { NavbarService } from '../../../services/navbar/navbar.service';
import { LogService } from '../../../services/log/log.service';
import { Log } from '../../../models/log.model';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _reservaService: ReservaService,
    public _usuarioService: UsuarioService, 
    public _notiService: NotificacionesService, 
    public _navmensaje: NavbarService,
    public _logService: LogService,
    protected alertService: AlertService) { }

    user:Usuario;
    impartes: Imparte[] = [];
    impartesMios: Imparte[] = [];
    nomProfe:any;
    resvar: Reserva[] = [];
    resvar2: Reserva[] = [];
    profvar: Profesor[] = [];
    esProfe: boolean = false;
    usuarios: Usuario[] = [];
    guardarIds: any[] = [];
    resAceptadas: any[] = [];
    resPendientes: any[] = [];
    resRechazadas: any[] = [];
    resvarAceptadas: any[] = [];
    variableFecha:boolean;
    numeroPendientes:any = 0;
    imparteIds:any[] = [];
    impartesMios2: Imparte[] = [];
    reservasMias: Reserva[] = [];
    nomAlumno: any;

    notificacion:any;
    editnoti:any;

    notificacionArray:any[] = [];
    editNotificacionArray:any;

    ip:any = null;


    options = {
      autoClose: false,
      keepAfterRouteChange: false
  };


//Cancelar reserva realizada por el usuario
cancelarReserva(id:string){

  this._reservaService.getReservaPorID(id)
  .subscribe((reserva:any)=>{
    let parte1 = reserva.fecha_inicio.split("T")
    let fechaReserva = parte1[0];

    let dividir = fechaReserva.split("-");

    //en variables fecha reserva

    let ar = dividir[0]; //añoReserva
    let mr = dividir[1]; //mesReserva
    let dr = dividir[2]; //diaReserva


    let parte2 = parte1[1].split(".")
    let horaReserva = parte2[0];

    let dividir1 = horaReserva.split(":");

    //en variables hora reserva

    let hr = dividir1[0];     //hora reserva
    let minr = dividir1[1];   //minuto reserva
    let sr = dividir1[2];     //segundos reserva

    //FECHA RESERVA FINAL

    let FechaReserva = new Date(ar, mr, dr, hr, minr, sr);
    let FechaActual = new Date();
    if(FechaReserva.getDate() - FechaActual.getDate() >=1){




      
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Estás apunto de cancelar una reserva, ¿deseas continuar?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#B7B7B7',
        cancelButtonColor: '#515FC9',
        confirmButtonText: 'Cancelar reserva',
        cancelButtonText: 'Mantener'
      }).then((result) => {
        if (result.value) {
          this._reservaService.cancelarReserva(id)
      .subscribe(() =>{
        Swal.fire({
          title: 'Reserva cancelada',
          text: "Has cancelado la reserva seleccionada, ¡una pena!",
          icon: 'success',
          confirmButtonColor: '#515FC9',
          confirmButtonText: 'Aceptar'
     })
        this._reservaService.mostrarReservasAlumno(localStorage.getItem('id'))
        .subscribe((data:any[]) => {
          this.resvar=[];
          data.forEach(reserva => {
        
            if(reserva.estado == "aceptada"){
              this.resvar.push(reserva);
            }
            if(reserva.estado == "pendiente"){
             this.resvar.push(reserva);
            }
            if(reserva.estado == "rechazada"){
              this.resvar.push(reserva);
            }
          });
         })
  
         this.usuarios = [];
         this.guardarIds = [];
         //this.resvar2 = [];
         this.resAceptadas = [];
         this.resPendientes = [];
         this.resRechazadas = [];
         this.impartesMios = [];
         this.reservasProfesor();
        
       });
      }
    })
    }else{
      Swal.fire({
        title: 'La reserva no puede ser cancelada',
        text: "Quedan menos de 24 horas para la clase, no puedes cancelarla ya.",
        icon: 'warning',
        confirmButtonColor: '#515FC9',
        confirmButtonText: 'Aceptar'
     })
    }
  });
}

  eliminarReserva(id:string){
    this._reservaService.cancelarReserva(id)
    .subscribe(()=>{
      Swal.fire({
        title: 'Reserva eliminada',
        text: "Has eliminado la reserva seleccionada.",
        icon: 'success',
        confirmButtonColor: '#515FC9',
        confirmButtonText: 'Aceptar'
     })
      
      this.usuarios = [];
      this.guardarIds = [];
      this.resAceptadas = [];
      this.resPendientes = [];
      this.resRechazadas = [];
      this.impartesMios = [];
      this.reservasProfesor();
    })
  }

  //Rechazar reserva que recibes como profesor
  async rechazarReserva(idreserva:string, idalumno:string, idimparte:string){
      const { value: text } = await Swal.fire({
        title: 'Escribe la razón por la que rechazas la clase',
        input: 'textarea',
        inputPlaceholder: 'La razón que escribas será enviada al alumno.',
        inputAttributes: {
          'aria-label': 'Escribe aquí tu razón'
        },
        confirmButtonText: 'Enviar',
        confirmButtonColor: '#515FC9',
        cancelButtonColor: '#B7B7B7',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        reverseButtons: true
      })
      
      if (text) {
        Swal.fire({
          title: 'Solicitud rechazada',
          text: "La solicitud de reserva ha sido rechazada, se le notificará al alumno.",
          icon: 'success',
          confirmButtonColor: '#515FC9',
          confirmButtonText: 'Aceptar'
       })
        this._reservaService.rechazarReserva(idreserva)
        .subscribe(()=>{
        this._imparteService.getImpartePorId(idimparte)
        .subscribe((data:any)=>{
          let notificacion = new Notificacion(
            idalumno,
            idreserva,
            "0",
            "El profesor "+this.nomProfe+" ha rechazado tu solicitud para la clase de "+data.nombreAsignatura+" por la siguiente razón: '"+text+"'."
          );
      
          this._notiService.crearNotificacion(notificacion)
          .subscribe(()=>{
          })
        })
      })
    }
      this.usuarios = [];
      this.guardarIds = [];
      this.resAceptadas = [];
      this.resPendientes = [];
      this.resRechazadas = [];
      this.impartesMios = [];
      this.reservasProfesor();

      //logs

      this._usuario.getUser(idalumno)
      .subscribe((usuario:any) => {
        var miLog = new Log(localStorage.getItem('id'), "Ha rechazado la clase a " + usuario.nombre, this.ip);
        this._logService.crearLog(miLog)
          .subscribe(correcto => {
            
          })
      })
  }


  //Aceptar reserva que recibes como profesor
  aceptarReserva(idreserva:string, idalumno:string, idimparte:string){

    this._usuarioService.getUser(idalumno)
    .subscribe((alumno:any)=>{
        this._imparteService.getImpartePorId(idimparte)
        .subscribe((imparte:any)=>{

          //Aceptar reserva pasandole el email del alumno y el nombre del profesor para el correo
          this._reservaService.aceptarReserva(idreserva, alumno.email, imparte.nombreProfesor, imparte.nombreAsignatura)
          .subscribe(()=>{
        
            Swal.fire({
              title: 'Reserva aceptada',
              text: "Has aceptado la clase, se le notificará al alumno. ¡Viva!",
              icon: 'success',
              confirmButtonColor: '#515FC9',
              confirmButtonText: 'Aceptar'
           })
            
            this.usuarios = [];
            this.guardarIds = [];
            this.resAceptadas = [];
            this.resPendientes = [];
            this.resRechazadas = [];
            this.impartesMios = [];
            this.reservasProfesor();
          })
        })
    })

    this._imparteService.getImpartePorId(idimparte)
    .subscribe((data:any)=>{
      let notificacion = new Notificacion(
        idalumno,
        idreserva,
        "0",
        "El profesor "+this.nomProfe+" ha aceptado tu solicitud para la clase de "+data.nombreAsignatura+". Podrás acceder a la clase en la sección de gestionar cuenta"
      );
  
      this._notiService.crearNotificacion(notificacion)
      .subscribe(()=>{
      })
  
      this._reservaService.crearToken(idreserva)
      .subscribe((data:any)=>{
      });


    })

    this._usuario.getUser(idalumno)
      .subscribe((usuario:any) => {
        var miLog = new Log(localStorage.getItem('id'), "Ha aceptado la clase a " + usuario.nombre, this.ip);
        this._logService.crearLog(miLog)
          .subscribe(correcto => {

          })
      })
    

  }

  sacarImpartes(){
    this.resvar.forEach(element => {
      this._imparteService.getImpartePorId(element.idimparte)
        .subscribe((data:any) => {
          if(this.imparteIds.includes(data.id) == false){
            this.imparteIds.push(data.id);
            this.impartes.push(data);
          }
        })
    });
  }

  sacarReservasProfesor(){
    this.impartesMios.forEach(element => {
      this._reservaService.mostrarReservasPorIdimparte(element.id)
        .subscribe((data:any[]) => {
          data.forEach(reserva => {
        
            if(reserva.estado == "aceptada"){
              this.resAceptadas.push(reserva);
            }
            if(reserva.estado == "pendiente"){
              this.resPendientes.push(reserva);
            }
            if(reserva.estado == "rechazada"){
              this.resRechazadas.push(reserva);
            }
            this.numeroPendientes = this.resPendientes.length;
            this._usuario.getUser(reserva.idusuario)
              .subscribe((id:any) => {
                if(this.guardarIds.includes(id.id) == false){
                  this.usuarios.push(id);
                  this.guardarIds.push(id.id) 
                }
              })
          });
        })
    });
  }

  reservasProfesor(){
    this._profService.obtenerIdProfesor(localStorage.getItem('id'))
      .subscribe((data:any) => {
        if(data){
          this.esProfe = true;
          this._imparteService.sacarAsignaturasPorId(data)
            .subscribe((element:any[]) => {
              element.forEach(imparte => {
                this.impartesMios.push(imparte)
              });
              this.sacarReservasProfesor();
            })
         }
      })
  }

 
  caducada(reserva:any){
      let parte1 = reserva.fecha_inicio.split("T")
      let fechaReserva = parte1[0];

      let dividir = fechaReserva.split("-");

      //en variables fecha reserva

      let ar = dividir[0]; //añoReserva
      let mr = dividir[1]; //mesReserva
      let dr = dividir[2]; //diaReserva


      let parte2 = parte1[1].split(".")
      let horaReserva = parte2[0];

      let dividir1 = horaReserva.split(":");

      //en variables hora reserva

      let hr = dividir1[0];     //hora reserva
      let minr = dividir1[1];   //minuto reserva
      let sr = dividir1[2];     //segundos reserva

      //FECHA RESERVA FINAL

      let FechaReserva = new Date(ar, mr, dr, hr, minr, sr);
      let FechaActual = new Date();
      if(FechaReserva.getDate() - FechaActual.getDate() >=1){
        return false;
      }
      else{
        
        return true;
      }
    }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async ngOnInit() {

    //logs

    this._logService.getIPAddress()
      .subscribe((ip:any) => {
        this.ip = ip.ip;
      })

    

    this._usuario.cargarStorage();
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) =>{
      this.nomProfe=data.nombre;
    })
    
    //Reservas que ha realizado el usuario  
    this._reservaService.mostrarReservasAlumno(localStorage.getItem('id'))
      .subscribe((data:any[]) => {
        data.forEach(reserva => {
        
          if(reserva.estado == "aceptada"){
            this.resvar.push(reserva);
          }
          if(reserva.estado == "pendiente"){
           this.resvar.push(reserva);
          }
          if(reserva.estado == "rechazada"){
            this.resvar.push(reserva);
          }
        });
        this.sacarImpartes();
      })

    this.reservasProfesor();
    //this.comprobarHoraClase();

    //notificacion

    this._navmensaje.customNotificacion.subscribe(noti => this.notificacion = noti);
    this._navmensaje.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    await this.delay(400);
    this.editnoti = this._navmensaje.numNotificaciones;
    this._navmensaje.newNoti(this.editnoti)

    this._navmensaje.customNotificacionArray.subscribe((notiArray:any) => this.notificacionArray = notiArray)
    this.editNotificacionArray = this._navmensaje.notificaciones;
    console.log(this.editNotificacionArray);
    this._navmensaje.newArrayNotis(this.editNotificacionArray);
   }
   
}