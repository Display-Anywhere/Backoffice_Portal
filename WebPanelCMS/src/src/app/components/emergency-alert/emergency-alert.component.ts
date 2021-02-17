import { Component, OnInit, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { AuthService } from 'src/app/auth/auth.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { MachineService } from '../machine-announcement/machine.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
@Component({
  selector: 'app-emergency-alert',
  templateUrl: './emergency-alert.component.html',
  styleUrls: ['./emergency-alert.component.css']
})
export class EmergencyAlertComponent implements OnInit {
  public loading = false;
  cmbSearchCustomer = '0';
  cmbSearchToken=[]; 
  SearchTokenList;
  TokenList=[];
  CustomerList: any[];
  PlaylistSongsList;
  cmbGenre;
  GenreList:any[];
  SongsList;
  tid=[];
  SongsSelected:string="";
  SongsSelectedMediaTye:string="";
  plArray = [];
  selectedRow;
  dropdownSettings = {};
  cmbToken;
  cmbCustomer;
  chkAll:boolean=false;
  ForceUpdateTokenid=[];
  constructor(public toastr: ToastrService,  private cf: ConfigAPI,
     config: NgbModalConfig, private modalService: NgbModal, public auth:AuthService, 
     private mService:MachineService, private pService: PlaylistLibService,private serviceLicense: SerLicenseHolderService) {
      config.backdrop = 'static';
    config.keyboard = false;
     }

  ngOnInit(): void {
    $("#dis").attr('unselectable', 'on');
    $("#dis").css('user-select', 'none');
    $("#dis").on('selectstart', false);

    this.FillClient();
    
  }
  FillClient() {
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.mService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.cmbSearchCustomer = localStorage.getItem('dfClientId');
          this.onChangeSearchCustomer(this.cmbSearchCustomer);
        } 
        this.FillGenre();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id) {
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.SongsList=[];
    this.cmbGenre=0;
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
        this.loading = false;
        this.dropdownSettings = {
          singleSelection: false,
          text: "",
          idField: 'tokenid',
          textField: 'tokenCode',
          selectAllText: 'All',
          unSelectAllText: 'All',
          itemsShowLimit: 2
        };
        
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillGenre() {
    this.loading = true;
    var qry = "select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ";
    qry = qry + " where genreid in(303,297,325,324)  ";
    qry = qry + " order by genre ";
    this.mService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.GenreList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeToken(id){
    this.loading = true;
    this.mService.GetFireAlert(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlaylistSongsList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeGenre(id){
    this.chkAll=false;
this.FillSearch(id);
  }
  FillSearch(id) {
    this.SongsSelected="";
    this.SongsSelectedMediaTye="";
    
    var chkSearchRadio = "Genre";
    var chkMediaRadio='Video';
    if ((id=="297") || (id=="303")){
      chkMediaRadio='Video';
    }
    else{
      chkMediaRadio='Image';
    }
    this.loading = true;
    this.mService.CommanSearch(chkSearchRadio, id, chkMediaRadio, false,"1",this.cmbSearchCustomer).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        this.SongsList = obj;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }


  selectWithShift(rowIndex) {
    var lastSelectedRowIndexInSelectedRowsList = this.selectedRowsIndexes.length - 1;
    var lastSelectedRowIndex = this.selectedRowsIndexes[lastSelectedRowIndexInSelectedRowsList];
    var selectFromIndex = Math.min(rowIndex, lastSelectedRowIndex);
    var selectToIndex = Math.max(rowIndex, lastSelectedRowIndex);
    this.selectRows(selectFromIndex, selectToIndex);
  }
  selectRows(selectFromIndex, selectToIndex) {
    for (var rowToSelect = selectFromIndex; rowToSelect <= selectToIndex; rowToSelect++) {
      this.select(rowToSelect);
    }
  }
  setMultipleClickedRow = function (event, index, songLst, lock) {
    if (event.ctrlKey) {
      // this.selectedRowsIndexes=[];
      this.changeSelectionStatus(index);
    }
    else if (event.shiftKey) {
      this.selectWithShift(index);
    } else {
      this.selectedRowsIndexes = [index];
    }
    return;

  }
  changeSelectionStatus(rowIndex) {
    if (this.isRowSelected(rowIndex)) {
      this.unselect(rowIndex);
    } else {
      this.select(rowIndex);
    }
  }

  isRowSelected(rowIndex) {
    return this.selectedRowsIndexes.indexOf(rowIndex) > -1;
  };
  selectedRowsIndexes = [];

  unselect(rowIndex) {
    var rowIndexInSelectedRowsList = this.selectedRowsIndexes.indexOf(rowIndex);
    var unselectOnlyOneRow = 1;
    this.selectedRowsIndexes.splice(rowIndexInSelectedRowsList, unselectOnlyOneRow);
  }
  select(rowIndex) {
    if (!this.isRowSelected(rowIndex)) {
      this.selectedRowsIndexes.push(rowIndex)
    }
  }


  openTitleDeleteModal(mContent, id) {

    this.tid.push[id];
    this.modalService.open(mContent);
  }

  DeleteTitle() {
    this.loading = true;
    this.mService.DeleteFireAlert(this.cmbToken, this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.onChangeToken(this.cmbToken);
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

   
Clear(){
  this.cmbSearchToken=[];
  this.SongsSelected="";
  this.SongsSelectedMediaTye="";
  this.cmbGenre="0";
  this.SongsList=[];
  this.chkAll=false;
}
  AddSong(UpdateModel){
    

    //this.getSelectedRows();
 
    if (this.cmbSearchToken.length == 0) {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.SongsSelected == "") {
      this.toastr.error("Select atleast one announcement", '');
      return;
    }
     
    this.loading = true;
    this.mService.SetFireAlert(this.cmbSearchToken, this.SongsSelected, this.SongsSelectedMediaTye).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;

        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
          this.ForceUpdateTokenid=[];
          this.cmbSearchToken.forEach(item => {
            this.ForceUpdateTokenid.push(item.tokenid)
          });
          this.modalService.open(UpdateModel, { centered: true });
          this.Clear();
          this.selectedRowsIndexes = [];
          
          //this.onChangeToken(this.cmbSearchToken);
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
  setClickedRow = function (index) {
    this.selectedRow = index;
  }

  moveUp = function (num) {
    if (num > 0) {
      var tmp = this.PlaylistSongsList[num - 1];
      var tmpPL = this.plArray[num - 1];

      this.PlaylistSongsList[num - 1] = this.PlaylistSongsList[num];
      this.plArray[num - 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;

      this.ArrayLoop();
      this.selectedRow--;
    }
  }
  moveDown = function (num) {
    if (num < this.PlaylistSongsList.length - 1) {
      var tmp = this.PlaylistSongsList[num + 1];
      var tmpPL = this.plArray[num + 1];

      this.PlaylistSongsList[num + 1] = this.PlaylistSongsList[num];
      this.plArray[num + 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;
      this.ArrayLoop();
      this.selectedRow++;
    }
  }
  ArrayLoop() {
    this.plArray = [];
    var srno = 0;
    for (let prop in this.PlaylistSongsList) {
      this.plArray.push({
        "index": srno, "titleid": this.PlaylistSongsList[prop].id
      });
      srno++;
    }

  }
  UpdateSRNo() {

    this.loading = true;
    this.mService.UpdateMachineAnnouncementSRNo(this.cmbSearchToken, this.plArray).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
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

  onChangeCustomer(id) {
    this.TokenList=[];
    this.PlaylistSongsList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
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

   
  SelectTitle(fileid, event,mtype) {
    this.SongsSelected="";
    this.SongsSelectedMediaTye="";
    if (event.target.checked) {
      this.SongsSelected=fileid;
      this.SongsSelectedMediaTye=mtype;
    }
  }
  
  ForceUpdateAll() {
    this.loading = true;
    this.serviceLicense.ForceUpdate(this.ForceUpdateTokenid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Update request is submit", 'Success!');
          this.loading = false;
        }
        else {
        }
        this.loading = false;
      },
        error => {

          this.loading = false;
        })
  }
}
