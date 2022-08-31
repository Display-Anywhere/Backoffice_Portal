import { Component, OnInit } from '@angular/core';
import { AuthServiceOwn } from '../auth/auth.service';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  
IsAdminLogin:boolean= false;
  constructor(public authService: AuthServiceOwn){}
  ngOnInit() {
    if ((localStorage.getItem('dfClientId') == "2") || (localStorage.getItem('dfClientId') == "6")) {
      this.IsAdminLogin = true;
      
    }
    else {
      this.IsAdminLogin = false;
      
    } 
  }


}
/*
"./node_modules/jszip/dist/jszip.js",
"./node_modules/datatables.net-buttons/js/dataTables.buttons.js",
"./node_modules/datatables.net-buttons/js/buttons.colVis.js",
"./node_modules/datatables.net-buttons/js/buttons.flash.js",
"./node_modules/datatables.net-buttons/js/buttons.html5.js",
"./node_modules/datatables.net-buttons/js/buttons.print.js",

*/