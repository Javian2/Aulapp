import { Injectable } from '@angular/core';
import { ProfesorService } from '../usuario/profesor.service';
import { ImparteService } from '../impartes/imparte.service';
import { Imparte } from '../../models/imparte.model';
import { ReservaService } from '../reservas/reserva.service';
import { Reserva } from '../../models/reserva.model';



@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _reservaService: ReservaService,
  ) { }

  impartesMios: Imparte[] = [];
  esProfe: boolean = false;
  resvarAceptadas: any[] = [];

  //profe

  variableFecha:boolean;
  variableReserva:Reserva;
  taspasadoProf:boolean;
  ReservataspadadoAlu:Reserva;
  
  //alumno

  variableFechaAlumno:boolean;
  variableReservaAlumno:Reserva;
  taspasadoAlu:boolean;
  ReservataspadadoProf:Reserva;

  



  misSolicitudesAlumno(){
    var comprobar = false;
    this.variableFechaAlumno = false;
    this._reservaService.mostrarReservasAlumno(localStorage.getItem('id'))
      .subscribe((data:any) => {
        data.forEach((element:any) => {
          if(element.estado == "aceptada"){
            let parte1 = element.fecha_inicio.split("T")
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

            let MyDate01 = new Date(ar, mr, dr, hr, minr, sr);
            let fechaReservaFinal = null;

            MyDate01.setMinutes(MyDate01.getMinutes() - 5);
            fechaReservaFinal = MyDate01.getFullYear() + '-'
              + ('0' + (MyDate01.getMonth())).slice(-2) + '-'
              + ('0' + MyDate01.getDate()).slice(-2)

            //FECHA RESERVA + 50 MINS

            let MiFecha50 = new Date(ar, mr, dr, hr, minr, sr);
            MiFecha50.setMinutes(MiFecha50.getMinutes() + 50);
            let fechaReserva50 = MiFecha50.getFullYear() + '-'
              + ('0' + (MiFecha50.getMonth())).slice(-2) + '-'
              + ('0' + MiFecha50.getDate()).slice(-2)
              

            //HORA RESERVA FINAL

            let MyDate02 = new Date(ar, mr, dr, hr, minr, sr);
            MyDate02.setMinutes(MyDate02.getMinutes() - 5)

            let horaActualReserva:any = MyDate02.getHours();
            let minutoActualReserva:any = MyDate02.getMinutes();


            horaActualReserva = ("0" + horaActualReserva).slice(-2);
            minutoActualReserva = ("0" + minutoActualReserva).slice(-2);

            let horaCompletaActualReserva = horaActualReserva + ":" + minutoActualReserva + ":" + "00";

            //HORA RESERVA FINAL + 50MINS

            let MiHora50 = new Date(ar, mr, dr, hr, minr, sr);
            MiHora50.setMinutes(MiHora50.getMinutes() + 50)

            let horaActualReserva50:any = MiHora50.getHours();
            let minutoActualReserva50:any = MiHora50.getMinutes();

            horaActualReserva50 = ("0" + horaActualReserva50).slice(-2);
            minutoActualReserva50 = ("0" + minutoActualReserva50).slice(-2);

            let horaCompletaActualReserva50 = horaActualReserva50 + ":" + minutoActualReserva50 + ":" + "00";

            //fecha actual - 5mins
            var MyDate = new Date();
            var fechaActual = null;

            MyDate.setMinutes(MyDate.getMinutes() - 5);
            

            fechaActual = MyDate.getFullYear() + '-'
              + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-'
              + ('0' + MyDate.getDate()).slice(-2)


            //hora actual - 5mins

            let MyDate1 = new Date();

            let horaActual:any = MyDate1.getHours();
            let minutoActual:any = MyDate1.getMinutes();


            horaActual = ("0" + horaActual).slice(-2);
            minutoActual = ("0" + minutoActual).slice(-2);

            let horaCompletaActual = horaActual + ":" + minutoActual + ":" + "00";

            //comprobacion fecha y hora reservas = fecha y hora actuales 

            /* console.log("Fecha Reserva Final: " + fechaReservaFinal);
            console.log("Fecha Actual: " + fechaActual);
            console.log("Hora Reserva Final: " + horaCompletaActualReserva);
            console.log("Hora Actual: " + horaCompletaActual);

            if(fechaReservaFinal == fechaActual && horaCompletaActualReserva == horaCompletaActual){
              console.log("entroooooooo")
              this.variableFecha = true;
              this.variableReserva = element;
            }  */

            console.log("Fecha Reserva Final: " + fechaReservaFinal);
            console.log("Fecha Reserva + 50: " + fechaReserva50);
            console.log("Fecha Actual: " + fechaActual);
            console.log("Hora Reserva Final: " + horaCompletaActualReserva);
            console.log("Hora Reserva + 50: " + horaCompletaActualReserva50);
            console.log("Hora Actual: " + horaCompletaActual);


            if((fechaReservaFinal <= fechaActual && fechaReserva50 >= fechaActual) && (horaCompletaActualReserva <= horaCompletaActual && horaCompletaActualReserva50 >= horaCompletaActual) && (comprobar == false)){
              comprobar = true;
              this.variableFechaAlumno = true;
              this.taspasadoAlu=false;
              this.variableReservaAlumno = element;
            }else{
              this.variableFechaAlumno=false;
              this.taspasadoAlu=true;
              this.ReservataspadadoAlu=element;
            }
          }
        });
      })
  }

  reservasProfesor(){
    this.impartesMios = [];
    this.resvarAceptadas = [];
    this.variableFecha = false;
    this._profService.obtenerIdProfesor(localStorage.getItem('id'))
      .subscribe((data:any) => {
        if(data){
          this.esProfe = true;
          this._imparteService.sacarAsignaturasPorId(data)
            .subscribe((element:any[]) => {
              element.forEach(imparte => {
                this.impartesMios.push(imparte)
              });
              this.reservasAceptadasProfesor();
            })
         }
      })
  }

  reservasAceptadasProfesor(){
    for(let i = 0; i < this.impartesMios.length; i++){
      this._reservaService.mostrarReservasPorIdimparte(this.impartesMios[i].id)
        .subscribe((data:any[]) => {
          data.forEach(reserva => {
            if(reserva.estado == "aceptada"){
              this.resvarAceptadas.push(reserva);
            }
          });
          if(i == this.impartesMios.length - 1){
            //comprobamos las fechas aquí debajo
            this.resvarAceptadas.forEach(element => {

              //reserva

              let parte1 = element.fecha_inicio.split("T")
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

              let MyDate01 = new Date(ar, mr, dr, hr, minr, sr);
              let fechaReservaFinal = null;

              MyDate01.setMinutes(MyDate01.getMinutes() - 5);
              fechaReservaFinal = MyDate01.getFullYear() + '-'
                + ('0' + (MyDate01.getMonth())).slice(-2) + '-'
                + ('0' + MyDate01.getDate()).slice(-2)

              //FECHA RESERVA + 50 MINS

              let MiFecha50 = new Date(ar, mr, dr, hr, minr, sr);
              MiFecha50.setMinutes(MiFecha50.getMinutes() + 50);
              let fechaReserva50 = MiFecha50.getFullYear() + '-'
                + ('0' + (MiFecha50.getMonth())).slice(-2) + '-'
                + ('0' + MiFecha50.getDate()).slice(-2)
                

              //HORA RESERVA FINAL

              let MyDate02 = new Date(ar, mr, dr, hr, minr, sr);
              MyDate02.setMinutes(MyDate02.getMinutes() - 5)

              let horaActualReserva:any = MyDate02.getHours();
              let minutoActualReserva:any = MyDate02.getMinutes();


              horaActualReserva = ("0" + horaActualReserva).slice(-2);
              minutoActualReserva = ("0" + minutoActualReserva).slice(-2);

              let horaCompletaActualReserva = horaActualReserva + ":" + minutoActualReserva + ":" + "00";

              //HORA RESERVA FINAL + 50MINS

              let MiHora50 = new Date(ar, mr, dr, hr, minr, sr);
              MiHora50.setMinutes(MiHora50.getMinutes() + 50)

              let horaActualReserva50:any = MiHora50.getHours();
              let minutoActualReserva50:any = MiHora50.getMinutes();

              horaActualReserva50 = ("0" + horaActualReserva50).slice(-2);
              minutoActualReserva50 = ("0" + minutoActualReserva50).slice(-2);

              let horaCompletaActualReserva50 = horaActualReserva50 + ":" + minutoActualReserva50 + ":" + "00";

              //fecha actual - 5mins
              var MyDate = new Date();
              var fechaActual = null;

              MyDate.setMinutes(MyDate.getMinutes() - 5);
              

              fechaActual = MyDate.getFullYear() + '-'
                + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-'
                + ('0' + MyDate.getDate()).slice(-2)


              //hora actual - 5mins

              let MyDate1 = new Date();

              let horaActual:any = MyDate1.getHours();
              let minutoActual:any = MyDate1.getMinutes();


              horaActual = ("0" + horaActual).slice(-2);
              minutoActual = ("0" + minutoActual).slice(-2);

              let horaCompletaActual = horaActual + ":" + minutoActual + ":" + "00";

              //comprobacion fecha y hora reservas = fecha y hora actuales 

              /* console.log("Fecha Reserva Final: " + fechaReservaFinal);
              console.log("Fecha Actual: " + fechaActual);
              console.log("Hora Reserva Final: " + horaCompletaActualReserva);
              console.log("Hora Actual: " + horaCompletaActual);

              if(fechaReservaFinal == fechaActual && horaCompletaActualReserva == horaCompletaActual){
                console.log("entroooooooo")
                this.variableFecha = true;
                this.variableReserva = element;
              }  */

              /* console.log("Fecha Reserva Final: " + fechaReservaFinal);
              console.log("Fecha Reserva + 50: " + fechaReserva50);
              console.log("Fecha Actual: " + fechaActual);
              console.log("Hora Reserva Final: " + horaCompletaActualReserva);
              console.log("Hora Reserva + 50: " + horaCompletaActualReserva50);
              console.log("Hora Actual: " + horaCompletaActual); */


              if((fechaReservaFinal <= fechaActual && fechaReserva50 >= fechaActual) && (horaCompletaActualReserva <= horaCompletaActual && horaCompletaActualReserva50 >= horaCompletaActual)){
                this.variableFecha = true;
                this.taspasadoProf=false;
                this.variableReserva = element;
              }
              else{
                this.taspasadoProf=true;
                this.ReservataspadadoProf=element;
                this.variableFecha = false;
              }

              //comprobar

              

            });
          }
        })
    };
    

  }
}
