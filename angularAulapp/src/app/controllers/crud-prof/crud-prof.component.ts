import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ProfesorService } from '../../services/usuario/profesor.service';
import { HttpClient } from '@angular/common/http';
import { Profesor } from '../../models/profesor.model';
import swal from 'sweetalert';
import { getLocaleFirstDayOfWeek } from '@angular/common';

import { FilterNombrePipe } from '../../pipes/filterUsu.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-prof',
  templateUrl: './crud-prof.component.html',
  styleUrls: ['./crud-prof.component.css']
})
export class CrudProfComponent implements OnInit {

  profvar: any[] = [];
  profe: any[] = [];
  pageActual:number = 1;
  desde: number=0;
  botones:any[] = [];
  proftotal:number =0;
  BProf: any[] = [];
  Bprofe: any[] =[];
  MBusquedaProf: any[] = [];
  cont:number =0;
  totEntero:number=0;
   profesorestotalEntero:number=0;

  filterUsu='';

  constructor(
    public _prof: ProfesorService,
    public _usuario: UsuarioService,
   
    public http: HttpClient) {

    }

    deleteProfesor(id:string){
      
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
          this._prof.borrarProfesor(id)
          .subscribe((data:any) => {
              let mensaje = "Borrado con exito";
    
              swal("Usuario eliminado", mensaje, "success");
              this.cargarProf();
            
            
          });
        }else{
          this._prof.borrarProfesor(id)
          .subscribe((data:any) => {
              let mensaje = "Borrado con exito";
    
              swal("Usuario eliminado", mensaje, "success");
              
              this.buscarProf(this.filterUsu);
          
          });
        }
        }
      });
    }

    cargarProf(){
      this.profe=[];
      this.profvar=[];
      
      
      this._prof.getProfsP(this.desde)
      .subscribe((data: any[]) => {
        this.profvar = data; //Profesores
      this.profvar.forEach(profesor => {
        this._usuario.getUser(profesor.idUsuario)
        .subscribe((data:any) =>{
          this.profe.push(data);//Usuarios profes
          
          
        });
      });
      
      });  

      this._prof.getProfsT()
      .subscribe((data:any) =>{
        this.proftotal = data;
        this.llenarbotones(this.proftotal);

        if(this.proftotal%6!=0){
          
          this.profesorestotalEntero = Math.round(this.proftotal/6);
          
            
          
        }else{
          this.profesorestotalEntero=this.proftotal/6;
        }
        if(this.proftotal/6>this.profesorestotalEntero){
          this.profesorestotalEntero+=1;
                   
        }
      });
    }
    cambiarDesde(d:number){
      let des = this.desde +d;
      if(!this.filterUsu){
      if(des<0){
        return;
      }
      if(des >= this.proftotal){
        return;
      }
      this.desde +=d;
      this.cargarProf();
    }else{
        if(des <0){
          return;
        }
        if( des >= this.cont){
          return;
        }
        this.desde +=d;
        this.pagino(this.BProf,this.desde);
      }
    }
    
    setDesde(valor:number){
      console.log(this.filterUsu);
      
      if(!this.filterUsu){
      if(valor <0){
        return;
      }
      if(valor >= this.proftotal){
        return;
      }
      
      this.desde =valor;
      this.cargarProf();
    }
    if(this.filterUsu){ 
      if(valor <0){
        return;
      }
      if(valor > this.cont){
        return;
      }
      this.desde =valor;
      this.pagino(this.BProf,this.desde);
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
    buscarProf(texto:string){
      this.BProf=[];
      this.cont=0;
      
      
      if(texto){ 
        this._prof.buscarProfesor(texto).subscribe((data: any[]) =>{
          this.BProf = data;      
          console.log(this.BProf);
          
          this.BProf.forEach(usus =>{
                  this.cont++;           
          });
          this.llenarbotones(this.cont);
          this.pagino(this.BProf, this.desde);
          this.sacariID(this.BProf);

          this.proftotal=this.cont;
          if(this.proftotal%6!=0){
          
            this.profesorestotalEntero = Math.round(this.proftotal/6);
            
              
            
          }else{
            this.profesorestotalEntero=this.proftotal/6;
          }
          if(this.proftotal/6>this.profesorestotalEntero){
            this.profesorestotalEntero+=1;
                     
          }
        })
        
      }else{
        
      }
    }
    sacariID(valor){
      this.Bprofe=[];

      valor.forEach(profesor => {
        this._prof.obtenerIdProfesor2(profesor.id)
        .subscribe((data:any) =>{
          this.Bprofe.push(data);
    

        });
      });
    }
    pagino(valor, desde){
      this.MBusquedaProf=[];
      for(let i=desde; i<(desde+6); i++){
        if(valor[i]!=null){
      this.MBusquedaProf.push(valor[i]);
        }
      }
      console.log(this.MBusquedaProf);
      
      
    }
  ngOnInit() {
    this.cargarProf();
  }

}
