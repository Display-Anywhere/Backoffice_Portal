import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { MachineService } from '../machine-announcement/machine.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';

@Component({
  selector: 'app-instant-mobile',
  templateUrl: './instant-mobile.component.html',
  styleUrls: ['./instant-mobile.component.css']
})
export class InstantMobileComponent implements OnInit {
  public loading = false;
  InstantActiveTabId=1
  cmbSearchCustomer = '0';
  cmbSearchToken; 
  SearchTokenList;
  TokenList=[];
  CustomerList: any[];
  SavedList;
  cmbFormat;
  cmbPlaylist;
  FormatList:any[];
  PlaylistList:any[];
  SongsList;
  tid;
  CustomerMediaTypeList = [];
  cmbCustomerMediaType = '';
  plArray = [];
  selectedRow;
  dropdownSettings = {};
  cmbToken;
  cmbCustomer;
  chkAll:boolean=false;
  ForceUpdateTokenid=[];
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  constructor(public toastr: ToastrService,  private cf: ConfigAPI,
     config: NgbModalConfig, private modalService: NgbModal, public auth:AuthServiceOwn, 
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

          this.cmbCustomer=localStorage.getItem('dfClientId')
          this.onChangeCustomer(localStorage.getItem('dfClientId'))
        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id) {
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.PlaylistList =[]
    this.FormatList =[];
    this.cmbFormat="0"
    this.cmbPlaylist ="0"
    this.cmbCustomerMediaType=""
    this.GetCustomerMediaType(id)
  }
  FillFormat() {
    this.loading = true;
    var qry = "";
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
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithEvent,0)=0 and ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cmbSearchCustomer +
      ' OR sf.dfclientid=' +
      this.cmbSearchCustomer +
      ") and sf.mediatype='" +
      this.cmbCustomerMediaType +
      "' group by  sf.formatname";

    this.mService.FillCombo(qry).pipe()
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
  onChangeToken(id){
    this.loading = true;
    this.mService.GetInstantMobileAnnouncement(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SavedList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeFormat(id){
    this.chkAll=false;
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

  DeleteKeyboardAnnouncement() {
    this.loading = true;
    this.mService.DeleteInstantPlayPlaylist(this.tid).pipe()
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
  this.cmbFormat="0";
  this.cmbPlaylist="0";
  this.SongsList=[];
  this.chkAll=false;
}
SaveAnnouncement(UpdateModel){
    

    //this.getSelectedRows();
 
    if (this.cmbSearchCustomer == '0') {
      this.toastr.error("Please select a customer", '');
      return;
    }

    if (this.cmbSearchToken.length == '0') {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.cmbFormat == 0) {
      this.toastr.error("Please select a format", '');
      return;
    }
    if (this.cmbPlaylist == 0) {
      this.toastr.error("Please select a playlist", '');
      return;
    }
     
    this.loading = true;
    this.mService.SaveInstantMobileAnnouncement(this.cmbSearchToken,this.cmbPlaylist,this.cmbFormat,this.cmbSearchCustomer).pipe()
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
  onChangeCustomer(id) {
    this.TokenList=[];
    this.SavedList=[];
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
  GetCustomerMediaType(cid) {
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.PlaylistList =[]
    this.FormatList =[];
    this.cmbFormat="0"
    this.cmbPlaylist ="0"
    this.cmbCustomerMediaType=""
    
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
    this.FillPlayerInfo();
  }
FillPlayerInfo(){
  this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.PlaylistList =[]
    this.loading = true;
    this.mService.FillTokenInfo(this.cmbSearchCustomer).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
        var objmType = this.cmbCustomerMediaType.split(' ');
        let mtype = '';
        if (objmType.length == 2) {
          mtype = objmType[0].trim();
        } else {
          mtype = this.cmbCustomerMediaType;
        }
        this.SearchTokenList = this.SearchTokenList.filter(
          (order) =>
            order.MediaType === mtype
        );


        this.loading = false;
        this.dropdownSettings = {
          singleSelection: false,
          text: "",
          idField: 'tokenid',
          textField: 'tInfo',
          selectAllText: 'All',
          unSelectAllText: 'All',
          itemsShowLimit: 2
        };
        this.FillFormat();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
}
}
