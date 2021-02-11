import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPlayService } from '../instant-play/i-play.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  uid;
  public loading = false;
  TokenList = [];
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

  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private ipService: IPlayService,
    public auth: AuthService, private pService: PlaylistLibService) {
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
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Please select a player");
      return;
    }

    this.Userform.get('dfClientid').setValue(this.did);
    this.loading = true;

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
    this.TokenList = [];
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
        this.loading = false;
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
    this.did = deviceValue;
    this.FillPlayer(deviceValue);
  }

  FillFormat() {
    this.loading = true;
    var qry = "";

    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    }
    else {
      qry = "select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid";
      qry = qry + " left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where ";
      qry = qry + " (dbtype='" + localStorage.getItem('DBType') + "' or dbtype='Both') and  (st.dfclientid=" + localStorage.getItem('dfClientId') + " OR sf.dfclientid=" + localStorage.getItem('dfClientId') + ") group by  sf.formatname";
    }

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
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
