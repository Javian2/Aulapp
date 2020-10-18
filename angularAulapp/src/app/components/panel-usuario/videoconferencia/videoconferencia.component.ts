import { Component, OnInit } from '@angular/core';
import 'src/assets/js/external_api.js';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ReservaService } from '../../../services/reservas/reserva.service';
import { Reserva } from '../../../models/reserva.model';
import { Imparte } from '../../../models/imparte.model';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { SolicitudesService } from '../../../services/solicitudes/solicitudes.service';
import { Valoracion } from '../../../models/valoraciones.model';
import { ValoracionesService } from '../../../services/valoraciones/valoraciones.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { LogService } from '../../../services/log/log.service';
import { Log } from '../../../models/log.model';

declare var main:any;
declare var JitsiMeetExternalAPI:any;

@Component({
  selector: 'app-videoconferencia',
  templateUrl: './videoconferencia.component.html',
  styleUrls: ['./videoconferencia.component.css', './../../../../assets/css/style-guide.css']
})
export class VideoconferenciaComponent implements OnInit {

  api:any;
  motor:any;

  constructor(
    public _usuario:UsuarioService,
    public _reserva: ReservaService,
    public _impart: ImparteService,
    public _solicitudService: SolicitudesService,
    public _profService: ProfesorService,
    public _valoracion: ValoracionesService, 
    public router: Router,
    public _logs: LogService) { }


      user:Usuario;
      reservas:Reserva;
      reserOK:Reserva;
      imparte: Imparte;
      para: boolean = false;
      idprof:any;
      idimparte:any;
      profvar: Profesor[] = [];
      busqueda:any;
      ruta : boolean = false;
      esProfe: boolean = false;
      puntuacion: any = 0;
      puntos:any = 0;
      total:any = 0;
      i:any = 0;
      media:any = 0;
      valoraciones:Valoracion[] = [];
      cambiar:boolean=false;
    //logs
    ip:any = null;

    sacarValorEstrella(puntos:any){
      this.puntuacion=puntos;
    }

    cambiarSidebar1(){
      this.cambiar=false;
      document.getElementById("ajustes").style.color = "#48465B";
      document.getElementById("models").style.color = "#6C63FF";
      
    }

    cambiarSidebar2(){
      this.cambiar=true;
      document.getElementById("ajustes").style.color = "#6C63FF";
      document.getElementById("models").style.color = "#48465B";
    }

    abrirEntorno3D(){
      document.getElementById("videoconference").style.width = "400px";
      document.getElementById("videoconference").style.height = "300px";
    }
    cerrarEntorno3D(){
      document.getElementById('videoconference').style.width = '100%';
      document.getElementById('videoconference').style.height = '700px';
    }

  ngOnInit() {

    dragElement(document.getElementById("mydiv"));
    document.getElementById("ajustes").style.color = "#48465B";
    document.getElementById("models").style.color = "#6C63FF";
    
    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }
    
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
    
      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
   
    //sacar datos del usuario
    this._usuario.cargarStorage();
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
      this._profService.getProfs()
      .subscribe((data: Profesor[]) => {
        this.profvar = data;
        for (let index = 0; index < this.profvar.length; index++) {
          if(this.profvar[index].idUsuario == localStorage.getItem('id')){
            this.idprof=this.profvar[index].id;
            
            this.para = true;
          }
        }  

        if(this._solicitudService.variableFecha==true){
          this.esProfe = true;
          this.busqueda=this._solicitudService.variableReserva.id
          this.idimparte=this._solicitudService.variableReserva.idimparte
        }else{
          this.busqueda=this._solicitudService.variableReservaAlumno.id
        }
       
        this._reserva.getReservaPorID(this.busqueda)
        .subscribe((data:any)=>{
          this.reservas=data;
       
          if(this.reservas.estado=="aceptada"){
            if(this._solicitudService.variableFecha==false){
              if(this.user.id==this.reservas.idusuario){
                this.reserOK=this.reservas;
              }
            }
          }

          this._impart.getImpartePorId(this.reservas.idimparte)
          .subscribe((data:any)=>{
          this.imparte=data;

          if(this.imparte.idprofesor==this.idprof){
            this.reserOK=this.reservas;
          }
         
    var domain = "meet.jit.si";
    var options = {
        roomName: this.reserOK.token ,
        parentNode: document.querySelector('#videoconference'),
        jwt:  this._usuario.usuario.id,
        displayName: this._usuario.usuario.nombre,
        //password: this._usuario.usuario.nombre,
        avatarUrl: URL_SERVICIOS + '/imagenes' + '/usuarios/' + this._usuario.usuario.foto,
        userInfo: {
          email: this._usuario.usuario.email,
      },
        configOverwrite: {
          subject: 'Clase en Aulapp',
          defaultLanguage: 'es',
          noSSL: false,
          enableUserRolesBasedOnToken: false,
          p2p: {
            enabled: true
          },
          enableWelcomePage: false,
          enableClosePage: false,
          /* noticeMessage: 'La sesión durará 1 hora' */ //Esto supuestamente envia un mensaje a la sesión pero no va 
        },
        interfaceConfigOverwrite: {
          DEFAULT_REMOTE_DISPLAY_NAME: 'Aulapp usuario',
          DEFAULT_LOCAL_DISPLAY_NAME: 'yo',
          DEFAULT_BACKGROUND: '#515FC9',
          AUDIO_LEVEL_PRIMARY_COLOR: '#515FC9',
          AUDIO_LEVEL_SECONDARY_COLOR: '#515FC9',
            filmStripOnly: false,
            DISABLE_VIDEO_BACKGROUND: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            VIDEO_QUALITY_LABEL_DISABLED: true,
            CLOSE_PAGE_GUEST_HINT: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            ENABLE_FEEDBACK_ANIMATION: false,
            MOBILE_APP_PROMO: false,
            SHOW_CHROME_EXTENSION_BANNER: false, //Quitar el banner de google chrome
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false, //Mensaje de usuario se ha unido/dejado la sesion
            DISABLE_PRESENCE_STATUS: false,  
            TOOLBAR_BUTTONS: [ //Quitados: 'invite', 'feedback', 'recording', 'info', 'tileview', 'livestreaming' 'hangup'(colgar)
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'profile', 'chat', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'stats', 'shortcuts',
               'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
        }
    }

    this.api = new JitsiMeetExternalAPI(domain, options);
    //this.api.executeCommand('password', this._usuario.usuario.nombre);
    this.api.executeCommand('displayName', this._usuario.usuario.nombre);
    
    if(!this._usuario.usuario.foto.indexOf('http')){
      this.api.executeCommand('avatarUrl', this._usuario.usuario.foto);

    }else{
    this.api.executeCommand('avatarUrl', URL_SERVICIOS + '/imagenes' + '/usuarios/' + this._usuario.usuario.foto);
    }
      });
    });
  });
});

if(localStorage.getItem('id') != null){
  this._logs.getIPAddress()
    .subscribe((ip:any) => {
      this.ip = ip.ip;
    })
}
 }

salirAlumno(){

  //logs
  var miLog = new Log(localStorage.getItem('id'), "El alumno ha salido del aula", this.ip);
    this._logs.crearLog(miLog)
      .subscribe(correcto => {

    })


  let html = `<button type="button" class="btn btn-primary" id="CerrarModalSi" data-dismiss="modal">Sí</button>
  <button type="button" id="CerrarModal" class="btn btn-secondary" data-dismiss="modal">No</button>`;
  document.getElementById("btnPregunta").innerHTML = html;
  document.getElementById('CerrarModalSi').click();
  this.router.navigate(['/panel-usuario/videoconferencia']);
  this._reserva.pagarReserva(this.reserOK.id).subscribe((data:any) => {
    let html2 = `<button class="btn" [routerLink]="" data-toggle="modal" data-target="#exampleModal" id="showValModal">Finalizar clase</button>`;
    document.getElementById("endClass").innerHTML = html2;
    document.getElementById("showValModal").click();
  });
}
  salir(){

    if(this.esProfe==false){
     
      let html0 = `<button class="btn" [routerLink]="" data-toggle="modal" data-target="#modalSalir" id="showValModal">Finalizar clase</button>`;
      document.getElementById("endClass").innerHTML = html0;
      document.getElementById("showValModal").click();
    }
    else{
      
      swal.fire({
        icon: 'question', 
        title: 'Salir del aula',
        text: 'Vas a cerrar el aula. Al terminar, finalizará la clase y no podrás volver a entrar. ¿Estás seguro?',
        showCancelButton: true,
        cancelButtonText: 'Continuar en la clase',
        confirmButtonColor: '#B7B7B7',
        cancelButtonColor: '#515FC9',
        confirmButtonText: 'Salir del aula'
      }).then((result) => {
        if(result.value){
          this._reserva.pagarReserva(this.reserOK.id).subscribe((data:any) => {
            this.router.navigate(['/panel-usuario/gestionar-cuenta']);
          });

          var miLog = new Log(localStorage.getItem('id'), "El profesor ha salido del aula", this.ip);
          this._logs.crearLog(miLog)
            .subscribe(correcto => {

          })
        }
      });
  
    }
  }

  crearValoracion(form:NgForm){
    

    //Nueva valoracion
    let valoracion = new Valoracion(
      this.puntuacion,
      form.value.observacion,
      localStorage.getItem('id'),
      this.imparte.idprofesor
    );

    this._valoracion.crearValoracion(valoracion)
    .subscribe((data:any) => {

          //Primero calculamos y actualizamos la valoracion media
          this._valoracion.mostrarValoracionesProfesor(this.imparte.idprofesor)
          .subscribe((data:any[]) =>{
            this.valoraciones = data;
           
            this.valoraciones.forEach((valoracion:Valoracion)=> {
              //calcular la media
              this.i = this.i+1;
              this.puntos = valoracion.puntuacion;
              this.total = this.total + valoracion.puntuacion;
              this.media = this.total / this.i;
              this.media = Math.trunc(this.media);
            })

            this._profService.actualizarValoracionMedia(this.imparte.idprofesor, this.media)
            .subscribe((data:any)=>{
              console.log("realizado con esito");
            })
            
        })
        var MiLog = new Log(localStorage.getItem('id'), "Ha valorado al profesor: " + this.imparte.idprofesor, this.ip);
        this._logs.crearLog(MiLog)
          .subscribe(correcto => {
            
          }); 

      //Mostramos mensaje
      let html = `<button type="button" class="btn btn-primary" id="CerrarModalVal" data-dismiss="modal">Enviar valoración</button>`;
      document.getElementById("insert").innerHTML = html;
      document.getElementById('CerrarModalVal').click();
      this.router.navigate(['/panel-usuario/videoconferencia']);
      swal.fire({
        icon: 'success',
        title: '¡Gracias por tu opinión!',
        showCancelButton: false,
        confirmButtonColor: '#5348FF',
        confirmButtonText: 'Salir'
      }).then((result) => {
        this.router.navigate(['/panel-usuario/gestionar-cuenta']);
      });
    });
  }

  cargarModelo(modelo:any, texture:any){
    this.motor = new main(modelo, texture);
  }

  cerrarModelos(){
    document.getElementById("mydiv").style.display = "none";
  }

  girarModeloDerecha(){
    
  }

}
