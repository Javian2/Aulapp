import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../services/reportes/reportes.service';
import swal from 'sweetalert';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-reportes',
  templateUrl: './crud-reportes.component.html',
  styleUrls: ['./crud-reportes.component.css']
})
export class CrudReportesComponent implements OnInit {

  constructor(public _http: HttpClient,
    public _router:Router,
    public _reportes: ReportesService) { }

    reservavar:any[] = [];
    pageActual:number = 1;
    desde: number=0;
    botones:any[] = [];
    reservastotal:number =0;
    reservatotalEntero:number=0;
    BReserva: any[] = [];
    MBusquedaImparte: any[] = [];
    cont:number =0;
    totEntero:number=0;
    filterReserva= '';

    deleteReserva(id:any){
      swal({
        title: "¿Estás seguro?",
        text: "¿Estás seguro que quieres eliminar a esta reserva con id: " + id + "?",
        icon: "warning",
        buttons: ["Volver",true],
        dangerMode: true,
      })
      .then(willDelete => {
        if (willDelete) {
  if(!this.filterReserva){
          this._reportes.borrarReporte(id)
          .subscribe((data:any) => {
              let mensaje = "Borrado con exito";
    
              swal("Reporte eliminado", mensaje, "success");
             this.cargarReportes();
           
            
          });
        }else{
          this._reportes.borrarReporte(id)
          .subscribe((data:any) => {
              let mensaje = "Borrado con exito";
    
              swal("Reporte eliminado", mensaje, "success");
             this.buscarReserva(this.filterReserva);
           
            
          });
        }
        }
      });
    }
  
    cargarReportes(){
      this._reportes.getReportesPaginada(this.desde).subscribe((data:any) => {
            this.reservavar = data;
          });
      this._reportes.getReportesTotal().subscribe((data:any) =>{
        this.reservastotal = data;
            
        this.llenarbotones(this.reservastotal);
        
        if(this.reservastotal%6!=0){
          
          this.reservatotalEntero = Math.round(this.reservastotal/6);   
        }else{
          this.reservatotalEntero=this.reservastotal/6;
        }
        if(this.reservastotal/6>this.reservatotalEntero){
          this.reservatotalEntero+=1;
          
        }
      });
      
    }
  
  
    cambiarDesde(d:number){
      let des = this.desde +d;
  
      if(!this.filterReserva){
        if(des<0){return;}
        if(des >= this.reservastotal){return;}
        this.desde +=d;
        this.cargarReportes();
        }else{
        if(des <0){
          return;
        }
        if( des >= this.cont){
          return;
        }
        this.desde +=d;
        this.pagino(this.BReserva,this.desde);
      }
    }
      
    
    setDesde(valor:number){
    
      if(!this.filterReserva){
        if(valor <0){return;}
        if(valor >= this.reservastotal){return;}
        this.desde =valor;  
        this.cargarReportes();
      }
      if(this.filterReserva){ 
        if(valor <0){return;}
        if(valor > this.cont){return;}
        this.desde =valor;
        this.pagino(this.BReserva,this.desde);
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
  
    buscarReserva(texto:string){
      this.BReserva.length = 0;
      this.cont=0;
  
      if(texto){ 
        this._reportes.getReportesPorID(texto).subscribe((data: any[]) =>{
          this.BReserva.push(data);      
          this.BReserva.forEach(usus =>{
                  this.cont++;           
          });
          this.llenarbotones(this.cont);
          this.pagino(this.BReserva, this.desde);
  
          this.reservastotal=this.cont;
          if(this.reservastotal%6!=0){
          
            this.reservatotalEntero = Math.round(this.reservastotal/6);   
          }else{
            this.reservatotalEntero=this.reservastotal/6;
          }
          if(this.reservastotal/6>this.reservatotalEntero){
            this.reservatotalEntero+=1;
            
          }
  
        })
      }else{
  
      }
    }
  
    pagino(valor, desde){
      this.MBusquedaImparte=[];
      for(let i=desde; i<(desde+6); i++){
        if(valor[i]!=null){
          this.MBusquedaImparte.push(valor[i]);
        }
      }
    }

  ngOnInit() {
    this.cargarReportes();
  }

}
