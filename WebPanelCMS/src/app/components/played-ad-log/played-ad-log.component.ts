import { AfterViewInit, Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { SerReportService } from 'src/app/report/ser-report.service';
import { PlayerlogsService } from '../player-log/playerlogs.service';
import { DataTableDirective } from 'angular-datatables';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Subject } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-played-ad-log',
  templateUrl: './played-ad-log.component.html',
  styleUrls: ['./played-ad-log.component.css']
})
export class PlayedAdLogComponent implements AfterViewInit, OnInit, OnDestroy  {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  file_Name = "";
  Client_Name = "";
  cid;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  tabkey="0"
  CustomerList: any[];
  TokenList = [];
  PlayedAdsList = [];
  SearchAdsDate;
  SearchAdsToDate
  pageAds: number = 1;
  pageSizeAds: number = 30;
  searchAdsText;
  loading = false;
  tokenid = "0";
  PlayedAdsListSummary=[]
  constructor(public toastr: ToastrService, private rService: SerReportService,public auth:AuthServiceOwn,
    private plService: PlayerlogsService) { }

  async ngOnInit() {
    var cd = new Date();
    this.SearchAdsDate = cd
    this.SearchAdsToDate= cd
    this.DataTableSettings()
    await  this.FillClientList()
  }
  DataTableSettings() {
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'Brtp',
      columnDefs: [{
        'targets': [0, 1], // column index (start from 0)
        'orderable': true,
      },{
        'width':'110px', 'targets': 1 
      }],
      retrieve: true,
      buttons: [
        {
          extend: 'pdf',
          pageSize: 'A4', title: '', filename: this.file_Name,
          exportOptions: {
            columns: [0, 1]
          }
        }, {
          extend: 'excelHtml5',
          pageSize: 'A4', title: '', filename: this.file_Name,
          exportOptions: {
            columns: [0, 1]
          }
        }
      ]
    };
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
  tabclickkey(e){
this.tabkey= e
  }
  async onChangeCustomer(id, type) {
    this.PlayedAdsList = [];
    if (id == "0") {
      this.TokenList = [];
      return;
    }
    var ArrayItem = {};
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.Client_Name=""
    const NewList = this.CustomerList.filter(order => order.Id == ArrayItem["Id"]);
    if (NewList.length > 0) {
      this.Client_Name = NewList[0].DisplayName;
    }
     

    this.loading = true;
    this.rService.FillTokenInfo(id, 1).pipe()
      .subscribe(async data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);

        this.loading = false;
        if (type=="summary"){
          await this.SearchPlayedAdSummary()
        }
    
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  onChangePlayer(id) {
    this.PlayedAdsList = [];
    this.tokenid = id;
    this.SearchPlayedAds();
  }
  SearchPlayedAds() {
    this.loading = true;
    var sTime1 = new Date(this.SearchAdsDate);
   
    this.plService.FillPlayedAdLogreport(sTime1.toDateString(),this.tokenid).pipe()
      .subscribe(data => {

        var returnData = JSON.stringify(data);

        this.PlayedAdsList = JSON.parse(returnData);
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
    try {
      this.dtTrigger.unsubscribe();
      
    } catch (error) {
      
    }
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

  SearchPlayedAdSummary() {
    var cd = new Date();
    var FromDate = new Date(this.SearchAdsDate);
    var ToDate = new Date(this.SearchAdsToDate);

    if (FromDate.getDate() > ToDate.getDate()) {
     // this.SearchFromDate = cd;
     // this.SearchToDate = cd;
    //  return;
    }
    
    this.PlayedAdsListSummary = [];
    this.rerender();
if (this.tokenid=="0"){
  this.file_Name = this.Client_Name + "_"  + FromDate.toDateString() + "_" + ToDate.toDateString() + "_AdsSummary";
}
else{
  this.file_Name = this.Client_Name + "_" + this.tokenid + "_" + FromDate.toDateString() + "_" + ToDate.toDateString() + "_AdsSummary";
}
this.DataTableSettings();

    this.loading = true;
 
    this.rService.FillPlayedAdSummary(FromDate.toDateString(), ToDate.toDateString(), this.tokenid,this.cid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlayedAdsListSummary = JSON.parse(returnData);
        this.rerender();
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
