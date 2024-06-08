import { Component, OnInit } from '@angular/core';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { StoreForwardService } from 'app/mock-api/services/store-forward.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-copydata',
  templateUrl: './copydata.component.html',
  styleUrls: ['./copydata.component.scss']
})
export class CopydataComponent implements OnInit{
  loading = false
  CustomerList=[]
  cmbCustomerId="0"
  CustomerMediaTypeList=[
    {
        "DisplayName": "Audio",
        "Id": "Audio",
        "check": false
    },
    {
        "DisplayName": "Signage",
        "Id": "Signage",
        "check": false
    },
    {
        "DisplayName": "Music Clips",
        "Id": "Video",
        "check": false
    }
]
  FormatList=[]
  PlaylistList=[]
  cmbCustomerMediaType=""
  cmbFormatId="0"
  cmbPlaylistId="0"
  listofSelectedPlaylist=[]
  cmbCopyCustomerId="0"
  CopyCustomerList=[]
  constructor(public auth:AuthServiceOwn,private sfService: StoreForwardService,public toastr: ToastrService){}

  async ngOnInit(){
    await this.FillClient();
  }
  FillClient() {
    this.CustomerList=[]
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.sfService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.cmbCustomerId=localStorage.getItem('dfClientId')
        this.onChangeCustomer()
       
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCustomer(){
    this.listofSelectedPlaylist=[]
    this.CopyCustomerList=[]
    this.CopyCustomerList= this.CustomerList.filter(o => o.Id != this.cmbCustomerId)
    var mType= localStorage.getItem('mType')
    this.FormatList=[]
    this.PlaylistList=[]
      if(mType!=null){
        this.cmbCustomerMediaType=mType
        this.onChangeCustomerMediaType()
      }
  }
  onChangeCustomerMediaType(){
    this.cmbFormatId="0"
    this.cmbPlaylistId="0"
    this.FillFormat()
  }
  FillFormat() {
    this.FormatList=[]
    var qry = "";
    var innerQry=""
    if ((this.cmbCustomerMediaType == 'Signage') || (this.cmbCustomerMediaType == 'Video')){
      innerQry= " and sf.mediatype in('Signage','Video') "
    }
    else if ((this.cmbCustomerMediaType == 'Audio')){
      innerQry= " and sf.mediatype in('Audio Copyright','Audio DirectLicence', 'Audio') "
    }
    else{
      innerQry= " and sf.mediatype in('"+this.cmbCustomerMediaType+"') "
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
      this.cmbCustomerId +
      ' OR sf.dfclientid=' +
      this.cmbCustomerId +
      ")"+ innerQry +
      "  group by  sf.formatname";
      this.loading = true;
      this.sfService.FillCombo(qry).pipe()
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
  onChangeFormat(id) {
    this.PlaylistList = [];
    this.cmbPlaylistId="0"
    this.FillPlaylist(id);
  }
  FillPlaylist(id) {
    this.loading = true;
    this.sfService.Playlist(id).pipe()
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
  AddItem(){
    const objFormat= this.FormatList.filter(o => o.Id== this.cmbFormatId)
    const objPlaylist= this.PlaylistList.filter(o => o.Id== this.cmbPlaylistId)
    this.listofSelectedPlaylist= this.listofSelectedPlaylist.filter(o=> o.playlistId != this.cmbPlaylistId)
    this.listofSelectedPlaylist.push({
      _id:Math.random(),
      formatname:objFormat[0].DisplayName,
      formatid:this.cmbFormatId,
      playlistName:objPlaylist[0].DisplayName,
      playlistId:this.cmbPlaylistId
    })
    this.cmbPlaylistId="0"
  }
  RemoveItem(_id){
    this.listofSelectedPlaylist= this.listofSelectedPlaylist.filter(o=> o._id !=_id)
  }
  SaveCopyPlaylist(){
    if (this.listofSelectedPlaylist.length==0){
      return
    }
    let payload=[]
    this.listofSelectedPlaylist.forEach(item => {
      payload.push({
        formatid:item["formatid"],
        splPlaylistId:item["playlistId"],
        toClientId:this.cmbCopyCustomerId
      })
    });
    this.loading = true;
    this.sfService.SaveCopyPlaylist(payload).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;
        if (obj.response == "1") {
          this.toastr.info("Saved", '');
          this.ClearConstrols();
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
  ClearConstrols(){
    this.CustomerList=[]
    this.cmbCustomerId="0"
    this.FormatList=[]
    this.PlaylistList=[]
    this.cmbCustomerMediaType=""
    this.cmbFormatId="0"
    this.cmbPlaylistId="0"
    this.listofSelectedPlaylist=[]
    this.cmbCopyCustomerId="0"
    this.CopyCustomerList=[]
  }
}
