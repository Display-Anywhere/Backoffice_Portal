import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { AdsService } from 'app/mock-api/services/ads.service';
import { SerLicenseHolderService } from 'app/mock-api/services/ser-license-holder.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
@Component({
  selector: 'app-template-url',
  templateUrl: './template-url.component.html',
  styleUrls: ['./template-url.component.css']
})
export class TemplateUrlComponent implements OnInit {
  frmUrl: FormGroup;
  loading = false;
  @Input() resetFormSubject_Url: Subject<boolean> = new Subject<boolean>();
  SearchCustomerList = [];
  CustomerList=[];
  UrlList=[]
  page: number = 1;
  pageSize: number = 20;
  aid;
  del_urlname=""
  FolderList=[]
  UrlActiveTabId=1
  cmbSearchCustomer="0";
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  listOfOrientation=[
    {Id:"0",DisplayName:""},
    {Id:"496",DisplayName:"Landscape Url"},
    {Id:"495",DisplayName:"Portrait Url"},
    
  ]
  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef
    , config: NgbModalConfig, private modalService: NgbModal, private aService: AdsService,
    public auth:AuthServiceOwn, configTime: NgbTimepickerConfig,private serviceLicense: SerLicenseHolderService) {
      config.backdrop = 'static';
      config.keyboard = false;
  
     }

  async ngOnInit()  {
    this.initUrlForm();
    //await this.FillClientList();
      this.frmUrl.get('cmbCustomer').setValue(localStorage.getItem('selecteddfClientId'));
      this.onChangeCustomer(localStorage.getItem('selecteddfClientId'));
      this.cmbSearchCustomer=localStorage.getItem('selecteddfClientId')
      this.onChangeSearchCustomer(localStorage.getItem('selecteddfClientId'))
    

  }
  get frmU() {
    return this.frmUrl.controls;
  }
 initUrlForm(){
  this.frmUrl = this.formBuilder.group({
    id: [0],
    cmbCustomer: ["0", [Validators.required]],
    cmbFolder: ["0"],
    cmbGenre:[0],
    urlName: ["", [Validators.required]],
    duration: [20],
    refersh: [40],
    urlLink: ['', [Validators.required]],
    dbType:[localStorage.getItem('DBType')],
    IsAnnouncement:[false],
    Url_Time_With_Min:[false],
    duration_min: [1],
    refershtime_min: [2]
  });
 }
  async FillClientList() {
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('selecteddfClientId') + "," + localStorage.getItem('DBType');
    this.loading = true;
   await this.aService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchCustomerList = JSON.parse(returnData);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        if (this.auth.IsAdminLogin$.value == false) {
          this.frmUrl.get('cmbCustomer').setValue(localStorage.getItem('selecteddfClientId'));
          this.onChangeCustomer(localStorage.getItem('selecteddfClientId'));

          this.cmbSearchCustomer=localStorage.getItem('selecteddfClientId')
          this.onChangeSearchCustomer(localStorage.getItem('selecteddfClientId'))

        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillFolder(cid) {
    this.loading = true;
    this.serviceLicense.GetClientFolder(cid).pipe()
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
  onChangeCustomer(id){
    this.initUrlForm();
    this.UrlList=[];
    this.cmbSearchCustomer="0";
    this.frmUrl.patchValue({
      cmbCustomer:id
    })
    this.FillFolder(id);
  }
  async SaveUrl(){
    if (this.frmUrl.invalid) {
     // return;
    }
    let frm = this.frmUrl.value
    let refershtime 
    if (frm['Url_Time_With_Min'] == true){
      frm['duration']= parseFloat(frm['duration_min'])*60
      frm['refershtime_min']= parseFloat(frm['duration_min'])*2
    }
    refershtime= parseFloat(frm['duration'])*2
    frm['refersh']= refershtime
    this.loading = true;
    await this.serviceLicense.SaveTemplateUrl(frm).pipe()
    .subscribe(async data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == "1") {
        this.toastr.info("Saved", 'Success!');
        this.SaveModifyInfo(
          0,
          'Template add/modify with these values '+ this.frmUrl.value
        );
        this.initUrlForm();
        //this.UrlList=[];
        //this.FillClientList();
        //this.cmbSearchCustomer="0";
        this.loading = false;
        await this.onChangeSearchCustomer(this.cmbSearchCustomer)
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
  async EditUrl(data){
    this.initUrlForm()
    await this.FillFolder(data.cmbCustomer);
    this.AddNewTabSelected=true
    setTimeout(async () => {
      this.frmUrl.patchValue({
        id: data.id,
      cmbCustomer: data.cmbCustomer,
      cmbFolder: data.cmbFolder,
      cmbGenre: data.cmbGenre,
      urlName: data.urlName,
      duration: data.duration,
      refersh: data.refersh,
      urlLink: data.urlLink,
      dbType:localStorage.getItem('DBType'),
      IsAnnouncement:data.IsAnnouncement,
      Url_Time_With_Min:data.Url_Time_With_Min,
      duration_min: data.duration_min,
      refershtime_min: data.refershtime_min
      })
    
  }, 2000);
  }
  openUrlDeleteModal(mContent, id,urlname) {
    this.del_urlname=urlname
    this.aid = id;
    this.modalService.open(mContent, { centered: true });
  }
  async DeleteUrl(){
    this.UrlList = [];
    this.loading = true;
    var obj= []
    obj.push(this.aid)
    await this.serviceLicense.DeleteTemplateUrl(obj).pipe()
      .subscribe(data => {
        this.loading = false;
        this.toastr.info("Deleted");
        this.SaveModifyInfo(
          0,
          'Template Url is deleted ('+this.del_urlname+') '
        );
        this.onChangeSearchCustomer(this.cmbSearchCustomer)
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeSearchCustomer(id){
    this.UrlList = [];
    let obj=[]
    obj.push(id)
    this.loading = true;
    this.serviceLicense.GetTemplateUrl(obj).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.UrlList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  OpenViewContent(modalName, url,genreId){

    let oType="LS"
    if (genreId =="303"){
      oType="PT"
    }
    if (genreId =="324"){
      oType="PT"
    }
      localStorage.setItem("ViewContent",url)
      localStorage.setItem("oType",oType)
      localStorage.setItem("mViewType","Url")
      
      if (oType=="LS"){
        this.modalService.open(modalName, {
          size: 'Template',
        }); 
      }
      if (oType=="PT"){
        this.modalService.open(modalName,{
          size: 'PT-Template'
        }); 
      }
    
  }
  CloseModal(){
    this.modalService.dismissAll();
  }
  SaveModifyInfo(tokenid, ModifyText) {
    this.serviceLicense.SaveModifyLogs(tokenid, ModifyText).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
      },
        error => {
        })
  };
  FolderName = "";
  IsPromoFolder=false;
  resIsPromoFolder=false;
  IsAutoDelete=false;
  resIsAutoDelete=false;
  dtpDeleteDate;
  NewFolderName=""
  onChangeFolder(id){
    this.FolderName="";
    this.resIsPromoFolder=false;
    this.resIsAutoDelete=false;
    var sd1= new Date()
    this.dtpDeleteDate=sd1;
    let NewfList = this.FolderList.filter(order => order.Id == id);
    if (NewfList.length > 0) {
      this.FolderName = NewfList[0].DisplayName;
      this.resIsPromoFolder=NewfList[0].check;
      this.resIsAutoDelete=NewfList[0].IsAutoDelete;
      var sd= new Date(NewfList[0].DeleteDate)
      this.dtpDeleteDate=sd;

    }
}
  openFolderModal(mdl) {
    var obj = this.frmUrl.value;

    if (obj['cmbCustomer']=="0"){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  onSubmitFolder() {
    if (this.NewFolderName == "") {
      this.toastr.info("Folder name cannot be blank", '');
      return;
    }
    var obj_frm = this.frmUrl.value;
    var deleteDate = new Date();
    this.serviceLicense.SaveFolder(obj_frm['cmbFolder'], this.NewFolderName, obj_frm['cmbCustomer'],this.IsPromoFolder, this.IsAutoDelete,deleteDate.toDateString()).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
          var params = JSON.stringify({FolderName: this.NewFolderName, IsPromoFolder:this.IsPromoFolder,IsAutoDelete:this.IsAutoDelete,DeleteDate:deleteDate.toDateString() });
          if (obj_frm['cmbFolder'] == "0") {
            this.SaveModifyInfo(0, "New folder is create with name " + this.NewFolderName + " and with these values "+ params);
          }
          else {
            this.SaveModifyInfo(0, "Folder name is modify. Now New name is " + this.NewFolderName + " and with these values "+ params);

          }
          obj_frm['cmbFolder'] = "0";
          this.FolderName="";
          this.resIsPromoFolder=false;
          this.resIsAutoDelete=false;
          this.FillFolder(obj_frm['cmbCustomer']);
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
  CancelPage(){
    this.initUrlForm();
    //this.UrlList=[];
    //this.FillClientList();
    //this.cmbSearchCustomer="0";
  }
  AddNewTabSelected=false
  PlaylistAdsonTabSelect(e: SelectEvent){
    if (e.index==0){
      this.AddNewTabSelected=false
    }
      
  }
}
