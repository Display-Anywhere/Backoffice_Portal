import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { DataTableDirective } from 'angular-datatables';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Subject, Observable, Subscription } from 'rxjs';
import { SerAdminLogService } from '../admin-logs/ser-admin-log.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-player-ipaddress-logs',
  templateUrl: './player-ipaddress-logs.component.html',
  styleUrls: ['./player-ipaddress-logs.component.css']
})
export class PlayerIPAddressLogsComponent implements OnInit {
  CustomerList: any[];
  LogList = [];
  public loading = false;
  cid="0"
  tid="0"
  TokenList
  page: number = 1;
  pageSize: number = 20;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  file_Name = "";
  constructor(private adminService: SerAdminLogService,public auth:AuthService,
     public toastr: ToastrService, vcr: ViewContainerRef) {
      this.auth.ClientId$.subscribe((res) => {
        this.onChangeCustomer(res)
      }); 
   }

  ngOnInit() {
     
    this.DataTableSettings();
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.adminService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  DataTableSettings() {
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'Brtp',
      columnDefs: [{
        'targets': [4,5], // column index (start from 0)
        'orderable': false,
      }],
      retrieve: true,
      buttons: [
        {
          extend: 'pdf',
          pageSize: 'A4', title: '', filename: this.file_Name,
           
        }, {
          extend: 'excelHtml5',
          pageSize: 'A4', title: '', filename: this.file_Name,
          
        }
      ]
    };
  }
  onChangeCustomer(deviceValue) {
    this.cid=deviceValue;
    this.tid="0"
    this.loading = true;
    this.TokenList=[];
    this.adminService.FillTokenInfo(this.cid, 1).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.loading = false;
        this.FillRecords();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
    
  }
  onChangePlayer(deviceValue) {
    this.tid=deviceValue;
    this.FillRecords();
  }
  FillRecords(){
    this.loading = true;
    this.LogList=[];
    this.rerender();
    this.file_Name ="Player_IP_Logs";
  this.DataTableSettings();
  
    this.adminService.FillPlayerIpLogs(this.cid,this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.LogList = JSON.parse(returnData);
        this.rerender();
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      // Destroy the table first      
      dtInstance.destroy();
      // Call the dtTrigger to rerender again       
      this.dtTrigger.next();

    });
  }

}
