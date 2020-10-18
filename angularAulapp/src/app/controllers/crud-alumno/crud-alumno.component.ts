import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/usuario/alumno.service';
import { Alumno } from 'src/app/models/alumno.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import swal from 'sweetalert';

import { FilterNombrePipe } from '../../pipes/filterUsu.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-alumno',
  templateUrl: './crud-alumno.component.html',
  styleUrls: ['./crud-alumno.component.css']
})
export class CrudAlumnoComponent implements OnInit {

  alumnos:any[] = [];
  alumno:any[] = [];
  pageActual:number = 1;
  desde: number=0;
  botones:any[] = [];
  alumnostotal:number =0;
  BAlu: any[] = [];
  BAlumno: any[] =[];
  MBusquedaAlum: any[] = [];
  cont:number =0;
  alumnostotalEntero:number=0;
  totEntero:number=0;
  
  filterUsu='';

  constructor(
    public _alumno: AlumnoService,
    public _usuario:UsuarioService
  ) {
      
   }

   deleteAlumno(id:string){
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
        this._alumno.borrarAlumno(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
            this.cargarAlu();
          
          
        });
      }else{
        this._alumno.borrarAlumno(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
            
            this.buscarAlu(this.filterUsu);
        
        });
      }
      }
    });
    
  }

  cargarAlu(){
    this.alumno = [];
    this.alumno=[];

    this._alumno.getAlumnosP(this.desde)
      .subscribe((data:any[]) => {
        
        this.alumnos = data; // Alumnos
            //Recuperar el usuario de cada alumno
            this.alumnos.forEach(alumno => {
              
               this._usuario.getUser(alumno.idUsuario)
              .subscribe((data:any) => {
                this.alumno.push(data); //Usuario Alumnos         
              });
            });
      });    

      this._alumno.getAlumnosT()
      .subscribe((data:any) =>{
        this.alumnostotal = data;
        this.llenarbotones(this.alumnostotal);

        if(this.alumnostotal%6!=0){
          
          this.alumnostotalEntero = Math.round(this.alumnostotal/6);
          
            
          
        }else{
          this.alumnostotalEntero=this.alumnostotal/6;
        }
        if(this.alumnostotal/6>this.alumnostotalEntero){
          this.alumnostotalEntero+=1;
                   
        }
      });
  }
  cambiarDesde(d:number){
    let des = this.desde +d;
if(!this.filterUsu){
    if(des <0){
      return;
    }
    if(des >= this.alumnostotal){
      return;
    }
    this.desde +=d;
    this.cargarAlu();
  }else{
    if(des <0){
      return;
    }
    if( des >= this.cont){
      return;
    }
    this.desde +=d;
    this.pagino(this.BAlu,this.desde);
  }
  }

  setDesde(valor:number){
    if(!this.filterUsu){
    if(valor <0){
      return;
    }
    if(valor >= this.alumnostotal){
      return;
    }
    
    this.desde =valor;
    
    this.cargarAlu();
  }
  if(this.filterUsu){ 
    if(valor <0){
      return;
    }
    if(valor > this.cont){
      return;
    }
    this.desde =valor;
    this.pagino(this.BAlu,this.desde);
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
  buscarAlu(texto:string){
    this.BAlu=[];
    this.cont=0;
    
    
    if(texto){ 
      
      this._alumno.buscarAlumno(texto).subscribe((data: any[]) =>{
        this.BAlu = data;      
        console.log(this.BAlu);
        
        this.BAlu.forEach(usus =>{
                this.cont++;           
        });
        this.llenarbotones(this.cont);
        this.pagino(this.BAlu, this.desde);
        this.sacariID(this.BAlu);

        this.alumnostotal=this.cont;
          if(this.alumnostotal%6!=0){
          
            this.alumnostotalEntero = Math.round(this.alumnostotal/6);  
            
          }else{
            this.alumnostotalEntero=this.alumnostotal/6;
          }
          if(this.alumnostotal/6>this.alumnostotalEntero){
            this.alumnostotalEntero+=1;         
          }
      })
      
    }else{
      
    }
    
    
  }
  sacariID(valor){
    this.BAlumno=[];

    valor.forEach(profesor => {
      this._alumno.obtenerIdAlumno(profesor.id)
      .subscribe((data:any) =>{
        this.BAlumno.push(data);
      });
    });
    
  }
  pagino(valor, desde){
    this.MBusquedaAlum=[];
    for(let i=desde; i<(desde+6); i++){
      if(valor[i]!=null){
    this.MBusquedaAlum.push(valor[i]);
      }
    }
    
  }

  ngOnInit() {
    this.cargarAlu();
  }

}
