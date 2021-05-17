import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { SerAdminLogService } from '../admin-logs/ser-admin-log.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { DataTableDirective } from 'angular-datatables';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Subject, Observable, Subscription } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {
  CustomerList: any[];
  LogList = [];
  public loading = false;
   
  page: number = 1;
  pageSize: number = 20;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  file_Name = "";
  constructor(private adminService: SerAdminLogService,public auth:AuthService,
     public toastr: ToastrService, vcr: ViewContainerRef) {
   }

  ngOnInit() {
    this.FillClientList();
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
        'targets': [1,2], // column index (start from 0)
        'orderable': false,
      }],
      retrieve: true,
      buttons: [
        {
          extend: 'pdf',
          pageSize: 'A4', title: '', filename: this.file_Name,
          exportOptions: {
            columns: [0,1, 2,3]
          }
        }, {
          extend: 'excelHtml5',
          pageSize: 'A4', title: '', filename: this.file_Name,
          exportOptions: {
            columns: [0,1, 2,3]
          }
        }
      ]
    };
  }
  onChangeCustomer(deviceValue) {
    this.loading = true;
    this.LogList=[];
    this.rerender();
    this.file_Name ="Logs";
  this.DataTableSettings();
  
    this.adminService.FillAdminLogs(deviceValue).pipe()
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
