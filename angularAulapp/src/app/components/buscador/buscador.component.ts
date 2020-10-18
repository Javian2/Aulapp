import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesorService } from 'src/app/services/usuario/profesor.service';
import { ImparteService } from '../../services/impartes/imparte.service';
import {UsuarioService} from 'src/app/services/usuario/usuario.service';
import { AsignaturaService } from 'src/app/services/asignaturas/asignaturas.service';
import { NavbarService } from '../../services/navbar/navbar.service';
import { LogService } from '../../services/log/log.service';
import { Log } from '../../models/log.model';


@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  profe: any[] = [];
  varprofe:any[]=[];
  boo:boolean=false;
  boo2:boolean=false;
  cont:number=12;
  cont2:number=6;
  filterText= '';
  filterAsig='';

  resultadovacio = false;

  notificacion:any;
  editnoti:any;

  notificacionArray:any[] = [];
  editNotificacionArray:any;

  varimparte: any[] = [];

  ProfesorPar = [
    {
        "imparte": null,
        "profesor": null
    }
    
];
PruebaPar = [
  {
      "imparte": null,
      "profesor": null
  }
  
];

  check1 = true;
  check2 = true;

  variableBusquedaHome = this._imparte.variableBusqueda;

  constructor(
    public _profesor: ProfesorService, 
    public _asignatura: AsignaturaService,
    public _imparte: ImparteService, 
    public _usuario : UsuarioService,
    public _http: HttpClient,
    public _router: Router,
    public _navmensaje: NavbarService,
    public _rutaActiva: ActivatedRoute,
    public _logs: LogService
  ) {}

    //logs
    ip:any = null;

  buscarProfesor(texto:string){
    document.getElementById("resultados").style.display = "none";
    document.getElementById('buscador').style.borderRadius = "25px 25px 25px 25px";
    var inputValue = (<HTMLInputElement>document.getElementById("buscador")).value = texto;


    this.boo=true;
    this.cont=12;
    this.varprofe=[];
    this.variableBusquedaHome = texto;
    

    this.ProfesorPar.forEach(par => {
      par.imparte=null;
      par.profesor=null;
    });

    this.profe.length = 0;

    if(texto){
    
      this._profesor.buscarProfesor(texto).subscribe((data: any[]) =>{
        this.profe = data;  
        for(let i=0; i<6; i++){
          if(this.profe[i]!=null)
            this.varprofe.push(this.profe[i]);
        }   
        if(this.profe.length==this.varprofe.length){
          this.boo=false;
        }

        if(this.varprofe.length == 0){
          this.resultadovacio = true;
        }
        else{
          this.resultadovacio =false;
        }
    });

    }
    
    
  }
  pruebaprofe(){
   this.varprofe=[];
    for(let i=0; i<this.cont; i++){
      if(this.profe[i]!=null)
      this.varprofe.push(this.profe[i]);
    }   
   
   this.cont+=6;
   if(this.profe.length==this.varprofe.length){
    this.boo=false;
  }
  }

  buscarProfAsig(texto:string, n:number=6){
    console.log(n);
    

    document.getElementById("resultados").style.display = "none";
    document.getElementById('buscador').style.borderRadius = "25px 25px 25px 25px";
    var inputValue = (<HTMLInputElement>document.getElementById("buscador")).value = texto;


    this.boo2=true;
    let cent=0;
    let c=0;
    this.ProfesorPar.length=0;
    this.PruebaPar.length=0;
    
    
    
    
    this.variableBusquedaHome = texto;
    this.ProfesorPar.forEach(par => {
      par.imparte=null;
      par.profesor=null;
    });

    if(texto){
      this._imparte.getImparteAsig(texto).subscribe((impartes:any[])=>{
        if(n>impartes.length){
          n=impartes.length;
          console.log(n);
        }
        if(n!=0){
          this.resultadovacio = false;
        impartes.forEach(imparte => {
            this._usuario.getUserPorNombre(imparte.nombreProfesor).subscribe((usuario: any) =>{
              this.ProfesorPar.push({     
                'imparte': imparte,
                'profesor': usuario
              });
               
           if(cent<n){
                this.PruebaPar.push({
                 'imparte': imparte,
                 'profesor': usuario
                });
                cent++;
              }
 
              if(impartes.length == cent){  
                this.boo2=false;
              }

            });

          });
        }else{
          this.boo2=false;
         this.resultadovacio = true;  
        }
      });
      
      if(!this._imparte.variableBusqueda){
        var MiLog = new Log(localStorage.getItem('id'), "Ha buscado desde el buscador: " + texto, this.ip);
        this._logs.crearLog(MiLog)
          .subscribe(correcto => {
            
          }); 
      }

    }   
  }

  visibleProfe(selector){
    var elemento = document.querySelector(selector);
    if(elemento != null){ 
      elemento.style.display = (elemento.style.display == 'none') ? 'inline' : 'none';
    }
  }

  visibleProfeAsig(selector){
    var elemento = document.querySelector(selector);
    if(elemento != null){ 
      elemento.style.display = (elemento.style.display == 'none') ? 'inline' : 'none';
    }
  }

  estiloBuscador(value:any){
    document.getElementById("resultados").style.display = "flex"
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
      console.log(comprobar);
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  async ngOnInit(){

    this._imparte.getImpartes()
    .subscribe((data:any[]) => {
          data.forEach(imparte => {
            this.varimparte.push(imparte.nombreAsignatura);        
          });
    }); 

    if(this._imparte.variableBusqueda){
      this.buscarProfAsig(this._imparte.variableBusqueda);
      this.buscarProfesor(this._imparte.variableBusqueda);
      this._imparte.variableBusqueda = null;
    }

    //notis

    this._navmensaje.customNotificacion.subscribe(noti => this.notificacion = noti);
    this._navmensaje.mostrarNotificacionesDelUsuario(localStorage.getItem('id'));
    await this.delay(400);
    this.editnoti = this._navmensaje.numNotificaciones;
    this._navmensaje.newNoti(this.editnoti)

    this._navmensaje.customNotificacionArray.subscribe((notiArray:any) => this.notificacionArray = notiArray)
    this.editNotificacionArray = this._navmensaje.notificaciones;
    console.log(this.editNotificacionArray);
    this._navmensaje.newArrayNotis(this.editNotificacionArray);
    
    if(localStorage.getItem('id') != null){
      this._logs.getIPAddress()
        .subscribe((ip:any) => {
          this.ip = ip.ip;
        })
    }

  }

}

