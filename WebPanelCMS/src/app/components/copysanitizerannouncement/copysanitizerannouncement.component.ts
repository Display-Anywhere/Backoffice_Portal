import { Component, OnInit, ViewContainerRef,ViewChild,OnDestroy, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { MachineService } from '../machine-announcement/machine.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-copysanitizerannouncement',
  templateUrl: './copysanitizerannouncement.component.html',
  styleUrls: ['./copysanitizerannouncement.component.css']
})
export class CopysanitizerannouncementComponent implements OnInit {
  constructor(public toastr: ToastrService, public auth:AuthService, 
    private sfService: StoreForwardService,private formBuilder: FormBuilder, 
    private modalService: NgbModal, private serviceLicense: SerLicenseHolderService,private mService:MachineService) { }

  page: number = 1;
  pageSize: number = 50;
 
   
  public loading = false;
  CustomerList: any[];
  cmbCustomer = '0';
  cmbToken="0";
  TokenList: any[];
  FilterTokenList=[];
  ContentList:any[];
  TokenSelected_lst = [];

  CustomerSearchList: any[];
  cmbSearchCustomer: number;
  cmbSearchFolder:number;
  FolderSearchList: any[];
  CDform: FormGroup;
  chkAll:boolean=false;
  NewFolderName: string = "";
  FolderName = "";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  searchText="";
  ngOnInit(): void {
    this.CDform = this.formBuilder.group({
      FolderId: [this.cmbSearchFolder],
      TitleList: [this.TokenSelected_lst],
      dfClientId: [this.cmbSearchCustomer],
      FromFolderId:[this.cmbToken]
    });

    this.FillClient();
    this.ContentList=[];
    this.cmbSearchCustomer=0;
    this.cmbSearchFolder=0;
    this.DataTableSettings();
  }
  FillClient() {
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.sfService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        this.CustomerList = JSON.parse(returnData);
        this.CustomerSearchList = JSON.parse(returnData);
        this.loading = false;
       
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.cmbCustomer = localStorage.getItem('dfClientId');
          this.onChangeCustomer(this.cmbCustomer);
        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  } 
  FillToken(id) {
    this.loading = true;
    this.serviceLicense.FillTokenInfo(id,"0").pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
       
        this.loading = false;
         
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCustomer(e){
    this.TokenSelected_lst=[];
    this.ContentList=[];
    this.FilterTokenList=[];
    this.TokenList=[];
    this.cmbToken="0";
    this.FillToken(e);
  }
  onChangeToken(e){
    this.chkAll= false;
    this.rerender();

    this.loading = true;
    this.serviceLicense.FillTokenInfo(this.cmbCustomer,"0").pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.FilterTokenList= obj.filter(order => order.tokenid !=this.cmbToken)
        this.loading = false;
        this.rerender();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

    
     
    
    this.FillSearch(e);
  }
  NewfList;
  GetJSONFolderRecord = (array): void => {
    this.NewfList = this.FolderSearchList.filter(order => order.Id == array.Id);
  }
  FillSearch(id) {
    this.loading = true;
    this.mService.GetMachineAnnouncement(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.ContentList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  allContent(event){
    var tokenItem = {};
    const checked = event.target.checked;
    this.TokenSelected_lst=[];
    this.FilterTokenList.forEach(item=>{
      item.check = checked;
      tokenItem = {};
      
      tokenItem['tokenid'] = item.tokenid;
      tokenItem['tokenCode'] = item.tokenid;
      this.TokenSelected_lst.push(tokenItem);

      this.TokenSelected_lst.push(item.id)
    });
    if (checked==false){
      this.TokenSelected_lst=[];
    }
  }
  SelectContent(fileid, event) {
    var tokenItem = {};
    if (event.target.checked) {
      tokenItem['tokenid'] = fileid;
      tokenItem['tokenCode'] = fileid;
      this.TokenSelected_lst.push(tokenItem);
    } else {
      tokenItem['tokenid'] = fileid;
      tokenItem['tokenCode'] = fileid;
      this.removeDuplicateRecord(tokenItem);
    }
  }
  removeDuplicateRecord = (array): void => {
    this.TokenSelected_lst = this.TokenSelected_lst.filter(
      (order) => order.tokenId !== array.tokenId
    );
  };
   
  SaveContent(){
    let SongsSelected=[];
    if (this.cmbCustomer == '0') {
      this.toastr.info("Please select a customer name");
      return;
    }
    if (this.ContentList.length == 0) {
      this.toastr.info("Please select a content");
      return;
    }
    if (this.TokenSelected_lst.length == 0) {
      this.toastr.info("Please select a token");
      return;
    }
    
    this.ContentList.forEach(item=>{
      SongsSelected.push(item.id)
    });

    this.loading = true;
    this.mService.SaveMachineAnnouncement(this.TokenSelected_lst, SongsSelected, false).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.cmbSearchCustomer = 0;
          this.cmbSearchFolder = 0;
          this.cmbCustomer = '0';
          this.cmbToken = "0";
          this.ContentList = [];
          this.TokenSelected_lst = [];
          this.FilterTokenList=[];
          this.TokenList=[];
          this.chkAll= false;

        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }
  openGenreModal(mdl) {
    if (this.cmbSearchCustomer==0){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  
  onChangeSearchFolder(e){
    this.FolderName="";
    var ArrayItem = {};
    ArrayItem["Id"] = e;
    ArrayItem["DisplayName"] = "";
    this.GetJSONFolderRecord(ArrayItem);
    if (this.NewfList.length > 0) {
      this.FolderName = this.NewfList[0].DisplayName;
    }
  }

  DataTableSettings() {
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'rtp',
     
      columnDefs: [ {
        'caseInsensitive': false
      },{
        'targets': [0], 
        'orderable': false,
      },{
        "targets": [7,8],
        "visible": false
    },{
        'width':'100px', 'targets': 1,
      },{
        'width':'130px', 'targets': 2,
      },{
        'width':'280px', 'targets': 3,
      },{
        'width':'100px', 'targets': 4,
      }
      ,{
        'width':'280px', 'targets': 5,
      }
      ],
      retrieve: true,
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  filterById(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.searchText,false).draw();
    });
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
