import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../../../services/asignaturas/asignaturas.service';
import { Asignatura } from 'src/app/models/asignaturas.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { ImparteService } from 'src/app/services/impartes/imparte.service';
import { Imparte } from 'src/app/models/imparte.model';

@Component({
  selector: 'app-edit-asig',
  templateUrl: './edit-asig.component.html',
  styleUrls: ['./edit-asig.component.css', '../../crud-usuario/edit-user/edit-user.component.css']
})
export class EditAsigComponent implements OnInit {

  id:string;
  asiginfo:any;
  forma: FormGroup;
  imparteNuevo: Imparte;

  constructor(
    public _asignatura:AsignaturaService,
    public http: HttpClient,
    public rutaActiva: ActivatedRoute,
    public router: Router,
    public _imparte: ImparteService
  ) 
  { 
    this.rutaActiva.params.subscribe(params => {
      this.id = params.id;
      this._asignatura.getAsig(this.id)
      .subscribe((data:any) => {
        this.asiginfo = data
       
      });
    })
  }

  editarAsignatura(){
    //ESTO SE HACE PORQUE POR DEFECTO NO COGE LOS VALORES DEL VALUE DE LOS INPUTS
    //SE PODRÁ OPTIMIZAR BASTANTE
   
    if(this.forma.value.nombre == null){
      this.forma.value.nombre = this.asiginfo['nombre'];
    }

    //A PARTIR DE AQUÍ YA BIEN TODO
    
    let nuevaAsig = new Asignatura(
      this.asiginfo['id'],
      this.forma.value.nombre
    );

   
    this._asignatura.editAsig(this.asiginfo['id'], nuevaAsig)
      .subscribe(async (data:any) => {
        await this.delay(300);
        this.router.navigate(['/admin/crud-asignaturas']);
        let mensaje = "Asignatura editada con exito";

        swal("Asignatura editada", mensaje, "success");

        //Cambiar los impartes
        console.log("Antigua asignatura:" + this.asiginfo['nombre']);
        
        this._imparte.getImparteAsig(this.asiginfo['nombre']).subscribe((impartes:any[])=>{
          impartes.forEach(imparte => {
            //De cada imparte que tenga la asignatura, se le cambia el nombre
            this.imparteNuevo = new Imparte(imparte.idProfesor, imparte.idasignatura, imparte.id, imparte.precio, imparte.nombreProfesor, nuevaAsig.nombre)

            this._imparte.editarImparte(imparte.id, this.imparteNuevo)
            .subscribe((data:any) => {
             console.log("Imparte cambiado");
             
              
            });

          });
        });



    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


  ngOnInit() {
    this.forma = new FormGroup({
      //id: new FormControl(),
      nombre: new FormControl(null, Validators.required)
    },  {
        });
   
    }
}
