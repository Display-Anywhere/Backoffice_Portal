import {  Component,  OnInit,  ViewContainerRef,  Input,  Output,  OnDestroy,  AfterViewInit,  ElementRef,  ViewChild,  QueryList,  ViewChildren,PipeTransform} from '@angular/core';
import {  NgbModalConfig,  NgbModal,  NgbNavChangeEvent,  NgbTimepickerConfig,  NgbTimeStruct,  NgbNavModule,} from '@ng-bootstrap/ng-bootstrap';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable, Subscription } from 'rxjs';
import { ExcelServiceService } from '../license-holder/excel-service.service';
import { ConfigAPI } from '../class/ConfigAPI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceOwn } from '../auth/auth.service';
import { DataTableDirective } from 'angular-datatables';

import { TokenInfoServiceService } from '../components/token-info/token-info-service.service';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
import { NgbdSortableHeaderOpening, SortEvent } from './opensortable.directive';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-license-holder',
  templateUrl: './license-holder.component.html',
  styleUrls: ['./license-holder.component.css'],
  providers: [NgbModalConfig, NgbModal,DecimalPipe],
})
export class LicenseHolderComponent
  implements AfterViewInit, OnInit, OnDestroy {
    @ViewChildren(NgbdSortableHeaderOpening) headers: QueryList<NgbdSortableHeaderOpening>;
    compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  Adform: FormGroup;
  frmEvent: FormGroup;
  TokenList = [];
  CustomerList: any[];
  FolderList: any[];
  dtpEventDate1 = new Date()
  dtpUploadSheetEventDate= new Date()
  public loading = false;
  TokenInfoPopup: boolean = false;
  page: number = 1;
  pageSize: number = 20;
  DeviceStatusList =[]
  searchText="";
  cid = '0';
  LogoId = 0;
  SongsList = [];
  PromoLogoList = [];
  DelLogoId = 0;
  uExcel: boolean = false;
  IsForceUpdateRunning: boolean = false;
  IsForceUpdateAll: boolean = false;
  ForceUpdateBar: number = 0;
  IsIndicatorShow: boolean = false;
  interval;
  cmbFolder = '0';
  TokenSelected = [];
  chkAll: boolean = false;
  ActiveTokenList = [];
  MainActiveTokenList=[]
  ActiveTokenListlength=0;
  PublishSearchList=[]
  MainTokenList = [];
  InfoTokenList = [];
  active = 3;
  isSanitizerActive=false
  h_info_Active=false
  Indicator_Active=false
  E_Link_Active=false
  Meeting_Active=false
  txtDelPer;
  cmbPlaylist = '0';
  tokenid;
  TokenPlaylistList = [];
  dropdownSettings = {};
  ModifyGroupName=""
  cmbRoomGroup="0"
  cmbRoomGroup_search="0"
  Group_List=[]
  futureSchList=[]
  FutureSchFind="No"
  GroupVenueList=[]
  GroupAllVenueList=[]
  cmbRoomSchedule="0"
  GroupVenueSelected = [];
  dropdownList = [];
  selectedItems = [];
  searchTextPublish="";
  CountryList = [];
  StateList = [];
  CityList = [];
  cmbCustomerId = '0';
  DefaultRoomsPaxOccupancy =[]
  FilterValue_For_Reload = 'Regsiter';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  IschkViewOnly=0;
  SubClientId=""
  cmbPublishHour="5"
  cmbPublishId=""
  PublishActive=1
  CustomerMediaTypeList
  TokenContentMatchDownload =[]
  EventList = []
  MeetingRoomList =[]
  cmbMeetingId ='0'
  cmbRoomStatus =''
  MeetingRoomDetail ={}
  DefaultRoomsDetail={}
  cmbEventCustomer ="0"
  EventCustomerList=[]
  eventListjson= []
  selected_logoName
  dtpLogoEventDate= new Date()
  EventCustomerdata = {
    logoimgurl: "",
    selected_logoName: "",
    titleid: "0"
  }
  CustomerEventList =[]
  UploadLogoCustomerEventList=[]
  MeetingSettings = {};
  GroupSettings = {};
  SelectedMeetingArray = []
  Group_Active=1
  RoomSignagePlaylist=[]
  RoomSignagePlaylist_Main=[]
 // templateHost ='http://localhost:4202'
  templateHost ='https://templates.nusign.eu'
dtPromoStartDate = new Date()
dtPromoEndDate = new Date()
dtTokenExpiryDate = new Date()
loginpage= localStorage.getItem('loginpage')
ActivePlayerListlength=0;
  PlayerSearchList=[]
  pagePlayer: number = 1;
  pageSizePlayer: number = 50;
  ShowIndicator= false
  dtpEventSearchDate
  SavedEventList=[]
  RoomActivityList=[]
  rType_Playlist="Room"
  Schedule_Active=1
  @ViewChild('flocation') flocationElement: ElementRef;
  constructor(
    config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private cf: ConfigAPI,
    private serviceLicense: SerLicenseHolderService,
    private excelService: ExcelServiceService,
    public toastr: ToastrService,
    public auth:AuthServiceOwn,
    private tService: TokenInfoServiceService,
    private pService: PlaylistLibService,private pipe: DecimalPipe,
    vcr: ViewContainerRef,
    configTime: NgbTimepickerConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    configTime.seconds = false;
    configTime.spinners = false;
    this.auth.isTokenInfoClose$.subscribe((value) => {
      if (value === true) {
        this.FillCustomerTokenList(this.cmbCustomerId);
      }
    });
  }
  public onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 9) {
      changeEvent.preventDefault();
    }
  }
  async ngOnInit() {

    if (localStorage.getItem('IsSubClientActive')==='Yes'){
      this.SubClientId = localStorage.getItem('dfClientId')
      localStorage.setItem('dfClientId',localStorage.getItem('Main_Client_Id'))
    }


    this.auth.isTokenInfoClose$.next(false);
    this.Adform = this.formBuilder.group({
      FilePathNew: [''],
    });
    this.inEventfrm()


    this.LogoId = 0;
    this.TokenList = [];
    await this.FillClientList();
    this.selectedItems = [];
    this.dropdownList = [
      { id: '1', itemName: 'Mon' },
      { id: '2', itemName: 'Tue' },
      { id: '3', itemName: 'Wed' },
      { id: '4', itemName: 'Thu' },
      { id: '5', itemName: 'Fri' },
      { id: '6', itemName: 'Sat' },
      { id: '7', itemName: 'Sun' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Week',
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Week',
      unSelectAllText: 'Week',
      itemsShowLimit: 3,
    };
    this.DataTableSettings();

    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  }
  DataTableSettings() {
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'rtp',
      order: [[1, 'asc']],
      columnDefs: [
        {
          caseInsensitive: false,
        },
        {
          targets: [9, 10, 11, 12,13,14], // column index (start from 0)
          orderable: false,
        },
        {
          targets: [0,15, 16, 17],
          visible: false,
        },
        {
          width: '60px',
          targets: 0,
        },
        {
          width: '100px',
          targets: 1,
        },
        {
          width: '150px',
          targets: 2,
        },
        {
          width: '90px',
          targets: 3,
        },
        {
          width: '160px',
          targets: 4,
        },
        {
          width: '210px',
          targets: 5,
        },
        {
          width: '90px',
          targets: 6,
        },
        {
          width: '90px',
          targets: 8,
        },
        {
          width: '50px',
          targets: 9,
        },
        {
          width: '20px',
          targets: 10,
        },
        {
          width: '20px',
          targets: 11,
        },
        {
          width: '20px',
          targets: 12,
        },
        {
          width: '20px',
          targets: 13,
        },
        {
          width: '20px',
          targets: 14,
        },
      ],
      retrieve: true,
    };
  }
inEventfrm(){
  const cd= new Date()
  this.frmEvent = this.formBuilder.group({
    id:['0'],
    dname: [''],
    edate: [cd],
    stime: [''],
    etime: [''],
    mid:['0'],
    activity:[''],
    dfclientid:[this.cmbCustomerId]
  });
}
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  filterById(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.searchText, false).draw();
    });
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

  FillClientList() {
    this.loading = true;
    var str = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.serviceLicense
      .FillCustomerWithKey(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          if (this.auth.IsAdminLogin$.value == false) {
            if (localStorage.getItem('IsSubClientActive')==='Yes'){
              this.cmbCustomerId = this.SubClientId
            }
            else{
              this.cmbCustomerId = localStorage.getItem('dfClientId');
            }
            this.onChangeCustomer(this.cmbCustomerId);
          }
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
  Token_Id_App = '0';
  open(content, tid) {
    this.Token_Id_App = tid;
    localStorage.setItem('tokenid', tid);
    this.modalService.open(content, { size: 'lg', windowClass: 'tokenmodal' });
  }
 async onChangeCustomer(deviceValue) {
    this.SongsList = [];
    this.searchText="";
    localStorage.removeItem('IsSubClientActive')
    if (deviceValue == '0') {
      this.TokenList = [];
      this.LogoId = 0;
      this.cid = '0';
      this.MainTokenList = [];
      this.ActivePlayerListlength=0
      this.ShowIndicator= false
      return;
    }
    const obj= this.CustomerList.filter(o => o.Id == this.cmbCustomerId)
    this.isSanitizerActive= obj[0].isSanitizerActive
    this.h_info_Active= obj[0].h_info_Active
    this.Indicator_Active= obj[0].Indicator_Active
    this.E_Link_Active= obj[0].E_Link_Active  
    this.Meeting_Active= obj[0].Meeting_Active  
    await this.FillDeviceLastStatus(deviceValue)
  }
  
  FillCustomerTokenList(deviceValue){
    //this.DataTableSettings();
    // this.rerender();

    this.loading = true;
    if (this.cid != deviceValue) {
      this.FilterValue_For_Reload = 'Regsiter';
    }
    this.cid = deviceValue;
    

    this.serviceLicense
      .FillTokenInfo(deviceValue, '0')
      .pipe()
      .subscribe(
        (data) => {
          this.FillData(data);
          
          
          //this.rerender();
          if (this.searchText!=""){
           // setTimeout(() => {this.filterById();}, 1000);
          }
          /*
          setTimeout(() => {
            this.FilterTokenList(this.FilterValue_For_Reload)
           }, 1000);
           */
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
  FillTokenContentMatchDownload(deviceValue){
    this.loading = true;
    this.serviceLicense.GetTokenContentMatchDownload(deviceValue).pipe().subscribe((data) => {
      if (data['response']=="1"){
        var obj = JSON.parse(data['data']);
        this.TokenContentMatchDownload = obj
      }
      else{
        this.TokenContentMatchDownload= []
      }
      this.loading = false;
      
      this.FillCustomerTokenList(deviceValue);
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  FillDeviceLastStatus(deviceValue) {
    this.loading = true;
    var qry = "select TokenId as Id, max(StatusDatetime) as DisplayName from tbTokenOverDueStatus where tokenid in(select tokenid from AMPlayerTokens where ClientID="+this.cmbCustomerId+") group by TokenId"
    this.pService.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.DeviceStatusList = JSON.parse(returnData);
          this.FillTokenContentMatchDownload(deviceValue)
        },
        (error) => {
        }
      );
  }
  minutes_interval:any
  CET_today:any
  deviceStatus:any
  FillData(data) {
    var returnData = JSON.stringify(data);
    const objData = JSON.parse(returnData);
    this.ShowIndicator = false
    objData.forEach(item => {
      const obj =  this.TokenContentMatchDownload.filter(o => o.tokenid === Number(item['tokenid']))
      if (item['Version'] === '2.0'){
        item['IsDownloadAll']= 'true'  
      }
      else if (obj.length==0){
        item['IsDownloadAll']= 'false'  
      }
      else if (obj[0].pContent < 0){
        item['IsDownloadAll']= 'false'
      }
      else if (obj[0].pContent == 0){
        item['IsDownloadAll']= 'true'
      }
      else{
        item['IsDownloadAll']= 'false'
      }
      if (item['IsIndicatorActive']=='1'){
        this.ShowIndicator = true
      }

      let obj_device= this.DeviceStatusList.filter(d => d.Id === item['tokenid'].toString())
      if (obj_device.length>0){
        
        let today = new Date();
        this.deviceStatus =new Date(obj_device[0]['DisplayName'])
        
        let CETDateTime = today.toLocaleString("en-US", {timeZone: "CET"  });
        const cet = CETDateTime.split(',')
        const CET_DateTime = cet[0] + ' ' + cet[1]
        this.CET_today = new Date(CET_DateTime);
         
        //this.minutes_interval = Math.abs(deviceStatus.getTime() - CET_today.getTime()) / (1000 * 60) % 60;
        var diffMs = (this.CET_today - this.deviceStatus); // milliseconds between now & Christmas
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        if ((diffDays==0 ) && (diffHrs==0) && (diffMins <15)){
          item['IshotelTvOnline']='1'
        }
        else{
          item['IshotelTvOnline']='0'
        }
      }
      else{
        item['IshotelTvOnline']='0'
      }
    });
 
    objData.sort((a, b) => (a.city > b.city) ? 1 : -1)

    //this.TokenList = objData;
    this.MainTokenList = objData;
    this.InfoTokenList = objData;
    if (this.MainTokenList.length != 0) {
      this.LogoId = this.MainTokenList[0].AppLogoId;
      if (this.MainTokenList[0].IsIndicatorActive == '1') {
        this.IsIndicatorShow = true;
      } else {
        this.IsIndicatorShow = true;
      }
    }
    this.loading = false;
    
    if (this.FilterValue_For_Reload == 'All') {
      this.TokenList = this.MainTokenList
    }
    if (this.FilterValue_For_Reload == 'Regsiter') {
      this.TokenList = this.MainTokenList.filter((order) => order.token === 'used');
    }
    if (this.FilterValue_For_Reload == 'Audio') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.MediaType === 'Audio'
      );
    }
    if (this.FilterValue_For_Reload == 'Video') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.MediaType === 'Video'
      );
    }
    if (this.FilterValue_For_Reload == 'Signage') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.MediaType === 'Signage' && order.DeviceType != 'HotelTv'
      );
    }
    if (this.FilterValue_For_Reload == 'HotelTv') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.DeviceType === 'HotelTv'
      );
    }
    if (this.FilterValue_For_Reload == 'WhiteBoard') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.DeviceType === 'WhiteBoard'
      );
    }
    if (this.FilterValue_For_Reload == 'UnRegsiter') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.TokenStatus === 'UnRegsiter'
      );
    }
    if (this.FilterValue_For_Reload == 'Sanitizer') {
      this.TokenList = this.MainTokenList.filter(
        (order) => order.DeviceType === 'Sanitizer'
      );
    }
    this.ActivePlayerListlength= this.TokenList.length
  }
  sortByLastModifiedDesc() {
    return this.TokenList.sort((a: any, b: any) => {
      return <any>(b.city) - <any>(a.city);
    });
  }
  async tokenInfoClose() {
    this.RefreshTokenList()
    this.modalService.dismissAll();
    
  }
async RefreshTokenList(){
  this.SongsList = [];
    localStorage.removeItem('IsSubClientActive')
    if (this.cid == '0') {
      this.TokenList = [];
      this.LogoId = 0;
      this.cid = '0';
      this.MainTokenList = [];
      return;
    }
    await this.FillTokenContentMatchDownload(this.cid)
  // await this.FillCustomerTokenList(this.cid);
}
  FullImageUrl;
  OpenFullImageModal(ObjModal, url) {
    this.FullImageUrl = url;
    this.modalService.open(ObjModal, { size: 'lg' });
  }

  SetLogo(LogoId) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.loading = true;
    this.serviceLicense
      .UpdateAppLogo(this.cid, LogoId)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Logo is set', 'Success!');
            this.loading = false;
            this.LogoId = LogoId;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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

  SetIndicator(Indicator) {
    this.IsIndicatorShow = Indicator;

    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.serviceLicense
      .SetOnlineIndicator(this.cid, Indicator)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            if (Indicator == true) {
              this.toastr.info(
                'Online Indicator is set for all locations',
                'Success!'
              );
            }
            if (Indicator == false) {
              this.toastr.info(
                'Online Indicator is disable for all locations',
                'Success!'
              );
            }
            this.loading = false;
            this.onChangeCustomer(this.cid);
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
      this.flocationElement.nativeElement.focus();
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.ForceUpdateBar >= 0 && this.ForceUpdateBar <= 99) {
        this.ForceUpdateBar++;
      } else {
        this.ForceUpdateBar = 100;
        this.IsForceUpdateRunning = false;
        this.IsForceUpdateAll = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }
  enableEditIndex = null;
  ForceUpdate(tokenid, i) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }

    this.loading = true;
    this.TokenSelected = [];
    this.TokenSelected.push(tokenid);
    this.serviceLicense
      .ForceUpdate(this.TokenSelected)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            if (i == '-1') {
              this.enableEditIndex = null;
              this.IsForceUpdateRunning = false;
              this.IsForceUpdateAll = true;
            } else {
              this.IsForceUpdateAll = false;
              this.enableEditIndex = i;
              this.IsForceUpdateRunning = true;
            }
            this.ForceUpdateBar = 0;
            this.startTimer();
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
  DeleteLogoModal(mContent, id) {
    this.DelLogoId = id;
    this.modalService.open(mContent);
  }
  DeleteLogo() {
    this.loading = true;
    this.serviceLicense
      .DeleteLogo(this.DelLogoId)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.SetUnsetPromoLogo(this.DelLogoId,"1")
            this.DelLogoId = 0;
            this.FillLogo(this.cmbFolder);
            this.FillPromoLogo("777");
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
  ExportExcel() {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.uExcel = false;
    var ExportList = [];
    var ExportItem = {};
    for (var j = 0; j < this.MainTokenList.length; j++) {
      ExportItem = {};
      if (this.MainTokenList[j].token != 'used') {
        ExportItem['TokenId'] = this.MainTokenList[j].tokenid;
        ExportItem['TokenCode'] = this.MainTokenList[j].tokenCode;
        ExportItem['MAC'] = '';
        ExportItem['Location'] = '';
        ExportItem['IsAudioPlayer'] = '';
        ExportItem['IsCopyright'] = '';
        ExportItem['IsDirectLicence'] = '';
        ExportItem['IsSignagePlayer'] = '';
        ExportItem['IsVideoPlayer'] = '';
        ExportItem['IsSanitizerPlayer'] = '';
        ExportItem['IsH-Info'] = '';
        ExportList.push(ExportItem);
      }
    }
    this.excelService.exportAsExcelFile(ExportList, 'BulkActivation');
    this.flocationElement.nativeElement.focus();
  }
  BulkActivation(modalContant) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.uExcel = false;
    this.modalService.open(modalContant, {
      centered: true,
      windowClass: 'fade',
    });
    this.flocationElement.nativeElement.focus();  
  }
  InputFileName: string = 'No file chosen...';
  fileUpload = { status: '', message: '', filePath: '' };
  error: string;
  InputAccept: string = '*.xlsx';
  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Adform.get('FilePathNew').setValue(file);
      this.InputFileName = file.name.replace('C:\\fakepath\\', '');
    } else {
      this.InputFileName = 'No file chosen...';
    }
  }
  Clear() {}
  Upload() {
    if (this.Adform.get('FilePathNew').value.length == 0) {
      this.toastr.info('Please select a file');
      return;
    }
    var eventDate = new Date()
    const formData = new FormData();
    formData.append('name', 'Excel');
    formData.append('profile', this.Adform.get('FilePathNew').value);

    this.serviceLicense.upload(formData).subscribe(
      (res) => {
        this.fileUpload = res;
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info(obj.message, '');
          this.modalService.dismissAll();
          this.tokenInfoClose();
          this.loading = false;
        }
        if (obj.Responce == '0') {
          this.toastr.error(obj.message);
          this.InputFileName = 'No file chosen...';
          this.loading = false;
        }
        this.Adform.get('FilePathNew').setValue('');
      },
      (err) => {
        this.toastr.error('p');
        this.error = err;
        this.loading = false;
      }
    );
    this.flocationElement.nativeElement.focus();
  }
  UploadExcel() {
    this.uExcel = true;
    this.flocationElement.nativeElement.focus();
  }
  Cancel() {
    this.uExcel = false;
  }

  FillLogo(fid) {
    this.loading = true;
    this.serviceLicense
      .FillSignageLogo(this.cid, fid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          obj.forEach(item => {
            item['TitleIdLink']= item['TitleIdLink'].replace('http:','https:')
          });
          this.SongsList = obj;
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
  SetSignage(ObjModal) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.FolderList = [];
    this.cmbFolder = '0';
    this.FillFolder();
    this.modalService.open(ObjModal, { size: 'lg' });
    this.flocationElement.nativeElement.focus();
  }

  onChangeFolder(fid) {
    if (fid == 0) {
      this.SongsList = [];
      return;
    }
    this.FillLogo(fid);
  }
  FillFolder() {
    this.loading = true;
    var str = '';
    str = '';
    str =
      'select distinct  f.folderId as id ,f.folderName as displayname FROM tbFolder f ';
    str = str + ' inner join Titles t on t.folderId= f.folderId ';
    str = str + ' where t.GenreId= 326 and t.folderId is not null ';

    str = str + ' and f.dfclientId=' + this.cid + ' ';

    this.serviceLicense
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.FolderList = JSON.parse(returnData);
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

  allActiveToken(event) {
    const checked = event.target.checked;
    this.TokenSelected = [];
    if (this.searchTextPublish==''){
    this.ActiveTokenList.forEach((item) => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid);
    });
  }
  else{
    this.PublishSearchList.forEach((item) => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid);
    });
  }
    if (checked == false) {
      this.TokenSelected = [];
    }
  }

  SelectActiveToken(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected.push(fileid);
    } else {
      const index: number = this.TokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected.splice(index, 1);
      }
    }
  }
  GetCheckedToken(){
    this.ActiveTokenList.forEach(item => {
      let obj = this.TokenSelected.indexOf(item["tokenid"])
      if (obj != -1){
        item["check"]=true
      }
    });
   
  }
  ForceUpdateModal(modalContant) {
    this.TokenSelected=[];
    this.PublishSearchList=[]
    this.searchTextPublish=''

    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }

    this.loading = true;

    var qry = "select id as Id,publishHr as DisplayName from tbPublishSchedule where clientid= "+this.cmbCustomerId+" "
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          console.log(obj)
          if (obj.length!=0){
            this.cmbPublishHour= obj[0]['DisplayName']
            this.cmbPublishId=obj[0]['Id']
          }
          else{
            this.cmbPublishHour="5"
            this.cmbPublishId="0"
          }
        },
        (error) => {
         
        }
      );





    this.serviceLicense
      .FillTokenInfo(this.cid, '1')
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.ActiveTokenList = JSON.parse(returnData);
          this.MainActiveTokenList = this.ActiveTokenList
          this.ActiveTokenListlength= this.ActiveTokenList.length;
          this.loading = false;
          const obj:SortEvent   ={
            column:'city',
            direction: 'asc'
           }
           setTimeout(() => { 
            this.onSort(obj,'Active');
          }, 500);
          if (this.ActiveTokenList.length != 0) {
            this.modalService.open(modalContant, { size: 'lg' });
          } else {
            this.toastr.info('Register tokens are not found');
          }
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
      this.flocationElement.nativeElement.focus();
  }
  ForceUpdateAll(type) {
    if (this.TokenSelected.length == 0) {
      this.toastr.info('Please select a token');
      return;
    }
    if (type=="Now"){
      this.PublishNow()
    }
    if (type=="Schedule"){
      if (this.cmbPublishId=="0"){
        this.toastr.info('Please set publish schedule');
        return;
      }
      this.PublishSchedule()
    }
  }
  PublishNow(){
    this.loading = true;
    this.serviceLicense.ForceUpdate(this.TokenSelected).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
            this.loading = false;
            this.chkAll = false;
            this.SaveModifyInfo(
              0,
              'Publish request is submit for '+JSON.stringify(this.TokenSelected)+' '
            );
            this.TokenSelected = [];
            this.PublishSearchList=[]
            this.searchTextPublish=''
            this.modalService.dismissAll();
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

  PublishSchedule(){
    this.loading = true;
    this.serviceLicense.SavePublishToken(this.cmbPublishId,this.TokenSelected).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
            this.loading = false;
            this.chkAll = false;
            this.SaveModifyInfo(
              0,
              'Publish schedule is submit for '+JSON.stringify(this.TokenSelected)+' '
            );
            this.TokenSelected = [];
            this.PublishSearchList=[]
            this.searchTextPublish=''
            this.modalService.dismissAll();
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
  GetSortOrder(prop, asc) {
    return function (a, b) {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
      return 0;
    };
  }
  FilterTokenList(FilterValue) {
    //this.TokenList=[];
    this.searchText = '';
    this.FilterValue_For_Reload = FilterValue;
    this.onChangeCustomer(this.cid);
    /*
    if (FilterValue == 'All') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('').draw();
      });
    }
    if (FilterValue == 'Regsiter') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('used').draw();
      });

    }
    if (FilterValue == 'Audio') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('Audio').draw();
      });

    }
    if (FilterValue == 'Video') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('Video').draw();
      });
    }
    if (FilterValue == 'Signage') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('Signage').draw();
      });
    }
    if (FilterValue == 'UnRegsiter') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('UnRegsiter').draw();
      });
    }
    if (FilterValue == 'Sanitizer') {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search('Sanitizer').draw();
      });
    }
  */
  }
  OpenGroupsModal(gModal) {
    if (this.cid === '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    localStorage.setItem('tcid', this.cid);
    this.FilterValue_For_Reload = 'Regsiter';

    this.modalService.open(gModal, { size: 'lg' });
  }

  onDeletePercentageClick(mContent) {
    this.modalService.open(mContent);
  }
  DeleteTitlePercentage() {
    this.loading = true;
    this.pService
      .DeleteTitlePercentage(this.cmbPlaylist, this.txtDelPer)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.FillTokenPlaylists();
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
  onChangePlaylist(e) {}

  onDeletePlaylistSongModal(Modal, tokenid) {
    this.tokenid = tokenid;
    this.txtDelPer = 0;
    this.FillTokenPlaylists();
    this.modalService.open(Modal);
  }

  FillTokenPlaylists() {
    this.loading = true;
    const qry = 'GetTokenPlaylist ' + this.tokenid;
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.TokenPlaylistList = JSON.parse(returnData);
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

  OpenUpdateInfo(InfoModal) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.FilterValue_For_Reload = 'Regsiter';
    this.uExcel = false;
    this.modalService.open(InfoModal, {
      centered: true,
      windowClass: 'fade',
    });
  }

  UpdateInfo() {
    let Info = {};
    const BodyData = [];
    this.InfoTokenList.forEach((item) => {
      Info = {};
      Info['tokenid'] = item.tokenid;
      Info['CountryId'] = item.CountryId;
      Info['State'] = item.State;
      Info['city'] = item.city;
      Info['location'] = item.location;
      Info['Street'] = item.Street;
      Info['LicenceType'] = item.LicenceType;
      Info['MediaType'] = item.MediaType;
      Info['playerType'] = item.playerType;
      BodyData.push(Info);
    });
    this.loading = true;
    this.serviceLicense
      .UpdateTokenInfo(BodyData)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.onChangeCustomer(this.cid);
            this.modalService.dismissAll();
          } else {
            this.loading = false;
          }
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
  ExportExcelInfo() {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.uExcel = false;
    var ExportList = [];
    var ExportItem = {};
    for (var j = 0; j < this.MainTokenList.length; j++) {
      ExportItem = {};

      ExportItem['TokenId'] = this.MainTokenList[j].tokenid;
      ExportItem['TokenCode'] = this.MainTokenList[j].TokenNoBkp;
      ExportItem['Country'] = this.MainTokenList[j].CountryFullName;
      ExportItem['State'] = this.MainTokenList[j].State;
      ExportItem['City'] = this.MainTokenList[j].city;
      ExportItem['Street'] = this.MainTokenList[j].Street;
      ExportItem['Location'] = this.MainTokenList[j].location;

      if (this.MainTokenList[j].playerType === 'Windows') {
        ExportItem['IsWindowsPlayer'] = '1';
      } else {
        ExportItem['IsWindowsPlayer'] = '0';
      }
      if (this.MainTokenList[j].playerType === 'Android') {
        ExportItem['IsAndroidPlayer'] = '1';
      } else {
        ExportItem['IsAndroidPlayer'] = '0';
      }

      if (this.MainTokenList[j].MediaType === 'Audio') {
        ExportItem['IsAudioPlayer'] = '1';
      } else {
        ExportItem['IsAudioPlayer'] = '0';
      }

      if (this.MainTokenList[j].MediaType === 'Video') {
        ExportItem['IsVideoPlayer'] = '1';
      } else {
        ExportItem['IsVideoPlayer'] = '0';
      }

      if (this.MainTokenList[j].MediaType === 'Signage') {
        ExportItem['IsSignagePlayer'] = '1';
      } else {
        ExportItem['IsSignagePlayer'] = '0';
      }

      if (this.MainTokenList[j].LicenceType === 'Copyright') {
        ExportItem['IsCopyright'] = '1';
      } else {
        ExportItem['IsCopyright'] = '0';
      }
      if (this.MainTokenList[j].LicenceType === 'DirectLicence') {
        ExportItem['IsDirectLicence'] = '1';
      } else {
        ExportItem['IsDirectLicence'] = '0';
      }

      if (this.MainTokenList[j].DeviceType === 'Screen') {
        ExportItem['IsScreen'] = '1';
      } else {
        ExportItem['IsScreen'] = '0';
      }

      if (
        this.MainTokenList[j].MediaType === 'Signage' &&
        this.MainTokenList[j].DeviceType === 'Sanitizer'
      ) {
        ExportItem['IsSanitizer'] = '1';
      } else {
        ExportItem['IsSanitizer'] = '0';
      }

      ExportItem['DispenserAlertEmail'] = this.MainTokenList[j].AlertEmail;

      ExportList.push(ExportItem);
    }
    this.excelService.exportAsExcelFile(ExportList, 'BulkPlayerInfo');
    this.flocationElement.nativeElement.focus();
  }

  UploadExcelInfo() {
    this.uExcel = true;
    this.flocationElement.nativeElement.focus();
  }
  CancelInfo() {
    this.uExcel = false;
  }
  onSelectedFileInfo(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Adform.get('FilePathNew').setValue(file);
      this.InputFileName = file.name.replace('C:\\fakepath\\', '');
    } else {
      this.InputFileName = 'No file chosen...';
    }
  }
  UploadInfo() {
    if (this.Adform.get('FilePathNew').value.length == 0) {
      this.toastr.info('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('name', 'Excel');
    formData.append('profile', this.Adform.get('FilePathNew').value);

    this.serviceLicense.UpdateTokenInfo(formData).subscribe(
      (res) => {
        this.fileUpload = res;
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info(obj.message, '');
          this.modalService.dismissAll();
          this.loading = false;
          this.tokenInfoClose();
        }
        if (obj.Responce == '0') {
          this.toastr.error(obj.message);
          this.InputFileName = 'No file chosen...';
          this.loading = false;
        }
        this.Adform.get('FilePathNew').setValue('');
      },
      (err) => {
        this.error = err;
        this.loading = false;
      }
    );
  }
  OpenOpeningHoursModal(gModal) {
    if (this.cid === '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    localStorage.setItem('tcid', this.cid);
    this.FilterValue_For_Reload = 'Regsiter';
    this.modalService.open(gModal, { size: 'lgx' });
  }
  onSort({column, direction}: SortEvent,type) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
        
      }
    });

    // sorting countries
    console.log(direction + " " + column + " " + type)
    if (type=="Active"){
    if (direction === '' || column === '') {
      this.ActiveTokenList = this.MainActiveTokenList;
    } else {
      this.ActiveTokenList = [...this.MainActiveTokenList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  else{
    if (direction === '' || column === '') {
      this.TokenList = this.TokenList;
    } else {
      this.TokenList = [...this.TokenList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  }
  onChangeEvent(){
    this.PublishSearchList = this.ActiveTokenList.filter(country => this.serviceLicense.matches(country, this.searchTextPublish, this.pipe));
    const total = this.PublishSearchList.length;
    this.ActiveTokenListlength =total
  }
  SetDefaultClient(modalMediaTypeDefault){
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.GetCustomerMediaType(this.cid,modalMediaTypeDefault)
    this.flocationElement.nativeElement.focus();  
  }
  GetCustomerMediaType(cid,modalMediaTypeDefault) {
    this.loading = true;
    var str = '';
    str = 'GetCustomerMediaType ' + cid;

    this.pService
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerMediaTypeList = JSON.parse(returnData);
          console.log(this.CustomerMediaTypeList)
          if (this.CustomerMediaTypeList.length >1){
            this.modalService.open(modalMediaTypeDefault)
          }
          localStorage.setItem('Main_Client_Id',localStorage.getItem('dfClientId'))
          localStorage.setItem('dfClientId',this.cid)
          localStorage.setItem('IsSubClientActive','Yes')
          let mType= this.CustomerMediaTypeList[0].Id
          localStorage.setItem('mType',mType)
          this.toastr.info('Default customer and default media type is set');
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
  SetMediaTypeDefault(mType){
    localStorage.setItem('mType',mType)
    this.toastr.info('Default media type is set');
    this.modalService.dismissAll()
  }
  SavePublishSchedule(){
    this.loading = true;
    this.serviceLicense.SavePublishSchedule(this.cid, this.cmbPublishHour).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Save', '');
            this.loading = false;
            this.chkAll = false;
            this.TokenSelected = [];
            this.PublishSearchList=[]
            this.searchTextPublish=''
            this.modalService.dismissAll();
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
  SaveModifyInfo(tokenid, ModifyText) {
    this.pService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }
  openphinfo(philipsinfoModal){
    this.modalService.open(philipsinfoModal, { size: 'lg' });

  }
  GetFutureEventDetails () {
    this.EventList =[]
    this.loading = true;
    var EventDate = new Date()
    this.serviceLicense.GetFutureDateEventDetails(EventDate.toDateString(), this.cmbCustomerId).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var obj  = JSON.parse(returnData);
      if (obj.response=="1"){
          var jsonParse = JSON.parse(obj.data)
          jsonParse.forEach(item => {
            var ar ={}
            ar['Id'] = item['edate']
            this.EventList.push(ar)
          });
        }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  async openEventModal(modalContant) {
    if (this.cid == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.inEventfrm()
    this.CustomerEventList = []
    this.MeetingRoomDetail ={}
    var EventDate = new Date()
    this.dtPromoStartDate= new Date()
    this.dtPromoEndDate= new Date()
    this.dtpUploadSheetEventDate= EventDate
    this.dtpLogoEventDate = EventDate
    await this.FillRoomActivity()
    await this.GetMeetingRooms()
    await this.FillAllGroupVenue()
    await this.GetFutureEventDetails()
    await this.GetCurrentEventDetails(EventDate)
    await this.FillFormat()
    this.dtpEventSearchDate = new Date()
    await this.SearchEvent()
    await this.GetDefaultRoomsPaxOccupancy()
    await this.FillGroup()
    this.modalService.open(modalContant, {
      size: 'lg-900',
      windowClass: 'fade',
    });
    this.flocationElement.nativeElement.focus();  
    this.GetRoomSignagePlaylist()
    this.FillPromoLogo("777")
    localStorage.setItem('eventdfClientId',this.cid)
    localStorage.setItem('eventmType','Signage')
  }
  isUploadEventSheet="No"
  UploadEventSheet() {
    if (this.Adform.get('FilePathNew').value.length == 0) {
      this.toastr.info('Please select a file');
      return;
    }
    var eventDate = new Date(this.dtpUploadSheetEventDate)
    const formData = new FormData();
    formData.append('name', 'Excel');
    formData.append('clientid', this.cmbCustomerId);
    formData.append('eventdate', eventDate.toDateString());
    formData.append('profile', this.Adform.get('FilePathNew').value);

    this.serviceLicense.uploadevent(formData).subscribe(
      async (res) => {
        this.fileUpload = res;
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info('Sheet Uploaded', '');
          this.loading = false;
          this.isUploadEventSheet="Yes"
          this.GetCurrentEventDetails(eventDate)
          await this.SearchEvent()
          var currentd = new Date();
          var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
          var putDate = new Date(eventDate);
          if (cd == putDate) {
          if (this.cmbCustomerId == "10") {
            let payload =["2251","2253","2255"]
            this.publishEventPLayer(payload)
          }
        }
          this.GetFutureEventDetails()
        }
        if (obj.Responce == '0') {
          this.toastr.error(obj.message);
          this.InputFileName = 'No file chosen...';
          this.loading = false;
        }
        this.Adform.get('FilePathNew').setValue('');
      },
      (err) => {
        this.toastr.error('p');
        this.error = err;
        this.loading = false;
      }
    );
    this.flocationElement.nativeElement.focus();
  }
  publishEventPLayer(payload) {
  this.serviceLicense.ForceUpdate(payload).pipe().subscribe((data) => {
    var returnData = JSON.stringify(data);
    var obj = JSON.parse(returnData);
    if (obj.Responce == '1') {
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
  OpenViewContent(modalName, evtDate, t){
    var tid= "CP1"
    if (t =="N"){
      tid="CP4"
    }
    if (localStorage.getItem('PortalName')=='sbit'){
      tid="sbit1"
    }
    var url =`${this.templateHost}?templateId=${tid}&cpd=${evtDate}&dfd=${this.cmbCustomerId}`
    console.log(url)
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType","496")
      this.modalService.open(modalName, {
        size: 'Template',
      }); 
  }
  GetMeetingRooms () {
    this.MeetingSettings = {
      singleSelection: false,
      text: '',
      idField: 'id',
      textField: 'roomname',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };
    this.GroupSettings = {
      singleSelection: false,
      text: '',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };
    this.loading = true;
    this.MeetingRoomList = []
    this.SelectedMeetingArray = []
    this.cmbMeetingId ="0"
    this.cmbRoomStatus =""
    this.cmbFormatId='0'
    this.cmbPlaylistId ="0"
    this.serviceLicense.GetMeetingRooms(this.cid).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var objRes = JSON.parse(returnData);
          if (objRes.response == "1"){
            this.MeetingRoomList = JSON.parse(objRes.data);
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  onChangeMeetingRoom(deviceValue) {
    var obj = this.MeetingRoomList.filter(o => o.id == deviceValue)
    this.MeetingRoomDetail = obj[0]
    var obj2 = this.DefaultRoomsPaxOccupancy.filter(o => o.id == deviceValue)
    this.DefaultRoomsDetail = obj2[0]
    /*this.cmbFormatId = this.MeetingRoomDetail['signageFormatid']
    if ((this.cmbFormatId =="0") || (this.cmbFormatId ==null)){
      this.PlaylistList =[]
      this.cmbPlaylistId ='0'
    }
    else{
      this.FillPlaylist(this.cmbFormatId)
      this.cmbPlaylistId= this.MeetingRoomDetail['signagesplId']
    }*/
  }
  onItemSelectGroup(e){
    this.RoomSignagePlaylist=[]
    this.SelectedMeetingArray.forEach(item => {
      let obj = this.RoomSignagePlaylist_Main.filter(o => o.id == item["Id"])
      if (obj.length >0){
        this.RoomSignagePlaylist.push(obj[0])
      }
    });
  }
  onSelectAllGroup(e){
    console.log(e)
    this.RoomSignagePlaylist=[]
    console.log(this.SelectedMeetingArray)
    e.forEach(item => {
      let obj = this.RoomSignagePlaylist_Main.filter(o => o.id == item["Id"])
      if (obj.length >0){
        this.RoomSignagePlaylist.push(obj[0])
      }
    });
  }
  onItemDeSelectGroup(e){
    this.RoomSignagePlaylist=[]
    this.SelectedMeetingArray.forEach(item => {
      let obj = this.RoomSignagePlaylist_Main.filter(o => o.id == item["Id"])
      if (obj.length >0){
        this.RoomSignagePlaylist.push(obj[0])
      }
    });
  }
  onDeSelectAllGroup(e){
    this.RoomSignagePlaylist=[]
  }
  DisplayGroupRoomsList=[]
  DisplayGroupRooms(mdl){
    this.DisplayGroupRoomsList=[]
    this.SelectedMeetingArray.forEach(item => {
      let obj = this.GroupAllVenueList.filter(o => o.DisplayName == item["Id"])
      obj.forEach(element => {
        let rName = this.MeetingRoomList.filter(o => o.id == element["Id"])
        this.DisplayGroupRoomsList.push({
          roomname:rName[0]["roomname"],
          groupname: item["DisplayName"]
        })
      });
    });
    
    this.modalService.open(mdl)
  }
  onChangerType(){
    this.SelectedMeetingArray =[]
    this.RoomSignagePlaylist=[]
    if (this.rType_Playlist=="Room"){
      this.RoomSignagePlaylist = this.RoomSignagePlaylist_Main
    }
  }
  UpdateMeetingInfo(modalName) {
     
    if (this.SelectedMeetingArray.length==0){
      return
    }
    let SelectedMeetingRoomArray=[]
    if (this.rType_Playlist =='Group'){
    this.SelectedMeetingArray.forEach(item => {
      let obj = this.GroupAllVenueList.filter(o => o.DisplayName == item["Id"])
      obj.forEach(element => {
        SelectedMeetingRoomArray.push({
          id:element["Id"],
          roomname:""
        })
      });
    });
  }
  else{
    SelectedMeetingRoomArray = this.SelectedMeetingArray
  }
    
    this.MeetingRoomDetail['signagesplId']= this.cmbPlaylistId
    this.MeetingRoomDetail['signageFormatid']= this.cmbFormatId
    this.MeetingRoomDetail['lstRoom'] = SelectedMeetingRoomArray
    this.MeetingRoomDetail['dfclientid']= this.cmbCustomerId
    this.loading = true;
    this.serviceLicense.UpdateMeetingRoomsInfo(this.MeetingRoomDetail).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.response == "1"){
        this.toastr.info('Saved');
        this.SelectedMeetingArray =[]
        this.cmbFormatId ="0"
        this.cmbPlaylistId="0"
        //this.OpenRoomViewContent(modalName)
        this.GetRoomSignagePlaylist()
        let payload =[]
        if (this.cmbCustomerId == "10") {
          this.MeetingRoomList.forEach(item => {
            if ((item["tokenid"] != null) && (item["tokenid"] != 0)){
              payload.push(item["tokenid"])
            }
          });
          if (payload.length>0){
            this.publishEventPLayer(payload)
          }
        }
      }
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  GetRoomSignagePlaylist() {
    this.loading = true;
    this.serviceLicense.GetRoomSignagePlaylist(this.cid).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      if (objRes.response == "1"){
        this.RoomSignagePlaylist = JSON.parse(objRes.data);
        this.RoomSignagePlaylist_Main  = JSON.parse(objRes.data);
      }
      this.loading = false;
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  OpenRoomViewContent(modalName){
    var url =`${this.templateHost}?templateId=CP2&mid=${this.cmbMeetingId}`
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType","496")
      this.modalService.open(modalName, {
        size: 'Template',
      }); 
  }
  GetCurrentEventDetails (EventDate) {
    this.CustomerEventList = []
    
    this.cmbEventCustomer="0"
    this.loading = true;
    var str = '';
    this.serviceLicense.GetEventDetails(EventDate.toDateString(), this.cmbCustomerId).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var obj  = JSON.parse(returnData);
      this.loading = false;
      if (obj.response =="1"){
        var jsonParse = JSON.parse(obj.data)
        var eventjson = JSON.parse(jsonParse[0].eventjson)
        eventjson = eventjson.filter(o=> o.eventvenue != "Meeting Lounge")
        this.CustomerEventList = []

        eventjson.forEach(item => {
          var objAr = this.MeetingRoomList.filter(o => o.roomname == item['eventvenue'])
          item['mid'] =0
          item['tid'] =0
          if (objAr.length >0 ){
            item['mid'] =objAr[0].id
            item['tid'] =objAr[0].tokenid

            this.CustomerEventList.push(item)
          }
          
        });
        this.eventListjson= eventjson
        if (this.isUploadEventSheet == "No"){
          this.CustomerEventList = []
        }
        if (this.isUploadEventSheet == "Yes"){
          this.isUploadEventSheet = "No"
          this.SaveRoomCustomerEventWithUploadSheet(EventDate)
        }
      }
          

        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  openLibrary(ObjModal) {
    this.cmbFolder= "0"
    if (this.cmbCustomerId == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.FillLogo("777");
    this.modalService.open(ObjModal, { size: 'lg' });
  }
  SetImage(url,title, imgCount, titleid){
      this.EventCustomerdata.logoimgurl= url 
      this.EventCustomerdata.selected_logoName= title
      this.EventCustomerdata.titleid  = titleid
  }
  
  UploadCustomerLogo() {
    if (this.Adform.get('FilePathNew').value.length == 0) {
      this.toastr.info('Please select a file');
      return;
    }
    var eventDate = new Date()
    const formData = new FormData();
    formData.append('GenreId', '326');
    formData.append('GenreName', 'Logo Images');
    formData.append('CustomerId', this.cmbCustomerId);
    formData.append('MediaType', "Image");
    formData.append('FolderId', '777');
    formData.append('DBType', localStorage.getItem('DBType'));
    formData.append('IsAnnouncement','0');
    formData.append('name', 'Excel');
    formData.append('profile', this.Adform.get('FilePathNew').value);


    this.serviceLicense.uploadLogo(formData).subscribe(
      (res) => {
        this.fileUpload = res;
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info(obj.message, '');
          this.loading = false;
          this.FillLogo("777");
        }
        if (obj.Responce == '0') {
          this.toastr.error(obj.message);
          this.InputFileName = 'No file chosen...';
          this.loading = false;
        }
        this.Adform.get('FilePathNew').setValue('');
      },
      (err) => {
        this.toastr.error('p');
        this.error = err;
        this.loading = false;
      }
    );
    this.flocationElement.nativeElement.focus();
  }
  onChangeEventCustomer (e){
    // Meeting Lounge
    this.ResetCompanylogo()
    console.log(this.SavedEventList)
    this.UploadLogoCustomerEventList = this.SavedEventList.filter(o => o.cName == e && o.mid != 0)
  }
  OpenViewEventContent (modalName, event) {
    var url =`${this.templateHost}?templateId=CP32&mid=${event.mid}&imgSrc=${this.EventCustomerdata.logoimgurl}&title=${event.companyname.replace('&','amp')}&desc=${event.eventvenue}&text1=${event.eventtime}&text2=${event.eventdtl}`
    console.log(url)
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType","496")
      this.modalService.open(modalName, {
        size: 'Template',
      }); 
  }
  SaveRoomCustomerEventWithUploadSheet (eventDate) {
    this.CommonSaveRoomCustomerEvent(eventDate)
  }
  SaveRoomCustomerEventWithButtonClick () {
    var payload =[]
    let payloadPublish = []
    if (this.EventCustomerdata.logoimgurl == ""){
     // this.toastr.info('Please set logo','');
      return
    }
    this.loading = true;
    var EventDate = new Date(this.frmEvent.value.edate);
      var arr ={}
      arr['cName'] = this.frmEvent.value.dname
      arr['logoUrl'] = this.EventCustomerdata.logoimgurl
      arr['titleid'] = this.EventCustomerdata.titleid 
      arr['dfclientid'] =this.cmbCustomerId
      arr['eventDate'] = EventDate.toDateString()
      payload.push(arr)
    
    this.serviceLicense.SaveCustomerEventLogo(payload).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.Responce == "1"){
        //this.toastr.info('Saved', '');
        this.ResetCompanylogo()
        /*this.toastr.info('Event schedule is saved', '');
        var currentd = new Date();
        var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
        var putDate = new Date(eventDate);
        if (cd == putDate) {
        if (this.cmbCustomerId == "10") {
          this.publishEventPLayer(payloadPublish)
        }
      }

        this.CustomerEventList=[]
        this.ResetCompanylogo(); */
      }
     
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  CommonSaveRoomCustomerEvent(eventDate) {
    
    var payload =[]
    let payloadPublish = []
    if (this.CustomerEventList.length == 0){
      this.toastr.info('No event found','');
      return
    }
    this.loading = true;
    

    this.CustomerEventList.forEach(item => {
      var arr ={}
      arr['fromtotime'] = item['eventtime']
      arr['cName'] = item['companyname']
      arr['logoUrl'] = this.EventCustomerdata.logoimgurl
      arr['titleid'] = this.EventCustomerdata.titleid 
      arr['activity'] = item['eventdtl']
      arr['mid'] = item['mid']
      arr['dfclientid'] =this.cmbCustomerId
      arr['eventDate'] = eventDate.toDateString()
      payloadPublish.push(item['tid'])
      payload.push(arr)
    });
    this.serviceLicense.SaveRoomCustomerEvent(payload).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.Responce == "1"){
        this.AppendSignagePlaylistRoom(eventDate,payloadPublish)
        /*this.toastr.info('Event schedule is saved', '');
        var currentd = new Date();
        var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
        var putDate = new Date(eventDate);
        if (cd == putDate) {
        if (this.cmbCustomerId == "10") {
          this.publishEventPLayer(payloadPublish)
        }
      }

        this.CustomerEventList=[]
        this.ResetCompanylogo(); */
      }
     
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  AppendSignagePlaylistRoom(eventDate,payloadPublish) {
    this.loading = true;
    this.serviceLicense.AppendSignagePlaylistRoom(eventDate.toDateString(),this.cmbCustomerId).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
        this.toastr.info('Event schedule is saved', '');
        var currentd = new Date();
        var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
        var putDate = new Date(eventDate);
        if (cd == putDate) {
        if (this.cmbCustomerId == "10") {
          this.publishEventPLayer(payloadPublish)
        }
      }
      this.CustomerEventList=[]
      this.ResetCompanylogo();
      this.loading = false;
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  ResetCompanylogo() {
    this.EventCustomerdata = {
      logoimgurl: "",
      selected_logoName: "",
      titleid:"0"
    }
  }
  GetEvent(){
    var currentd = new Date();
    var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
    var EventDate = new Date(this.dtpLogoEventDate);
    if (EventDate < cd) {
      this.toastr.error('Event date could not be less than current date','');
      this.dtpLogoEventDate = cd;
    }
    this.CustomerEventList = []
    this.GetCurrentEventDetails(EventDate)
  }
  FormatList=[]
  cmbFormatId="0"
  PlaylistList=[]
  cmbPlaylistId="0"
  FillFormat() {
    this.loading = true;
    var qry = '';
    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    } else {
    }
    qry = '';
    qry =
      'select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid';
    qry =
      qry +
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithHotel,0)!=1 and ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cmbCustomerId +
      ' OR sf.dfclientid=' +
      this.cmbCustomerId +
      ") and sf.mediatype='Signage' group by  sf.formatname";

    this.pService.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  onChangeFormat(id) {
    this.PlaylistList = [];
    this.cmbPlaylistId="0"
    if (id == '') {
      return;
    }
    if (id == '0') {
      return;
    }
    this.FillPlaylist(id);
  }
  FillPlaylist(id) {
    this.PlaylistList = [];
    this.loading = true;
    this.pService.Playlist(id).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          this.PlaylistList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  UploadPromoLogo() {
    if (this.Adform.get('FilePathNew').value.length == 0) {
      this.toastr.info('Please select a file');
      return;
    }
    var eventDate = new Date()
    const formData = new FormData();
    formData.append('GenreId', '326');
    formData.append('GenreName', 'Logo Images');
    formData.append('CustomerId', this.cmbCustomerId);
    formData.append('MediaType', "Image");
    formData.append('FolderId', '777');
    formData.append('DBType', localStorage.getItem('DBType'));
    formData.append('IsAnnouncement','0');
    formData.append('name', 'Excel');
    formData.append('profile', this.Adform.get('FilePathNew').value);


    this.serviceLicense.uploadLogo(formData).subscribe(
      (res) => {
        this.fileUpload = res;
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info(obj.message, '');
          this.loading = false;
          this.FillPromoLogo("777");
        }
        if (obj.Responce == '0') {
          this.toastr.error(obj.message);
          this.InputFileName = 'No file chosen...';
          this.loading = false;
        }
        this.Adform.get('FilePathNew').setValue('');
      },
      (err) => {
        this.toastr.error('p');
        this.error = err;
        this.loading = false;
      }
    );
    this.flocationElement.nativeElement.focus();
  }
  openPromoLogoLibrary(ObjModal) {
    this.cmbFolder= "0"
    if (this.cmbCustomerId == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.modalService.open(ObjModal, { size: 'lg' });
  }
  FillPromoLogo(fid) {
    this.loading = true;
    this.serviceLicense
      .FillSignageLogo(this.cid, fid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          obj.forEach(item => {
            item['TitleIdLink']= item['TitleIdLink'].replace('http:','https:')
          });
          this.PromoLogoList = obj;
          this.loading = false;
          this.GetPromoLogo()
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
  GetPromoLogo() {
    this.loading = true;
    this.serviceLicense.GetPromoLogo(this.cid).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == "1"){
            var objRes = JSON.parse(obj.data);
          this.PromoLogoList.forEach(item => {
            var objFind= objRes.filter(o => o.titleid == Number(item['id']))
            var IsFindPromo ="0"
            if (objFind.length>0){
              IsFindPromo ="1"
            }
            item["IsFindPromo"] = IsFindPromo
          });
        }
        else{
          this.PromoLogoList.forEach(item => {
            item["IsFindPromo"] = "0"
          });
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

  SetUnsetPromoLogo(titleid,IsFindPromo) {
    this.loading = true;
    var dtPromoStartDate = new Date(this.dtPromoStartDate)
    var dtPromoEndDate= new Date(this.dtPromoEndDate)
    this.serviceLicense.SetUnsetPromoLogo(this.cmbCustomerId,titleid,IsFindPromo, dtPromoStartDate.toDateString(),dtPromoEndDate.toDateString()).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.response == "1"){
        this.FillPromoLogo("777")
        if (this.cmbCustomerId == "10") {
          let payload =["2251","2253","2255"]
          this.publishEventPLayer(payload)
        }
      }
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  PromoModaltitleid
  PromoModalIsFindPromo
  OpenPromoLogoDate(modalContant,titleid,IsFindPromo){
    this.PromoModaltitleid= titleid
    this.PromoModalIsFindPromo= IsFindPromo
    this.modalService.open(modalContant, {
      windowClass: 'fade',
    });
    this.flocationElement.nativeElement.focus(); 
  }
  onSubmitPromoDate(){
    this.SetUnsetPromoLogo(this.PromoModaltitleid,this.PromoModalIsFindPromo)
  }

  UpdatePlayerExpire(){
    if (this.TokenSelected.length == 0) {
      this.toastr.info('Please select a token');
      return;
    }
    this.loading = true;
    var dtExDate = new Date(this.dtTokenExpiryDate)
    this.serviceLicense.UpdatePlayerExpire(this.TokenSelected,dtExDate.toDateString()).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.SaveModifyInfo(
              0,
              'Expiry Date changed for for '+JSON.stringify(this.TokenSelected)+' new expiry date: '+ dtExDate.toDateString()
            );
            this.TokenSelected = [];
            this.PublishSearchList=[]
            this.searchTextPublish=''
            this.modalService.dismissAll();
            this.dtTokenExpiryDate = new Date()
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

  
  onChangeTokenEvent(){
    this.PlayerSearchList = this.TokenList.filter(country => this.serviceLicense.matches(country, this.searchText, this.pipe));
    const total = this.PlayerSearchList.length;
    this.ActivePlayerListlength =total
  }

  UpdateRoomsPaxOccupancy() {
    this.loading = true;
    this.serviceLicense.UpdateRoomsPaxOccupancy(this.MeetingRoomDetail).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.response == "1"){
        this.toastr.info('Saved');
        //this.OpenRoomViewContent(modalName)
      }
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  FillRoomActivity() {
    this.loading = true;
    var qry = 'select activityname as id , activityname as displayname from tbRoomActivity order by activityname';
    this.pService.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.RoomActivityList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  CheckEventDateDays(){
    let ct
    ct= new Date()
    let selectDate
    const frm = this.frmEvent.value
    selectDate= new Date(frm["edate"])
    let diffMs = (ct - selectDate); // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    if (diffDays >0){
      this.toastr.info('Event date not be less than current date.','');
      this.frmEvent.patchValue({
        edate: new Date()
      })
      return
    }
  }
  SearchEvent(){
    this.inEventfrm()
    this.SavedEventList=[]
    this.EventCustomerList=[]
    let ct
    ct= new Date()
    let diffMs = (ct - this.dtpEventSearchDate);  
    var diffDays = Math.floor(diffMs / 86400000);  
    if (diffDays >0){
      this.toastr.info('Event search date not be less than current date.','');
      this.dtpEventSearchDate= new Date()
    }
    this.dtpEventSearchDate= new Date(this.dtpEventSearchDate)
    this.loading = true;
    this.pService.GetRoomEventList_Datewise(this.dtpEventSearchDate.toDateString(), this.cmbCustomerId).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.data !=''){
            this.SavedEventList = JSON.parse(obj.data)
            this.SavedEventList.forEach(item => {
              var arr = {}
              this.EventCustomerList = this.EventCustomerList.filter(o => o.companyname != item['cName'])
              arr['companyname']= item['cName']
              this.EventCustomerList.push(arr)
            });
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  FetchEditInfo(e){
    var dt= new Date(e.fromtime)
    var dt2= new Date(e.totime)
    var time: NgbTimeStruct = { hour: dt.getHours(), minute: dt.getMinutes(), second: 0 };
    var time2: NgbTimeStruct = { hour: dt2.getHours(), minute: dt2.getMinutes(), second: 0 };
    this.frmEvent.patchValue({
      dname: e.cName,
    edate: new Date(e.eDate),
    stime: time,
    etime: time2,
    mid: e.mid,
    activity: e.activity,
    id:e.id
    })
  }
  ResetEventFrm(){
    this.frmEvent.reset();
    this.frmEvent.patchValue({
    edate: new Date(),
    id:"0",
    dfclientid:this.cmbCustomerId
    })
    this.ResetCompanylogo()
  }
  async SaveRoomCustomerEvent() {
    var sTime = this.frmEvent.value.stime;
    var eTime = this.frmEvent.value.etime;
    var dt = new Date(
      'Mon Mar 09 2020 ' + sTime['hour'] + ':' + sTime['minute'] + ':00'
    );
    var dt2 = new Date(
      'Mon Mar 09 2020 ' + eTime['hour'] + ':' + eTime['minute'] + ':00'
    );
    this.frmEvent.get('stime').setValue(dt.toTimeString().slice(0, 5));
    this.frmEvent.get('etime').setValue(dt2.toTimeString().slice(0, 5));
    var startDate = new Date(this.frmEvent.value.edate);
    this.frmEvent.get('edate').setValue(startDate.toDateString());

    var payload = this.frmEvent.value
   
    this.loading = true;
   
    
    this.serviceLicense.SaveRoomEvent(payload).pipe().subscribe(async (data) => {
      var returnData = JSON.stringify(data);
      var objRes = JSON.parse(returnData);
      this.loading = false;
      if (objRes.Responce == "1"){
        this.toastr.info('Event schedule is saved', '');
        await this.SaveRoomCustomerEventWithButtonClick()
        await this.SearchEvent()
        await this.GetFutureEventDetails()
        var payloadPublish=[]
        await this.AppendSignagePlaylistRoom(startDate,payloadPublish)
        /*
        var currentd = new Date();
        var cd = new Date(currentd.getFullYear(),currentd.getMonth(),currentd.getDate());
        var putDate = new Date(eventDate);
        if (cd == putDate) {
        if (this.cmbCustomerId == "10") {
          this.publishEventPLayer(payloadPublish)
        }
      }
      */
        
      }
     
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  DeleteEventId
  openDeleteModal(content, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.DeleteEventId = id;
    this.modalService.open(content, { centered: true });
  }
  DeleteEvent(){
    this.loading = true;
    this.serviceLicense.DeleteRoomEvent(this.DeleteEventId).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.SearchEvent();
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
  GetDefaultRoomsPaxOccupancy() {
    this.DefaultRoomsPaxOccupancy =[]
    this.loading = true;
    this.serviceLicense.GetDefaultRoomsPaxOccupancy(this.cmbCustomerId).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        this.DefaultRoomsPaxOccupancy = JSON.parse(obj.data)
      }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }

  FillGroup() {
    this.loading = true;
    this.GroupVenueList=[]
    this.GroupVenueSelected =[]
    const qry ='select  id, gname as displayname  from tbRoomGroup where dfClientId = ' + this.cmbCustomerId +' order by gname';
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          this.Group_List = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }

  SelectGroupVenue(fileid, event) {
    if (event.target.checked) {
      this.GroupVenueSelected.push(fileid);
    } else {
      const index: number = this.GroupVenueSelected.indexOf(fileid);
      if (index !== -1) {
        this.GroupVenueSelected.splice(index, 1);
      }
    }
  }
  OpenDeleteGroupModal(modal){
    if (this.cmbRoomGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    this.modalService.open(modal);
  }
  UpdateRoomGroups(){
    if (this.cmbRoomGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    if (this.GroupVenueSelected.length === 0) {
      this.toastr.info('Please select atleast one room');
      return;
    }
    this.loading = true;
    this.serviceLicense.UpdateVenueGroups(this.GroupVenueSelected, this.cmbRoomGroup,false).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.GroupVenueSelected = [];
            this.GroupVenueList = [];
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.cmbRoomGroup = '0';
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
            return;
          }
          this.cmbRoomGroup = '0';
          this.ModifyGroupName = '';
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
  openCommonModal(modal) {
    this.modalService.open(modal);
  }
  GroupVenueAssignedList=[]
  async onChangeRoomGroup_search(id) {
    this.GroupVenueAssignedList=[]
    if (id != "0"){
      this.loading = true;
    const qry ='select  mid as id, mid as displayname  from tbRoomGroupDetail where groupid = ' + this.cmbRoomGroup_search +' ';
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          var lstVenue = JSON.parse(returnData);
          let obj_GroupVenueList = this.MeetingRoomList
          obj_GroupVenueList.forEach(item => {
            item["check"]= false
            let fList = lstVenue.filter((order) => order.Id == item["id"])
            if (fList.length > 0){
              item["check"]= true
              this.GroupVenueAssignedList.push(item);
            }
          });
          this.loading = false;
          console.log(this.GroupVenueAssignedList)
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
    }
  }
  async onChangeRoomGroup(id) {
    let NewFilterList = [];
    this.GroupVenueList=[]
    this.GroupVenueSelected =[]
    NewFilterList = this.Group_List.filter((order) => order.Id === id);
    if (NewFilterList.length > 0) {
      console.log(this.GroupAllVenueList)
      console.log(this.MeetingRoomList)
      this.MeetingRoomList.forEach(item => {
        var obj = this.GroupAllVenueList.filter(o => o.Id == item["id"])
        if (obj.length ==0){
          this.GroupVenueList.push(item)
        }
      });
      this.ModifyGroupName = NewFilterList[0].DisplayName;
      await this.FillGroupVenue()
    }
    else{
      this.ModifyGroupName = '';
      this.cmbRoomGroup = '0';
    }
  }
  FillGroupVenue() {
    this.loading = true;
    const qry ='select  mid as id, mid as displayname  from tbRoomGroupDetail where groupid = ' + this.cmbRoomGroup +' ';
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          var lstVenue = JSON.parse(returnData);
          this.GroupVenueList.forEach(item => {
            item["check"]= false
            let fList = lstVenue.filter((order) => order.Id == item["id"])
            if (fList.length > 0){
              this.GroupVenueSelected.push(item["id"]);
              item["check"]= true
            }
          });
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }


  onSubmitRoomGroup(){
    this.loading = true;
    this.tService.SaveRoomGroup(this.cmbRoomGroup,this.ModifyGroupName,this.cmbCustomerId).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.FillGroup();
          } else if (obj.Responce == '-2') {
            this.toastr.info('Name is already exixts', '');
            this.loading = false;
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
            return;
          }
          this.cmbRoomGroup = '0';
          this.ModifyGroupName = '';
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  DeleteGroup(){
    this.loading = true;
    this.serviceLicense.DeleteRoomGroup(this.cmbRoomGroup).pipe().subscribe(async (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.GroupVenueSelected = [];
            this.GroupVenueList = [];
            await this.FillGroup();
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
            return;
          }
          this.cmbRoomGroup = '0';
          this.ModifyGroupName = '';
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
  FillAllGroupVenue() {
    this.loading = true;
    const qry ='select  mid as id, groupid as displayname from tbRoomGroupDetail where groupid in (select id from tbRoomGroup where dfClientId=' + this.cmbCustomerId +')  ';
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          const returnData = JSON.stringify(data);
          this.GroupAllVenueList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  onChangeRoomSchedule(id){
    let obj = this.MeetingRoomList.filter(o => o.id == id)
    this.futureSchList =[]
    this.FutureSchFind= "No"
    if (obj[0].tokenid == null){
      return
    }
    this.loading = true;
    this.tService.FillTokenContent(obj[0].tokenid).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.lstfutureSchList.length >0){
            this.futureSchList = obj.lstfutureSchList
            this.FutureSchFind= "Yes"
          }
          else{
            this.futureSchList = obj.lstPlaylistSch;
            this.FutureSchFind= "No"
          }
          if (obj.lstTokenData == null) {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
            return;
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
  ResetList(){
    this.cmbRoomSchedule ="0"
    this.futureSchList =[]
  }
  openUnAssignRoomGroupModal(id){
    this.loading = true;
    this.serviceLicense.UnAssignVenueGroups(id).pipe().subscribe(async (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Room Un-Assigned', 'Success!');
            this.loading = false;
            await this.onChangeRoomGroup_search(this.cmbRoomGroup_search);
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
            return;
          }
           
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
  DeleteSchPlaylist() {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
      
      this.tService
      .DeleteTokenSch_future(this.DeleteEventId)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
             
            this.loading = false;
            this.onChangeRoomSchedule(this.cmbRoomSchedule);
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
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
}
