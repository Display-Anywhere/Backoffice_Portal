import { Component, OnInit,ViewContainerRef,ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { DataTableDirective } from 'angular-datatables';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Subject, Observable, Subscription } from 'rxjs';
import { SerAdminLogService } from '../admin-logs/ser-admin-log.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { VisitorsService } from 'src/app/visitors.service';
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
  MapLocation=''
  TokenList
  page: number = 1;
  pageSize: number = 20;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  file_Name = "";
  lat 
  lng
  zoom: number =15
  constructor(private adminService: SerAdminLogService,public auth:AuthService,private modalService: NgbModal,config: NgbModalConfig,
     public toastr: ToastrService,private visitorsService: VisitorsService, vcr: ViewContainerRef) {
      config.backdrop = 'static';
      config.keyboard = false;
      this.auth.ClientId$.subscribe((res) => {
        this.onChangeCustomer(res)
      }); 
   }

  ngOnInit() {
     
    //this.DataTableSettings();
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
    this.LogList=[];
    this.adminService.FillTokenInfo(this.cid, 1).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.TokenList.sort(this.GetSortOrder("city",true));
        this.loading = false;
        //this.FillRecords();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
    
  }
  GetSortOrder(prop,asc) {    
    return function(a, b) {    
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    }   
        return 0;    
    } 
  }
  onChangePlayer(deviceValue) {
    try {
      this.tid=deviceValue;
      this.MapLocation=''
      let obj= this.TokenList.filter(o=>o.tokenid===this.tid)
      this.MapLocation= obj[0].Maplocation
      this.FillRecords();
      } catch (error) {
        this.LogList=[];
    }
  }
  FillRecords(){
    this.loading = true;
    this.LogList=[];
   // this.rerender();
    this.file_Name ="Player_IP_Logs";
  //this.DataTableSettings();
  
    this.adminService.FillPlayerIpLogs(this.cid,this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.LogList = JSON.parse(returnData);
        //this.rerender();
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  ngAfterViewInit(): void {
   // this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
   // this.dtTrigger.unsubscribe();
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
  OpenGoogleMap(ip,modal){
    try {
      
    this.loading= true

    this.visitorsService.getGEOLocation(ip).subscribe(res => {
      this.loading = false;
      this.lat =  Number(res['latitude'])
      this.lng =   Number(res['longitude'])
      console.log(this.lat+ ' '+ this.lng);
      
      setTimeout(() => {
      this.modalService.open(modal, {
        size: 'mdSx',
      }); 
    }, 1500);
     
      
    },
    error => {
      this.loading = false;
    });

  } catch (e) {
    this.loading = false;
      
  } 
  }
  
 
}
