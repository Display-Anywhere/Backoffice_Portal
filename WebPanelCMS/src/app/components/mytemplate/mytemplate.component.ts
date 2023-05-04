import { Component, OnInit,Input  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from "rxjs";
import { SrDownloadTemplateService } from '../download-template/sr-download-template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenInfoServiceService } from '../token-info/token-info-service.service';
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
  IframeSRC: SafeResourceUrl
  //templateHost ='http://localhost:4201'
   templateHost ='https://templates.display-anywhere.com'
  IsLS_URL= true
  DelpSchid="0"
  constructor(private formBuilder: FormBuilder,private dService: SrDownloadTemplateService,  public toastr: ToastrService,private tService: TokenInfoServiceService,
    private serviceLicense: SerLicenseHolderService, public auth:AuthServiceOwn,private modalService: NgbModal, public sanitizer: DomSanitizer) { 
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
  
  SelectTemplates(url,name,id,duration,Refersh, event, genreid, cnt, bgcolor) {
    var TemplateItem = {};

    var content = JSON.parse(cnt)
    let IframeSRC_Safe = this.templateHost+ '?templateId='+content[0].templateId+'&title='+content[0].title+'&desc='+content[0].desc+'&logosrc='+content[0].logosrc+ '&ngClass='+bgcolor+'&imgSrc='+content[0].imgSrc+ '&text1='+content[0].text1+'&text2='+content[0].text2+ '&text3='+content[0].text3+'&text4='+content[0].text4+'&imgSrc2='+content[0].imgSrc2+'&imgSrc3='+content[0].imgSrc3+'&imgSrc4='+content[0].imgSrc4+'&imgSrc5='+content[0].imgSrc5+'&imgSrc6='+content[0].imgSrc6+'&imgSrc7='+content[0].imgSrc7+'&imgSrc8='+content[0].imgSrc8+ '&text5='+content[0].text5+ '&text6='+content[0].text6+ '&text7='+content[0].text7+ '&text8='+content[0].text8+ '&text9='+content[0].text9+ '&text10='+content[0].text10
    url= IframeSRC_Safe
    if (event.target.checked) {
      if(duration>180){
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
  OpenViewContent(modalName,id, cnt,oType,bgcolor){
    let clsName=''
    if (oType=="496"){
      clsName='Template'
      this.IsLS_URL = true
    }
    if (oType=="495"){
        clsName= 'PT-Template'
        this.IsLS_URL= false
      }
    this.modalService.open(modalName, {
      size: clsName,
    }); 
    var content = JSON.parse(cnt)
    let IframeSRC_Safe = this.templateHost+ '?templateId='+content[0].templateId+'&title='+content[0].title+'&desc='+content[0].desc+'&logosrc='+content[0].logosrc+ '&ngClass='+bgcolor+'&imgSrc='+content[0].imgSrc+ '&text1='+content[0].text1+'&text2='+content[0].text2+ '&text3='+content[0].text3+'&text4='+content[0].text4+'&imgSrc2='+content[0].imgSrc2+'&imgSrc3='+content[0].imgSrc3+'&imgSrc4='+content[0].imgSrc4+'&imgSrc5='+content[0].imgSrc5+'&imgSrc6='+content[0].imgSrc6+'&imgSrc7='+content[0].imgSrc7+'&imgSrc8='+content[0].imgSrc8+ '&text5='+content[0].text5+ '&text6='+content[0].text6+ '&text7='+content[0].text7+ '&text8='+content[0].text8+ '&text9='+content[0].text9+ '&text10='+content[0].text10+'&logosrc2='+content[0].logosrc2
    console.log(IframeSRC_Safe)
    this.IframeSRC = this.sanitizer.bypassSecurityTrustResourceUrl(IframeSRC_Safe);
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

  EditTemplate(id, cnt,genreId,bgcolor, duration, TemplateName,data){
    var content = JSON.parse(cnt)
    if (content[0].bgImgColor == undefined){
      content[0].bgImgColor= "000000"
    }
    var templatedata = {
      _Id:id,
      TemplateName: TemplateName,
      clientid:this.CustomerId,
      templateId: content[0].templateId,
      genreId:genreId,
      imgurl:content[0].imgSrc,
      title:content[0].title,
      desc:content[0].desc,
      logoimgurl:content[0].logosrc,
      logoimgurl2:content[0].logosrc2,
      text1:content[0].text1,
      text2:content[0].text2,
      text3: content[0].text3,
      text4: content[0].text4,

      text5:content[0].text5,
      text6:content[0].text6,
      text7: content[0].text7,
      text8: content[0].text8,
      text9: content[0].text9,
      text10: content[0].text10,
      width:'0',
      height:'0',
      duration:duration,
      bgcolor:'#'+bgcolor,
      imgurl2:content[0].imgSrc2,
      imgurl3:content[0].imgSrc3,
      imgurl4:content[0].imgSrc4,
      imgurl5:content[0].imgSrc5,
      imgurl6:content[0].imgSrc6,
      imgurl7:content[0].imgSrc7,
      imgurl8:content[0].imgSrc8,
      selected_logoName:content[0].selected_logoName,
      selected_logoName2:content[0].selected_logoName2,
      selected_imgName:content[0].selected_imgName,
      selected_imgName2:content[0].selected_imgName2,
      selected_imgName3:content[0].selected_imgName3,
      selected_imgName4:content[0].selected_imgName4,
      selected_imgName5:content[0].selected_imgName5,
      selected_imgName6:content[0].selected_imgName6,
      selected_imgName7:content[0].selected_imgName7,
      selected_imgName8:content[0].selected_imgName8,
      bgImgColor:'#'+content[0].bgImgColor,
      tvurl:data.tvurl,
      roomurl:data.roomurl,
      tstadurl:data.tstadurl,
      mustseeurl:data.mustseeurl,
      musteaturl:data.musteaturl,
      mustshopurl:data.mustshopurl
    }
    console.log(genreId)
    if (genreId=="496"){
      localStorage.setItem("edittemplategenre",'LS')
    }
    if (genreId=="495"){
      localStorage.setItem("edittemplategenre",'PT')
    }
    localStorage.setItem("edittemplate",content[0].templateId)
    localStorage.setItem("edittemplatecontent",JSON.stringify(templatedata))
    this.auth.SetEditTemplateOpen(true)

  }
  openDeleteModal(content, pschid) {
    this.DelpSchid = pschid;
    this.modalService.open(content, { centered: true });  }
  DeleteTemplate() {
    this.loading = true;
    this.dService.DeleteTemplate(this.DelpSchid).pipe().subscribe((data) => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == '1') {
          this.toastr.info('Deleted', 'Success!');
          this.SaveModifyInfo('0','Template is delete ');
          this.loading = false;
          this.FillTemplates();
        } else {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
  }
  SaveModifyInfo(tokenid, ModifyText) {
    this.tService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }
  async SaveUrl(){
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
      var templateCount = this.TemplateSelected.length - 1
    this.loading = true;
    for (let index = 0; index < this.TemplateSelected.length; index++) {
      var body =`{
        "id": "0",
        "cmbCustomer": "${this.CustomerId}",
        "cmbFolder": "${this.cmbFolder}",
        "cmbGenre": "${this.cmbGenre}",
        "urlName": "${this.TemplateSelected[index].TemplateName}",
        "duration": "${this.TemplateSelected[index].duration}",
        "refersh": "${this.TemplateSelected[index].Refersh}",
        "urlLink": "https://templates.display-anywhere.com?id=${this.TemplateSelected[index].id}",
        "dbType": "Nusign",
        "IsAnnouncement": false,
        "duration_min":1,
        "refershtime_min":1,
        "Url_Time_With_Min": false
    }`
    await this.serviceLicense.SaveTemplateUrl(body).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == "1") {
        if (templateCount == index)
        {
          this.toastr.info("Saved", 'Success!');
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
          this.loading = false;
          this.SaveModifyInfo(
            0,
            'Template add/modify with these values '+ body
          );
        }
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
      
    
    
    
  }
}