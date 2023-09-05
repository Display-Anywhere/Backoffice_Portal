import { Component, OnInit,Input,ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
import {
  NgbModalConfig,
  NgbModal,
  NgbTimepickerConfig,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { trim } from 'jquery';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { DecimalPipe } from '@angular/common';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-masterschedule',
  templateUrl: './masterschedule.component.html',
  styleUrls: ['./masterschedule.component.css'],
  providers: [DecimalPipe]
})
export class MasterscheduleComponent implements OnInit {
  ScheduleList = [];
  dropdownSettings = {};
  dropdownList = [];
  selectedItems = [];
  SFform: FormGroup;
  submitted = false;
  public loading = false;
  TokenSelected = [];
  TokenSelected_publish = [];
  TokenList = [];
  MainTokenList = [];
  CustomerList: any[];
  PlaylistList = [];
  SearchPlaylistList=[];
  MainPlaylistList = [];
  SearchFormatList = [];
  FormatList = [];
  page: number = 1;
  pageSize: number = 50;
  pageSearch: number = 1;
  pageSizeSearch: number = 20;
  dt = new Date('Mon Mar 09 2020 00:00:00');
  dt2 = new Date('Mon Mar 09 2020 23:59:00');
  cmbSearchCustomer = "0";
  cmbSearchFormat = 0;
  cmbSearchPlaylist = 0;
  frmTokenInfoModifyPlaylist: FormGroup;
  pSchid = 0;
  DeleteOption=""

  cid='0';
  CountryList = [];
  CountrySettings = {};
  StateList = [];
  StateSettings = {};
  CityList = [];
  CitySettings = {};
  GroupList = [];
  GroupSettings = {};
  ForceUpdateType = '';
  searchText: string = '';
  searchSignageText: string = '';
  chkAll: boolean = false;
  cmbMediaType = '';
  txtMasterScheduleName=''
  cmbMasterSchedule="0"
  MasterSchedulelist=[]
  MasterSchedulelist_Overview=[]
  MediaTypeList = [];
  cmbSearchMediaType;
  SearchMediaTypeList = [];
  CustomSchedulePlaylist = [];
  CustomSchedulePlaylist_ForSave = [];
  TotalPercentageValue = 0;
  sType="Regular"
  sType_Search="Regular"
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  dtDate = new Date()
  cmbPublishId="0"
  PlaylistSongsList =[]
  DeleteContentId
  FilterPlaylistId
  HoteltvPlaylistLimit
  HoteltvPlaylistSize =0
  ShowLimitSubmitButton= false
  cmbDeviceType=""
  cmbSearch_SignageCustomer = "0";
  cmbSignageContentId=0
  SignageContentList = [];
  SignageContentPlayerList = [];
  NewMasterScheduleName=''
  chkOverwritemanual=false
  NewMasterScheduleNameId='0'
  cmbCustomer_MasterSchedule='0'
  ngbNavActiveTabId=1
  SelectionToken
  MasterScheduleTokenInfoList=[]
  MasterScheduleType=""
  EditPschId="0"
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
  constructor(
    private formBuilder: FormBuilder,
    public toastrSF: ToastrService,
    private vcr: ViewContainerRef,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private sfService: StoreForwardService, public confapi:ConfigAPI,
    public auth:AuthServiceOwn,private pService: PlaylistLibService,
    private serviceLicense: SerLicenseHolderService,private pipe: DecimalPipe,
    configTime: NgbTimepickerConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    configTime.seconds = false;
    configTime.spinners = false;
    this.auth.isTokenInfoClose$.subscribe((value) => {
      if (value === true) {
        this.tokenInfoClose()
      }
    });
  }
  @ViewChild('flocation') flocationElement: ElementRef;
  // d = new Date();
  // year = this.d.getHours();
  //   month = this.d.getMonth();
  // day = this.d.getDate();
  // hr= this.d.getHours();
  // public dateTime1 = new Date(this.year,this.month,this.day,this.hr,0,0,0);
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  time2: NgbTimeStruct = { hour: 23, minute: 59, second: 0 };
  ngOnInit() {
     
    this.auth.isTokenInfoClose$.next(false);
    this.SFform = this.formBuilder.group({
      CustomerId: ['0', Validators.required],
      FormatId: ['0', Validators.required],
      PlaylistId: ['0', Validators.required],
      startTime: [this.dt, Validators.required],
      EndTime: [this.dt2, Validators.required],
      startDate: [this.dtDate, Validators.required],
      EndDate: [this.dtDate, Validators.required],
      wList: [this.selectedItems, Validators.required],
      TokenList: [this.TokenSelected],
      lstPlaylist: [this.CustomSchedulePlaylist],
      ScheduleType: ['Normal', Validators.required],
      PercentageValue: ['0'],
      volume: ['90'],
      MasterScheduleId:['0'],
      mediatype: ['']
    });
    this.time = {
      hour: this.dt.getHours(),
      minute: this.dt.getMinutes(),
      second: 0,
    };
    this.SFform.get('startTime').setValue(this.time);
    this.time = {
      hour: this.dt2.getHours(),
      minute: this.dt2.getMinutes(),
      second: 0,
    };
    this.SFform.get('EndTime').setValue(this.time);

    this.frmTokenInfoModifyPlaylist = this.formBuilder.group({
      ModifyPlaylistName: [''],
      ModifyStartTime: [''],
      ModifyEndTime: [''],
      pschid: [''],
    });
    this.ScheduleList = [];

    this.TokenList = [];
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
      itemsShowLimit: 1,
    };

    this.FillClient();
    
  }

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  get f() {
    return this.SFform.controls;
  }

  onSubmitSF(UpdateModel, ReducePlaylist) {
    this.TokenSelected=[]
    this.SelectionToken.forEach(item => {
      var tokenItem = {};
      tokenItem['tokenId'] = item;
      tokenItem['schType'] = this.MasterScheduleType;
      this.TokenSelected.push(tokenItem);
    });
     
    this.modalService.dismissAll()
    var errorFound ="No"
    this.submitted = true;
    if (this.SFform.value.CustomerId == '0') {
      this.toastrSF.error('Please select a customer name');
      return;
    }
    /* if (this.SFform.value.FormatId == '0') {
      this.toastrSF.error('Please select a format name');
      return;
    } */

    if (this.TokenSelected.length == 0) {
       this.toastrSF.error('Please select at least one player', '');
      errorFound="Yes"
      return;
    }
    this.TokenList.forEach(item => {
      var obj = this.TokenSelected.filter(o => o.tokenId === item.tokenid)
      if (obj.length > 0 ){
        if (item.DeviceType === "HotelTv") {
          if (this.CustomSchedulePlaylist.length > 1){
            this.toastrSF.error('Only one playlist is assign to Hotel Tv player', '');
            errorFound="Yes"
            return
          }
          var playlist = this.CustomSchedulePlaylist[0]
          var obj_pl = this.PlaylistList.filter(o => o.Id === playlist.splId)
          this.HoteltvPlaylistLimit = item.playlistlimit
          this.ShowLimitSubmitButton= false
          if (Number(obj_pl[0].playlistsize) > Number(item.playlistlimit)){
            this.FilterPlaylistId = playlist.splId
            this.FillPlaylistSongs(playlist.splId)
            this.modalService.open(ReducePlaylist, { centered: true, size: 'lg' });
            errorFound="Yes"
            return
          }
        }
      }
    });
if (errorFound==="Yes"){
  return
}
    this.SFform.controls['TokenList'].setValue(this.TokenSelected);
    var sTime = this.SFform.value.startTime;
    var eTime = this.SFform.value.EndTime;

    var dt = new Date(
      'Mon Mar 09 2020 ' + sTime['hour'] + ':' + sTime['minute'] + ':00'
    );
    var dt2 = new Date(
      'Mon Mar 09 2020 ' + eTime['hour'] + ':' + eTime['minute'] + ':00'
    );

    this.SFform.get('startTime').setValue(dt.toTimeString().slice(0, 5));
    this.SFform.get('EndTime').setValue(dt2.toTimeString().slice(0, 5));

    this.SFform.controls['lstPlaylist'].setValue(this.CustomSchedulePlaylist);

    var startDate = new Date(this.SFform.value.startDate);
    var EndDate = new Date(this.SFform.value.EndDate);

    this.SFform.get('startDate').setValue(startDate.toDateString());
    this.SFform.get('EndDate').setValue(EndDate.toDateString());
    if (this.SFform.value.ScheduleType === 'PercentageSchedule') {
      if (this.TotalPercentageValue < 100) {
        this.toastrSF.error(
          'Total percentage value should  be greater than or equal to 100'
        );
        return;
      }
    }
    this.SFform.get('MasterScheduleId').setValue(this.cmbMasterSchedule);
    this.SFform.get('mediatype').setValue(this.cmbMediaType);
    
    this.TokenSelected_publish=[];
    this.TokenSelected_publish= this.TokenSelected
    this.loading = true;
    if (this.sType=="Regular"){
      this.SaveRegularSchedule(UpdateModel,sTime,eTime)
    }
    if (this.sType=="Future"){
      this.SaveFutureSchedule(UpdateModel,sTime,eTime)
    }
  }

  SaveRegularSchedule(UpdateModel,sTime,eTime){
    this.sfService
      .SaveSF(this.SFform.value)
      .pipe()
      .subscribe(
        async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Saved', 'Success!');

            var params= JSON.stringify({TokenList:this.TokenSelected,lstPlaylist:this.CustomSchedulePlaylist,ScheduleType:this.SFform.value.ScheduleType})
            this.SaveModifyInfo(0, 'New regular schedule is created with these values ' + params);
            this.loading = false;
            this.chkAll = false;
            //this.CustomSchedulePlaylist = [];
            this.TotalPercentageValue = 0;
            this.selectedItems=[];
            this.TokenSelected=[];
            this.TokenList=[];
            this.SelectionToken=[]

            this.sType="Regular"
           //this.SFform.get('CustomerId').setValue('0');
            this.SFform.get('FormatId').setValue('0');
            this.SFform.get('PlaylistId').setValue('0');
            this.SFform.get('TokenList').setValue(this.TokenSelected);
            this.SFform.get('lstPlaylist').setValue([]);
            this.SFform.get('PercentageValue').setValue('0');
            //this.SFform.get('volume').setValue('90');
            //this.SFform.get('ScheduleType').setValue('Normal');
            //this.SFform.get('startTime').setValue(sTime);
            //this.SFform.get('EndTime').setValue(eTime);
           // this.SFform.get('startDate').setValue(this.dtDate);
           // this.SFform.get('EndDate').setValue(this.dtDate);

           await this.GetMasterScheduleDetail(this.cmbMasterSchedule)
            
            this.ForceUpdateType = 'New';
            //this.modalService.open(UpdateModel, { centered: true });
          } else {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }


  SaveFutureSchedule(UpdateModel,sTime,eTime){
    this.sfService
      .SaveFutureSchedule(this.SFform.value)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Saved', 'Success!');
            var params= JSON.stringify({startTime:this.SFform.value.startTime,EndTime:this.SFform.value.EndTime,startDate:this.SFform.value.startDate,EndDate:this.SFform.value.EndDate,TokenList:this.TokenSelected,lstPlaylist:this.CustomSchedulePlaylist,ScheduleType:this.SFform.value.ScheduleType})
            this.SaveModifyInfo(0, 'New future schedule is created with these values ' + params);
            this.loading = false;
            this.chkAll = false;
            this.CustomSchedulePlaylist = [];
            this.TotalPercentageValue = 0;
            this.selectedItems=[];
            this.TokenSelected=[];
            this.TokenList=[];
            this.sType="Regular"
            this.SFform = this.formBuilder.group({
              CustomerId: ['0', Validators.required],
              FormatId: ['0', Validators.required],
              PlaylistId: ['0', Validators.required],
              startTime: [sTime, Validators.required],
              EndTime: [eTime, Validators.required],
              startDate: [this.dtDate, Validators.required],
              EndDate: [this.dtDate, Validators.required],
              wList: [this.selectedItems, Validators.required],
              TokenList: [this.TokenSelected],
              lstPlaylist: [this.CustomSchedulePlaylist],
              ScheduleType: ['Normal', Validators.required],
              PercentageValue: ['0'],
              volume: ['90'],
            });


            
            this.SFform.get('ScheduleType').setValue('Normal');
            this.SFform.get('startTime').setValue(sTime);
            this.SFform.get('EndTime').setValue(eTime);

            this.ForceUpdateType = 'New';
            this.modalService.open(UpdateModel, { centered: true });
          } else {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }

  SelectToken(fileid, event, scheduleType) {
    var tokenItem = {};
    if (event.target.checked) {
      tokenItem['tokenId'] = fileid;
      tokenItem['schType'] = this.f.ScheduleType.value;
      this.TokenSelected.push(tokenItem);
    } else {
      tokenItem['tokenId'] = fileid;
      tokenItem['schType'] = this.f.ScheduleType.value;
      this.removeDuplicateRecord(tokenItem);
      //      const index: number = this.TokenSelected.indexOf(fileid);
      //      if (index !== -1) {
      //        this.TokenSelected.splice(index, 1);
      //     }
    }
  }
  removeDuplicateRecord = (array): void => {
    this.TokenSelected = this.TokenSelected.filter(
      (order) => order.tokenId !== array.tokenId
    );
  };
  FillClient() {
    var q = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.loading = true;
    this.sfService
      .FillCombo(q)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          
            this.SFform.get('CustomerId').setValue(
              localStorage.getItem('dfClientId')
            );
            this.cmbCustomer_MasterSchedule=localStorage.getItem('dfClientId')
            this.cid=localStorage.getItem('dfClientId')
            this.onChangeCustomer(localStorage.getItem('dfClientId'));
            this.cmbSearchCustomer=localStorage.getItem('dfClientId')
          //this.onChangeSearchCustomer(localStorage.getItem('dfClientId'))
           
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  FillFormat() {
    var qry =
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
      ")  group by  sf.formatname";
    this.loading = true;
    this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }

  async onChangeFormat(id, type) {
    this.ScheduleList = [];
    this.SearchPlaylistList = [];
    await this.FillPlaylist(id, type);
    if (type == 'Search') {
      await this.SearchContent();
    }
  }

  FillPlaylist(id, type) {
    this.loading = true;
    this.sfService
      .Playlist(id)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.PlaylistList = JSON.parse(returnData);
          this.MainPlaylistList = JSON.parse(returnData);
          this.SearchPlaylistList=[];
          this.PlaylistList.forEach(element => {
            let obj =element['tokenIds']
            if (obj[0]!=""){
              this.SearchPlaylistList.push(element)
            }
          });
          this.loading = false;
          if (type == 'Search') {
            //this.SearchContent();
          }
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  async onChangeCustomer(deviceValue) {
    this.cid = deviceValue;
    this.TokenSelected = [];
    this.SelectedGroupArray = [];
    this.SelectedCountryArray = [];
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    this.PlaylistList = [];
    this.selectedItems = [];
    this.TokenList = [];
    this.MainPlaylistList = [];
    this.FormatList = [];
    this.CustomSchedulePlaylist = [];
    this.TotalPercentageValue = 0;
    this.SFform.get('FormatId').setValue('0');
    this.SFform.get('PlaylistId').setValue('0');
    await this.GetPublishSchedule()
    this.time = {
      hour: this.dt.getHours(),
      minute: this.dt.getMinutes(),
      second: 0,
    };
    this.SFform.get('startTime').setValue(this.time);
    this.time = {
      hour: this.dt2.getHours(),
      minute: this.dt2.getMinutes(),
      second: 0,
    };
    this.SFform.get('EndTime').setValue(this.time);

    this.SFform.get('wList').setValue(this.selectedItems);
    this.chkAll = false;
    
    await this.FillMasterSchedule(this.cid)
    
  }
  GetCustomerMediaType(cid, type) {
    this.loading = true;
    var str = '';
    str = 'GetCustomerMediaType ' + cid;
    this.sfService
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          
          if (type == 'New') {
            this.MediaTypeList = JSON.parse(returnData);
            var mType= this.MediaTypeList[0].Id
            if(mType!=null){
              this.cmbMediaType=mType
              this.onChangeMediaType(mType)
            }
          }
          if (type == 'Search') {
            this.SearchMediaTypeList = JSON.parse(returnData);
            if(mType!=null){
              this.cmbSearchMediaType=mType
              this.onChangeSearchMediaType(mType)
            }
          }
          
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  onChangeMediaType(mtype) {
    this.ScheduleList = [];
    //this.PlaylistList = [];
    //this.FormatList = [];
    this.TokenSelected = [];
    this.chkAll = false
    //this.CustomSchedulePlaylist=[];
/*     this.SFform.get('FormatId').setValue('0');
    this.SFform.get('PlaylistId').setValue('0');
    this.SFform.get('volume').setValue('90');
    if (this.cmbMediaType =="Signage"){
      this.SFform.get('volume').setValue('0');
    }
 */    
    this.FillTokenInfo(this.cid);
  }
  isHotelTvFind="No"
  FillTokenInfo(deviceValue) {
    this.loading = true;
    this.sfService
      .FillTokenInfo(deviceValue)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          obj= obj.filter(o => o.IsKpnActive =='0')
          const objfrm = this.SFform.value;
          var objmType = this.cmbMediaType.split(' ');
          let mtype = '';
          let ptype = '';
          let objList = [];
          if (objmType.length == 2) {
            mtype = objmType[0].trim();
            ptype = objmType[1].trim();
          } else {
            mtype = this.cmbMediaType;
          }
          if (ptype === '') {
            //order.ScheduleType === objfrm['ScheduleType'] &&
            objList = obj.filter(
              (order) =>
                order.MediaType === mtype
            );
          } else {
            //order.ScheduleType === objfrm['ScheduleType'] &&
            objList = obj.filter(
              (order) =>
                order.MediaType === mtype &&
                order.LicenceType === ptype
            );
          }
          this.isHotelTvFind="No"
          objList.forEach(item => {
            if (item.DeviceType === "HotelTv") {
              this.isHotelTvFind="Yes"
              return
            }
          });
          this.MasterScheduleTokenInfoList.forEach(item => {
            objList= objList.filter(o=> o.tokenid != item["TokenID"].toString())
          });

          this.TokenList = objList;
          this.MainTokenList = objList;
          this.loading = false;
          this.getSelectedRows();
          this.FillCountry();
          this.onChangeDeviceType('')
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  allToken(event) {
    var tokenItem = {};
    const checked = event.target.checked;
    this.chkAll = checked;
    if (this.searchText==''){
      this.TokenSelected = [];
      this.TokenList.forEach((item) => {
        tokenItem = {};
        item.check = checked;
        tokenItem['tokenId'] = item.tokenid;
        tokenItem['schType'] = this.f.ScheduleType.value;
        this.TokenSelected.push(tokenItem);
      });
  } else {
    this.TokenList_Search_Assign.forEach((item) => {
      tokenItem = {};
      item.check = checked;
      tokenItem['tokenId'] = item.tokenid;
      tokenItem['schType'] = this.f.ScheduleType.value;
      this.TokenSelected.push(tokenItem);
    });
  }
    if (checked == false) {
      this.TokenSelected = [];
    }
  }
  onChangeSearchPlaylist() {
    this.SearchContent();
  }
  SearchContent() {
    if (this.cmbSearchCustomer == "0") {
      this.toastrSF.error('Select a customer', '');
      return;
    }
    this.loading = true;
    this.ScheduleList=[]
    if (this.sType_Search=="Regular"){
      this.sfService.FillSF(this.cmbSearchCustomer,this.cmbSearchFormat,this.cmbSearchPlaylist).pipe().subscribe((data) => {
        var returnData = JSON.stringify(data);
        this.ScheduleList = JSON.parse(returnData);
        if (this.cmbSearchMediaType != 0) {
          this.ScheduleList= this.ScheduleList.filter(p => trim(p.mediatype) === this.cmbSearchMediaType)
        }
        this.loading = false;
      },
      (error) => {
        this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
    }
    if (this.sType_Search=="Future"){
      this.sfService.FillSF_future(this.cmbSearchCustomer,this.cmbSearchFormat,this.cmbSearchPlaylist).pipe().subscribe((data) => {
        var returnData = JSON.stringify(data);
        this.ScheduleList = JSON.parse(returnData);
        if (this.cmbSearchMediaType != 0) {
          this.ScheduleList= this.ScheduleList.filter(p => trim(p.mediatype) === this.cmbSearchMediaType)
        }
        this.loading = false;
      },
      (error) => {
        this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
    }
    
  }
  ModifyForceUpdateTokenId;
  openModal(content, pname, pschid, stime, eTime, tid) {
    var t = '1900-01-01 ' + stime;
    var t2 = '1900-01-01 ' + eTime;
    var dt = new Date(t);
    var dt2 = new Date(t2);
    this.ModifyForceUpdateTokenId = tid;

    this.frmTokenInfoModifyPlaylist = this.formBuilder.group({
      ModifyPlaylistName: [pname],
      ModifyStartTime: [dt],
      ModifyEndTime: [dt2],
      pschid: [pschid],
    });
    this.modalService.open(content, {
      centered: true,
    });
  }
  onSubmitTokenInfoModifyPlaylist(UpdateModel) {
    //this.loading = true;
    var sTime = new Date(this.frmTokenInfoModifyPlaylist.value.ModifyStartTime);
    var eTime = new Date(this.frmTokenInfoModifyPlaylist.value.ModifyEndTime);
    var pschid = this.frmTokenInfoModifyPlaylist.value.pschid;
    this.sfService
      .UpdateTokenSch(
        pschid,
        sTime.toTimeString().slice(0, 5),
        eTime.toTimeString().slice(0, 5)
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Saved', 'Success!');
            this.SearchContent();
            this.SaveModifyInfo(
              0,
              'Token schedule time is modify and schedule id is ' + pschid
            );
            this.ForceUpdateType = 'Modify';
            this.modalService.open(UpdateModel, { centered: true });
          } else {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  openDeleteModal(content, pschid,deleteOption) {
    this.pSchid = pschid;
    this.DeleteOption=deleteOption
    this.modalService.open(content, { centered: true });
  }
  DeleteTokenSchedule() {
    this.loading = true;
    this.sfService
      .DeleteTokenSch_future(this.pSchid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Deleted', 'Success!');
            this.loading = false;
            this.SearchContent();
            this.SaveModifyInfo(
              0,
              'Token schedule time is delete and schedule id is ' + this.pSchid
            );
          } else {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  async onChangeSearchCustomer(id) {
    this.cmbSearchFormat=0
    this.cmbSearchPlaylist=0
    this.ScheduleList = [];
    this.SearchPlaylistList = [];
    this.SearchFormatList=[]
    await this.GetCustomerMediaType(id, 'Search');
    await this.SearchContent();
  }
  onChangeType(){

  }
  async onChangeSearchMediaType(mtype) {
    this.cmbSearchFormat=0
    this.cmbSearchPlaylist=0
    this.ScheduleList = [];
    this.SearchPlaylistList = [];
    this.SearchFormatList=[]
    var qry=""
    if (this.sType_Search=="Regular"){
      qry ='select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf inner join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid';
      qry =qry + ' inner join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where  isnull(LinkWithEvent,0)=0 and ';
    }
    if (this.sType_Search=="Future"){
      qry ='select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf inner join tbSpecialTempPlaylistSchedule_Token st on st.formatid= sf.formatid';
      qry =qry + ' inner join tbSpecialTempPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithEvent,0)=0 and ';
    }
    qry =qry +" (dbtype='" + localStorage.getItem('DBType') + "' or dbtype='Both') and  (st.dfclientid=" + this.cmbSearchCustomer + ' OR sf.dfclientid=' + this.cmbSearchCustomer +") and sf.mediatype='" + this.cmbSearchMediaType +"' group by  sf.formatname";
    this.loading = true;
    await this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.SearchFormatList = JSON.parse(returnData);
          this.loading = false;
          this.SearchContent();
          //this.SearchContent();
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  SaveModifyInfo(tokenid, ModifyText) {
    this.sfService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }
  open(content, tid) {
    localStorage.setItem('tokenid', tid);
    this.modalService.open(content, { size: 'lg', windowClass: 'tokenmodal' });
  }
  tokenInfoClose() {
    this.FillTokenInfo(this.cid);
    this.modalService.dismissAll();
  }
  getSelectedRows() {
    this.TokenList.forEach((itemList) => {
      if (this.FindRecords(itemList.tokenid).length != 0) {
        itemList.check = true;
      }
    });
  }
  FindRecords(Id) {
    var NewList = [];
    NewList = this.TokenSelected.filter((order) => order.tokenId == Id);
    return NewList;
  }
  FillCountry() {
    this.CountrySettings = {
      singleSelection: false,
      text: 'Select Country',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
    };
    this.CountryList = [];

    this.loading = true;
    var qry =
      'select distinct  countrycodes.countrycode as Id, countrycodes.countryname  as DisplayName from AMPlayerTokens';
    qry +=
      '  inner join countrycodes on countrycodes.countrycode =  AMPlayerTokens.countryid ';
    qry += ' where clientid = ' + this.cid;
    this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CountryList = JSON.parse(returnData);
          this.loading = false;
          this.FillGroup();
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }

  SelectedCountryArray = [];

  onItemSelectCountry(item: any) {
    //this.SelectedCountryArray.push(item);
    this.chkAll = false;
    this.searchText = '';
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    if (this.SelectedCountryArray.length == 0) {
      this.StateList = [];
      this.CityList = [];
      this.SelectedCountryArray = [];
      return;
    }
    var ret = this.ReturnFncAddId(this.SelectedCountryArray);
    this.FillState(ret);
  }
  onItemDeSelectCountry(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    this.SelectedCountryArray = this.removeDuplicateRecordFilter(
      item,
      this.SelectedCountryArray
    );
    if (this.SelectedCountryArray.length == 0) {
      this.StateList = [];
      this.SelectedCountryArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var ret = this.ReturnFncAddId(this.SelectedCountryArray);
    this.FillState(ret);
    var FilterValue = this.ReturnFncAddId(this.SelectedCountryArray);
    this.FilterTokenInfo(FilterValue, 'CountryId');
  }
  removeDuplicateRecordFilter(array, SelectedArray) {
    return (SelectedArray = SelectedArray.filter(
      (order) => order.Id !== array.Id
    ));
  }

  onSelectAllCountry(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    this.SelectedCountryArray = items;
    this.TokenList = [];
    if (this.SelectedCountryArray.length == 0) {
      this.StateList = [];
      this.SelectedCountryArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var ret = this.ReturnFncAddId(this.SelectedCountryArray);
    this.FillState(ret);
    var FilterValue = this.ReturnFncAddId(this.SelectedCountryArray);
    this.FilterTokenInfo(FilterValue, 'CountryId');
  }
  onDeSelectAllCountry(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.StateList = [];
    this.CityList = [];
    this.SelectedCountryArray = [];
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    this.TokenList = [];
    this.TokenList = this.MainTokenList;
  }

  FillState(CountryID) {
    this.StateSettings = {
      singleSelection: false,
      text: 'Select State',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
    };
    this.loading = true;
    var qry =
      'select stateid as id, statename as displayname  from tbstate where countryid in( ' +
      CountryID +
      ' ) order by statename';
    this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.StateList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  SelectedStateArray = [];
  onItemSelectState(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    this.SelectedCityArray = [];
    //this.SelectedStateArray.push(item);
    if (this.SelectedStateArray.length == 0) {
      this.TokenList = this.MainTokenList;
      this.CityList = [];
      this.SelectedStateArray = [];
      return;
    }
    var k = this.ReturnFncAddId(this.SelectedStateArray);
    this.FillCity(k);
    var FilterValue = this.ReturnFncAddId(this.SelectedStateArray);
    this.FilterTokenInfo(FilterValue, 'StateId');
  }
  onItemDeSelectState(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    this.SelectedCityArray = [];
    this.SelectedStateArray = this.removeDuplicateRecordFilter(
      item,
      this.SelectedStateArray
    );
    if (this.SelectedStateArray.length == 0) {
      this.CityList = [];
      this.SelectedStateArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var ret = this.ReturnFncAddId(this.SelectedStateArray);
    this.FillCity(ret);
    var FilterValue = this.ReturnFncAddId(this.SelectedStateArray);
    this.FilterTokenInfo(FilterValue, 'StateId');
  }
  onSelectAllState(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedStateArray = items;
    this.SelectedCityArray = [];
    this.TokenList = [];

    if (this.SelectedStateArray.length == 0) {
      this.CityList = [];
      this.SelectedStateArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var ret = this.ReturnFncAddId(this.SelectedStateArray);
    this.FillCity(ret);
    var FilterValue = this.ReturnFncAddId(this.SelectedStateArray);
    this.FilterTokenInfo(FilterValue, 'StateId');
  }

  onDeSelectAllState(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.CityList = [];
    this.SelectedStateArray = [];
    this.SelectedCityArray = [];
    this.TokenList = [];
    this.TokenList = this.MainTokenList;
  }
  FillCity(StateID) {
    this.CitySettings = {
      singleSelection: false,
      text: 'Select City',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      defaultOpen: true,
    };
    this.loading = true;
    var qry =
      'select distinct cityid as id, cityname as displayname  from tbcity where stateid in(' +
      StateID +
      ') order by cityname';
    
    this.sfService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CityList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  SelectedCityArray = [];
  onItemSelectCity(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    // this.SelectedCityArray.push(item);
    if (this.SelectedCityArray.length == 0) {
      this.SelectedCityArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedCityArray);
    this.FilterTokenInfo(FilterValue, 'CityId');
  }
  onItemDeSelectCity(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    this.SelectedCityArray = this.removeDuplicateRecordFilter(
      item,
      this.SelectedCityArray
    );
    if (this.SelectedCityArray.length == 0) {
      this.SelectedCityArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedCityArray);
    this.FilterTokenInfo(FilterValue, 'CityId');
  }
  onSelectAllCity(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedCityArray = items;
    this.TokenList = [];

    if (this.SelectedCityArray.length == 0) {
      this.SelectedCityArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedCityArray);
    this.FilterTokenInfo(FilterValue, 'CityId');
  }

  onDeSelectAllCity(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedCityArray = [];
    this.TokenList = [];
    this.TokenList = this.MainTokenList;
  }
  ReturnFncAddId(ArrayList) {
    var ReturnId = [];
    for (var i = 0; i < ArrayList.length; i++) {
      ReturnId.push(ArrayList[i].Id);
    }
    return ReturnId;
  }

  SelectedGroupArray = [];
  FillGroup() {
    this.GroupSettings = {
      singleSelection: false,
      text: 'Select City',
      idField: 'Id',
      textField: 'DisplayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
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
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }

  onItemSelectGroup(item: any) {
    //this.SelectedGroupArray.push(item);
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    if (this.SelectedGroupArray.length == 0) {
      this.SelectedGroupArray = [];
      this.TokenList = this.MainTokenList;
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);
    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onItemDeSelectGroup(item: any) {
    this.chkAll = false;
    this.searchText = '';
    this.TokenList = [];
    this.SelectedGroupArray = this.removeDuplicateRecordFilter(
      item,
      this.SelectedGroupArray
    );
    if (this.SelectedGroupArray.length == 0) {
      this.TokenList = this.MainTokenList;
      this.SelectedGroupArray = [];
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);
    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onSelectAllGroup(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedGroupArray = items;
    this.TokenList = [];
    if (this.SelectedGroupArray.length == 0) {
      this.TokenList = this.MainTokenList;
      this.SelectedGroupArray = [];
      return;
    }
    var FilterValue = this.ReturnFncAddId(this.SelectedGroupArray);

    this.FilterTokenInfo(FilterValue, 'GroupId');
  }
  onDeSelectAllGroup(items: any) {
    this.chkAll = false;
    this.searchText = '';
    this.SelectedGroupArray = [];
    this.TokenList = [];
    this.TokenList = this.MainTokenList;
  }

  FilterTokenInfo(FilterValue, FilterId) {
    var ObjLocal;
    for (var counter = 0; counter < FilterValue.length; counter++) {
      if (FilterId == 'CountryId') {
        ObjLocal = this.MainTokenList.filter(
          (order) => order.CountryId == FilterValue[counter]
        );
      }
      if (FilterId == 'StateId') {
        ObjLocal = this.MainTokenList.filter(
          (order) => order.StateId == FilterValue[counter]
        );
      }
      if (FilterId == 'CityId') {
        ObjLocal = this.MainTokenList.filter(
          (order) => order.CityId == FilterValue[counter]
        );
      }
      if (FilterId == 'GroupId') {
        ObjLocal = this.MainTokenList.filter(
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
  ForceUpdateAll() {
    var tSelected = [];
    if (this.ForceUpdateType == 'New') {
      this.TokenSelected_publish.forEach((item) => {
        tSelected.push(item.tokenId);
      });
    }
    if (this.ForceUpdateType == 'Modify') {
      tSelected.push(this.ModifyForceUpdateTokenId);
    }
    this.loading = true;
    this.serviceLicense
      .ForceUpdate(tSelected)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Update request is submit', 'Success!');
            this.SaveModifyInfo(0,'Pubish request is submitted for ' + JSON.stringify(tSelected));
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
  loadPage(e) {
    this.getSelectedRows();
  }
  TokList = [];
  applyfilter() {
    

    this.TokList = this.TokenList;
  }
  onChange() {
  }

  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }
  async AddItem() {
    
    if (this.IschkViewOnly==1){
      this.toastrSF.info('This feature is not available in view only');
      return;
    }
    if (this.SFform.value.PlaylistId == '0') {
      this.toastrSF.error('Please select a playlist name');
      return;
    }
    
    if (this.SFform.value.ScheduleType != 'PercentageSchedule') {
      var startTime = this.SFform.controls['startTime'].value['hour'];
      var EndTime = this.SFform.controls['EndTime'].value['hour'];

      if (EndTime < startTime) {
        this.toastrSF.error('End time should be greater than start time');
        return;
      }
      if (this.SFform.value.wList.length == 0) {
        this.toastrSF.error('Please select a week day');
        return;
      }
    }

    const obj = this.SFform.value;
    const pname = this.PlaylistList.filter(
      (order) => order.Id == obj['PlaylistId'].toString()
    );
    let sTime = obj['startTime'];
    let eTime = obj['EndTime'];
    let dt = new Date();
    let dt2 = new Date();
    if (this.SFform.value.ScheduleType != 'PercentageSchedule') {
      dt = new Date(
        'Mon Mar 09 2020 ' + sTime['hour'] + ':' + sTime['minute'] + ':00'
      );
      dt2 = new Date(
        'Mon Mar 09 2020 ' + eTime['hour'] + ':' + eTime['minute'] + ':00'
      );
    } else {
      dt = new Date('Mon Mar 09 2020 00:00:00');
      dt2 = new Date('Mon Mar 09 2020 23:59:00');
    }
    let ObjWeekName = '';
    let ObjWeekId = '';
    let wlist = [];

    if (this.SFform.value.ScheduleType != 'PercentageSchedule') {
      wlist = obj['wList'].sort(this.GetSortOrder('id'));
    } else {
      wlist = [
        { id: '1', itemName: 'Mon' },
        { id: '2', itemName: 'Tue' },
        { id: '3', itemName: 'Wed' },
        { id: '4', itemName: 'Thu' },
        { id: '5', itemName: 'Fri' },
        { id: '6', itemName: 'Sat' },
        { id: '7', itemName: 'Sun' },
      ];
    }

    wlist.forEach((element) => {
      if (ObjWeekName === '') {
        ObjWeekName = element['itemName'];
      } else {
        ObjWeekName = ObjWeekName + ',' + element['itemName'];
      }
      if (ObjWeekId === '') {
        ObjWeekId = element['id'];
      } else {
        ObjWeekId = ObjWeekId + ',' + element['id'];
      }
    });
    let IsTimeFind = 'No';
    let itemPercentageValue = 0;
    this.CustomSchedulePlaylist.forEach((item) => {
      itemPercentageValue = itemPercentageValue + item['PercentageValue'];
      if (
        item['sTime'] === dt.toTimeString().slice(0, 5) &&
        item['eTime'] === dt2.toTimeString().slice(0, 5) &&
        item['wName'] === ObjWeekName
      ) {
       // IsTimeFind = 'Yes';
      }
    });
    if (this.SFform.value.ScheduleType == 'Normal') {
      if (IsTimeFind === 'Yes') {
        this.toastrSF.error('Same time schedule is already in list');
        return;
      }
    }
    this.TotalPercentageValue = itemPercentageValue + obj['PercentageValue'];

    if (this.SFform.value.ScheduleType === 'PercentageSchedule') {
      if (this.TotalPercentageValue > 100) {
        this.toastrSF.error(
          'Total percentage value should not be greater than 100'
        );
        return;
      }
    } else {
      obj['PercentageValue'] = '0';
    }
    this.CustomSchedulePlaylist_ForSave=[]
    this.CustomSchedulePlaylist_ForSave=[
      {
        Id: this.CustomSchedulePlaylist.length + '' + pname[0].Id,
        pName: pname[0].DisplayName,
        splId: pname[0].Id,
        sTime: dt.toTimeString().slice(0, 5),
        eTime: dt2.toTimeString().slice(0, 5),
        wId: ObjWeekId,
        wName: ObjWeekName,
        PercentageValue: obj['PercentageValue'],
        volume :obj['volume'],
        FormatId :obj['FormatId']

      }
    ]
    this.CustomSchedulePlaylist = [
      ...this.CustomSchedulePlaylist,
      {
        Id: this.CustomSchedulePlaylist.length + '' + pname[0].Id,
        pName: pname[0].DisplayName,
        splId: pname[0].Id,
        sTime: dt.toTimeString().slice(0, 5),
        eTime: dt2.toTimeString().slice(0, 5),
        wId: ObjWeekId,
        wName: ObjWeekName,
        PercentageValue: obj['PercentageValue'],
        volume :obj['volume'],
        FormatId :obj['FormatId']

      },
    ];
    this.SFform.controls['PlaylistId'].setValue('0');
    this.SFform.controls['PercentageValue'].setValue('0');
    let wobj=[]
    this.SFform.controls['wList'].setValue(wobj);
    
    await this.SaveMasterSchedule()
    /*
    this.PlaylistList =[];
    this.MainPlaylistList.forEach(CSP => {

      const obj = this.CustomSchedulePlaylist.filter(d => d.splId === CSP["Id"]);
    if (obj.length === 0){
      this.PlaylistList.push(CSP);
    }
    });
    */
  }
  RemoveItem(id) {
    this.CustomSchedulePlaylist = this.CustomSchedulePlaylist.filter(
      (d) => d.Id !== id
    );
    /*
    this.PlaylistList =[];
    this.MainPlaylistList.forEach(CSP => {
      const obj = this.CustomSchedulePlaylist.filter(d => d.splId === CSP["Id"]);
    if (obj.length === 0){
      this.PlaylistList.push(CSP);
    }
    });
    */
  }

  onChangeScheduleType(e) {
    if (this.cmbMediaType != '') {
      this.CustomSchedulePlaylist = [];
      this.TotalPercentageValue = 0;
      //this.FillTokenInfo(this.cid);
    }
  }
 
  ResetNormalControls(){
    this.ScheduleList = [];
    this.dropdownSettings = {};
    this.dropdownList = [];
    this.selectedItems = [];
    this.submitted = false;
    this.loading = false;
    this.TokenSelected = [];
    this.TokenList = [];
    this.MainTokenList = [];
    this.CustomerList =[];
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.SearchFormatList = [];
    this.FormatList = [];
    this.page  = 1;
    this.pageSize= 50;
    this.pageSearch  = 1;
    this.pageSizeSearch  = 20;
    this.dt = new Date('Mon Mar 09 2020 00:00:00');
    this.dt2 = new Date('Mon Mar 09 2020 23:59:00');
    this.cmbSearchCustomer = "0";
    this.cmbSearchFormat = 0;
    this.cmbSearchPlaylist = 0;
  
    this.pSchid = 0;

    this.cid;
    this.CountryList = [];
    this.CountrySettings = {};
    this.StateList = [];
    this.StateSettings = {};
    this.CityList = [];
    this.CitySettings = {};
    this.GroupList = [];
    this.GroupSettings = {};
    this.ForceUpdateType = '';
    this.searchText  = '';
    this.chkAll  = false;
    this.cmbMediaType = '';
    this.MediaTypeList = [];
    this.cmbSearchMediaType;
    this.SearchMediaTypeList = [];
    this.CustomSchedulePlaylist = [];
    this.TotalPercentageValue = 0;

    
    this.SFform = this.formBuilder.group({
      CustomerId: ['0', Validators.required],
      FormatId: ['0', Validators.required],
      PlaylistId: ['0', Validators.required],
      startTime: [this.dt, Validators.required],
      EndTime: [this.dt2, Validators.required],
      startDate: [this.dt, Validators.required],
      EndDate: [this.dt2, Validators.required],
      wList: [this.selectedItems, Validators.required],
      TokenList: [this.TokenSelected],
      lstPlaylist: [this.CustomSchedulePlaylist],
      ScheduleType: ['Normal', Validators.required],
      PercentageValue: ['0'],
      volume: ['90'],
    });
    this.time = {
      hour: this.dt.getHours(),
      minute: this.dt.getMinutes(),
      second: 0,
    };
    this.SFform.get('startTime').setValue(this.time);
    this.time = {
      hour: this.dt2.getHours(),
      minute: this.dt2.getMinutes(),
      second: 0,
    };
    this.SFform.get('EndTime').setValue(this.time);

    this.frmTokenInfoModifyPlaylist = this.formBuilder.group({
      ModifyPlaylistName: [''],
      ModifyStartTime: [''],
      ModifyEndTime: [''],
      pschid: [''],
    });
    this.ScheduleList = [];

    this.TokenList = [];
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
      itemsShowLimit: 4,
    };

    this.FillClient();
  }

  async PublishSchedule(){
         
          
    if (this.cmbPublishId=="0"){
      this.toastrSF.info('Please set publish schedule');
      return;
    }
    var tSelected = [];
    if (this.ForceUpdateType == 'New') {
      this.TokenSelected_publish.forEach((item) => {
        tSelected.push(item.tokenId);
      });
    }
    if (this.ForceUpdateType == 'Modify') {
      tSelected.push(this.ModifyForceUpdateTokenId);
    }
    this.loading = true;
    this.serviceLicense.SavePublishToken(this.cmbPublishId,tSelected).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Update request is submit', 'Success!');
            this.SaveModifyInfo(0,'Pubish schedule is submitted for ' + JSON.stringify(tSelected));
            this.loading = false;
          } else {
            this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
GetPublishSchedule(){
  let cid= this.SFform.get('CustomerId').value
var qry = "select id as Id,publishHr as DisplayName from tbPublishSchedule where clientid= "+cid+" "
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
OpenViewContent(modalName, url,oType,MediaType){
  if (MediaType!="Url"){
    window.open(url, '_blank'); 
    return
  }
  
      localStorage.setItem("ViewContent",url)
      localStorage.setItem("oType",oType)
      if (oType=="496"){
        this.modalService.open(modalName, {
          size: 'lgx',
        }); 
      }
      if (oType=="495"){
        this.modalService.open(modalName,{
          size: 'smg'
        }); 
      }
      
    }
    FillPlaylistSongs(fileid) {
      this.loading = true;
      this.HoteltvPlaylistSize =0
      this.pService
        .PlaylistSong(fileid, 'No')
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            obj.forEach(item => {
              this.HoteltvPlaylistSize += Number(item.FileSize)
            });
            this.PlaylistSongsList = obj;
            if (Number(this.HoteltvPlaylistSize) <= Number(this.HoteltvPlaylistLimit)){
              this.ShowLimitSubmitButton= true
            }
            this.loading = false;
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
    openTitleDeleteModal(mContent, id) {
      if (this.IschkViewOnly==1){
        this.toastrSF.info('This feature is not available in view only');
        return;
      }
  
      if (id == 0) {
          this.toastrSF.info('Please select a title', '');
          return;
      }
      this.DeleteContentId = id;
      this.modalService.open(mContent);
      this.flocationElement.nativeElement.focus();
    }
    async DeleteTitle() {
      this.loading = true;
      var tid = []
      tid.push(this.DeleteContentId)
      this.pService
        .DeleteTitle(this.FilterPlaylistId, tid, 'No')
        .pipe()
        .subscribe(
          async (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce == '1') {
              this.toastrSF.info('Deleted', 'Success!');
              this.loading = false;
              await this.FillPlaylist(this.SFform.value.FormatId , '');
              this.FillPlaylistSongs(this.FilterPlaylistId)
            } else {
              this.toastrSF.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
            }
            this.loading = false;
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
    onChangeDeviceType(e) {
      if (this.cmbDeviceType === 'HotelTv') {
        this.TokenList= []
        this.TokenList = this.MainTokenList.filter(
          (order) => order.DeviceType == this.cmbDeviceType
        );
      }
      if (this.cmbDeviceType === 'Sanitizer') {
        this.TokenList= []
        this.TokenList = this.MainTokenList.filter(
          (order) => order.DeviceType == this.cmbDeviceType
        );
      }

      if (this.cmbDeviceType === 'All') {
        this.TokenList= []
        this.TokenList = this.MainTokenList
      }
      if ( this.cmbDeviceType === 'Screen') {
        this.TokenList= []
        this.TokenList = this.MainTokenList.filter(
          (order) => order.DeviceType !== 'HotelTv' && order.DeviceType !== 'Sanitizer'
        );
      }
    }
    TokenList_Search_Assign
    onChangeEvent_TokenSearch(){
      this.TokenList_Search_Assign = this.TokenList.filter(country => this.serviceLicense.matches(country, this.searchText, this.pipe));
      const total = this.TokenList_Search_Assign.length;
      if (this.searchText === ""){
        this.chkAll = false
      }
    }
    async onChangeSearch_SignageCustomer(id) {
      this.cmbSearch_SignageCustomer= id
      this.cmbSignageContentId=0
      this.SignageContentList = [];
      await this.GetSignageContent();
    }
    GetSignageContent() {
      if (this.cmbSearch_SignageCustomer == "0") {
        this.toastrSF.error('Select a customer', '');
        return;
      }
      this.loading = true;
      this.SignageContentList=[]
        this.sfService.GetClientSignageContent(this.cmbSearch_SignageCustomer).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.data !=''){
            this.SignageContentList = JSON.parse(obj.data)
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
    }
    async onChangeSignageContent(id) {
      this.cmbSignageContentId= id
      this.SignageContentPlayerList = [];
      await this.GetSignageContentPlayerList();
    }
    GetSignageContentPlayerList() {
      if (this.cmbSignageContentId == 0) {
       // this.toastrSF.error('Select a Content', '');
        return;
      }
      this.loading = true;
      this.SignageContentPlayerList=[]
        this.sfService.GetSignageContentPlayers(this.cmbSignageContentId).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.data !=''){
            this.SignageContentPlayerList = JSON.parse(obj.data)
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
    }
  lblUpperMsg = '';
  ForceAction = 'No';
  openTitleDeleteModalOwn(mContent) {
    if (this.IschkViewOnly==1){
      this.toastrSF.info('This feature is not available in view only');
      return;
    }
    this.lblUpperMsg = 'Are you sure to delete?';
    this.ForceAction = 'No';
    this.modalService.open(mContent);
  }
  DeleteTitleOwn(ForceDelete) {
    this.loading = true;
    this.pService
      .DeleteTitleOwn(this.cmbSignageContentId.toString(), ForceDelete)
      .pipe()
      .subscribe(
        async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Deleted', 'Success!');
            this.loading = false;
            this.ForceAction = 'No';
            this.modalService.dismissAll();
            this.cmbSignageContentId=0
            this.SignageContentPlayerList=[]
            await this.GetSignageContent();
          } else if (obj.Responce == '2') {
            this.lblUpperMsg =
              'This title is assigned to playlists. Would you like contiue delete ?';
            this.loading = false;
            this.ForceAction = 'Yes';
          } else {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
          this.loading = false;
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  SignageContent_OpenViewContent(modalName){
    let obj= this.SignageContentList.filter(o=> o.TitleID==this.cmbSignageContentId)
    let url,genreId= obj[0].GenreId.toString(),MediaType= obj[0].MediaType.toString(), ext=".mp4"

    let oType="LS"
  if (genreId =="303"){
    oType="PT"
  }
  if (genreId =="324"){
    oType="PT"
  }
  if (MediaType == "Audio")
  {
    ext = ".mp3";
  }
  if (MediaType == "Video")
  {
    ext = ".mp4";
  }
  if (MediaType == "Image")
  {
    ext = ".jpg";
  }
  url =  "https://applicationaddons.com/mp3files/" + this.cmbSignageContentId  + ext;
  if (MediaType == "Url")
  {
    url=obj[0].url.toString()
  }
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType",oType)
    localStorage.setItem("mViewType",MediaType)
    
    if (oType=="LS"){
      this.modalService.open(modalName, {
        size: 'Template',
      }); 
    }
    if (oType=="PT"){
      this.modalService.open(modalName,{
        size: 'PT-Template'
      }); 
    }
        
      }
    openMasterScheduleModal(modalName){
      if (this.cmbCustomer_MasterSchedule=="0"){
        return
      }
      this.modalService.open(modalName);
      
    }
    PublishScheduleToDevices(){
      this.loading = true;
      setTimeout(() => { 
        this.loading = false;
        this.toastrSF.info("Schedules successfully published to device")
       }, 5000);
    }
    async openPlaylistScheduleModal(modalName,id){
      if (this.cid=="0"){
        return
      }
      const obj= this.CustomSchedulePlaylist.filter(o => o.Id==id)
      await this.FillFormat()
      if (obj.length>0){
      const sTime= new Date("1900-01-01 "+obj[0].sTime)
      const etime= new Date("1900-01-01 "+obj[0].eTime)
      var startime: NgbTimeStruct = { hour: sTime.getHours(), minute: sTime.getMinutes(), second: 0 };
      var endtime: NgbTimeStruct = { hour: etime.getHours(), minute: etime.getMinutes(), second: 0 };

      await this.onChangeFormat(obj[0].FormatId, '')
      this.SFform.get('startTime').setValue(startime);
      this.SFform.get('EndTime').setValue(endtime);
      this.SFform.get('volume').setValue(obj[0].volume);
      let week = obj[0].wId.toString().split(",")
      let wid=[]
      for (let index = 0; index < week.length; index++) {
        wid.push(
          {
           id: week[index],
           itemName:this.getWeekName(week[index])
        })
      }
      
      this.SFform.get('wList').setValue(wid)
      setTimeout(() => { 
        this.SFform.get('FormatId').setValue(obj[0].FormatId);
        this.SFform.get('PlaylistId').setValue(obj[0].splId);
       }, 2000); 
    }
      this.EditPschId=id
      
      this.modalService.open(modalName);
      
    }
    PlaylistScheduleClose(){
      this.EditPschId ="0"
    }
    onSubmitNewMasterSchedule(){
      if (this.NewMasterScheduleName == '') {
        this.toastrSF.info('Schedule name cannot be blank', '');
        return;
      }
  
      this.pService
        .SaveMasterScheduleName('0',this.NewMasterScheduleName,this.cmbCustomer_MasterSchedule,this.chkOverwritemanual)
        .pipe()
        .subscribe(
          async (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce != '-2') {
              this.toastrSF.info('Saved', 'Success!');
              this.loading = false;
              this.chkOverwritemanual=false
              await this.FillMasterSchedule(this.cmbCustomer_MasterSchedule);
              await this.openMasterScheduleDetail(obj.Responce,this.NewMasterScheduleName)
              this.NewMasterScheduleName = '';
              this.modalService.dismissAll()
            } else if (obj.Responce == '-2') {
              this.toastrSF.info('This schedule name already exists', '');
            } else {
              this.toastrSF.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
              this.loading = false;
            }
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
  
    }
    FillMasterSchedule(id) {
      this.MasterSchedulelist=[]
      this.MasterSchedulelist_Overview=[]
      var q = '';
      var q ='select id as id , name as displayname  from tbMasterSchedule where dfclientid='+id+' order by id'
      this.loading = true;
      this.sfService.FillCombo(q).pipe().subscribe((data) => {
            var returnData = JSON.stringify(data);
            this.MasterSchedulelist = JSON.parse(returnData);
            this.MasterSchedulelist_Overview = JSON.parse(returnData);
            this.loading = false;
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
    async onChangeCustomer_MasterSchedule(id){
      await this.FillMasterSchedule(id)
    }
    async openMasterScheduleDetail(id,name){
      this.ngbNavActiveTabId=4
      this.txtMasterScheduleName = name
      this.cmbMasterSchedule=id
      await this.onChangeCustomer(this.cmbCustomer_MasterSchedule)
      this.SFform.get('CustomerId').setValue(this.cmbCustomer_MasterSchedule);
      this.CustomSchedulePlaylist=[]
      await this.GetMasterScheduleDetail(id)
    }
    GetMasterScheduleDetail(id){
      this.loading = true;
      let mediatype=""
      let SchedulePlaylist=[]
      let player
      this.sfService.GetMasterScheduleDetail(id,this.cmbCustomer_MasterSchedule,localStorage.getItem('UserId')).pipe().subscribe(async (data) => {
            var returnData = JSON.stringify(data);
            var objData = JSON.parse(returnData);
            if (objData.response=="0"){
              this.MasterScheduleType=""
              this.MasterScheduleTokenInfoList=[]
              this.CustomSchedulePlaylist=[]
              return
            }
            let obj = JSON.parse(objData.data)
            obj.forEach(item => {
              let arr={}
              let wid=""
              let wname=""
              let week= JSON.parse(item["week"])
              week.forEach(itemWeek => {
                if (wid==""){
                  wid=itemWeek["wId"]
                  wname=this.getWeekName(itemWeek["wId"])
                }
                else{
                  wid= wid+","+itemWeek["wId"]
                  wname= wname+","+this.getWeekName(itemWeek["wId"])
                }
              });
              let schedule= JSON.parse(item["schedule"])
              player= JSON.parse(item["player"])
              
              
              mediatype=schedule[0].mediatype
              this.MasterScheduleType=""
              this.MasterScheduleType=schedule[0].ScheduleType
              arr["Id"]= schedule[0].pSchId
              arr["pName"]= schedule[0].splplaylistname
              arr["splId"]= schedule[0].splPlaylistId
              arr["sTime"]= new Date(schedule[0].StartTime).toTimeString().slice(0, 5)
              arr["eTime"]= new Date(schedule[0].EndTime).toTimeString().slice(0, 5)
              arr["wId"]= wid,
              arr["wName"]= wname,
              arr["PercentageValue"]= schedule[0].PercentageValue
              arr["volume"]=schedule[0].volume
              arr["FormatId"]=schedule[0].FormatId

              SchedulePlaylist.push(arr)
            });
            this.MasterScheduleTokenInfoList=[]
            this.MasterScheduleTokenInfoList= player
            this.loading = false;
            //this.cmbMediaType=mediatype
            this.CustomSchedulePlaylist= SchedulePlaylist
            this.TokenSelected=[]
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
    getWeekName(id){
      if (id== '1'){
        return 'Mon'
      }
      if (id== '2'){
        return 'Tue'
      }
      if (id== '3'){
        return 'Wed'
      }
      if (id== '4'){
        return 'Thu'
      }
      if (id== '5'){
        return 'Fri'
      }
      if (id== '6'){
        return 'Sat'
      }
      if (id== '7'){
        return 'Sun'
      }
    }
    async openAssignScheduleModal(modalName){
      if (this.cid=="0"){
        return
      }
      if (this.CustomSchedulePlaylist.length==0){
        return
      }
      this.modalService.open(modalName, {
        size: 'lg',
        windowClass: 'tokenmodal',
      });
      this.TokenList = [];
      this.MainTokenList = [];
      await this.GetCustomerMediaType(this.cid, 'New');
    }
    public getField = (args: any) => {
      return `${args.city}_${args.location}_${args.MediaType}_${args.gName}_${args.tokenCode}`;
    }
    public onPlayerFilter(inputValue: string): void {
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

    SaveMasterSchedule(){
      this.SFform.controls['TokenList'].setValue([]);
      var sTime = this.SFform.value.startTime;
      var eTime = this.SFform.value.EndTime;
  
      var dt = new Date(
        'Mon Mar 09 2020 ' + sTime['hour'] + ':' + sTime['minute'] + ':00'
      );
      var dt2 = new Date(
        'Mon Mar 09 2020 ' + eTime['hour'] + ':' + eTime['minute'] + ':00'
      );
  
      this.SFform.get('startTime').setValue(dt.toTimeString().slice(0, 5));
      this.SFform.get('EndTime').setValue(dt2.toTimeString().slice(0, 5));
  
      this.SFform.controls['lstPlaylist'].setValue(this.CustomSchedulePlaylist_ForSave);
      var startDate = new Date(this.SFform.value.startDate);
      var EndDate = new Date(this.SFform.value.EndDate);
  
      this.SFform.get('startDate').setValue(startDate.toDateString());
      this.SFform.get('EndDate').setValue(EndDate.toDateString());
      if (this.SFform.value.ScheduleType === 'PercentageSchedule') {
        if (this.TotalPercentageValue < 100) {
          this.toastrSF.error(
            'Total percentage value should  be greater than or equal to 100'
          );
          return;
        }
      }
      this.SFform.get('MasterScheduleId').setValue(this.cmbMasterSchedule);
      this.SFform.get('mediatype').setValue(this.cmbMediaType);
      
      this.TokenSelected_publish=[];
      this.loading = true;
      this.sfService
        .SaveMasterSchedule(this.SFform.value)
        .pipe()
        .subscribe(
          async (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce == '1') {
              this.toastrSF.info('Saved', 'Success!');
              this.loading = false;
              this.chkAll = false;
              
              
              this.CustomSchedulePlaylist_ForSave=[]
              this.MasterScheduleType=this.SFform.value.ScheduleType
              this.SFform.get('startTime').setValue(sTime);
              this.SFform.get('EndTime').setValue(eTime);
              this.SFform.get('startDate').setValue(this.dtDate);
              this.SFform.get('EndDate').setValue(this.dtDate);
              await this.GetMasterScheduleDetail(this.cmbMasterSchedule)
              
              if (this.EditPschId!="0"){
                this.modalService.dismissAll()
              }
              this.EditPschId="0"
     
  
            } else {
              this.toastrSF.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
              this.loading = false;
            }
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
    
    DeleteMasterSchedule() {
      this.loading = true;
      this.sfService
        .DeleteMasterSchedule(this.cmbMasterSchedule,this.cmbCustomer_MasterSchedule,this.DeleteOption,this.pSchid)
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.response=="1"){
              if (this.DeleteOption=="Playlist"){
                this.CustomSchedulePlaylist = this.CustomSchedulePlaylist.filter(
                  (d) => d.Id !== this.pSchid
                );
              }
              if (this.DeleteOption=="Player"){
                this.MasterScheduleTokenInfoList = this.MasterScheduleTokenInfoList.filter(
                  (d) => d.TokenID !== this.pSchid
                );
              }
              this.pSchid = 0;
              this.DeleteOption=""
              this.toastrSF.info("Deleted", '');
            } else {
              this.toastrSF.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
            }
            this.loading = false;
          },
          (error) => {
            this.toastrSF.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    }
}
