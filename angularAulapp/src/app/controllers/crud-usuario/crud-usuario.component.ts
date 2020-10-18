import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert';

import { FilterNombrePipe } from '../../pipes/filterUsu.pipe';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-crud-usuario',
  templateUrl: './crud-usuario.component.html',
  styleUrls: ['./crud-usuario.component.css']
})
export class CrudUsuarioComponent implements OnInit {

  usuariosvar:any[] = [];
  usuariostotal:number =0;
  usuariostotalEntero:number=0;
  cont:number =0;
  pageActual:number = 1;
  desde: number =0;
  BUsu: any[] = [];
  MBusquedaUsu: any[] = [];
  botones:any[] = [];
  totEntero:number=0;

  filterUsu='';

  //GET USUARIOS
  constructor(
      public usuario: UsuarioService, 
      public http: HttpClient,
      public router:Router
    ) {
      
  }

  //DELETE USUARIOS (SE PUEDE MEJORAR EL CÓDIGO CON FETCHDATA Y AÑADIENDO UN MENSAJE)
  deleteUser(id:string){
    
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
        this.usuario.borrarUsuario(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
            this.cargarUsu();
          
          
        });
      }else{
        this.usuario.borrarUsuario(id)
        .subscribe((data:any) => {
            let mensaje = "Borrado con exito";
  
            swal("Usuario eliminado", mensaje, "success");
            
            this.buscarUsu(this.filterUsu);
        
        });
      }
      }
    });

  }
cargarUsu(){
  this.usuario.getUsersP(this.desde)
      .subscribe((data:any) => {
        this.usuariosvar = data;
      });
      this.usuario.getUsersT()
      .subscribe((data:any) =>{
        this.usuariostotal = data;
        
        this.llenarbotones(this.usuariostotal);
        
        if(this.usuariostotal%6!=0){
          
          this.usuariostotalEntero = Math.round(this.usuariostotal/6);
          
            
          
        }else{
          this.usuariostotalEntero=this.usuariostotal/6;
        }
        if(this.usuariostotal/6>this.usuariostotalEntero){
          this.usuariostotalEntero+=1;
                   
        }
      });
      
    }
    cambiarDesde(d:number){
      let des = this.desde +d;
      if(!this.filterUsu){
      if(des <0){
        return;
      }
      if( des >= this.usuariostotal){
        return;
      }
      this.desde +=d;
      this.cargarUsu();
    }else{
      if(des <0){
        return;
      }
      if( des >= this.cont){
        return;
      }
      this.desde +=d;
      this.pagino(this.BUsu,this.desde);
    }
    }
    setDesde(valor:number){  

      if(!this.filterUsu){
      if(valor <0){
        return;
      }
      if(valor >= this.usuariostotal){
        return;
      }
      this.desde = valor;
      this.cargarUsu();
    }
    if(this.filterUsu){ 
      if(valor <0){
        return;
      }
      if(valor > this.cont){
        return;
      }
      this.desde =valor;
      this.pagino(this.BUsu,this.desde);
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

    buscarUsu(texto:string){
      this.BUsu=[];
      this.cont=0;

      if(texto){ 
        this.usuario.buscarUsuario(texto).subscribe((data: any[]) =>{
          this.BUsu = data;      
          this.BUsu.forEach(usus =>{
                  this.cont++;           
          });
          this.llenarbotones(this.cont);
          this.pagino(this.BUsu, this.desde);

          this.usuariostotal=this.cont;
          if(this.usuariostotal%6!=0){
          
            this.usuariostotalEntero = Math.round(this.usuariostotal/6);  
            
          }else{
            this.usuariostotalEntero=this.usuariostotal/6;
          }
          if(this.usuariostotal/6>this.usuariostotalEntero){
            this.usuariostotalEntero+=1;         
          }
        })
      }else{
        this.cargarUsu();
      }
    }
    pagino(valor, desde){
      this.MBusquedaUsu=[];
      for(let i=desde; i<(desde+6); i++){
        if(valor[i]!=null){
      this.MBusquedaUsu.push(valor[i]);
        }
      }
    }

  ngOnInit() {
    this.cargarUsu();
  }

}
