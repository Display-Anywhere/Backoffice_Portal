import { Component, OnInit, ViewContainerRef,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  NgbModalConfig,
  NgbModal,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { TokenInfoServiceService } from './token-info-service.service';
import { MachineService } from '../machine-announcement/machine.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SerCopyDataService } from 'src/app/copy-data/ser-copy-data.service';

@Component({
  selector: 'app-token-info',
  templateUrl: './token-info.component.html',
  styleUrls: ['./token-info.component.css'],
})
export class TokenInfoComponent implements OnInit {
  TokenInfo: FormGroup;
  submitted = false;
  chkIndicatorBox: boolean = false;
  chkShotMsg: boolean = false;
  chkShowKeyboard=false;
  public loading = false;
  CountryList = [];
  StateList = [];
  CityList = [];
  GroupList = [];
  tid: string = '';
  scheduleList = [];
  futureSchList=[];
  ModifySchList = [];
  adList = [];
  prayerList = [];
  AdsPlaylist = [];
  shortmonths: Array<string>;
  TokenInfoModifyPlaylist: FormGroup;
  StateName = '';
  DelpSchid;
  SongsList = [];
  LogoId;
  ModalType;
  NewName;
  ModifyStateName;
  ModifyStateId = '0';
  ModifyCityId = '0';
  HeaderText;
  CommonId;
  citName;
  Country_Id = '0';
  ModifyGroupId = '0';
  ModifyGroupName = '';
  ClientId = 0;
  dropdownSettings = {};
  dropdownList = [];
  selectedItems = [];
  AnnoId;
  PlaylistSongsList;
  APKPlaylist;
  chkScreen: boolean = false;
  chkSanitizer: boolean = false;
  chkTTL: boolean = false;
  chkKeyboard: boolean = false;
  chkKeyboardScreen: boolean = false;
  chkBlankComType: boolean = true;
  chkCopyright: boolean = false;
  chkDL: boolean = false;
  KeyboardPlaylist = [];
  keyboardId;
  EmergencyList = [];
  EmgAlertId;
  ScheduleType="";
  ClientContentType="";
  IschkViewOnly=0;
  clid=""
  prvGroupId="0";
  ScheduleList=[]
  @ViewChild('flocation') flocationElement: ElementRef;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private tService: TokenInfoServiceService,
    private mService: MachineService,
    public auth: AuthService,
    private serviceLicense: SerLicenseHolderService,private cService: SerCopyDataService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.clid = localStorage.getItem('dfClientId');
    this.shortmonths = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    this.dropdownList = [
      { id: '80', itemName: '80%' },
      { id: '85', itemName: '85%' },
      { id: '90', itemName: '90%' },
      { id: '95', itemName: '95%' },
      { id: '100', itemName: '100%' },
    ];

    this.tid = localStorage.getItem('tokenid');
    this.dropdownSettings = {
      singleSelection: false,
      text: '',
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'All',
      unSelectAllText: 'All',
      itemsShowLimit: 2,
    };
    this.TokenInfo = this.formBuilder.group({
      Tokenid: [this.tid],
      token: [''],
      personName: [''],
      country: [''],
      state: [''],
      city: [''],
      street: [''],
      location: [''],
      ExpiryDate: [''],
      PlayerType: ['Android'],
      LicenceType: [''],
      chkMediaType: [''],
      chkuserRights: ['', Validators.required],
      chkType: ['', Validators.required],
      TokenNoBkp: [''],
      DeviceId: [''],
      ScheduleType: [''],
      chkIndicator: [false],
      GroupId: [0],
      Rotation: ['0'],
      CommunicationType: [''],
      DeviceType: [''],
      DispenserAlert: [this.selectedItems],
      TotalShot: [0],
      AlertMail: [''],
      IsShowShotToast: [false],
      OsVersion:[''],
      isShowKeyboardToast: [false],
      dfclientid: ["0"],
      IsCheckGroupSchedule:[false]
    });
    this.TokenInfoModifyPlaylist = this.formBuilder.group({
      ModifyPlaylistName: [''],
      ModifyStartTime: [],
      ModifyEndTime: [],
      pschid: [''],
      PercentageValue:[0]
    });
    this.FillCountry();
    this.scheduleList = [];
    this.adList = [];
    this.prayerList = [];
    this.FillTokenInfo();
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  }
  get f() {
    return this.TokenInfo.controls;
  }

  onSubmitTokenInfo = function () {

    
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.TokenInfo.invalid) {
      return;
    }
    // var date = new Date(this.TokenInfo.value.ExpiryDate);
    //var FromDateS = (date.getDate() + '-' + this.shortmonths[date.getMonth()] + '-' + date.getFullYear());

    
    const frm= this.TokenInfo.value;
if (frm['chkMediaType']==='Audio'){
  frm['DeviceType']="";
  if ( frm['LicenceType']===''){
  frm['LicenceType']="Copyright";
  }
}
if (frm['chkMediaType']==='Video'){
  frm['DeviceType']="Screen";
  frm['LicenceType']="Copyright";
}
if (frm['chkMediaType']===''){
  frm['DeviceType']="";
  frm['LicenceType']="";
}
frm['IsCheckGroupSchedule']=false;

if (this.prvGroupId != frm['GroupId']){
  frm['IsCheckGroupSchedule']=true;
}
if (frm['GroupId']=='0'){
  frm['IsCheckGroupSchedule']=false;
}

 
this.submitted = true;this.loading = true;
    this.tService
      .SaveTokenInfo(this.TokenInfo.value)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
             
            this.SaveModifyInfo(
              this.TokenInfo.value.Tokenid,
              'Token information is modify'
            );
            this.modalService.dismissAll('Cross click');
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
          this.auth.isTokenInfoClose$.next(true);
          this.loading = false;
          if ((this.prvGroupId != frm['GroupId']) && (obj.lstPlaylistSch.length!=0)){
            this.ScheduleList= obj.lstPlaylistSch
            this.SaveSchedule();
          }
          else{
            this.toastr.info('Saved', 'Success!');
            this.modalService.dismissAll('Cross click');
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
  };
  SaveModifyInfo(tokenid, ModifyText) {
    this.tService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }

  openModal(content, pname, pschid, stime, eTime,PercentageValue) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    var t = '1900-01-01 ' + stime;
    var t2 = '1900-01-01 ' + eTime;
    var dt = new Date(t);
    var dt2 = new Date(t2);

    var time: NgbTimeStruct = { hour: dt.getHours(), minute: dt.getMinutes(), second: 0 };
    var time2: NgbTimeStruct = { hour: dt2.getHours(), minute: dt2.getMinutes(), second: 0 };
    this.TokenInfoModifyPlaylist = this.formBuilder.group({
      ModifyPlaylistName: [pname],
      ModifyStartTime: [time],
      ModifyEndTime: [time2],
      pschid: [pschid],
      PercentageValue:[PercentageValue]
    });
    this.modalService.open(content, { centered: true });
  }
  onSubmitTokenInfoModifyPlaylist(UpdateModel) {
    //this.loading = true;
    var sTime = this.TokenInfoModifyPlaylist.value.ModifyStartTime;
    var eTime = this.TokenInfoModifyPlaylist.value.ModifyEndTime;

    const dt = new Date('Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00');
    const dt2 = new Date('Mon Mar 09 2020 ' + eTime.hour + ':' + eTime.minute + ':00');

    var pschid = this.TokenInfoModifyPlaylist.value.pschid;
    var PercentageValue= this.TokenInfoModifyPlaylist.value.PercentageValue;
    this.tService
      .UpdateTokenSch(
        pschid,
        dt.toTimeString().slice(0, 5),
        dt2.toTimeString().slice(0, 5),PercentageValue
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.SaveModifyInfo(
              this.TokenInfo.value.Tokenid,
              'Token schedule time is modify and schedule id is ' + pschid
            );

            this.FillTokenInfo();
            this.modalService.open(UpdateModel, { centered: true });
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

  ResetToken() {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.tService
      .ResetToken(this.TokenInfo.value.Tokenid, this.TokenInfo.value.TokenNoBkp)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Token Reset', 'Success!');
            this.SaveModifyInfo(this.TokenInfo.value.Tokenid, 'Token is reset');
            this.loading = false;
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
  FillCountry() {
    this.loading = true;
    var qry =
      'select countrycode as id, countryname as displayname from countrycodes';
    this.tService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CountryList = JSON.parse(returnData);
          //this.loading=false;
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
  onChangeCountry(CountryID) {
    this.Country_Id = CountryID;
    this.CityList=[];
    this.StateList=[];
    const frm= this.TokenInfo.value;
    frm['city']="0";
    frm['state']="0";
    frm['street']="";
    this.FillState(CountryID);
  }
  FillState(CountryID) {
    this.loading = true;
    this.TokenInfo.get('state').setValue("0");
    this.ModifyStateId="0";
    this.ModifyStateName=""
    this.StateList=[];
    var qry =
      'select stateid as id, statename as displayname  from tbstate where countryid = ' +
      CountryID +
      ' order by statename';
    this.tService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.StateList = JSON.parse(returnData);
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
  onChangeState(StateID) {
    var ArrayItem = {};
    ArrayItem['Id'] = StateID;
    ArrayItem['DisplayName'] = '';
    this.NewFilterList = [];
    this.ModifyStateName=""
    this.GetJSONRecord(ArrayItem, this.StateList);
    if (this.NewFilterList.length > 0) {
      this.ModifyStateName = this.NewFilterList[0].DisplayName;
    }
    this.ModifyStateId = StateID;
    this.FillCity(StateID);
  }
  FillCity(StateID) {
    this.loading = true;
    this.TokenInfo.get('city').setValue("0");
    this.ModifyCityId="0";
    this.citName="";
    var qry =
      'select cityid as id, cityname as displayname  from tbcity where stateid = ' +
      StateID +
      ' order by cityname';
    this.tService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CityList = JSON.parse(returnData);
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
  FillTokenInfo() {
    this.loading = true;

    this.tService
      .FillTokenContent(this.tid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.chkSanitizer = false;
          this.chkScreen = false;
          this.chkTTL = false;
          this.chkKeyboard = false;
          this.chkKeyboardScreen = false;
          this.chkBlankComType = true;
          this.chkCopyright = false;
          this.chkDL = false;

          this.scheduleList = obj.lstPlaylistSch;
          this.adList = obj.lstAds;
          this.prayerList = obj.lstPrayer;
          this.AdsPlaylist= obj.lstAdsPlaylist;
          this.APKPlaylist = obj.APKPlaylist;
          this.futureSchList = obj.lstfutureSchList
          if (obj.lstTokenData == null) {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            return;
          }
          var objTdata = JSON.stringify(obj.lstTokenData);

          var objTokenData = JSON.parse(objTdata);

          var d = new Date(objTokenData[0].ExpiryDate);
          this.onChangeCountry(objTokenData[0].country);
          this.onChangeState(objTokenData[0].state);
          var PlayerType;
          if (objTokenData[0].PlayerType == '') {
            PlayerType = 'Android';
          } else {
            PlayerType = objTokenData[0].PlayerType;
          }
          this.selectedItems = objTokenData[0].DispenserAlert;
          this.ClientContentType = objTokenData[0].ClientContentType;
          this.prvGroupId=objTokenData[0].GroupId

          setTimeout(() => {  this.TokenInfo = this.formBuilder.group({
            Tokenid: [this.tid],
            token: [objTokenData[0].token],
            personName: [objTokenData[0].personName],
            country: [objTokenData[0].country],
            state: [objTokenData[0].state],
            city: [objTokenData[0].city],
            street: [objTokenData[0].street],
            location: [objTokenData[0].location],
            ExpiryDate: [d],
            PlayerType: [PlayerType],
            LicenceType: [objTokenData[0].LicenceType],
            chkMediaType: [objTokenData[0].chkMediaType],
            chkuserRights: [objTokenData[0].chkuserRights, Validators.required],
            chkType: [objTokenData[0].chkType, Validators.required],
            TokenNoBkp: [objTokenData[0].TokenNoBkp],
            DeviceId: [objTokenData[0].DeviceId],
            ScheduleType: [objTokenData[0].ScheduleType],
            chkIndicator: [objTokenData[0].Indicator],
            GroupId: [objTokenData[0].GroupId],
            Rotation: [objTokenData[0].Rotation],
            CommunicationType: [objTokenData[0].CommunicationType],
            DeviceType: [objTokenData[0].DeviceType],
            //DispenserAlert:[objTokenData[0].DispenserAlert],
            DispenserAlert: [this.selectedItems],
            TotalShot: [objTokenData[0].TotalShot],
            AlertMail: [objTokenData[0].AlertMail],
            IsShowShotToast: [objTokenData[0].IsShowShotToast],
            OsVersion:[objTokenData[0].OsVersion],
            isShowKeyboardToast: [objTokenData[0].isShowKeyboardToast],
            dfclientid: [objTokenData[0].ClientId],
            IsCheckGroupSchedule:[false]
          }); }, 500);       
         
          this.chkIndicatorBox = objTokenData[0].Indicator;
          this.chkShotMsg = objTokenData[0].IsShowShotToast;
          this.chkShowKeyboard = objTokenData[0].isShowKeyboardToast;
          this.ClientId = objTokenData[0].ClientId;
          this.ModifyStateId = objTokenData[0].state;
          this.ModifyCityId = objTokenData[0].city;
          this.ModifyStateName = objTokenData[0].StateName;
          this.citName = objTokenData[0].CityName;

          this.ModifyGroupId = objTokenData[0].GroupId;
          this.ModifyGroupName = objTokenData[0].GroupName;

          this.FillGroup();
          this.loading = false;

          this.onChangeSchedule(objTokenData[0].ScheduleType);
          this.GetMachineAnnouncement();

          this.TokenInfo.get('DeviceType').setValue(objTokenData[0].DeviceType);
          if (objTokenData[0].LicenceType == 'Copyright') {
            this.chkCopyright = true;
            this.chkDL = false;
          }
          if (objTokenData[0].LicenceType == 'DirectLicence') {
            this.chkCopyright = false;
            this.chkDL = true;
          }

          if (
            objTokenData[0].chkMediaType == 'Signage' &&
            objTokenData[0].DeviceType == 'Sanitizer'
          ) {
            this.chkSanitizer = true;
            this.chkScreen = false;
          }
          if (
            objTokenData[0].chkMediaType == 'Signage' &&
            objTokenData[0].DeviceType == 'Screen'
          ) {
            this.chkSanitizer = false;
            this.chkScreen = true;
          }

          if (
            objTokenData[0].chkMediaType == 'Signage' &&
            objTokenData[0].DeviceType == 'Sanitizer' &&
            objTokenData[0].CommunicationType == 'TTL'
          ) {
            this.chkTTL = true;
            this.chkKeyboard = false;
            this.chkKeyboardScreen = false;
            this.chkBlankComType = false;
          }
          if (
            objTokenData[0].chkMediaType == 'Signage' &&
            objTokenData[0].DeviceType == 'Sanitizer' &&
            objTokenData[0].CommunicationType == 'Keyboard'
          ) {
            this.chkTTL = false;
            this.chkKeyboard = true;
            this.chkKeyboardScreen = false;
            this.chkBlankComType = false;
          }
          if (
            objTokenData[0].chkMediaType == 'Signage' &&
            objTokenData[0].DeviceType == 'Screen' &&
            objTokenData[0].CommunicationType == 'Keyboard'
          ) {
            this.chkTTL = false;
            this.chkKeyboard = false;
            this.chkKeyboardScreen = true;
            this.chkBlankComType = false;
          }
          this.GetKeyboardAnnouncement();
          this.GetFireAlert();
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

  openResetModal(mContent) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.modalService.open(mContent, { centered: true });
  }
  openStateModal(content) {
    this.modalService.open(content, { centered: true });
  }
  onSubmitState() {}
  apiType=""
  openDeleteModal(content, pschid, apitype) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.apiType=apitype
    this.DelpSchid = pschid;
    this.modalService.open(content, { centered: true });
  }
  DeleteSchPlaylist() {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    if (this.apiType=="Normal"){
      this.tService
      .DeleteTokenSch(this.DelpSchid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.SaveModifyInfo(
              this.tid,
              'Token schedule time is delete and schedule id is ' +
                this.DelpSchid
            );
            this.loading = false;
            this.FillTokenInfo();
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
    else{
      this.tService
      .DeleteTokenSch_future(this.DelpSchid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.SaveModifyInfo(
              this.tid,
              'Token schedule time is delete and schedule id is ' +
                this.DelpSchid
            );
            this.loading = false;
            this.FillTokenInfo();
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

  onChangeSchedule(schType) {
    var schItem = {};
    this.ScheduleType= schType;
    this.loading = true;
    this.ModifySchList = [];
    if (schType == 'Normal') {
      this.scheduleList.forEach((item) => {
        schItem = {};
        schItem['formatName'] = item.formatName;
        schItem['playlistName'] = item.playlistName;
        schItem['StartTime'] = item.StartTime;
        schItem['EndTime'] = item.EndTime;
        schItem['WeekDay'] = item.WeekDay;
        schItem['id'] = item.id;
        schItem['PercentageValue'] = item.PercentageValue;
        schItem['volume'] = item.volume;
        this.ModifySchList.push(schItem);
      });
    }
    if (schType == 'OneToOnePlaylist') {
      this.scheduleList.forEach((item) => {
        schItem = {};
        schItem['formatName'] = item.formatName;
        schItem['playlistName'] = item.playlistName;
        schItem['StartTime'] = '00:00';
        schItem['EndTime'] = '00:00';
        schItem['WeekDay'] = item.WeekDay;
        schItem['id'] = item.id;
        schItem['PercentageValue'] = item.PercentageValue;
        schItem['volume'] = item.volume;
        this.ModifySchList.push(schItem);
      });
    }
    if (schType == 'PercentageSchedule') {
      this.scheduleList.forEach((item) => {
        schItem = {};
        schItem['formatName'] = item.formatName;
        schItem['playlistName'] = item.playlistName;
        schItem['StartTime'] = '00:00';
        schItem['EndTime'] = '00:00';
        schItem['WeekDay'] = item.WeekDay;
        schItem['id'] = item.id;
        schItem['PercentageValue'] = item.PercentageValue;
        schItem['volume'] = item.volume;
        this.ModifySchList.push(schItem);
      });
    }
    this.loading = false;
  }

  openCommonModal(modal, ModalType) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.ModalType = ModalType;
    if (ModalType == 'State') {
      this.HeaderText = 'State';
      if (this.Country_Id == '0') {
        this.toastr.error('Please select a county');
        return;
      }
      this.NewName = this.ModifyStateName;
      this.CommonId = this.ModifyStateId;
      this.modalService.open(modal);
    }
    if (ModalType == 'City') {
      if (this.ModifyStateId == '0') {
        this.toastr.error('Please select a state');
        return;
      }
      this.HeaderText = 'City';
      this.NewName = this.citName;
      this.CommonId = this.ModifyCityId;
      this.modalService.open(modal);
    }
    if (ModalType == 'Group') {
      this.HeaderText = 'Group';
      this.NewName = this.ModifyGroupName;
      this.CommonId = this.ModifyGroupId;
      this.modalService.open(modal);
    }
  }
  NewFilterList;
  GetJSONRecord = (array, list): void => {
    this.NewFilterList = list.filter((order) => order.Id == array.Id);
  };

  onSubmitModal() {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.tService
      .CitySateNewModify(
        this.CommonId,
        this.NewName,
        this.ModalType,
        this.ModifyStateId,
        this.Country_Id,
        this.ClientId
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            if (this.ModalType == 'State') {
              this.FillState(this.Country_Id);
              this.ModifyStateName = this.NewName;
            }
            if (this.ModalType == 'City') {
              this.FillCity(this.ModifyStateId);
              this.citName = this.NewName;
            }
            if (this.ModalType == 'Group') {
              this.FillGroup();
              this.ModifyGroupName = this.NewName;
            }
          } else if (obj.Responce == '-2') {
            this.toastr.info('Name is already exixts', '');
            this.loading = false;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            return;
          }
          this.NewName = '';
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
  onChangeCity(event: Event) {
    let selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    let selectElementValue = event.target['options'][event.target['options'].selectedIndex].value;
    this.citName = selectElementText;
    this.ModifyCityId = selectElementValue;
  }
  onChangeGroup(Id) {
    var ArrayItem = {};
    ArrayItem['Id'] = Id;
    ArrayItem['DisplayName'] = '';
    this.NewFilterList = [];
    this.GetJSONRecord(ArrayItem, this.GroupList);
    if (this.NewFilterList.length > 0) {
      this.ModifyGroupName = this.NewFilterList[0].DisplayName;
    }
    this.ModifyGroupId = Id;
  }
  FillGroup() {
    this.loading = true;
    var qry =
      'select GroupId as id, GroupName as displayname  from tbGroup where dfClientId = ' +
      this.ClientId +
      ' order by GroupName';
    this.tService
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
  MediaTypeChange(value) {}
  openTitleDeleteModal(mContent, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.AnnoId = id;
    this.modalService.open(mContent);
  }
  DeleteTitle() {
    this.loading = true;
    this.mService
      .DeleteMachineTitle(this.tid, this.AnnoId)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.GetMachineAnnouncement();
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

  GetMachineAnnouncement() {
    this.loading = true;
    this.mService
      .GetMachineAnnouncement(this.tid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          console.log(returnData)
          this.PlaylistSongsList = JSON.parse(returnData);
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
  GetKeyboardAnnouncement() {
    this.loading = true;
    this.mService
      .GetKeyboardAnnouncement(this.tid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.KeyboardPlaylist = JSON.parse(returnData);
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

  openDeleteKeyboardModal(mContent, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.keyboardId = id;
    this.modalService.open(mContent);
  }
  DeleteKeyboardAnnouncement() {
    this.loading = true;
    this.mService
      .DeleteKeyboardAnnouncement(this.tid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.GetKeyboardAnnouncement();
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

  GetFireAlert() {
    this.loading = true;
    this.mService
      .GetFireAlert(this.tid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.EmergencyList = JSON.parse(returnData);
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
  openEmergencyDeleteModal(mContent, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.EmgAlertId = id;
    this.modalService.open(mContent);
  }

  DeleteEmergency() {
    this.loading = true;
    this.mService
      .DeleteFireAlert(this.tid, this.EmgAlertId)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.GetFireAlert();
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
  ForceUpdateAll() {
    var tSelected = [];

    tSelected.push(this.tid);

    this.loading = true;
    this.serviceLicense
      .ForceUpdate(tSelected)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
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

  CrossClick(){
    this.modalService.dismissAll('Cross click');
  }
  
SaveSchedule() {
  var TokenSelected = [];

  const frm= this.TokenInfo.value;
  TokenSelected.push(frm['Tokenid']);

  var CDform = this.formBuilder.group({
        SchList: [this.ScheduleList],
        TokenList: [TokenSelected],
        dfClientId: [frm['dfclientid']]
      });
  
      CDform.get('SchList').setValue(this.ScheduleList);
      CDform.get('dfClientId').setValue(frm['dfclientid']);
      CDform.get('TokenList').setValue(TokenSelected);
      this.loading = true;
      this.cService.SaveCopySchedule(CDform.value).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == "1") {
            this.toastr.info("Saved", 'Success!');
            this.ForceUpdateAll();
          }
          this.modalService.dismissAll('Cross click');
          this.loading = false;
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    }
    

    PlaylistContentStatus(mContent) {
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      localStorage.setItem('tokenClient',this.ClientId.toString());
      localStorage.setItem('dpid','');
      this.modalService.open(mContent, {  size: 'lg',
      windowClass: 'tokenmodal', });
      this.flocationElement.nativeElement.focus();
    }

}
