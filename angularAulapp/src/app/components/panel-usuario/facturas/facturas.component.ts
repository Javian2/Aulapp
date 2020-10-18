import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  
  @ViewChild('content', {static: false}) content: ElementRef;

  public downloadPDF(){
    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML, 10, 10, {
      'width': 250,
      'elementHandlers': specialElementHandlers
    });

    doc.save('Factura.pdf');
  }


  constructor() { }

  ngOnInit() {
  }

}
