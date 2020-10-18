import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ProfesorService } from 'src/app/services/usuario/profesor.service';
import { Profesor } from 'src/app/models/profesor.model';
import { Usuario } from '../../models/usuario.model';
import { Imparte } from '../../models/imparte.model';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ImparteService } from '../../services/impartes/imparte.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log/log.service';
import { Log } from '../../models/log.model';

function typewrite(){
  var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 400 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 800;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.1em solid #7f42f1 }";
  document.body.appendChild(css);
  
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profvar: any[] = [];
  profe: any[] = [];
  varimparte: any[] = [];
  mensaje: string;
  editmensaje: string;
  logueado : boolean = false;
  filterAsig='';
  notificacion:any;
  editnoti:any;
  notificacionArray:any[] = [];
  editNotificacionArray:any;
  profDrowpdown: boolean = false;
  publicProfile: any;
  asignaturas: Imparte[] = [];
  malumno:boolean=true;
  mprofe:boolean=false;

  constructor(
    public _usuario: UsuarioService,
    public _prof: ProfesorService,
    public _navmensaje: NavbarService,
    public _imparte: ImparteService,
    public _router: Router,
    public _logs: LogService

  ) {

  this._imparte.getImpartes()
    .subscribe((data:Imparte[]) => {
          data.forEach(imparte => {
            this.varimparte.push(imparte.nombreAsignatura);        
          });
    });   
    

    if(localStorage.getItem('google') == '1'){
      window.location.href= '';
      localStorage.setItem('google', '0');
    }
  
    this._prof.getProfsMejorValorados()
    .subscribe((data: any[]) => {
    
      this.profvar = data;
      this.profvar.forEach(profesor => {
        let algo:boolean = false;
          this._imparte.getImpartesPorProfesor(profesor.id)
          .subscribe((data:any[])=>{
            for(let i = 0; i<data.length && algo==false; i++ ){
              this.asignaturas.push(data[i]);
              algo=true;
            }
          })
      this._usuario.getUser(profesor.idUsuario)
      .subscribe((data:any) =>{
        this.profe.push(data);    
      });
    });
    
    });

  }
  user: Usuario;
    //logs
    ip:any = null;


  realizarBusqueda(asignatura:any){
    var MiLog = new Log(localStorage.getItem('id'), "Ha buscado desde home: " + asignatura, this.ip);
    this._logs.crearLog(MiLog)
      .subscribe(correcto => {
        
      }); 
    
    this._imparte.variableBusqueda = asignatura;
    this._router.navigate(['/buscador'])
  }

  estiloBuscador(value:any){
    value = value.toLowerCase();
    if(value == ""){
      document.getElementById('buscador').style.borderRadius = "25px 25px 25px 25px";
    }
    else{
      let comprobar = false;
      for(let i = 0; i < this.varimparte.length && comprobar == false; i++){
        if(this.varimparte[i].toLowerCase().includes(value)){
          comprobar = true;
        }
      }
      if(comprobar == true){
        document.getElementById('buscador').style.borderRadius = "25px 25px 0px 0px";
      }
      else{
        document.getElementById('buscador').style.borderRadius = "25px 25px 25px 25px";
      }  
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  mostrarProfesor(){
    this.mprofe=true;
    this.malumno=false;
  }

  mostrarAlumno(){
    this.mprofe=false;
    this.malumno=true;
    }


  async ngOnInit() {
    if(localStorage.getItem('id') != null){
      this._logs.getIPAddress()
        .subscribe((ip:any) => {
          this.ip = ip.ip;
        })
    }
    typewrite();

  
    this._usuario.cargarStorage();
    if(localStorage.getItem('id')!=null){
      
      if(localStorage.getItem('id')=='null' || localStorage.getItem('id')=='undefined'){ //Cuando te registrar por primera vez con google

        this._usuario.getIdPorEmail(JSON.parse(localStorage.getItem('usuario')).email)
        .subscribe((usuario:any) =>{
          localStorage.setItem('id', usuario);
          localStorage.getItem('id');
          this.ngOnInit();
        })
           
      }
      
      this.logueado = true;
      this._usuario.getUser(localStorage.getItem('id'))
      .subscribe((data:any) => {
        this.user = data;
        this.editmensaje = this.user.foto;
        this._navmensaje.customMensaje.subscribe(msg => this.mensaje = msg);
        this._navmensaje.changeMensaje(this.editmensaje);
        //para saber en el dropdown si es profesor
        this._navmensaje.customPubProfile.subscribe(newEsProfe => this.publicProfile = newEsProfe);
        this._navmensaje.changePublicProfile(this.user.id);
        
      });
      //para saber si es profesor
      this._prof.getProfs()
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

    }

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
    
    
}