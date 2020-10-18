import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { NgForm } from '@angular/forms';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from '../../../services/reservas/reserva.service';
import { Reporte } from 'src/app/models/reporte.model';
import { ReportesService } from '../../../services/reportes/reportes.service';
import swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { Profesor } from '../../../models/profesor.model';
import { LogService } from '../../../services/log/log.service';
import { Log } from '../../../models/log.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _reservaService: ReservaService,
    public _usuarioService: UsuarioService, 
    public _reporteService: ReportesService,
    public _logs: LogService
    
    ) { }

    reservaId:any;
    clasesRealizadas:Reserva[] = [];
    clasesRealizadas2:Reserva[] = [];
    imparteIds:any[] = [];
    profIds:any[]=[];
    prof:Profesor[]=[];
    impartes: Imparte[] = [];
    usuIds:any[]=[];
    nombreusu:Usuario[]=[];
    razonesAlumno: any[]=["He sufrido problemas a la hora de comunicarme con el usuario", "He sufrido algún tipo de acoso e insulto por parte del usuario",
    "El usuario ha llegado tarde a la clase", "Tengo una incidencia con el cobro de la clase", "El usuario se ha equivocado al elegir la materia para dar clase", "Otro motivo"];
    idprofesor:any;
    impartesprof:any[]=[];
    respagadasprof:Reserva[]=[];
    esprofe:boolean=false;
    malumno:boolean=true;
    mprofe:boolean=false;

    //logs
    ip:any = null;

  mandarIdReserva(id:any){
    this.reservaId = id;
  }

    reportarUsuario(form:NgForm){

      let reporte = new Reporte(
        this.reservaId,
        form.value.razon,
        form.value.observacion,
        "0"
      );

      this._reporteService.crearReporte(reporte)
      .subscribe(()=>{

        
        document.getElementById('CerrarModal').click();
        swal.fire({
          icon: 'success',
          title: '¡Gracias por tu reporte!',
          text: 'Analizaremos tu reporte',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        })

        var MiLog = new Log(localStorage.getItem('id'), "Ha reportado una incidencia de la reserva: " + reporte.idReserva, this.ip);
        this._logs.crearLog(MiLog)
          .subscribe(correcto => {
            
          }); 

      })

    }

    mostrarProfesor(){
      this.mprofe=true;
      this.malumno=false;
    }

    mostrarAlumno(){
      this.mprofe=false;
      this.malumno=true;
      }


  ngOnInit() {
    this._usuario.cargarStorage();
    this._reservaService.mostrarReservasAlumno(localStorage.getItem('id'))
    .subscribe((data:any[])=>{
      data.forEach(bucle=>{
        this.clasesRealizadas2.push(bucle);
      });
     console.log(this.clasesRealizadas2);
     
      
      
      data.forEach(reserva =>{
        this._imparteService.getImpartePorId(reserva.idimparte)
        .subscribe((come:any) => {
          if(this.imparteIds.includes(come.id) == false){
            this.imparteIds.push(come.id);
            this.impartes.push(come);
          }
            

          
          
          this.impartes.forEach(hola=>{
            this._profService.getProf(hola.idprofesor)
            .subscribe((data2:any)=>{
              if(this.profIds.includes(data2.id) == false){
                this.profIds.push(data2.id);
                this.prof.push(data2);
              }
           
            });

          })

        })
      })
    data.forEach(reser=>{
      this._usuarioService.getUser(reser.idusuario)
      .subscribe((data:any)=>{
        if(this.usuIds.includes(data.id) == false){
          this.usuIds.push(data.id);
          this.nombreusu.push(data);
        }
      })
    })

    })

    this._profService.obtenerIdProfesor(localStorage.getItem('id'))
  .subscribe((data:any)=>{
    if(data){
      this.esprofe=true;
      this.malumno=false;
      this.mprofe=true;
    this.idprofesor=data;


    this._imparteService.sacarAsignaturasPorId(this.idprofesor)
    .subscribe((data:any[])=>{
      data.forEach(imparte => {
        this.impartesprof.push(imparte)
      });
  
    this.impartesprof.forEach(element=>{
      this._reservaService.mostrarReservasPorIdimparte(element.id)
      .subscribe((data:any[])=>{
        data.forEach(reserva =>{
          if(reserva.estado == "pagada"){
            this.clasesRealizadas.push(reserva);
          }
        });
    

        data.forEach(reserva =>{
          this._imparteService.getImpartePorId(reserva.idimparte)
          .subscribe((data:any) => {
            if(this.imparteIds.includes(data.id) == false){
              this.imparteIds.push(data.id);
              this.impartes.push(data);
            }
          })
        })
        data.forEach(reser=>{
          this._usuarioService.getUser(reser.idusuario)
          .subscribe((data:any)=>{
            if(this.usuIds.includes(data.id) == false){
              this.usuIds.push(data.id);
              this.nombreusu.push(data);
            }
          })
        })
      });
    });
    
    });
  }
  });
    

  if(localStorage.getItem('id') != null){
    this._logs.getIPAddress()
      .subscribe((ip:any) => {
        this.ip = ip.ip;
      })
  }
   }
  

}
