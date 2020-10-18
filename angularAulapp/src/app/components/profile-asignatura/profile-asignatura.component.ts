import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../../services/asignaturas/asignaturas.service';
import { Asignatura } from 'src/app/models/asignaturas.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile-asignatura',
  templateUrl: './profile-asignatura.component.html',
  styleUrls: ['./profile-asignatura.component.css']
})
export class ProfileAsignaturaComponent implements OnInit {

  constructor(
    public _asignatura: AsignaturaService,
    public router: Router,
    public rutaActiva: ActivatedRoute
  ) { }

  asignatura: Asignatura;
  idAsignatura: string;

  ngOnInit() {

    this.rutaActiva.params.subscribe( parametros =>{
      this.idAsignatura = parametros.id;
      this._asignatura.getAsig(this.idAsignatura).subscribe((resultado: Asignatura) =>{
        this.asignatura = resultado;
      
      })
    })
  }

}
