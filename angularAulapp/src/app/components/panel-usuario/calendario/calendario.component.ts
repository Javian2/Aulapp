import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listWeek from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';


import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from '../../../services/reservas/reserva.service';
import { ProfesorService } from 'src/app/services/usuario/profesor.service';
import { ImparteService } from 'src/app/services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { start } from 'repl';
import swal from 'sweetalert2';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGridPlugin, listWeek, interactionPlugin];
  calendarWeekends = true;

  
  es = 'es';
  header= {
    left: 'title',
    right:  'dayGridMonth,timeGridWeek,timeGridDay,prev,next'
  };
  footer = {
    center: 'today',
    right: "listWeek"
  };
  timeZone = 'UTC';
  eventTimeFormat: { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }


  calendarEvents: EventInput[] = [
    { title: 'Evento', start: new Date(), description: 'Hola Caraculo' }
];

  

  

  handleDateClick(arg) {
    
    /*
    if (confirm('¿Seguro que quieres añadir un evento a las  ' +  arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'Nuevo Evento',
        description: 'Hola Caraculo',
        start: arg.date,
        allDay: arg.allDay
      })
    }
    */

    swal.fire({
      icon: 'question',
      title: '¿Quieres añadir un evento?',
      text: ('Evento seleccionado: ' + arg.dateStr),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if(result.value){ 

        swal.fire({
          icon: 'success',
          title: 'Evento añadido',
          text: 'Si has especificado la hora, puedes visualizar el evento en la parte de "list" o en la ventana "month"'
        })
        this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
          title: 'Nuevo Evento',
          description: 'Hola Caraculo',
          start: arg.date,
          allDay: arg.allDay
        })
      }
    });


  }

  ngOnInit(){
    
  }

  /*
  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent;

  es = 'es';
  header= {
    left: 'title',
    right:  'dayGridMonth,timeGridWeek,timeGridDay,prev,next'
  };
  footer = {
    center: 'today',
    right: "listWeek"
  };
  
  calendarPlugins = [dayGridPlugin, timeGridPlugin, listWeek];
  timeZone = 'UTC';
  eventTimeFormat: { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];
  

  constructor(
    public _reservaService: ReservaService,
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _usuario:UsuarioService
  ) { }

  esProfe: boolean = false;
  impartesMios: Imparte[] = [];
  resAceptadas: any[] = [];
  resPendientes: any[] = [];
  resRechazadas: any[] = [];
  resvarAceptadas: any[] = [];
  variableFecha:boolean;
  numeroPendientes:any = 0;
  usuarios: Usuario[] = [];
  guardarIds: any[] = [];

  ngOnInit() {
   //this.reservasProfesor();
    
  }

  handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay
      })
    }
  }

  /*
  reservasProfesor(){
    this._profService.obtenerIdProfesor(localStorage.getItem('id'))
      .subscribe((data:any) => {
        if(data){
          this.esProfe = true;
          this._imparteService.sacarAsignaturasPorId(data)
            .subscribe((element:any[]) => {
              element.forEach(imparte => {
                
                this.calendarEvents.push({
                  id: imparte.id,
                  title: imparte.nombreAsignatura,
                  start: imparte.createdAt
                })
                
                this.impartesMios.push(imparte)
              });
              this.sacarReservasProfesor();
            })
         }
      })
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
                  console.log("RESERVA");
                  console.log(id);
                  this.guardarIds.push(id.id) 
                }
              })
          });
        })
    });
  }
  */
  

}
