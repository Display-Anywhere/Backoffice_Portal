import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { MachineService } from '../machine-announcement/machine.service';

@Component({
  selector: 'app-kpn-channels',
  templateUrl: './kpn-channels.component.html',
  styleUrls: ['./kpn-channels.component.css']
})
export class KpnChannelsComponent implements OnInit {
  loading = false
  ChannelList=[]
  ChannelSource={}
  CustomerList: any[];
  cmbCustomer;
  TokenList=[];
  cmbToken
  dropdownSettings = {};
  ChannelSelected = [];
  cmbSearchCustomer;
  SearchTokenList=[];
  cmbSearchToken
  PlayerChannelList=[]
  chid="";
  constructor(private serviceLicense: SerLicenseHolderService, public toastr: ToastrService,
    private modalService: NgbModal,public auth:AuthServiceOwn, 
    private mService:MachineService) { }

  async ngOnInit(){
    await this.FillClient()
    await this.KPN_Login()
  }
  FillClient() {
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.mService.FillCombo(q).pipe()
      .subscribe(async data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {

          this.cmbCustomer=localStorage.getItem('dfClientId')
          await this.onChangeCustomer(localStorage.getItem('dfClientId'))
     
          this.cmbSearchCustomer=localStorage.getItem('dfClientId')
         await this.onChangeSearchCustomer(localStorage.getItem('dfClientId'))

        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id){
    this.SearchTokenList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
          this.SearchTokenList= this.SearchTokenList.filter(order => order.IsKpnActive==='1')
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeToken(id){
    this.PlayerChannelList=[]
    this.loading = true;
    this.mService.GetPlayerKpnChannels(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          this.PlayerChannelList = JSON.parse(obj.data)
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  openDeleteModal(mContent, id) {
    this.chid= id;
    this.modalService.open(mContent);
  }
  DeleteChannel() {
    this.loading = true;
    this.mService.RemovePlayerKpnChannel(this.chid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.response == "1") {
          this.chid="";
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.onChangeToken(this.cmbSearchToken);
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
    this.cmbToken=[];
    this.ChannelSelected = []
    this.FillTokenInfo(id)
  }
  FillTokenInfo(id){
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.TokenList= this.TokenList.filter(order => order.IsKpnActive==='1')

            this.TokenList.forEach(element => {
              element['commonName']= element['tokenCode'] + '-'+ element['location']+ '-' + element['city']
            });
        this.loading = false;
        this.dropdownSettings = {
          singleSelection: false,
          text: "",
          idField: 'tokenid',
          textField: 'commonName',
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
  FillChannelList() {
     
  this.loading = true;
    this.serviceLicense.GetKpnChannels().pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        const res = JSON.parse(obj.data)
  this.ChannelList=[]
  if (res.resultCode ==0 ){
    this.ChannelList = res.resultObj
    this.ChannelList.forEach(item => {
      item["iChecked"]=false
    });
  }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  KPN_Login() {
    this.loading = true;
    
     this.serviceLicense.kpnLogin().pipe()
      .subscribe(async data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        const res = JSON.parse(obj.data)
        localStorage.setItem('code',res.access)
        this.loading = false;
        await this.FillChannelList()
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  GetChannelDetail(id) {
    this.loading = true;
     
     this.serviceLicense.GetKpnChannelDetails(id).pipe()
      .subscribe(async data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        const res = JSON.parse(obj.data)
  this.ChannelSource={}
  if (res.resultCode ==0 ){
    this.ChannelSource = res.resultObj.sources
  }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  async OpenChannelDetailModel(modalName,id){

    await this.GetChannelDetail(id)
    this.modalService.open(modalName, {
      size: 'lg',
      windowClass: 'tokenmodal',
    }); 
  }
  SelectChannel(fileid, event) {
    
    if (event.target.checked) {
      this.ChannelSelected.push(fileid);
    }
    else {
      const index: number = this.ChannelSelected.indexOf(fileid);
      if (index !== -1) {
        this.ChannelSelected.splice(index, 1);
      }
    }
   /* this.ChannelList.forEach(item => {
      item["iChecked"]=false
      if (item["id"]== fileid){
        item["iChecked"]=true
      }
    });*/
  }
  SaveChannels(){
    if (this.cmbToken.length == '0') {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.ChannelSelected.length == 0) {
      this.toastr.error("Select atleast one channel", '');
      return;
    }
      
    this.loading = true;
    let channel=[]
    for (let index = 0; index < this.ChannelSelected.length; index++) {
      const cid = this.ChannelSelected[index];
      const obj = this.ChannelList.filter(o => o.id==cid)
      channel =[
        ...channel,
        {
          channelid:obj[0].id,
          channelname:obj[0].fullname,
          channellabel:obj[0].label,
          channeldesc:obj[0].notes
        }
      ]
    }
    this.mService.AssignKpnChannels(this.cmbToken, channel).pipe()
      .subscribe(async data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;

        if (obj.Responce == "1") {
          
          this.toastr.info("Saved", '');
          var payload=[]
          this.cmbToken.forEach(item => {
            payload.push(item["tokenid"])
          });
          await this.publishPlayer(payload)
          
          this.cmbCustomer ='0';
          this.TokenList= [];
          this.cmbToken =[]
          this.ChannelSelected = [];
          channel=[]
          await this.onChangeToken(this.cmbSearchToken)
          this.FillChannelList()
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

  publishPlayer(payload) {
    this.serviceLicense.ForceUpdate(payload).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == '1') {
        this.toastr.info("Changes are published", '');
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
}
