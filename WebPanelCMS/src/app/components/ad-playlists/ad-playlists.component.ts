import { Component, OnInit ,ViewContainerRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AdsService } from 'src/app/ad/ads.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-ad-playlists',
  templateUrl: './ad-playlists.component.html',
  styleUrls: ['./ad-playlists.component.css']
})
export class AdPlaylistsComponent implements OnInit {
  ScheduleList = [];
  dropdownSettings = {};
  dropdownList = [];
  selectedItems = [];
  Plform: FormGroup;
  submitted = false;
  public loading = false;
  TokenSelected = [];
  TokenList = [];
  CustomerList: any[];
  PlaylistList = [];
  SearchTokenList = [];
  FormatList = [];
  page: number = 1;
  pageSize: number = 50;
  pageSearch: number = 1;
  pageSizeSearch: number = 20;
  dt = new Date();
  dt2 = new Date();
  cmbSearchCustomer = "0";
  cmbSearchToken = 0;
  cmbSearchPlaylist = 0;
  TokenInfoModifyPlaylist: FormGroup;
  pSchid = 0;
  searchText="";
  aid;
  delTokenId;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  
  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private sfService: StoreForwardService,
    private aService: AdsService, public auth:AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    var cd = new Date();
    
     

    this.Plform = this.formBuilder.group({
      CustomerId: ["0", Validators.required],
      FormatId: ["0", Validators.required],
      PlaylistId: ["0", Validators.required],
      sDate: [cd, Validators.required],
      eDate: [cd, Validators.required],
      startTime: [this.dt, Validators.required],
      EndTime: [this.dt2, Validators.required],
      pMode: ["Minutes"],
      TotalFrequancy: [0],
      wList: [this.selectedItems, Validators.required],
      TokenList: [this.TokenSelected]
    });
    this.dropdownList = [ 
      { "id": "1", "itemName": "Monday" },
      { "id": "2", "itemName": "Tuesday" },
      { "id": "3", "itemName": "Wednesday" },
      { "id": "4", "itemName": "Thursday" },
      { "id": "5", "itemName": "Friday" },
      { "id": "6", "itemName": "Saturday" },
      { "id": "7", "itemName": "Sunday" }
    ];
    this.TokenList = [];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Week",
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Week',
      unSelectAllText: 'Week',
      itemsShowLimit: 4
    };
    this.FillClient();
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
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.Plform.get('CustomerId').setValue(localStorage.getItem('dfClientId'));
          this.onChangeCustomer(localStorage.getItem('dfClientId'));
          this.cmbSearchCustomer=localStorage.getItem('dfClientId')
          this.onChangeSearchCustomer(localStorage.getItem('dfClientId'))
        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillFormat() {
    var q = "";
    if (this.auth.IsAdminLogin$.value == true) {
      q = "FillFormat 0,'"+ localStorage.getItem('DBType') +"'";
    }
    else {
      q = "select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid";
      q = q + " left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where (dbtype='"+ localStorage.getItem('DBType') +"' or dbtype='Both') and (st.dfclientid=" + localStorage.getItem('dfClientId') + " OR sf.dfclientid=" + localStorage.getItem('dfClientId') + ") group by  sf.formatname";
    }
    this.loading = true;
    this.sfService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        this.FormatList = JSON.parse(returnData);
        
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeFormat(id) {
    this.ScheduleList = [];
    this.PlaylistList = [];
    this.FillPlaylist(id);
  }
  FillPlaylist(id) {
    this.loading = true;
    this.sfService.Playlist(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlaylistList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  cid="";
  onChangeCustomer(deviceValue) {
    this.cid=deviceValue;
    var qry = "";
    qry = "";
    qry = "select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid";
    qry = qry + " left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where ";
    qry = qry + " (dbtype='" + localStorage.getItem('DBType') + "' or dbtype='Both') and  (st.dfclientid=" + deviceValue + " OR sf.dfclientid=" + deviceValue + ")  group by  sf.formatname";
     
      this.loading = true;
      this.sfService.FillCombo(qry).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.loading = false;
          this.FillTokenInfo(deviceValue);
          this.FillGroup();
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    

  }
  FillTokenInfo(deviceValue) {
    this.loading = true;
    this.rerender();
    this.sfService.FillTokenInfo(deviceValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.loading = false;
        this.rerender();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchToken(id){
   
    this.SearchContent();
  }
  SearchContent() {
    if (this.cmbSearchCustomer == "0") {
      this.toastr.error("Select a customer", '');
      return;
    }
    this.ScheduleList=[]
    this.loading = true;
     
    this.sfService.FillAdPlaylist(this.cmbSearchCustomer, this.cmbSearchToken).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.ScheduleList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id) {
    this.ScheduleList = [];
    this.loading = true;
    this.sfService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
        this.loading = false;
        this.SearchContent();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  get f() { return this.Plform.controls; }

  SelectToken(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected.push(fileid);
    }
    else {
      const index: number = this.TokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected.splice(index, 1);
      }
    }

  }
  
  onSubmitPL  = function () {
    
    this.submitted = true;
    if(this.Plform.value.CustomerId == 0){
      this.toastr.error("Please select a customer name");
      return;
    }
    if(this.Plform.value.FormatId == 0){
      this.toastr.error("Please select a format name");
      return;
    }
    if(this.Plform.value.PlaylistId == 0){
      this.toastr.error("Please select a playlist name");
      return;
    }
    if(this.Plform.value.TotalFrequancy == 0){
      this.toastr.error("Frequancy should be grater than zero");
      return;
    }
    if(this.Plform.value.wList.length == 0){
      this.toastr.error("Please select a Week Day");
      return;
    }
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Select atleast one token", '');
      return;
    }
    
    
    if (this.Plform.invalid) {
      return;
    }
    var startTime = new Date(this.Plform.controls["startTime"].value).getHours();
    var EndTime = new Date(this.Plform.controls["EndTime"].value).getHours();
    if (EndTime < startTime) {
     // this.toastr.error("End time should be greater than start time");
     // return;
    }
    
    


    var sTime = new Date(this.Plform.value.startTime);
    var eTime = new Date(this.Plform.value.EndTime);
    this.Plform.get('startTime').setValue(sTime.toTimeString().slice(0, 5));
    this.Plform.get('EndTime').setValue(eTime.toTimeString().slice(0, 5));
 
    this.loading = true;
    this.sfService.SaveAdPlaylist(this.Plform.value).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == "1") {
        this.toastr.info("Saved", 'Success!');
        this.loading = false;
       this.clear();
        this.SaveModifyInfo(0,"Playlist is schedule for advertisement");
      }
      else {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      }
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
  }
  clear(){
    var cd = new Date();
    this.selectedItems=[];
    this.TokenSelected=[];
    this.Plform.get('sDate').setValue(cd);
    this.Plform.get('eDate').setValue(cd);
    this.Plform.get('pMode').setValue("Minutes");
    this.Plform.get('TotalFrequancy').setValue(0);

    this.PlaylistList=[];
    this.FormatList=[];
    this.dropdownList=[];
    this.Plform.get('CustomerId').setValue("0");
    this.Plform.get('FormatId').setValue("0");
    this.Plform.get('PlaylistId').setValue("0");
    this.Plform.get('wList').setValue('');
    this.TokenList=[];

    this.dropdownList = [
      { "id": "1", "itemName": "Monday" },
      { "id": "2", "itemName": "Tuesday" },
      { "id": "3", "itemName": "Wednesday" },
      { "id": "4", "itemName": "Thursday" },
      { "id": "5", "itemName": "Friday" },
      { "id": "6", "itemName": "Saturday" },
      { "id": "7", "itemName": "Sunday" }
    ];
  }
  SaveModifyInfo(tokenid, ModifyText){
  
    this.sfService.SaveModifyLogs(tokenid, ModifyText).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
    },
      error => {
      })
  };
  allToken(event){
    const checked = event.target.checked;
    this.TokenSelected=[];
    this.TokenList.forEach(item=>{
      item.check = checked;
      this.TokenSelected.push(item.tokenid)
    });
    if (checked==false){
      this.TokenSelected=[];
    }
    
  }
  openAdsDeleteModal(mContent, id,tokenid) {
    this.aid = id;
    this.delTokenId=tokenid;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteAds() {
    this.loading = true;
    this.aService.DeletePlaylistAds(this.aid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", '');
          this.SearchContent();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }


  SelectedGroupArray = [];
  GroupSettings = {};
  GroupList = [];
  FillGroup() {
    this.GroupSettings = {
      singleSelection: false,
      text: 'Select City',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
    };
    this.loading = true;
    var qry =
      'select GroupId as id, GroupName as displayname  from tbGroup where dfClientId in( ' +
      this.cid +
      ' ) order by GroupName';
    this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.GroupList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  ReturnFncAddId(ArrayList) {
    var ReturnId = [];
    for (var i = 0; i < ArrayList.length; i++) {
      ReturnId.push(ArrayList[i].Id);
    }
    return ReturnId;
  }
  removeDuplicateRecordFilter(array, SelectedArray) {
    return (SelectedArray = SelectedArray.filter(
      (order) => order.Id !== array.Id
    ));
  }
  onItemSelectGroup(item: any) {
    
    //this.chkAll = false;
    //this.searchText = '';
    this.TokenList = [];
    if (this.SelectedGroupArray.length == 0) {
      this.FilterTokenInfo('0', '');
      this.SelectedGroupArray = [];
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);
    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onItemDeSelectGroup(item: any) {
  //  this.chkAll = false;
 //   this.searchText = '';
    this.SelectedGroupArray = this.removeDuplicateRecordFilter(
      item,
      this.SelectedGroupArray
    );
    if (this.SelectedGroupArray.length == 0) {
      this.FilterTokenInfo('0', '');
      this.SelectedGroupArray = [];
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);
    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onSelectAllGroup(items: any) {
   // this.chkAll = false;
  //  this.searchText = '';
    this.SelectedGroupArray = items;
    this.TokenList = [];
    if (this.SelectedGroupArray.length == 0) {
      this.FilterTokenInfo('0', '');
      this.SelectedGroupArray = [];
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);

    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onDeSelectAllGroup(items: any) {
   // this.chkAll = false;
 //   this.searchText = '';
    this.SelectedGroupArray = [];
    this.FilterTokenInfo('0', '');
  }

  FilterTokenInfo(FilterValue, FilterId) {
    this.loading = true;
    var ObjLocal;
     
    this.rerender();
    this.sfService.FillTokenInfo(this.cid).pipe()
      .subscribe(data => {
        this.TokenList=[];
        var returnData = JSON.stringify(data);
        var List = JSON.parse(returnData);
        if (FilterValue!="0"){
          for (var counter = 0; counter < FilterValue.length; counter++) {
          if (FilterId == 'GroupId') {
             ObjLocal = List.filter(
               (order) => order.GroupId == FilterValue[counter]
             );
           }
           if (ObjLocal.length > 0) {
             ObjLocal.forEach((obj) => {
               this.TokenList.push(obj);
             });
           }
         }
       }
       else{
        this.TokenList= JSON.parse(returnData);
       }
        this.loading = false;
        this.rerender();
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
      dom: 'rtp',
      order:[[ 2, "asc" ]],
      columnDefs: [ {
        'caseInsensitive': false
      },{
        'targets': [0], // column index (start from 0)
        'orderable': false,
      },{
        'width':'60px', 'targets': 0,
      },{
        'width':'100px', 'targets': 1,
      },{
        'width':'120px', 'targets': 4,
      }],
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
