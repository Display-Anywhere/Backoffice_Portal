import { Component, OnInit, ViewContainerRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { SerReportService } from 'src/app/report/ser-report.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-hoteltv-played-logs',
  templateUrl: './hoteltv-played-logs.component.html',
  styleUrls: ['./hoteltv-played-logs.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class HoteltvPlayedLogsComponent implements AfterViewInit, OnInit, OnDestroy  {

  CustomerList: any[];
  TokenList = [];
  public loading = false;
  SearchFromDate;
  SearchToDate;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  tokenid = "0";
  PlayedSongList;
  file_Name="";
  Client_Name="";
  @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
  constructor(config: NgbModalConfig, private modalService: NgbModal, 
    private rService: SerReportService, public toastr: ToastrService, vcr: ViewContainerRef,
    public auth:AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    var cd = new Date();
    this.SearchFromDate = cd;
    this.SearchToDate = cd;
     
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'Brtp',
      columnDefs:[{
        'targets': [1,2,3], // column index (start from 0)
        'orderable': false,
      }],
      retrieve: true,
      buttons: [
        {
          extend: 'pdf',
          pageSize: 'A4', title: '',filename:this.file_Name,
          exportOptions: {
            columns: [ 1,2, 3 ]
        }
        }, {
          extend: 'excelHtml5',
          pageSize: 'A4', title: '',filename:this.file_Name,
          exportOptions: {
            columns: [ 1,2, 3 ]
        }
        }
      ]
    };


    this.FillClientList();
  }

  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');


    this.rService.FillCombo(str).pipe()
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
  NewList;
  GetJSONRecord = (array): void => {
    this.NewList = this.CustomerList.filter(order => order.Id == array.Id);
  }
  onChangeCustomer(id) {
    this.PlayedSongList = [];
    if (id == "0") {
      this.TokenList = [];
      return;
    }

    var ArrayItem = {};
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.GetJSONRecord(ArrayItem);
    if (this.NewList.length > 0) {
      this.Client_Name = this.NewList[0].DisplayName;
    }

    this.loading = true;
    this.rService.FillTokenInfo(id, 1).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.TokenList = this.TokenList.filter(
          (order) => order.DeviceType === 'HotelTv'
        );

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }
  onChangePlayer(id) {
    this.PlayedSongList = [];
    this.tokenid = id;
    this.SearchPlayedSong();
  }
  SearchPlayedSong() {
    var cd = new Date();
    var FromDate = new Date(this.SearchFromDate);
    var ToDate = new Date(this.SearchToDate);
    if (FromDate.getDate() > ToDate.getDate()) {
      //this.SearchFromDate = cd;
      //this.SearchToDate = cd;
     // return;
    }
    if (this.tokenid == "0") {
      this.PlayedSongList = [];
      return;
    }
    this.PlayedSongList = [];
    this.rerender();

this.file_Name= this.Client_Name+"_"+this.tokenid+"_"+ FromDate.toDateString()+"_"+ ToDate.toDateString()+"_PlayedSongsLog";


    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'Brtp',
      columnDefs:[{
        'targets': [1,2,3], // column index (start from 0)
        'orderable': false,
      }],
      retrieve: true,
      buttons: [
        {
          extend: 'pdf',
          pageSize: 'A4', title: '',filename:this.file_Name,
          exportOptions: {
            columns: [ 1,2, 3 ]
        }
        }, {
          extend: 'excelHtml5',
          pageSize: 'A4', title: '',filename:this.file_Name,
          exportOptions: {
            columns: [ 1,2, 3 ]
        }
        }
      ]
    };










    this.loading = true;

    this.rService.FillPlayedSongsLog(FromDate.toDateString(), ToDate.toDateString(), this.tokenid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlayedSongList = JSON.parse(returnData);
        
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
