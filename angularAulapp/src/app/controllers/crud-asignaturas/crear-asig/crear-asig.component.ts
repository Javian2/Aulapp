import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AsignaturaService } from '../../../services/asignaturas/asignaturas.service';
import { Asignatura } from 'src/app/models/asignaturas.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';



@Component({
  selector: 'app-register',
  templateUrl: './crear-asig.component.html',
  styleUrls: ['./crear-asig.component.css', '../../crud-usuario/edit-user/edit-user.component.css']
})
export class CrearAsigComponent implements OnInit {

  forma: FormGroup;
  imagenSubir:File;

  constructor(
    public _asignatura:AsignaturaService,
    public router: Router
  ) { }

 

  ngOnInit() {

  this.forma = new FormGroup({
    //id: new FormControl(),
    nombre: new FormControl(null, Validators.required)
  },  {
      });
  }

  crearAsignatura(){
  

    if (this.forma.invalid){
      
      return;
    }

    let nuevaAsig = new Asignatura(
        this.forma.value.id,
        this.forma.value.nombre
      );

    this._asignatura.crearAsignatura(nuevaAsig)
    .subscribe( resp =>{
    
      this.router.navigate(['/admin/crud-asignaturas']);
      let mensaje = "Asignatura creada con éxito";

      swal("Asignatura creada", mensaje, "success");
    });

    
    
  }
}
