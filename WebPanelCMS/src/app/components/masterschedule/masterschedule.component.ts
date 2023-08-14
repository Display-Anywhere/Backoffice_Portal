import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
@Component({
  selector: 'app-masterschedule',
  templateUrl: './masterschedule.component.html',
  styleUrls: ['./masterschedule.component.css']
})
export class MasterscheduleComponent implements OnInit {
  loading=false
  CustomerList=[]
  cmbSearchCustomer=''
  SearchMasterScheduleList=[]
  cmbSearchMasterSchedule=''
  gridViewSearchMasterScheuleList=[]
  MSform: FormGroup;
  dt = new Date('Mon Mar 09 2020 00:00:00');
  dt2 = new Date('Mon Mar 09 2020 23:59:00');
  WeekSelectedItems = [];
  CustomMasterSchedulePlaylist=[]
  FormatList=[]
  MediaTypeList = [];
  PlaylistList=[]
  cid=''
  MainPlaylistList=[]
  WeekdropdownSettings = {};
  WeekdropdownList = [];
  cmbMasterScheduleMediaType=''
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  time2: NgbTimeStruct = { hour: 23, minute: 59, second: 0 };
  TotalPercentageValue = 0;
  constructor(private formBuilder: FormBuilder,public toastrSF: ToastrService,public auth:AuthServiceOwn,
    private sfService: StoreForwardService) { }

  async ngOnInit() {
    this.PlaylistList = []
    this.MainPlaylistList=[] 
    this.FormatList=[]
    this.WeekSelectedItems=[]
    this.CustomMasterSchedulePlaylist =[]
    this.cid=''
    this.cmbMasterScheduleMediaType=''

    this.initForm()
    this.initWeekDropDown()
    this.time = {
      hour: this.dt.getHours(),
      minute: this.dt.getMinutes(),
      second: 0,
    };
    this.MSform.get('startTime').setValue(this.time);
    this.time = {
      hour: this.dt2.getHours(),
      minute: this.dt2.getMinutes(),
      second: 0,
    };
    this.MSform.get('EndTime').setValue(this.time);
    await this.FillClient()
  }
  initWeekDropDown(){
    this.WeekSelectedItems=[]
    this.WeekdropdownList=[]
    this.WeekdropdownList = [
      { id: '1', itemName: 'Mon' },
      { id: '2', itemName: 'Tue' },
      { id: '3', itemName: 'Wed' },
      { id: '4', itemName: 'Thu' },
      { id: '5', itemName: 'Fri' },
      { id: '6', itemName: 'Sat' },
      { id: '7', itemName: 'Sun' },
    ];
    this.WeekdropdownSettings={}
    this.WeekdropdownSettings = {
      singleSelection: false,
      text: 'Select Week',
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Week',
      unSelectAllText: 'Week',
      itemsShowLimit: 1,
    };
    let wobj=[]
    this.MSform.controls['wList'].setValue(wobj);
  }

  initForm(){
    this.MSform = this.formBuilder.group({
      ScheduleName: ['', Validators.required],
      CustomerId: ['0', Validators.required],
      FormatId: ['0', Validators.required],
      PlaylistId: ['0', Validators.required],
      startTime: [this.dt, Validators.required],
      EndTime: [this.dt2, Validators.required],
      wList: [this.WeekSelectedItems, Validators.required],
      lstPlaylist: [this.CustomMasterSchedulePlaylist],
      ScheduleType: ['Normal', Validators.required],
    });
    
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}
  get f() {
    return this.MSform.controls;
  }

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
          if (this.auth.IsAdminLogin$.value == false) {
            this.MSform.get('CustomerId').setValue(
              localStorage.getItem('dfClientId')
            );
            this.onChangeCustomer(localStorage.getItem('dfClientId'));
            this.cmbSearchCustomer=localStorage.getItem('dfClientId')
          this.onChangeSearchCustomer(localStorage.getItem('dfClientId'))
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
      ") and sf.mediatype='" +
      this.cmbMasterScheduleMediaType +
      "' group by  sf.formatname";
      console.log( this.cmbMasterScheduleMediaType)
      console.log(qry)
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

  RemoveItem(id) {
    this.CustomMasterSchedulePlaylist = this.CustomMasterSchedulePlaylist.filter(
      (d) => d.Id !== id
    );
  }
  AddMasterScheduleItem(){
    if (this.IschkViewOnly==1){
      this.toastrSF.info('This feature is not available in view only');
      return;
    }
    if (this.MSform.value.PlaylistId == '0') {
      this.toastrSF.error('Please select a playlist name');
      return;
    }
    
    if (this.MSform.value.ScheduleType != 'PercentageSchedule') {
      var startTime = this.MSform.controls['startTime'].value['hour'];
      var EndTime = this.MSform.controls['EndTime'].value['hour'];

      if (EndTime < startTime) {
        this.toastrSF.error('End time should be greater than start time');
        return;
      }
      if (this.MSform.value.wList.length == 0) {
        this.toastrSF.error('Please select a week day');
        return;
      }
    }

    const obj = this.MSform.value;
    const pname = this.PlaylistList.filter(
      (order) => order.Id === obj['PlaylistId']
    );
    let sTime = obj['startTime'];
    let eTime = obj['EndTime'];
    let dt = new Date();
    let dt2 = new Date();
    if (this.MSform.value.ScheduleType != 'PercentageSchedule') {
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

    if (this.MSform.value.ScheduleType != 'PercentageSchedule') {
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
    this.CustomMasterSchedulePlaylist.forEach((item) => {
      itemPercentageValue = itemPercentageValue + item['PercentageValue'];
      if (
        item['sTime'] === dt.toTimeString().slice(0, 5) &&
        item['eTime'] === dt2.toTimeString().slice(0, 5) &&
        item['wName'] === ObjWeekName
      ) {
        IsTimeFind = 'Yes';
      }
    });
    if (this.MSform.value.ScheduleType === 'Normal') {
      if (IsTimeFind === 'Yes') {
        this.toastrSF.error('Same time schedule is already in list');
        return;
      }
    }
    this.TotalPercentageValue = itemPercentageValue + obj['PercentageValue'];

    if (this.MSform.value.ScheduleType === 'PercentageSchedule') {
      if (this.TotalPercentageValue > 100) {
        this.toastrSF.error(
          'Total percentage value should not be greater than 100'
        );
        return;
      }
    } else {
      obj['PercentageValue'] = '0';
    }

    this.CustomMasterSchedulePlaylist = [
      ...this.CustomMasterSchedulePlaylist,
      {
        Id: this.CustomMasterSchedulePlaylist.length + '' + pname[0].Id,
        pName: pname[0].DisplayName,
        splId: pname[0].Id,
        sTime: dt.toTimeString().slice(0, 5),
        eTime: dt2.toTimeString().slice(0, 5),
        wId: ObjWeekId,
        wName: ObjWeekName,
        PercentageValue: obj['PercentageValue'],
        volume :"0",
        FormatId:obj['FormatId']
      },
    ];
    this.MSform.controls['PlaylistId'].setValue('0');
    let wobj=[]
    this.MSform.controls['wList'].setValue(wobj);

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
  onChangeSearchCustomer(e){

  }
  onChangeSearchMasterSchedule(e){

  }
  async onChangeCustomer(id){
    this.cid=id
    this.PlaylistList = []
    this.MainPlaylistList=[] 
    this.FormatList=[]
    this.WeekSelectedItems=[]
    this.CustomMasterSchedulePlaylist =[]
    this.initWeekDropDown()
    await this.GetCustomerMediaType(id)

  }
  GetCustomerMediaType(cid) {
    this.loading = true;
    var str = '';
    str = 'GetCustomerMediaType ' + cid;
    this.sfService
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var mType= localStorage.getItem('mType')
            this.MediaTypeList = JSON.parse(returnData);
            if(mType!=null){
              this.cmbMasterScheduleMediaType=mType
              this.onChangeMediaType(mType)
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
  async onChangeMediaType(type){
    console.log(type)
   
    this.PlaylistList = []
    this.MainPlaylistList=[] 
    this.FormatList=[]
    this.WeekSelectedItems=[]
    this.initWeekDropDown()
    this.CustomMasterSchedulePlaylist=[];
    this.MSform.get('FormatId').setValue('0');
    this.MSform.get('PlaylistId').setValue('0');
    this.cmbMasterScheduleMediaType=type
    await this.FillFormat()
  }
  async onChangeFormat(id){
    await this.FillPlaylist(id)
  }
  FillPlaylist(id) {
    this.loading = true;
    this.sfService
      .Playlist(id)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.PlaylistList = JSON.parse(returnData);
          this.MainPlaylistList = JSON.parse(returnData);
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
  SaveMasterSchedule(){
    var errorFound ="No"
    if (this.MSform.value.CustomerId == '0') {
      this.toastrSF.error('Please select a customer name');
      return;
    }
    if (this.MSform.value.FormatId == '0') {
      this.toastrSF.error('Please select a format name');
      return;
    }

    if (this.CustomMasterSchedulePlaylist.length == 0) {
      this.toastrSF.error('Please create schedule', '');
      return;
    }
    var sTime = this.MSform.value.startTime;
    var eTime = this.MSform.value.EndTime;

    var dt = new Date(
      'Mon Mar 09 2020 ' + sTime['hour'] + ':' + sTime['minute'] + ':00'
    );
    var dt2 = new Date(
      'Mon Mar 09 2020 ' + eTime['hour'] + ':' + eTime['minute'] + ':00'
    );

    this.MSform.get('startTime').setValue(dt.toTimeString().slice(0, 5));
    this.MSform.get('EndTime').setValue(dt2.toTimeString().slice(0, 5));

    this.MSform.controls['lstPlaylist'].setValue(this.CustomMasterSchedulePlaylist);
    this.sfService
      .SaveMasterSchedule(this.MSform.value)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastrSF.info('Saved', 'Success!');

            this.loading = false;
            this.ngOnInit()
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
}
