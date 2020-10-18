import { Component, OnInit } from '@angular/core';
import { Profesor } from '../../../models/profesor.model';
import { Premium } from '../../../models/premium.model';
import { ProfesorService } from '../../../services/usuario/profesor.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { PremiumService } from '../../../services/premium/premium.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ImparteService } from '../../../services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';
import { Reserva } from 'src/app/models/reserva.model';
import { ReservaService } from '../../../services/reservas/reserva.service';

@Component({
  selector: 'app-navbar-panelusuario',
  templateUrl: './navbar-panelusuario.component.html',
  styleUrls: ['./navbar-panelusuario.component.css']
})
export class NavbarPanelusuarioComponent implements OnInit {

  constructor(public _usuario:UsuarioService,
    public _profService: ProfesorService,
    public _imparteService: ImparteService,
    public _reservaService: ReservaService,
    public _premService: PremiumService) { }

    esProfe:boolean = false;
    esPremium:boolean = false;
    user:Usuario;
    profvar: Profesor[] = [];
    premvar: Premium[] = [];
    idProfe:any;
    impartesMios: Imparte[] = [];
    resPendientes: any[] = [];
    numeroPendientes:any = 0;

    sacarReservasProfesor(){
      this.impartesMios.forEach(element => {
        this._reservaService.mostrarReservasPorIdimparte(element.id)
          .subscribe((data:any[]) => {
            data.forEach(reserva => {
          
              if(reserva.estado == "pendiente"){
                this.resPendientes.push(reserva);
              }
            
              this.numeroPendientes = this.resPendientes.length;
            });
          })
      });
    }



  ngOnInit() {

    this._usuario.cargarStorage();

    //Comprobar que el usuario esta en la tabla profesores para saber si es profesor
    this._usuario.getUser(localStorage.getItem('id'))
    .subscribe((data:any) => {
      this.user = data
     
      this._profService.getProfs()
      .subscribe((data: Profesor[]) => {
        this.profvar = data;
        for (let index = 0; index < this.profvar.length; index++) {
          if(this.profvar[index].idUsuario == localStorage.getItem('id')){
            this.esProfe = true;
            this.idProfe = this.profvar[index].id;
            this._imparteService.sacarAsignaturasPorId(this.profvar[index].id)
            .subscribe((element:any[]) => {
              element.forEach(imparte => {
                this.impartesMios.push(imparte)
              });
              this.sacarReservasProfesor();
            })
            
          }
        }
      });
      //Comrpobar que el usuario profesor tiene premium para mostrar o no el repositorio
      this._premService.getPremium()
      .subscribe((data: Premium[]) =>{
        this.premvar = data;
        for (let i = 0; i < this.premvar.length; i++){
          if(this.premvar[i].idprofesor == this.idProfe){
            this.esPremium = true;
            
            document.getElementById("Premium").className = "nav-item nav-link";
            console.log("¿Es premium? "+this.esPremium);
          }
        }
      })
    });

  }

}
