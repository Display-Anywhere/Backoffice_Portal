import { Component, OnInit ,ViewContainerRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { AdsService } from 'app/mock-api/services/ads.service';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { StoreForwardService } from 'app/mock-api/services/store-forward.service';
import { SerLicenseHolderService } from 'app/mock-api/services/ser-license-holder.service';
import { DateInputFillMode, FormatSettings } from '@progress/kendo-angular-dateinputs';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SelectEvent } from '@progress/kendo-angular-layout';
@Component({
  selector: 'app-ad-playlists',
  templateUrl: './ad-playlists.component.html',
  styleUrls: ['./ad-playlists.component.css'],
  providers: [DecimalPipe],
})
export class AdPlaylistsComponent implements OnInit {
  public format: FormatSettings = {
    displayFormat: "dd/MMM/yyyy",
    inputFormat: "dd/MMM/yyyy",
  };
  fillMode="outline"
  selectedFillMode: DateInputFillMode = "outline";
  ScheduleList = [];
  adPlaylistActiveTabId=1
  dropdownSettings = {};
  dropdownList = [];
  selectedItems = [];
  AddNewTabSelected=false
  Plform: FormGroup;
  submitted = false;
  public loading = false;
  TokenSelected = [];
  TokenList = [];
  MainTokenList=[]
  TokenList_Search = [];
  CustomerList: any[];
  PlaylistList = [];
  SearchTokenList = [];
  FormatList = [];
  page: number = 1;
  pageSize: number = 50;
  pageSearch: number = 1;
  pageSizeSearch: number = 20;
  listOfPlayingMode=[
    {Id:"Minutes",DisplayName:"Minutes"},
    {Id:"Song",DisplayName:"Content"},
    {Id:"Seconds",DisplayName:"Seconds"}
  ]
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
  dtOptions: any = {};
  SearchAdsDate
  cmbPublishId=""
  ForceUpdateTokenid = '';
  SearchText = '';
  cmbCustomerMediaType=""
  CustomerMediaTypeList=[]
  chkAll_Token= false
  dtTrigger: Subject<any> = new Subject();
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private sfService: StoreForwardService,
    private aService: AdsService, public auth:AuthServiceOwn,private serviceLicense: SerLicenseHolderService,private pipe: DecimalPipe) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    var cd = new Date();
    var cd = new Date();
    this.SearchAdsDate = cd;
     this.insForm()

    
    this.dropdownList = [ 
      { "id": "2", "itemName": "Monday" },
      { "id": "3", "itemName": "Tuesday" },
      { "id": "4", "itemName": "Wednesday" },
      { "id": "5", "itemName": "Thursday" },
      { "id": "6", "itemName": "Friday" },
      { "id": "7", "itemName": "Saturday" },
      { "id": "1", "itemName": "Sunday" }
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
    //this.DataTableSettings();
  }
insForm () {
  var cd = new Date();
  this.Plform = this.formBuilder.group({
    id: ["0"],
    CustomerId: [localStorage.getItem('dfClientId'), Validators.required],
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
        
          this.Plform.get('CustomerId').setValue(localStorage.getItem('dfClientId'));
          this.onChangeCustomer(localStorage.getItem('dfClientId'));
          this.cmbSearchCustomer=localStorage.getItem('dfClientId')
          this.onChangeSearchCustomer(localStorage.getItem('dfClientId'))
         
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
    this.SearchText=''
    this.TokenSelected=[]
    this.TokenList=[]
    this.selectedItems = []
    var cd = new Date();
    this.Plform.patchValue({
     FormatId: "0",
     PlaylistId: "0",
     sDate: cd,
     eDate: cd,
     startTime: this.dt,
     EndTime: this.dt2,
     pMode: "Minutes",
     TotalFrequancy: 0,
     wList: this.selectedItems,
     TokenList: this.TokenSelected
   });
    this.GetCustomerMediaType(deviceValue)
  }
  FillFormat() {
    var qry = "";
    var innerQry=""
    if ((this.cmbCustomerMediaType == 'Signage') || (this.cmbCustomerMediaType == 'Video')){
      innerQry= " and sf.mediatype in('Signage','Video') "
    }
    else if ((this.cmbCustomerMediaType == 'Audio')){
      innerQry= " and sf.mediatype in('Audio Copyright','Audio DirectLicence', 'Audio') "
    }
    else{
      innerQry= " and sf.mediatype in('"+this.cmbCustomerMediaType+"') "
    }
    
    qry = '';
    qry =
      'select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid';
    qry =
      qry +
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithEvent,0)=0 and ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cid +
      ' OR sf.dfclientid=' +
      this.cid +
      ")"+ innerQry +
      "  group by  sf.formatname";
      this.loading = true;
      this.sfService.FillCombo(qry).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.loading = false;
          this.FillTokenInfo(this.cid);
          // this.FillGroup();
          this.GetPublishSchedule()
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    
  }
  FillTokenInfo(deviceValue) {
    this.loading = true;
    this.MainTokenList=[]
    this.TokenList=[]
    this.sfService.FillTokenInfo(deviceValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.TokenList.forEach(item => {
          const index: number = this.TokenSelected.indexOf(item["tokenid"]);
          if (index !== -1) {
            item["check"]= true
          }
        });
        this.MainTokenList= this.TokenList
        var objmType = this.cmbCustomerMediaType.split(' ');
        let mtype = '';
        if (objmType.length == 2) {
          mtype = objmType[0].trim();
        } else {
          mtype = this.cmbCustomerMediaType;
        }
        /* this.TokenList = this.TokenList.filter(
          (order) =>
            order.MediaType === mtype
        ); */

        this.loading = false;
        //this.rerender();
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
    var sTime1 = new Date(this.SearchAdsDate);
    this.sfService.FillAdPlaylist(this.cmbSearchCustomer, sTime1.toDateString()).pipe()
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
  
  onSubmitPL  = function (UpdateModel) {
    
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
   // this.Plform.get('startTime').setValue(sTime.toTimeString().slice(0, 5));
    //this.Plform.get('EndTime').setValue(eTime.toTimeString().slice(0, 5));

    var sd = new Date(this.Plform.value.sDate);
    var ed = new Date(this.Plform.value.eDate);

   // this.Plform.get('sDate').setValue(sd.toDateString());
   // this.Plform.get('eDate').setValue(ed.toDateString());
    this.Plform.get('TokenList').setValue(this.TokenSelected);

    this.loading = true;
    this.sfService.SaveAdPlaylist(this.Plform.value).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == "1") {
        this.toastr.info("Saved", 'Success!');
        this.SaveModifyInfo(0,"Playlist is schedule for advertisement");
        this.loading = false;
        this.ForceUpdateTokenid=''
        this.ForceUpdateTokenid= this.TokenSelected
        if (this.ForceUpdateTokenid != '') {
           this.modalService.open(UpdateModel, { centered: true });
        }
       this.clear();
        
      }
      else {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        var cd = new Date(sd);
        var ecd = new Date(ed);
        this.Plform.get('sDate').setValue(cd);
        this.Plform.get('eDate').setValue(ecd);
        this.loading = false;
      }
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
  }
  clear(){
    this.ClearAll()
    var cd = new Date();
    this.cmbSearchCustomer ="0"
    this.cmbSearchToken =0
    this.selectedItems=[];
    this.TokenSelected=[];
    this.TokenList_Search=[]
    this.Plform.get('sDate').setValue(cd);
    this.Plform.get('eDate').setValue(cd);
    this.Plform.get('pMode').setValue("Minutes");
    this.Plform.get('TotalFrequancy').setValue(0);
    this.chkAll_Token=false
    this.PlaylistList=[];
    this.FormatList=[];
    this.dropdownList=[];
    this.Plform.get('CustomerId').setValue(localStorage.getItem('dfClientId'));
    this.Plform.get('FormatId').setValue("0");
    this.Plform.get('PlaylistId').setValue("0");
    this.Plform.get('wList').setValue('');
    this.Plform.get('id').setValue("0");
    

    this.dropdownList = [
      { "id": "2", "itemName": "Monday" },
      { "id": "3", "itemName": "Tuesday" },
      { "id": "4", "itemName": "Wednesday" },
      { "id": "5", "itemName": "Thursday" },
      { "id": "6", "itemName": "Friday" },
      { "id": "7", "itemName": "Saturday" },
      { "id": "1", "itemName": "Sunday" }
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
    if (this.SearchText === ''){
    this.TokenList.forEach(item=>{
      item.check = checked;
      this.TokenSelected.push(item.tokenid)
    });
  }
  else{
    this.TokenList_Search.forEach((item) => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid);
    });
  }
    if (checked==false){
      this.TokenSelected=[];
    }
    console.log(this.TokenSelected)
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
     
    //this.rerender();
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
        //this.rerender();
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
  }
  ngOnDestroy(): void {
  }
  EditClick(id,tokenid){
    this.ClearAll()
    
    this.loading = true;
     this.aService.FillSavePlaylistAds(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.onChangeCustomer(obj.clientId)

        var str=""
        str="select formatid as id, mediatype as displayname from tbSpecialFormat where formatid="+ obj.formatid
        this.sfService.FillCombo(str).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var objF = JSON.parse(returnData);
          this.cmbCustomerMediaType = objF[0].DisplayName
          this.FillFormat()
          this.loading = false;
          this.loading = false;
          obj.wList.forEach(item => {
            var objW= this.dropdownList.filter(x=> x.id==item["id"]);
            item["itemName"]= objW[0].itemName
          });
          this.TokenSelected= obj.TokenLst
          
          this.onChangeFormat(obj.formatid)
          this.selectedItems = obj.wList;
          
          this.loading = false;
          this.Plform.get('wList').setValue(this.selectedItems);
          this.Plform.get('CustomerId').setValue(obj.clientId);
          var sd = new Date(obj.sDate);
          var ed = new Date(obj.eDate);
          this.Plform.get('id').setValue(id);
          this.Plform.get('FormatId').setValue(obj.formatid);
          this.Plform.get('PlaylistId').setValue(obj.splId);
          this.Plform.get('sDate').setValue(sd);
          this.Plform.get('eDate').setValue(ed);
          this.Plform.get('pMode').setValue(obj.pMode);
          this.Plform.get('TotalFrequancy').setValue(obj.TotalFrequancy);
          this.Plform.get('TokenList').setValue(this.TokenSelected);
          this.Plform.get('startTime').setValue(this.dt);
          this.Plform.get('EndTime').setValue(this.dt2);
          this.AddNewTabSelected=true
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })


      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  
  ForceUpdateAll() {
    this.loading = true;
    this.serviceLicense
      .ForceUpdate(this.ForceUpdateTokenid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
            this.SaveModifyInfo(
              0,
              'Pubish request is submitted for ' +
              JSON.stringify(this.ForceUpdateTokenid)
            );
            this.ForceUpdateTokenid = '';
            this.loading = false;
          } else {
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  async PublishSchedule(){
         
          
    if (this.cmbPublishId=="0"){
      this.toastr.info('Please set publish schedule');
      return;
    }
    this.loading = true;
    this.serviceLicense.SavePublishToken(this.cmbPublishId,this.ForceUpdateTokenid).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
            this.SaveModifyInfo(0,'Pubish schedule is submitted for ' +JSON.stringify(this.ForceUpdateTokenid));
            this.loading = false;
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
GetPublishSchedule(){
var qry = "select id as Id,publishHr as DisplayName from tbPublishSchedule where clientid= "+this.cid+" "
this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
    var returnData = JSON.stringify(data);
    let obj = JSON.parse(returnData);
    if (obj.length!=0){
      this.cmbPublishId=obj[0]['Id']
    }
    else{
      this.cmbPublishId="0"
    }
  },
  (error) => {
   
  }
);
}
onChangeEvent_Search(){
  this.TokenList_Search = this.TokenList.filter(country => this.serviceLicense.matches(country, this.SearchText, this.pipe));
  const total = this.TokenList_Search.length;
  this.chkAll_Token=false
  //this.GetCheckedToken();
}
GetCheckedToken(){
  this.TokenList.forEach(item => {
    let obj = this.TokenSelected.indexOf(item["tokenid"])
    if (obj != -1){
      item["check"]=true
    }
    else{
      item["check"]=false
    }
  });
 
}

GetCustomerMediaType(cid) {
  this.SearchText=''
  this.TokenSelected=[]
  this.TokenList=[]
  this.FormatList=[]
  this.PlaylistList=[]
  
  this.loading = true;
  var str = '';
  str = 'GetCustomerMediaType ' + cid;

  this.serviceLicense
    .FillCombo(str)
    .pipe()
    .subscribe(
      (data) => {
        var returnData = JSON.stringify(data);
        //this.CustomerMediaTypeList = JSON.parse(returnData);
        this.CustomerMediaTypeList=[
          {
              "DisplayName": "Audio",
              "Id": "Audio",
              "check": false
          },
          {
              "DisplayName": "Signage",
              "Id": "Signage",
              "check": false
          },
          {
              "DisplayName": "Music Clips",
              "Id": "Video",
              "check": false
          }
      ]
        var mType= localStorage.getItem('mType')
        if(mType!=null){
          this.cmbCustomerMediaType=mType
          this.onChangeCustomerMediaType(mType)
        }
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

onChangeCustomerMediaType(id) {
   this.FillFormat()
   var cd = new Date();
   this.Plform.patchValue({
    FormatId: "0",
    PlaylistId: "0",
    sDate: cd,
    eDate: cd,
    startTime: this.dt,
    EndTime: this.dt2,
    pMode: "Minutes",
    TotalFrequancy: 0,
    wList: this.selectedItems,
    TokenList: this.TokenSelected
  });
}
ClearAll (){
  this.dropdownSettings = {};
  this.dropdownList = [];
  this.selectedItems = [];
  this.submitted = false;
  this.loading = false;
  this.TokenSelected = [];
  this.TokenList = this.MainTokenList
  this.TokenList_Search = [];
  this.PlaylistList = [];
  this.SearchTokenList = [];
  this.FormatList = [];
  this.page  = 1;
  this.pageSize  = 50;
  this.pageSearch  = 1;
  this.pageSizeSearch  = 20;
  this.cmbSearchPlaylist = 0;
  this.pSchid = 0;
  this.searchText="";
  this.aid;
  this.delTokenId;
  this.SearchAdsDate
  this.cmbPublishId=""
  
  this.SearchText = '';
  this.cmbCustomerMediaType=""
  this.CustomerMediaTypeList=[]
  this.chkAll_Token= false

  var cd = new Date();
    var cd = new Date();
    this.SearchAdsDate = cd;
     this.insForm()

    
    this.dropdownList = [ 
      { "id": "2", "itemName": "Monday" },
      { "id": "3", "itemName": "Tuesday" },
      { "id": "4", "itemName": "Wednesday" },
      { "id": "5", "itemName": "Thursday" },
      { "id": "6", "itemName": "Friday" },
      { "id": "7", "itemName": "Saturday" },
      { "id": "1", "itemName": "Sunday" }
    ];
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
}
public getField = (args: any) => {
  return `${args.city}_${args.location}_${args.MediaType}_${args.gName}_${args.tokenCode}`;
}
public onFilter(inputValue: string): void {
  this.TokenList = process(this.MainTokenList, {
      filter: {
          logic: 'or',
          filters: [
              {
                  field: this.getField,
                  operator: 'contains',
                  value: inputValue
              }
          ]
      }
  }).data;

  this.dataBinding? this.dataBinding.skip = 0 : null;
}
PlaylistAdsonTabSelect(e: SelectEvent){
  if (e.index==0){
    this.AddNewTabSelected=false
  }

}
}