import { Component, OnInit,Input  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from "rxjs";
import { SrDownloadTemplateService } from '../download-template/sr-download-template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mytemplate',
  templateUrl: './mytemplate.component.html',
  styleUrls: ['./mytemplate.component.css']
})
export class MytemplateComponent implements OnInit {
  loading = false;
  @Input() resetFormSubject_ConvertUrl: Subject<boolean> = new Subject<boolean>();
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
  TemplateSelected_Own=[];
  chkAll:boolean=false;
  SearchCDate;
  chkIsAnnouncement=false
  frmUrl_Convert: FormGroup;
  activeTab =1
  CurrentValue = 0;
  MaxValue = 0;
  preventAbuse = false;

  
  constructor(private formBuilder: FormBuilder,private dService: SrDownloadTemplateService,  public toastr: ToastrService,
    private serviceLicense: SerLicenseHolderService, public auth:AuthService,private modalService: NgbModal) { 
       }

  ngOnInit () {
    this.initUrlForm()
    var cd = new Date();
    this.SearchCDate = cd;
    this.FillClientList();
    this.resetFormSubject_ConvertUrl.subscribe(response => {
      if(response){
        var cd = new Date();
        this.SearchCDate = cd;
        this.activeTab =1
        this.ResetPage();
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.CustomerId = localStorage.getItem('dfClientId');
          this.frmUrl_Convert.controls['cmbCustomer'].setValue(this.CustomerId);
          this.onChangeCustomer(this.CustomerId);
        }
    }
  });
  }
ResetPage(){
  
  this.TemplateSelected=[];
  this.TemplateSelected_Own=[];
  this.CustomerId="0";
  this.cmbGenre="0";
  this.cmbFolder="0";
  this.FolderName="";
  this.TemplateList=[];
  this.MainTemplateList=[];
  this.chkAll=false;
  this.frmUrl_Convert.reset();
  this.initUrlForm();
  this.CurrentValue = 0;
  this.MaxValue = 0;
  this.preventAbuse = false;
  this.CrTime=0;
  this.pauseTimer() 
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

  openGenreModal(mdl,SaveFrom) {
    if (SaveFrom=='Editor'){
    if (this.CustomerId=="0"){
      this.toastr.info("Please select a customer name");
      return;
    }
  }
  if (SaveFrom=='Own'){
    if (this.frmUrl_Convert.value.cmbCustomer==0){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.CustomerId = this.frmUrl_Convert.value.cmbCustomer
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
    this.dService.GetOwnTemplates(this.CustomerId, this.cmbGenre, this.SearchCDate, '').pipe()
      .subscribe(data => {
        if (data['response']=="1"){
          this.TemplateList = JSON.parse(data['data']);
        }
        else{
          this.TemplateList =[]
        }
        this.TemplateList.forEach(item => {
          item["Refersh"]= item["duration"]*3
        });
        //this.TemplateList.sort(this.GetSortOrder("createdAt",false));
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
      if(duration>60){
        this.toastr.info("You can enter maximum duration up to 60 seconds", '');
        this.TemplateList.forEach(item => {
          if (item["id"] == id){
            item["check"]=true
          }
        });
        setTimeout(() => {
        this.TemplateList.forEach(item => {
        var objT= this.TemplateSelected.filter(o=>o.id==item["id"])
        if (objT.length==1){
          item["check"]=true
        }
        else{
          item["check"]=false
        }
      });
    }, 100);
        return
      }


      var TemplateSelected_length =this.TemplateSelected.length+1;
      if (TemplateSelected_length>5){
        this.toastr.info("Only five url will convert at one time.", '');
        this.TemplateList.forEach(item => {
          if (item["id"] == id){
            item["check"]=true
          }
        });
        setTimeout(() => {
        this.TemplateList.forEach(item => {
        var objT= this.TemplateSelected.filter(o=>o.id==item["id"])
        if (objT.length==1){
          item["check"]=true
        }
        else{
          item["check"]=false
        }
      });
    }, 100);
        return;
      }
      TemplateItem["TemplateName"] = name;
      TemplateItem["Url"] = url;
      TemplateItem["id"] = id;
      TemplateItem["duration"] = duration;
      TemplateItem["Refersh"] = Refersh;
      TemplateItem["GenreId"] = this.cmbGenre;
      TemplateItem["FolderId"] = this.cmbFolder;
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
  DownloadTemplate(ConvertType){
    if (ConvertType=="Editor"){
if (this.CustomerId=="0"){
  this.toastr.info("Please select a customer.", '');
  return;
}
if (this.cmbGenre=="0"){
  this.toastr.info("Please select a genre.", '');
  return;
}
if (this.TemplateSelected.length==0){
  this.toastr.info("Please select atleast one template.", '');
  return;
}
  if (this.TemplateSelected.length>5){
    this.toastr.info("Only five url will convert at one time.", '');
    return;
  }
  this.TemplateSelected.forEach(item=>{
    item["IsAnnouncement"] = this.chkIsAnnouncement;
  });
  
}
else{
  if (this.frmUrl_Convert.value.cmbCustomer==0){
    this.toastr.info("Please select a customer.", '');
    return;
  }
  if (this.frmUrl_Convert.value.cmbGenre==0){
    this.toastr.info("Please select a genre.", '');
    return;
  }
  if (this.TemplateSelected_Own.length==0){
    this.toastr.info("Please add atleast one template.", '');
    return;
  }
  this.TemplateSelected_Own.forEach(item=>{
    item["IsAnnouncement"] = this.frmUrl_Convert.value.IsAnnouncement;
  });

  
  this.CustomerId = this.frmUrl_Convert.value.cmbCustomer;
  this.cmbGenre= this.frmUrl_Convert.value.cmbGenre;
  this.cmbFolder= this.frmUrl_Convert.value.cmbFolder;
  this.TemplateSelected= []
  this.TemplateSelected= this.TemplateSelected_Own
}
this.loading = false;
this.preventAbuse = true;

    this.CalPrograssBarTimer(this.TemplateSelected);
    this.dService.DownloadTemplatesConvertTOMp4(this.CustomerId,this.cmbGenre,this.cmbFolder,this.TemplateSelected).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.preventAbuse = false;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          this.preventAbuse = false;
          this.TemplateSelected=[];
          this.TemplateSelected_Own=[];
          this.CustomerId="0";
          this.cmbGenre="0";
          this.cmbFolder="0";
          this.FolderName="";
          this.TemplateList=[];
          this.MainTemplateList=[];
          this.chkAll=false;
          this.CurrentValue = 0;
          this.MaxValue = 0;
          this.CrTime=0;
          this.ResetPage();
          this.pauseTimer() 

        })
  }
  interval;
  CrTime: number=0;
  CalPrograssBarTimer(array){
    this.CurrentValue = 0;
    var totalUrl= array.length
    var totalSeconds = totalUrl*130
    this.MaxValue=totalSeconds+30
    this.startTimer()
  }
  startTimer() {
    this.interval = setInterval(() => {
        this.CrTime++
        if ((this.CrTime == (this.MaxValue-30)) && (this.preventAbuse == true)){
          this.MaxValue=this.MaxValue+30;
        }
        if (this.preventAbuse ==false){
          this.CurrentValue= this.MaxValue
          this.toastr.info("Content Downloaded.", '');
          this.TemplateSelected=[];
          this.TemplateSelected_Own=[];
          this.CustomerId="0";
          this.cmbGenre="0";
          this.cmbFolder="0";
          this.FolderName="";
          this.TemplateList=[];
          this.MainTemplateList=[];
          this.chkAll=false;
          this.CurrentValue = 0;
          this.MaxValue = 0;
          this.CrTime=0;
          this.ResetPage();
          this.pauseTimer() 
        }
        this.CurrentValue=this.CrTime
    },1000)
  }
  pauseTimer() {
    clearInterval(this.interval);
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
  OpenViewContent(modalName, cnt,oType){

    let clsName=''
    if (oType=="496"){
      localStorage.setItem("oType",oType)
      clsName='lgx'
    }
    if (oType=="495"){
      localStorage.setItem("oType",oType)
        clsName= 'smg'
      }
      localStorage.removeItem('innerHtml')
      localStorage.setItem('innerHtml',cnt)
    this.modalService.open(modalName, {
      size: clsName,
    }); 

     
    
  }
  CloseModal(){
    this.modalService.dismissAll();
  }
  initUrlForm(){
    this.frmUrl_Convert = this.formBuilder.group({
      id: [0],
      cmbCustomer: [0],
      cmbFolder: [0],
      cmbGenre:[0],
      urlName: [""],
      duration: [20],
      refersh: [50],
      urlLink: [""],
      dbType:[localStorage.getItem('DBType')],
      IsAnnouncement:[false]
    });
   }
   
  AddItem(){
    var TemplateSelected_length = this.TemplateSelected_Own.length + 1
    if (TemplateSelected_length>5){
      this.toastr.info("Only five url will convert at one time.", '');
      return;
    }
    if (this.frmUrl_Convert.value.urlName==""){
      this.toastr.info("Template name cannot be blank", '');
      return;
    }
    if ((this.frmUrl_Convert.value.duration=="") || (this.frmUrl_Convert.value.duration==0)){
      this.toastr.info("Duration cannot be blank", '');
      return;
    }
    if (this.frmUrl_Convert.value.Url==""){
      this.toastr.info("Template url cannot be blank", '');
      return;
    }
    if(this.frmUrl_Convert.value.duration>60){
      this.toastr.info("You can enter maximum duration up to 60 seconds", '');
      this.frmUrl_Convert.controls['duration'].setValue(60);
      return;
    }
    var TemplateItem = {};
    TemplateItem = {};
    TemplateItem["TemplateName"] = this.frmUrl_Convert.value.urlName;
    TemplateItem["Url"] = this.frmUrl_Convert.value.urlLink;
    TemplateItem["id"] = this.frmUrl_Convert.value.id;
    TemplateItem["duration"] = this.frmUrl_Convert.value.duration;
    TemplateItem["Refersh"] = this.frmUrl_Convert.value.refersh;
    TemplateItem["IsAnnouncement"] = this.frmUrl_Convert.value.IsAnnouncement;
    TemplateItem["FolderId"] = this.frmUrl_Convert.value.cmbFolder;
    TemplateItem["GenreId"] = this.frmUrl_Convert.value.cmbGenre;
    var gname="";
    if (this.frmUrl_Convert.value.cmbGenre =="496"){
      gname="Landscape Url"
    }
    if (this.frmUrl_Convert.value.cmbGenre =="495"){
      gname="Portrait Url"
    }
    TemplateItem["Orientation"] = gname;

    this.TemplateSelected_Own.push(TemplateItem);
    this.frmUrl_Convert.controls['urlName'].setValue("");
    this.frmUrl_Convert.controls['urlLink'].setValue("");

}
  RemoveItem(index){
    try {
      this.TemplateSelected_Own.splice(index, 1);
    } catch (error) {
      
    }
  }
  onNavChange(changeEvent: NgbNavChangeEvent){
    this.ResetPage();

  }

}