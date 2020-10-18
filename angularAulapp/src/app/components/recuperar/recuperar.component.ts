import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  
  forma : FormGroup;
  email : string;
  checked : boolean = false;
  times : number = 0;
  minutos : number = 4; //300 segundos son 5 minutos
  segundos : number = 59;
  constructor(public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    /*if(this.email.length >1){
      this.recuerdame=true;
    }*/
    this.forma = new FormGroup({
      email : new FormControl(null, [Validators.required, Validators.email])
    });
  }
  recupcontra(formu: NgForm){
    this.email = formu.value.email;
    console.log("Dirección a mandar: " + this.email);
    /*var EMAIL_REGEX = "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";
    if (!formu.value.email.match(EMAIL_REGEX)){
      //mailValido = true;
      console.log("Email invalido");
      swal.fire({
        icon: 'error',
        title: "Correo electrónico inválido",
        text: "Te has equivocado al escribir la dirección de correo electrónico.",
        cancelButtonColor: '#3085d6'
      });
    }*/
    //else{
    this._usuarioService.recuperarContra(this.email)
    .subscribe (resp =>{
      let r = JSON.parse(resp); 
      console.log(r.ok);
      if (r.ok == false){
        swal.fire({
          icon: 'error',
          title: "Correo electrónico inválido",
          text: "Te has equivocado al escribir la dirección de correo electrónico.",
          cancelButtonColor: '#3085d6'
        });
      }
      else{
        this.checked = true;
      }
    });
    //}
  }
  recup2(){
    console.log("Dirección a mandar: " + this.email);
    this._usuarioService.recuperarContra(this.email)
    .subscribe (resp => {
      console.log(resp);
    });
    this.times++;
    if (this.times >= 5){
      this.minutos = 4;
      this.segundos = 59;
      setInterval(() => this.cuentatras(), 1000);
    }
  }
  cuentatras(){
    this.segundos--;
    if (this.segundos < 0){
      this.segundos = 59;
      this.minutos--;
      if(this.minutos < 0){
        this.times = 0;
        return;
      }
    }
  }
}