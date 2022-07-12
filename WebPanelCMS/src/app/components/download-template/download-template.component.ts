import { Component, OnInit,Input  } from '@angular/core';
import { SrDownloadTemplateService } from './sr-download-template.service';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from "rxjs";
@Component({
  selector: 'app-download-template',
  templateUrl: './download-template.component.html',
  styleUrls: ['./download-template.component.css']
})
export class DownloadTemplateComponent implements OnInit {
  public loading = false;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
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
  chkIsAnnouncement=false
    constructor(private dService: SrDownloadTemplateService,  public toastr: ToastrService,
    private serviceLicense: SerLicenseHolderService, public auth:AuthServiceOwn,private modalService: NgbModal) { 
      
    }
    
  ngOnInit() {
    
    var cd = new Date();
    this.SearchCDate = cd;
    this.FillClientList();
    this.resetFormSubject.subscribe(response => {
      if(response){
        var cd = new Date();
        this.SearchCDate = cd;
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.CustomerId = localStorage.getItem('dfClientId');
          this.onChangeCustomer(this.CustomerId);
        }
    }
  });
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
    qry = qry + " and genreid in(495,496) ";
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
    this.FolderName="";
    this.TemplateList=[];
    this.MainTemplateList=[];
    this.chkAll=false;
    this.FillFolder(id);
  }
  FillFolder(cid) {
    this.loading = true;
    var qry = "select folderId as Id, foldername as DisplayName  from tbFolder ";
    qry = qry + " where isnull(IsPromoFolder,0)=0 and  dfclientId="+cid+" ";
    qry = qry + " order by foldername ";
    this.serviceLicense.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.FolderList = JSON.parse(returnData);
        this.loading = false;
        
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

    this.serviceLicense.SaveFolder(this.cmbFolder, this.NewFolderName, this.CustomerId,false,false,'01-01-1900').pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
          this.cmbFolder = "0";
          this.FolderName="";
          this.FillFolder(this.CustomerId);
          this.modalService.dismissAll();
        }
        else if (obj.Responce == "-2") {
          this.toastr.info("This folder name already exists", '');
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
  




  FillTemplates() {
    this.TemplateList=[];
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
        this.TemplateList.forEach(item => {
          item["Refersh"]= item["duration"]*3
        });
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
      TemplateItem["Url"] = item.url;
      TemplateItem["id"] = item.id;
      TemplateItem["duration"] = item.duration;
      TemplateItem["Refersh"] = item.Refersh;
      TemplateItem["IsAnnouncement"] = this.chkIsAnnouncement;
      this.TemplateSelected.push(TemplateItem);
    });
    if (checked==false){
      this.TemplateSelected=[];
    }
  }

  SelectTemplates(url,name,id,duration,Refersh, event) {
    var TemplateItem = {};
    if (event.target.checked) {
      
      TemplateItem["TemplateName"] = name;
      TemplateItem["Url"] = url;
      TemplateItem["id"] = id;
      TemplateItem["duration"] = duration;
      TemplateItem["Refersh"] = Refersh;
      TemplateItem["IsAnnouncement"] = this.chkIsAnnouncement;
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
if (this.TemplateSelected.length==0){
  this.toastr.info("Please select atleast one template to download.", '');
  return;
}

this.TemplateSelected.forEach(item=>{
  item["IsAnnouncement"] = this.chkIsAnnouncement;
});

    this.loading = true;

    this.dService.DownloadTemplates_new(this.CustomerId,this.cmbGenre,this.cmbFolder,this.TemplateSelected).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce=="1"){
          this.toastr.info("Content Downloaded.", '');
        }
        this.TemplateSelected=[];
        this.CustomerId="0";
        this.cmbGenre="0";
        this.cmbFolder="0";
        this.FolderName="";
        this.TemplateList=[];
        this.MainTemplateList=[];
        this.chkAll=false;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeGenre(id){
    var orientation="";
    if (id=="495"){
      orientation="portrait";
    }
    if (id=="496"){
      orientation="landscape";
    }
    this.FillTemplates();
    //this.FilterRecord(orientation);
    //this.TemplateList.sort(this.GetSortOrder("createdAt",false));
  }
  
  FilterRecord = (orientation): void => {
    this.TemplateList = this.MainTemplateList.filter(order => order.orientation === orientation);
  }
  OpenViewContent(modalName, url,oType){


    localStorage.setItem("ViewContent",url)
    
    if (oType!="portrait"){
      localStorage.setItem("oType","496")
      this.modalService.open(modalName, {
        size: 'lgx',
      }); 
    }
    if (oType=="portrait"){
      localStorage.setItem("oType","495")
      this.modalService.open(modalName,{
        size: 'smg'
      }); 
    }
    
  }
  CloseModal(){
    this.modalService.dismissAll();
  }
}
//http://jsfiddle.net/194rbn3s/5/