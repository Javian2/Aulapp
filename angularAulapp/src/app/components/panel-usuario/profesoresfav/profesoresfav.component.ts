import { Component, OnInit } from '@angular/core';
import { ProfesoresFavService } from '../../../services/profesores-fav/profesores-fav.service';
import { ProfesoresFavoritos } from '../../../models/profesores-fav.model';
import swal from 'sweetalert';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { Profesor } from '../../../models/profesor.model';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';


@Component({
  selector: 'app-profesoresfav',
  templateUrl: './profesoresfav.component.html',
  styleUrls: ['./profesoresfav.component.css']
})
export class ProfesoresfavComponent implements OnInit {

  constructor(
    public _proffav: ProfesoresFavService,
    public _prof: ProfesorService,
    public _usu: UsuarioService
    ) { }

  profesoresfav: ProfesoresFavoritos[]=[];
  profesores: Profesor[]=[];
  usuarios: Usuario[]=[];
  usuIds:any[]=[];

  borrarfav(id:any){
      this._usu.getUser(id)
      .subscribe((data:any)=>{
        
        this._prof.obtenerIdProfesor(data.id)
        .subscribe((data:any) => { 

          this._proffav.borrarProfesor(data)
          .subscribe(()=>{
            this.sacarProfes(localStorage.getItem('id'));
          });
   }); 
  });
}

sacarProfes(id:any){
  this.usuarios = [];
  this._proffav.getProfFavUsu(id)
    .subscribe((favoritos:any) => {
      //console.log(favoritos);
      favoritos.forEach((element:any) => {
        //console.log(element);
        this._prof.getProf(element.idprofesor)
          .subscribe((infoProfe:any) => {
            this._usu.getUser(infoProfe.idUsuario)
              .subscribe((infoUsuario:any) => {
                console.log(infoUsuario);
                this.usuarios.push(infoUsuario);
              })
          })
      });
    })
  /* this.usuarios = [];
  this._proffav.getProfFavUsu(id)
  .subscribe((data:any)=>{
    console.log(data);
    this.profesoresfav=data;
    data.forEach(mira=>{
      console.log(mira);
      this._prof.getProf(mira.idprofesor)
      .subscribe((data2:any)=>{
        console.log(data2);
        this.profesores.push(data2);
        this.profesores.forEach(element => {
          console.log(element);
          this._usu.getUser(element.idUsuario)
          .subscribe((data3:any)=>{
            console.log(data3);
            console.log("entro");
            if(this.usuIds.includes(data3.id) == false){
              this.usuIds.push(data3.id);
              this.usuarios.push(data3);
            }
          });
        });
    });
  });
  }); */
}



  ngOnInit() {
    this._usu.cargarStorage();
    this.sacarProfes(localStorage.getItem('id'));
  }
}
