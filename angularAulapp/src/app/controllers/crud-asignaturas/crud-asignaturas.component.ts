import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../../services/asignaturas/asignaturas.service';
import { Asignatura } from 'src/app/models/asignaturas.model';
import swal from 'sweetalert';

import { FilterNombrePipe } from '../../pipes/filterUsu.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-asignaturas',
  templateUrl: './crud-asignaturas.component.html',
  styleUrls: ['./crud-asignaturas.component.css']
})
export class CrudAsignaturasComponent implements OnInit {

  asignaturas:Asignatura[] = [];
  pageActual:number = 1;
  desde: number=0;
  botones:any[] = [];
  asigtotal:number =0;
  BAsig: any[] = [];
  MBusquedaAsig: any[] = [];
  cont:number =0;
  totEntero:number=0;
  asigtotalEntero:number=0;

  filterUsu = '';

  constructor(
    public _asignatura:AsignaturaService
  ) {
      
      
   }

   deleteAsignatura(id:string){

    swal({
      title: "¿Estás seguro?",
      text: "¿Estás seguro que quieres eliminar a esta asignatura con id: " + id + "?",
      icon: "warning",
      buttons: ["Volver",true],
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
if(!this.filterUsu){
        this._asignatura.borrarAsignatura(id)
        .subscribe((correcto) => {
      
          let mensaje = 'Borrado con éxito';
          swal("Asignatura borrada" , mensaje ,  "success");
          this.cargarAsig(); 
        });
      }else{
        this._asignatura.borrarAsignatura(id)
        .subscribe((correcto) => {
      
          let mensaje = 'Borrado con éxito';
          swal("Asignatura borrada" , mensaje ,  "success");
          this.buscarAsig(this.filterUsu);
        });
      }
      }
    });
  }

  cargarAsig(){
    this.asignaturas = [];
    this._asignatura.getAsigsP(this.desde)
      .subscribe((data:Asignatura[]) => {
      
            data.forEach(asignaturas => {
              
                this.asignaturas.push(asignaturas);        
       
            });

      });  

      this._asignatura.getAsigsT()
      .subscribe((data:any) =>{
        this.asigtotal = data;
        this.llenarbotones(this.asigtotal);

        if(this.asigtotal%6!=0){
          
          this.asigtotalEntero = Math.round(this.asigtotal/6);
          
            
          
        }else{
          this.asigtotalEntero=this.asigtotal/6;
        }
        if(this.asigtotal/6>this.asigtotalEntero){
          this.asigtotalEntero+=1;
                   
        }
      });
  }

  cambiarDesde(d:number){
    let des = this.desde +d;
if(!this.filterUsu){
    if(des<0){
      return;
    }
    if(des >= this.asigtotal){
      return;
    }
    this.desde +=d;
    this.cargarAsig();
  }else{
    if(des <0){
      return;
    }
    if( des >= this.cont){
      return;
    }
    this.desde +=d;
    this.pagino(this.BAsig,this.desde);
  }
  }

  setDesde(valor:number){
    if(!this.filterUsu){
    if(valor <0){
      return;
    }
    if(valor >= this.asigtotal){
      return;
    }
    
    this.desde =valor;
    this.cargarAsig();
  }
  if(this.filterUsu){ 
    if(valor <0){
      return;
    }
    if(valor > this.cont){
      return;
    }
    this.desde =valor;
    this.pagino(this.BAsig,this.desde);
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
  buscarAsig(texto:string){
    this.BAsig=[];
    this.cont=0;

    if(texto){ 
      this._asignatura.buscarAsignatura(texto).subscribe((data: any[]) =>{
        this.BAsig = data;      
        this.BAsig.forEach(usus =>{
                this.cont++;           
        });
        this.llenarbotones(this.cont);
        this.pagino(this.BAsig, this.desde);

        this.asigtotal=this.cont;
        if(this.asigtotal%6!=0){
          
          this.asigtotalEntero = Math.round(this.asigtotal/6);
          
            
          
        }else{
          this.asigtotalEntero=this.asigtotal/6;
        }
        if(this.asigtotal/6>this.asigtotalEntero){
          this.asigtotalEntero+=1;
                   
        }
      })
    }else{

    }
  }
  pagino(valor, desde){
    this.MBusquedaAsig=[];
    for(let i=desde; i<(desde+6); i++){
      if(valor[i]!=null){
    this.MBusquedaAsig.push(valor[i]);
      }
    }
  }
  

  ngOnInit() {
    this.cargarAsig();
  }

}

