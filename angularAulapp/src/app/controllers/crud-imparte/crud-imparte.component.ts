import { Component, OnInit } from '@angular/core';
import { ImparteService } from '../../services/impartes/imparte.service';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { AsignaturaService } from '../../services/asignaturas/asignaturas.service';
import swal from 'sweetalert';
  

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { FilterNombrePipe } from '../../pipes/filterUsu.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-crud-imparte',
  templateUrl: './crud-imparte.component.html',
  styleUrls: ['./crud-imparte.component.css']
})
export class CrudImparteComponent implements OnInit{

  impartevar:any[] = [];
  pageActual:number = 1;
  profvar: any[] = [];
  profe: any[] = [];
  asig: any[] = [];
  usuariovar: any[] = [];
  desde: number=0;
  botones:any[] = [];
  imparttotal:number =0;
  BImp: any[] = [];
  MBusquedaImp: any[] = [];
  cont:number =0;
  totEntero:number=0;
  imptotalEntero:number=0;

  filterUsu= '';

  deleteImparte(id:any){
    swal({
      title: "¿Estás seguro?",
      text: "¿Estás seguro que quieres eliminar a este usuario con id: " + id + "?",
      icon: "warning",
      buttons: ["Volver",true],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
if(!this.filterUsu){
        this._imparte.borrarImparte(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
           this.cargarImp();
         
          
        });
      }else{
        this._imparte.borrarImparte(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
           this.buscarImparte(this.filterUsu);
         
          
        });
      }
      }
    });
  }

  constructor(
      public _imparte: ImparteService, 
      public _http: HttpClient,
      public _router:Router,
      public _usuario: UsuarioService,
      public _profesor: ProfesorService, 
      public _asignatura: AsignaturaService
  ) { 
  }

  cambiarDesde(d:number){
    let des = this.desde +d;
if(!this.filterUsu){
    if(des<0){
      return;
    }
    if(des >= this.imparttotal){
      return;
    }
    this.desde +=d;
    this.cargarImp();
  }else{
    if(des <0){
      return;
    }
    if( des >= this.cont){
      return;
    }
    this.desde +=d;
    this.pagino(this.BImp,this.desde);
  }
  }

  cargarImp(){
    this._imparte.getImpartesP(this.desde)
    .subscribe((data:any) => {
      this.impartevar = data;
    });
      this._imparte.getImpartesT()
      .subscribe((data:any) =>{
        this.imparttotal = data;
        this.llenarbotones(this.imparttotal);

        if(this.imparttotal%6!=0){
          
          this.imptotalEntero = Math.round(this.imparttotal/6);
          
            
          
        }else{
          this.imptotalEntero=this.imparttotal/6;
        }
        if(this.imparttotal/6>this.imptotalEntero){
          this.imptotalEntero+=1;
                   
        }

      });
  }
  setDesde(valor:number){
    if(!this.filterUsu){
    if(valor <0){
      return;
    }
    if(valor >= this.imparttotal){
      return;
    }
    
    this.desde =valor;
    this.cargarImp();
  }
  if(this.filterUsu){ 
    if(valor <0){
      return;
    }
    if(valor > this.cont){
      return;
    }
    this.desde =valor;
    this.pagino(this.BImp,this.desde);
  }
  }
  llenarbotones(valor){
      
    this.botones = [];
   let tot:number =0;
   this.totEntero = 0;
   let seguro:number =0;
   let s:number =0;
   tot = valor/6;

   if(valor%6!=0){
    this.totEntero = Math.round(tot);
    if(this.totEntero==0){
      this.totEntero=1;
    }
    if(tot>this.totEntero){
      this.totEntero+=1;
    }   
   }else{
     this.totEntero=tot;
   }
   s=this.desde/6;

  if((s+2)>=this.totEntero){
    s=this.totEntero-3;
    
  }
  if(s<0){
    s=0;
  }
  
   for(let i=s; i<this.totEntero && seguro<=2; i++){
    this.botones.push(i);
    seguro++;
   }
   
  }
  buscarImparte(texto:string){
    this.BImp=[];
    this.cont=0;

    if(texto){ 
      this._imparte.getImparteAsig(texto).subscribe((data: any[]) =>{
        this.BImp = data;      
        this.BImp.forEach(usus =>{
                this.cont++;           
        });
        this.llenarbotones(this.cont);
        this.pagino(this.BImp, this.desde);

        this.imparttotal=this.cont;
        if(this.imparttotal%6!=0){
          
          this.imptotalEntero = Math.round(this.imparttotal/6);
          
            
          
        }else{
          this.imptotalEntero=this.imparttotal/6;
        }
        if(this.imparttotal/6>this.imptotalEntero){
          this.imptotalEntero+=1;
                   
        }

      })
    }else{

    }
  }
  pagino(valor, desde){
    this.MBusquedaImp=[];
    for(let i=desde; i<(desde+6); i++){
      if(valor[i]!=null){
    this.MBusquedaImp.push(valor[i]);
      }
    }
  }
  ngOnInit() {
    this.cargarImp();
  }
}
