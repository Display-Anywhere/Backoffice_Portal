import { Component, OnInit, ViewContainerRef,ViewChildren,QueryList, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPlayService } from '../instant-play/i-play.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from '../auth/auth.service';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
import { NgbdSortableHeader_User, SortEvent } from './user_sortable.directive';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DecimalPipe],
})
export class UserComponent implements OnInit {
  uid;
  public loading = false;
  TokenList = [];
  MainTokenList = [];
  UserList = [];
  Userform: FormGroup;
  submitted = false;
  TokenSelected = [];
  currentJustify = 'justified';
  searchText;
  CustomerList = [];
  did;
  FormatList = [];
  PlaylistList = [];
  cmbCustomer;
  chkUserAll: boolean = false;
  chkdis: boolean = true;
  SearchList=[]
  @ViewChildren(NgbdSortableHeader_User) headers: QueryList<NgbdSortableHeader_User>;
  compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private ipService: IPlayService,
    public auth:AuthServiceOwn, private pService: PlaylistLibService,private serviceLicense: SerLicenseHolderService,private pipe: DecimalPipe) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {

    this.did = localStorage.getItem('dfClientId');

    this.FillClientList();



    //this.FillPlayer(this.did);


    this.Userform = this.formBuilder.group({
      UserName1: ["", Validators.required],
      Password1: ["", Validators.required],
      chkDashboard: [true],
      chkPlayerDetail: [false],
      chkPlaylistLibrary: [false],
      chkScheduling: [false],
      chkAdvertisement: [false],
      chkInstantPlay: [false],
      chkDeleteSong: [false],
      lstToken: [this.TokenSelected],
      id: ["0"],
      dfClientid: [this.did],
      Responce: ["0"],
      chkInstantApk: [false],
      cmbFormat: ["0"],
      cmbPlaylist: ["0"],
      chkUserAdmin: [false],
      chkUpload: [false],
      chkCopyData: [false],
      chkStreaming: [false],
      chkOfflineAlert: [false],
      chkViewOnly:[false],
      chkEventMeeting:[false],
      OfflineIntervalHour:["30"],
    });

  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.ipService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {
           
          this.cmbCustomer=localStorage.getItem('dfClientId')
          this.onChangeCustomer(localStorage.getItem('dfClientId'))
        } 
        // this.FillPlayer(localStorage.getItem('dfClientId'));
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  get f() { return this.Userform.controls; }
  onSubmitUser() {
    this.submitted = true;
    if (this.Userform.invalid) {
      return;
    }
    
    
    if ((this.f.chkDashboard.value == false) && (this.f.chkPlayerDetail.value == false) && (this.f.chkPlaylistLibrary.value == false) && (this.f.chkScheduling.value == false) && (this.f.chkAdvertisement.value == false) && (this.f.chkInstantPlay.value == false) && (this.f.chkDeleteSong.value == false) && (this.f.chkUpload.value == false) && (this.f.chkCopyData.value == false) && (this.f.chkStreaming.value == false)) {
      this.toastr.error("Please select a user rights");
      return;
    }
    if (this.f.chkEventMeeting.value == false) {
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Please select a player");
      return;
    }
  }
  if (this.f.chkEventMeeting.value == true) {
    this.f.chkDashboard.setValue(false);
    this.f.chkPlayerDetail.setValue(true);
    this.f.chkPlaylistLibrary.setValue(false);
    this.f.chkScheduling.setValue(false);
    this.f.chkAdvertisement.setValue(false);
    this.f.chkInstantPlay.setValue(false);
    this.f.chkDeleteSong.setValue(false);
    this.f.chkInstantApk.setValue(false);
    this.f.chkUserAdmin.setValue(false);
    this.f.chkUpload.setValue(false);
    this.f.chkCopyData.setValue(false);
    this.f.chkStreaming.setValue(false);
    this.f.chkViewOnly.setValue(false);
  }
  if (this.f.chkViewOnly.value == true) {
    this.f.chkEventMeeting.setValue(false);
  }

    this.Userform.get('dfClientid').setValue(this.did);
    this.loading = true;
    this.Userform.get('lstToken').setValue(this.TokenSelected);
    this.ipService.SaveUpdateUser(this.Userform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.Refresh();
          this.FillUserList(this.did);
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
  Refresh() {
    this.chkUserAll= false;
    this.SearchList=[];
    this.searchText="";
    this.TokenSelected=[];
    this.TokenList = [];
    this.MainTokenList = [];
    this.TokenSelected = [];
    this.f.UserName1.setValue("");
    this.f.Password1.setValue("");
    this.f.chkDashboard.setValue(true);
    this.f.chkPlayerDetail.setValue(false);
    this.f.chkPlaylistLibrary.setValue(false);
    this.f.chkScheduling.setValue(false);
    this.f.chkAdvertisement.setValue(false);
    this.f.chkInstantPlay.setValue(false);
    this.f.chkDeleteSong.setValue(false);
    this.f.lstToken.setValue(this.TokenSelected);
    this.f.id.setValue("0");
    this.f.dfClientid.setValue(this.did);
    this.f.chkInstantApk.setValue(false);
    this.f.cmbFormat.setValue("0");
    this.f.cmbPlaylist.setValue("0");
    this.f.chkUserAdmin.setValue(false);
    this.f.chkUpload.setValue(false);
    this.f.chkCopyData.setValue(false);
    this.f.chkStreaming.setValue(false);
    this.f.chkViewOnly.setValue(false);
    this.f.chkEventMeeting.setValue(false);
    
    

    this.FillPlayer(this.did);
  }
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
  FillPlayer(id) {
    this.loading = true;
    this.ipService.FillPlayerUsers(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        this.TokenList = JSON.parse(returnData);
        this.MainTokenList= this.TokenList;
        this.loading = false;
        const obj:SortEvent   ={
          column:'city',
          direction: 'asc'
         }
         setTimeout(() => { 
          this.onSort(obj);
        }, 500);

        this.FillUserList(id);
        this.FillFormat();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillUserList(id) {
    this.loading = true;
    this.ipService.FillUserList(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.UserList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onClickEditUser(id) {
    this.loading = true;
    this.ipService.EditUser(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        
        this.TokenList = obj.lstTokenInfo;
        this.MainTokenList = this.TokenList;
        this.TokenSelected = obj.lstToken;
        this.f.UserName1.setValue(obj.UserName1);
        this.f.Password1.setValue(obj.Password1);
        this.f.chkDashboard.setValue(true);
        this.f.chkPlayerDetail.setValue(obj.chkPlayerDetail);
        this.f.chkPlaylistLibrary.setValue(obj.chkPlaylistLibrary);
        this.f.chkScheduling.setValue(obj.chkScheduling);
        this.f.chkAdvertisement.setValue(obj.chkAdvertisement);
        this.f.chkInstantPlay.setValue(obj.chkInstantPlay);
        this.f.chkDeleteSong.setValue(obj.chkDeleteSong);
        this.f.chkInstantApk.setValue(obj.chkInstantApk);
        this.f.chkUserAdmin.setValue(obj.chkUserAdmin);
        this.f.chkUpload.setValue(obj.chkUpload);
        this.f.chkCopyData.setValue(obj.chkCopyData);
        this.f.chkStreaming.setValue(obj.chkStreaming);

        this.f.chkOfflineAlert.setValue(obj.chkOfflineAlert);
        this.f.OfflineIntervalHour.setValue(obj.OfflineIntervalHour);
        this.f.chkViewOnly.setValue(obj.chkViewOnly);
        this.f.chkEventMeeting.setValue(obj.chkEventMeeting);
        
        this.f.cmbFormat.setValue(obj.cmbFormat);
        this.FillPlaylist(obj.cmbFormat)


        this.f.lstToken.setValue(this.TokenSelected);
        this.f.id.setValue(obj.id);
        this.f.dfClientid.setValue(this.did);
        this.f.cmbPlaylist.setValue(obj.cmbPlaylist);

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  openDeleteDeleteModal(mContent, id) {
    this.uid = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteUser() {
    this.loading = true;
    this.ipService.DeleteUser(this.uid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.loading = false;
          this.toastr.info("User Deleted", '');
          this.FillUserList(this.did);
        }
        else {
          this.loading = false;
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  onChangeCustomer(deviceValue) {
    this.chkUserAll= false;
    this.SearchList=[];
    this.searchText="";
    this.TokenSelected=[];
    this.did = deviceValue;
    this.FillPlayer(deviceValue);
  }

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
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cmbCustomer +
      ' OR sf.dfclientid=' +
      this.cmbCustomer +
      ") group by  sf.formatname " ;

    this.ipService.FillCombo(qry).pipe()
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
  onChangeFormat(id, l) {
    this.PlaylistList = [];
    this.FillPlaylist(id);
  }
  FillPlaylist(id) {

    this.PlaylistList = [];
    this.loading = true;
    this.pService.Playlist(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlaylistList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          //this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.TokenList = this.MainTokenList;
    } else {
      this.TokenList = [...this.MainTokenList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }

    // sorting countries
  }

  
  allActiveToken(event) {
    const checked = event.target.checked;
    this.TokenSelected = [];
    if (this.searchText==''){
    this.TokenList.forEach((item) => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid);
    });
  }
  else{
    this.SearchList.forEach((item) => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid);
    });
  }
    if (checked == false) {
      this.TokenSelected = [];
    }
  }
  onChangeEvent(){
    this.SearchList = this.TokenList.filter(country => this.serviceLicense.matches(country, this.searchText, this.pipe));
    const total = this.SearchList.length;
    console.log(this.SearchList)
  }
  OnChangeViewOnly(e){
    this.f.chkPlayerDetail.setValue(e);
    this.f.chkPlaylistLibrary.setValue(e);
    this.f.chkScheduling.setValue(e);
    this.f.chkAdvertisement.setValue(e);
    this.f.chkDeleteSong.setValue(e);
    this.f.chkInstantPlay.setValue(e);
    this.f.chkUpload.setValue(e);
    this.f.chkCopyData.setValue(e);
    this.f.chkStreaming.setValue(e);
    this.f.chkEventMeeting.setValue(false);
  }
}
