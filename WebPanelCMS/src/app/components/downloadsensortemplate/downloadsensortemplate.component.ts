import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SrDownloadTemplateService } from '../download-template/sr-download-template.service';
import { MachineService } from '../machine-announcement/machine.service';

@Component({
  selector: 'app-downloadsensortemplate',
  templateUrl: './downloadsensortemplate.component.html',
  styleUrls: ['./downloadsensortemplate.component.css']
})
export class DownloadsensortemplateComponent implements OnInit {
  public loading = false;
  TemplateList=[];
  MainTemplateList=[];
  CustomerList: any[];
  GenreList=[];
  FolderList=[];

  cmbGenre = "0";
  cmbFolder = "0";
  CustomerId = "0";

  FolderName = "";
  NewFolderName: string = "";
  TemplateSelected=[];
  chkAll:boolean=false;
  SearchCDate;
  SearchTokenList;
  cmbSearchToken; 
  dropdownSettings = {};
  SongsSelected=[];
    constructor(private dService: SrDownloadTemplateService,  public toastr: ToastrService,
    private serviceLicense: SerLicenseHolderService, public auth:AuthService,private modalService: NgbModal,private mService:MachineService) { }
 
  ngOnInit(): void {
    var cd = new Date();
    this.SearchCDate = cd;
this.FillClientList();
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');


    this.serviceLicense.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.FillGenre();
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.CustomerId = localStorage.getItem('dfClientId');
          this.onChangeCustomer(this.CustomerId);
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillGenre() {
    this.loading = true;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var qry = "select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ";
    qry = qry + " where 1=1 ";
    qry = qry + " and genreid in(303,297) ";
    /*
    if ((this.auth.ContentType$=="Signage")){
      qry = qry + " and genreid in(303,297) ";
    }
    if ((this.auth.ContentType$=="MusicMedia")){
      qry = qry + " and genreid in(326) ";
     }
  if ((this.auth.ContentType$=="Both")){
    qry = qry + " and genreid in(303,297) ";
  }
  */
    qry = qry + " order by genre ";
     
    this.serviceLicense.FillCombo(qry).pipe()
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

  onChangeCustomer(id){
    this.TemplateSelected=[];
    this.cmbGenre="0";
    this.cmbFolder="0";
    this.TemplateList=[];
    this.MainTemplateList=[];
    this.chkAll=false;
    this.FillToken(id);
  }
  FillToken(id){
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
            this.SearchTokenList= this.SearchTokenList.filter(order => order.DeviceType==='Sanitizer')
            this.SearchTokenList.forEach(element => {
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
          itemsShowLimit: 1
        };
        
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  openGenreModal(mdl) {
    if (this.CustomerId=="0"){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  NewfList;
  GetJSONFolderRecord = (array): void => {
    this.NewfList = this.FolderList.filter(order => order.Id == array.Id);
  }
  onChangeFolder(id){
    this.FolderName="";
    var ArrayItem = {};
    var fName = "";
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.cmbFolder = id;
    this.GetJSONFolderRecord(ArrayItem);
    if (this.NewfList.length > 0) {
      this.FolderName = this.NewfList[0].DisplayName;
    }
  }


  onSubmitNewGenre() {
    if (this.NewFolderName == "") {
      this.toastr.info("Folder name cannot be blank", '');
      return;
    }

    
  }
  




  FillTemplates() {
if (this.CustomerId=='0'){
  return;
}
if (this.cmbGenre=='0'){
  return;
}

    this.loading = true;
    this.dService.GetTemplates(this.CustomerId, this.cmbGenre, this.SearchCDate, '').pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TemplateList= JSON.parse(returnData);
        this.TemplateList.sort(this.GetSortOrder("createdAt",false));
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
   GetSortOrder(prop,asc) {    
    return function(a, b) {    
      if (asc) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    } else {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    }   
        return 0;    
    }    
}    

  allTemplates(event){
    var TemplateItem = {};
    const checked = event.target.checked;
    this.TemplateSelected=[];
    this.TemplateList.forEach(item=>{
      TemplateItem = {};
      item.check = checked;
      TemplateItem["TemplateName"] = item.name;
      TemplateItem["Url"] = item.videoUrl;
      TemplateItem["id"] = item.id;
      this.TemplateSelected.push(TemplateItem);
    });
    if (checked==false){
      this.TemplateSelected=[];
    }
  }

  SelectTemplates(url,name,id, event) {
    var TemplateItem = {};
    if (event.target.checked) {
      
      TemplateItem["TemplateName"] = name;
      TemplateItem["Url"] = url;
      TemplateItem["id"] = id;
      this.TemplateSelected.push(TemplateItem)
    }
    else {
      TemplateItem["TemplateName"] = name;
      TemplateItem["Url"] = url;
      TemplateItem["id"] = id;
      this.removeDuplicateRecord(TemplateItem);
    }
  }
  removeDuplicateRecord = (array): void => {
    this.TemplateSelected = this.TemplateSelected.filter(order => order.id !== array.id);
  }
  DownloadTemplate(){
if (this.CustomerId=="0"){
  this.toastr.info("Please select a customer.", '');
  return;
}
if (this.cmbGenre=="0"){
  this.toastr.info("Please select a genre.", '');
  return;
}
if (this.cmbSearchToken.length == '0') {
  this.toastr.error("Please select a player", '');
  return;
}
if (this.TemplateSelected.length==0){
  this.toastr.info("Please select atleast one template to download.", '');
 // return;
}

    this.loading = true;
    this.dService.DownloadTemplates(this.CustomerId,this.cmbGenre,this.cmbFolder,this.TemplateSelected).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce=="1"){
          this.AddSong(obj.TitleId)
          //this.toastr.info("Content Downloaded.", '');
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  AddSong(id){
    this.SongsSelected=[];
    this.SongsSelected.push(id);   
    this.loading = true;
    this.mService.SaveMachineAnnouncement(this.cmbSearchToken, this.SongsSelected, false).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;
        if (obj.Responce == "1") {
          this.toastr.info("Content Downloaded", '');
          this.cmbSearchToken=[];
          this.SongsSelected=[];
          this.TemplateSelected=[];
          this.CustomerId="0";
          this.cmbGenre="0";
          this.cmbFolder="0";
          this.TemplateList=[];
          this.MainTemplateList=[];
          this.chkAll=false;
          this.loading = false;
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






  onChangeGenre(id){
    var orientation="";
    if (id=="303"){
      orientation="portrait";
    }
    if (id=="297"){
      orientation="landscape";
    }
    this.FillTemplates();
    //this.FilterRecord(orientation);
    //this.TemplateList.sort(this.GetSortOrder("createdAt",false));
  }
  
  FilterRecord = (orientation): void => {
    this.TemplateList = this.MainTemplateList.filter(order => order.orientation === orientation);
  }
}
