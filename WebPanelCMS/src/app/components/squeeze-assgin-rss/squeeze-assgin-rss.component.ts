import { Component, OnInit, ViewContainerRef, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { AdsService } from 'src/app/ad/ads.service';

@Component({
  selector: 'app-squeeze-assgin-rss',
  templateUrl: './squeeze-assgin-rss.component.html',
  styleUrls: ['./squeeze-assgin-rss.component.css']
})
export class SqueezeAssginRssComponent implements OnInit {
  RssTabId=1
  loading=false
  txtRss=""
  pid=""
  tid=""
  RssList=[]
  cmbSearchCustomer = "0";
  SearchCustomerList=[]
  CustomerList=[]
  cmbAssignCustomer="0"
  dropdownSettings = {};
  cmbAssignToken=[];
  AssignTokenList=[];
  AssginRssList=[]
  RssList_All=[]
  chkAll_Rss= false
  RssSelected=[];
  cmbSearchTokenCustomer="0"
  cmbTokenRss="0"
  chkDisplaywithads=false
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  constructor(public auth:AuthServiceOwn,config: NgbModalConfig,private modalService: NgbModal,
    private aService: AdsService, public toastr: ToastrService,) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    await this.FillClientList()
  }
  FillClientList() {
    var str="";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.loading = true;
    this.aService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.SearchCustomerList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id){
    this.GetClientRss()
  }
  openRssDeleteModal(mContent, id){
    this.pid = id;
    this.modalService.open(mContent, { centered: true });
  }
  GetClientRss(){
    this.RssList=[]
    this.loading = true;
     this.aService.FillClientRss(this.cmbSearchCustomer).pipe()
       .subscribe(data => {
         var returnData = JSON.stringify(data);
         var obj = JSON.parse(returnData);
         if (obj.data !=''){
          this.RssList = JSON.parse(obj.data)
         }
         this.loading = false;
       },
         error => {
           this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
           this.loading = false;
         })
   }
  DeleteRss(){
this.loading = true;
    this.aService.DeleteClientRss(this.pid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.response=="1"){
          this.pid=""
          this.txtRss=""
          this.toastr.info("Deleted", '');
          this.GetClientRss()
        }
        else{
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  EditClick(data){
    this.pid=data.id
    this.txtRss=data.rsstext
  }
  SaveClientRss(){
    if (this.cmbSearchCustomer == "0") {
      this.toastr.error("Please select customer");
      return;
    }
    if (this.txtRss == "") {
      this.toastr.error("Rss text cannot be empty");
      return;
    }
    this.loading = true;
    const payload={
      rsstext:this.txtRss,
      id:this.pid,
      clientid:this.cmbSearchCustomer
    }
    this.aService.SaveClientRss(payload).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
          this.pid=""
          this.txtRss=""
          this.GetClientRss()
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

  async onChangeAssignCustomer(e){
    await this.FillPlayerInfo()
    await this.GetClientRss_Assign()
  }
  FillPlayerInfo(){
    this.cmbAssignToken=[];
      this.AssignTokenList=[];
      this.loading = true;
      this.aService.FillTokenInfoMain(this.cmbAssignCustomer).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          this.AssignTokenList = JSON.parse(returnData);
          this.loading = false;
          this.dropdownSettings = {
            singleSelection: false,
            text: "",
            idField: 'tokenid',
            textField: 'tInfo',
            selectAllText: 'All',
            unSelectAllText: 'All',
            itemsShowLimit: 1
          };
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
  }
  
  GetClientRss_Assign(){
    this.RssList_All=[]
    this.loading = true;
     this.aService.FillClientRss(this.cmbAssignCustomer).pipe()
       .subscribe(data => {
         var returnData = JSON.stringify(data);
         var obj = JSON.parse(returnData);
         if (obj.data !=''){
          this.RssList_All = JSON.parse(obj.data)
         }
         this.RssList_All.forEach(item => {
          item["check"]=false
         });
         this.loading = false;
       },
         error => {
           this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
           this.loading = false;
         })
   }
   allRss(event){
    const checked = event.target.checked;
    this.RssSelected=[];
    this.RssList_All.forEach((item) => {
      item.check = checked;
      this.RssSelected.push(item.tokenid);
    });
    if (checked==false){
      this.RssSelected=[];
    }
  }
  SelectRss(fileid, event) {
    if (event.target.checked) {
      this.RssSelected.push(fileid);
    }
    else {
      const index: number = this.RssSelected.indexOf(fileid);
      if (index !== -1) {
        this.RssSelected.splice(index, 1);
      }
    }

  }
   SaveAssignPlayerRss(){
    if (this.cmbAssignToken.length == 0) {
      this.toastr.error("Please select a player", '');
      return;
    }
    if (this.RssSelected.length == 0) {
      this.toastr.error("Please select a text", '');
      return;
    }
    let tokenId=[]
    this.cmbAssignToken.forEach(item => {
      tokenId.push(item["tokenid"])
    });
    this.loading = true;
    const payload={
      rssId:this.RssSelected,
      tokenid:tokenId,
      chkDisplaywithads:this.chkDisplaywithads
    }
    this.aService.SavePlayerRss(payload).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
          this.RssSelected=[]
          this.cmbAssignToken=[]
          this.RssList_All=[]
          this.cmbAssignCustomer="0"
          this.chkAll_Rss=false
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
   onChangeSearchTokenCustomer(id){
    this.loading = true;
      this.aService.FillTokenInfoMain(this.cmbSearchTokenCustomer).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          this.AssignTokenList = JSON.parse(returnData);
          this.loading = false;
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
  }
  GetPlayerAssginRss(){
    this.AssginRssList=[]
    this.loading = true;
     this.aService.GetPlayerAssginRss(this.cmbTokenRss).pipe()
       .subscribe(async data => {
         var returnData = JSON.stringify(data);
         var obj = JSON.parse(returnData);
         if (obj.data !=''){
          this.AssginRssList = JSON.parse(obj.data)
         }
         this.loading = false;
       },
         error => {
           this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
           this.loading = false;
         })
   }
  async onChangeTokenRss(e){
   await this.GetPlayerAssginRss()
  }
  openPlayerRssDeleteModal(mContent, id){
    this.tid = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeletePlayerRss(){
    this.loading = true;
        this.aService.DeletePlayerRss(this.tid).pipe()
          .subscribe(data => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.response=="1"){
              this.tid=""
              this.toastr.info("Deleted", '');
              this.GetPlayerAssginRss()
            }
            else{
              this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            }
            this.loading = false;
          },
            error => {
              this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
              this.loading = false;
            })
      }
      ClearNewRss(){
        this.RssList=[]
        this.cmbSearchCustomer="0"
        this.txtRss=""
        this.pid=""
        this.ClearSearch()
      }
      ClearSearch(){
        this.cmbSearchTokenCustomer="0"
        this.cmbTokenRss="0"
        this.AssignTokenList=[]
        this.tid="0"
        this.AssginRssList=[]
        this.ClearAssign()
      }
      ClearAssign(){
        this.cmbAssignCustomer="0"
        this.cmbAssignToken=[]
        this.AssignTokenList=[]
        this.chkAll_Rss=false
        this.RssList_All=[]
        this.RssSelected=[]
        this.dropdownSettings={}
      }
}
