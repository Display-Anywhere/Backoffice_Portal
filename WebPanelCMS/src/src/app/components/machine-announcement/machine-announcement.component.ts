import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MachineService } from './machine.service';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { AuthService } from 'src/app/auth/auth.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
@Component({
  selector: 'app-machine-announcement',
  templateUrl: './machine-announcement.component.html',
  styleUrls: ['./machine-announcement.component.css']
})
export class MachineAnnouncementComponent implements OnInit {
  public loading = false;
  cmbSearchCustomer= '0';
  cmbSearchToken; 
  SearchTokenList;
  TokenList=[];
  CustomerList: any[];
  PlaylistSongsList;
  cmbGenre;
  GenreList:any[];
  SongsList;
  tid="";
  SongsSelected = [];
  plArray = [];
  selectedRow;
  dropdownSettings = {};
  cmbToken;
  cmbCustomer;
  chkAll:boolean=false;
  chkWithPrevious = false;
  ForceUpdateTokenid=[];
  active = 1;
  constructor(public toastr: ToastrService,  private cf: ConfigAPI,
     config: NgbModalConfig, private modalService: NgbModal, public auth:AuthService, 
     private mService:MachineService, private pService: PlaylistLibService,private serviceLicense: SerLicenseHolderService) {
      config.backdrop = 'static';
    config.keyboard = false;
    
     }

  ngOnInit(): void {
    localStorage.setItem('IsAnnouncement','1');
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
    this.mService.GetMachineAnnouncement(id).pipe()
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
    this.SongsSelected=[];
    
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
    this.tid= id;
    this.modalService.open(mContent);
  }

  DeleteTitle() {
    this.loading = true;
    this.mService.DeleteMachineTitle(this.cmbToken, this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.tid="";
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

  getSelectedRows() {
    this.SongsSelected = [];
    var k = this.SongsList[0];
    for (var val of this.selectedRowsIndexes) {
      var k = this.SongsList[val].id;
      this.SongsSelected.push(k);
    }


  }
Clear(){
  this.cmbSearchToken=[];
  this.SongsSelected=[];
  this.cmbGenre="0";
  this.SongsList=[];
  this.cmbToken="0";
  this.chkAll=false;
}
  AddSong(UpdateModel){
    

    //this.getSelectedRows();
      
    if (this.cmbSearchToken.length == '0') {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.SongsSelected.length == 0) {
      this.toastr.error("Select atleast one announcement", '');
      return;
    }
     
    this.loading = true;
    this.mService.SaveMachineAnnouncement(this.cmbSearchToken, this.SongsSelected, this.chkWithPrevious).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;

        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
this.chkWithPrevious= false;
this.cmbCustomer ='0';
this.TokenList= [];
this.cmbToken ='0';
this.PlaylistSongsList =[];
          this.ForceUpdateTokenid=[];
    this.cmbSearchToken.forEach(item => {
      this.ForceUpdateTokenid.push(item.tokenid)
    });


          this.modalService.open(UpdateModel, { centered: true });
          this.Clear();
          this.selectedRowsIndexes = [];
          this.SongsSelected = [];
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

  allToken(event){
    const checked = event.target.checked;
    this.SongsSelected=[];
    this.SongsList.forEach(item=>{
      item.check = checked;
      this.SongsSelected.push(item.id)
    });
    if (checked==false){
      this.SongsSelected=[];
    }
  }
  SelectTitle(fileid, event) {
    if (event.target.checked) {
      this.SongsSelected.push(fileid);
    }
    else {
      const index: number = this.SongsSelected.indexOf(fileid);
      if (index !== -1) {
        this.SongsSelected.splice(index, 1);
      }
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
  ActiveTab(tName){
    if ((tName==='Search') || (tName==='AddNew')){
      this.Clear();     
    }
  }
}
