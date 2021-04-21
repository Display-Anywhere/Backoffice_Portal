import { Component, OnInit,QueryList, ViewChildren,ViewContainerRef } from '@angular/core';
import {NgbdSortableHeader, SortEvent} from '../../components/sortable.directive';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { IPlayService } from 'src/app/instant-play/i-play.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-offline-alert',
  templateUrl: './offline-alert.component.html',
  styleUrls: ['./offline-alert.component.css']
})
export class OfflineAlertComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  uid;
 loading = false;
  TokenList = [];
  MainTokenList = [];
  AlertList = [];
  Userform: FormGroup;
  TokenSelected = [];
  currentJustify = 'justified';
  searchText;
  OfflineCustomerList = [];
  did;
  cmbCustomer;
  nEmail="";
  _id="0";
  timeInterval=30
  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef,
    config: NgbModalConfig, private modalService: NgbModal, private ipService: IPlayService,
    public auth: AuthService, private pService: PlaylistLibService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.did = localStorage.getItem('dfClientId');

    this.FillClientList();
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.ipService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.OfflineCustomerList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
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
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillUserList(id) {
    this.loading = true;
    this.ipService.FillOfflineAlertList(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AlertList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onClickEditUser(id) {
    this.loading = true;
    this.ipService.EditOfflineUser(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.TokenList = obj.lstTokenInfo;
        this.MainTokenList = this.TokenList;
        this.TokenSelected = obj.lstToken;
        this.nEmail= obj.email;
        this.timeInterval=  obj.interval;
        this._id=  obj.id;
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
    this.ipService.DeleteOfflineAlert(this.uid).pipe()
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

  onCustomerChange(deviceValue) {
    this.did = deviceValue;
    this.FillPlayer(deviceValue);
  }
  Refresh(){
    this.TokenList = [];
    this.MainTokenList = [];
    this.TokenSelected = [];
    this._id="0"
    this.nEmail="";
    this.timeInterval=0;
    this.FillPlayer(this.did);
  }
  onSubmitUser() {
    
    
    if (this.nEmail=="") {
      this.toastr.error("Email cannot be blank");
      return;
    }
    if (this.timeInterval==0) {
      this.toastr.error("Interval cannot be zero");
      return;
    }
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Please select a player");
      return;
    }

    this.loading = true;

    this.ipService.SaveUpdateOfflineAlert(this._id,this.nEmail,this.timeInterval,this.TokenSelected,this.cmbCustomer).pipe()
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
  onSort({column, direction}: SortEvent) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.TokenList = this.MainTokenList;
    } else {
      this.TokenList = [...this.MainTokenList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
