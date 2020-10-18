import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { LogService } from '../../../services/log/log.service';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css', '../../crud-usuario/edit-user/edit-user.component.css']
})
export class InfoComponent implements OnInit {

  constructor(
    public _usuario: UsuarioService,
    public router: Router,
    public rutaActiva: ActivatedRoute,
    public _logService: LogService

  ) { }

  usu: Usuario; 
  idUsu: string;
  varlogs: any[] = [];


  ngOnInit() {
    this.rutaActiva.params.subscribe( parametros =>{
      this.idUsu = parametros.id;
      this._usuario.getUser(this.idUsu).subscribe((resultado: Usuario) =>{
        this.usu = resultado;

      })
    })

    this._logService.getLogPorIdUsuario(this.idUsu)
      .subscribe((data:any) => {
        this.varlogs = data;
      })
  }

}