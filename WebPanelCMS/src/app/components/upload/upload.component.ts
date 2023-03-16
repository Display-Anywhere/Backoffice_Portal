import { Component, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
import { FileUploader, FileLikeObject, FileItem, FileSelectDirective, } from 'ng2-file-upload';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { MachineService } from '../machine-announcement/machine.service';
import { Subject } from "rxjs";
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  cmbGenre = "0";
  cmbGenreEdit = "0";
  GenreName = "";
  FolderName = "";
  cmbFolder = "0";
  cmbTransferToFolder="0";
  CustomerId = "0";
  TemplateCustomerId = "0";
  CustomerList: any[];
  GenreList: any[];
  FolderList:any[];
  TransferToFolderList=[]
  FolderContentList=[];
  public loading = false;
  IsAnnouncement="0";
  iframeUrl:SafeResourceUrl;
  loginclientId=localStorage.getItem('dfClientId')
  NewFolderName: string = "";
  IsPromoFolder=false;
  resIsPromoFolder=false;
  InputAccept="";
  MediaType="";
  UploaderResponce:any[];
  SearchTokenList;
  cmbSearchToken; 
  dropdownSettings = {};
  SongsSelected=[];
  IsAutoDelete=false;
  resIsAutoDelete=false;
  dtpDeleteDate;
  ComponentName="NormalUpload"
  ready = "";
  thumb=[];
  enableEdit = false;
  enableEditIndex = null;
  IschkViewOnly = 0
  txtTitle: string;
  LoginDfClientId
  TransferFolderTitleSelected=[];
  chkAll_Folder=false
  CDform: FormGroup;
  enableEdit_genre = false;
  enableEditIndex_genre = null;

  PortalName= localStorage.getItem('PortalName')
  resetFormSubject: Subject<boolean> = new Subject<boolean>();
  resetFormSubject_Url: Subject<boolean> = new Subject<boolean>();
  resetFormSubject_ConvertUrl: Subject<boolean> = new Subject<boolean>();
  public uploader: FileUploader = new FileUploader({
    url: this.cf.UploadImage,
    itemAlias: 'photo',
  });
  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private cf: ConfigAPI,
    private serviceLicense: SerLicenseHolderService, config: NgbModalConfig,private sfService: StoreForwardService,
     private modalService: NgbModal, public auth:AuthServiceOwn, private sanitizer: DomSanitizer,
     private mService:MachineService,private pService: PlaylistLibService,private formBuilder: FormBuilder) {
    config.backdrop = 'static';
    config.keyboard = false;
     this.uploader.onCompleteAll = () => {
      this.cmbGenre = "0";
      this.GenreName="";
      this.FolderName="";
      // this.uploader.clearQueue(); ------
      //  this.uploader.onProgressAll(0); -----
     };


  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.serviceLicense.FillCustomerWithKey(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.FillGenre();
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.CustomerId = localStorage.getItem('dfClientId');
          this.onChangeCustomer(this.CustomerId);
          this.TemplateCustomerId = localStorage.getItem('dfClientId');
          this.onChangeTemplateCustomer(this.TemplateCustomerId);
        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  NewList;
  GetJSONRecord = (array): void => {
    this.NewList = this.GenreList.filter(order => order.Id == array.Id);
  }
  onChangeCustomer(id){
    this.uploader.clearQueue();
    this.thumb=[]
    if (this.IsAnnouncement==='0'){
      this.FillFolder(id);
    }
    if (this.IsAnnouncement==='1'){
      this.FillToken(id);
    }
  }
  FillToken(id){
    this.cmbSearchToken=[];
    this.SearchTokenList=[];
    this.loading = true;
    this.mService.FillTokenInfo(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
          if (this.IsAnnouncement=="1"){
            this.SearchTokenList= this.SearchTokenList.filter(order => order.DeviceType==='Sanitizer')
            this.SearchTokenList.forEach(element => {
              element['commonName']= element['tokenCode'] + '-'+ element['location']+ '-' + element['city']
            });
          }

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
  FillFolder(cid) {
    this.cmbFolder="0";
    this.FolderName="";
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
  onChangeGenre(id) {
    
    this.uploader.clearQueue();
    this.thumb=[]
    var ArrayItem = {};
    var fName = "";
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.cmbGenre = id;
    this.GetJSONRecord(ArrayItem);
    if (this.NewList.length > 0) {
      this.GenreName = this.NewList[0].DisplayName;
    }
    if ((id=='303') || (id=='297')){
      this.InputAccept=".mp4";
      this.MediaType="Video";
    }
    else{
      this.InputAccept="image/jpeg, image/x-png";
      this.MediaType="Image";
    }
    if (id=='0'){
      this.InputAccept="";
    }
  }
  tempdfClientId=""
  ngOnInit() {
    
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
    this.tempdfClientId = localStorage.getItem('dfClientId')
    this.LoginDfClientId = localStorage.getItem('dfClientId');
    var cd = new Date();
    this.dtpDeleteDate = cd;
    this.IsAnnouncement= localStorage.getItem('IsAnnouncement');
    this.UploaderResponce=[];
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
var obj = JSON.parse(response)
      this.UploaderResponce.push(obj);
var returnRes="2";
var Item_TitleId="";
      
      if (this.uploader.getNotUploadedItems().length==0){
        
        this.UploaderResponce.forEach(item => {
          if (item.Responce == "1"){
            returnRes="1";
            Item_TitleId=item.TitleId;
            return;
          }
        });
        if (returnRes=="1"){
          if (this.IsAnnouncement==='1'){
              this.AddSong(Item_TitleId)
          }
          if (this.IsAnnouncement==='0'){
            if (this.resIsPromoFolder==true){
              this.ReplaceFolderContent()
            }
            else{
              this.toastr.info("Content Uploaded");
            }
          }
          this.SaveModifyInfo(
            0,
            'New content is uploaded'
          );
        }
        if (returnRes=="2"){
          this.toastr.info("Content is already available");
        }
        this.UploaderResponce=[];
        this.uploader.clearQueue()  
        this.cmbFolder="0";
        this.FolderName="";
      }
      
      //8968680545-- rajinder singh-  Fast Tag

    };

     
    this.FillClientList();
    

    this.uploader.onAfterAddingFile = (file) => {
      var image_file=file._file
      let reader = new FileReader();
     reader.addEventListener('load', () => {
      
      this.ready=file.file.type.split('/')[0];
      if (this.ready=='image'){
        this.thumb.push({
          "src":reader.result.toString(),
          "type":"image"
        }
        )
      }
      else{
        this.thumb=[]
        return
        this.thumb.push({
          "src":reader.result,
          "type":"video"
        }
        )
      }
    });
    reader.readAsDataURL(image_file);
    }
    this.CDform = this.formBuilder.group({
      FolderId: [""],
      TitleList: [""],
      dfClientId: [""],
      FromFolderId:[""]
    });
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
          this.toastr.info("Content Uploaded", '');
          this.cmbSearchToken=[];
          this.SongsSelected=[];
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


  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  fileObject: any;


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public onFileSelected(event: EventEmitter<File[]>) {

  }
  Upload() {
    if (this.CustomerId == "0") {
      this.toastr.info("Customer name cannot be blank");
      return;
    }
    if (this.cmbGenre == "0") {
      this.toastr.info("Genre cannot be blank");
      return;
    }
     if (this.IsAnnouncement==='1'){
      if (this.cmbSearchToken.length == '0') {
        this.toastr.error("Please select a player", '');
        return;
      }
     }
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('GenreId', this.cmbGenre);
      form.append('GenreName', this.GenreName);
      form.append('CustomerId', this.CustomerId);
      form.append('MediaType', this.MediaType);
      form.append('FolderId', this.cmbFolder);
      form.append('DBType', localStorage.getItem('DBType'));
      form.append('IsAnnouncement', localStorage.getItem('IsAnnouncement'));
    };
    this.uploader.uploadAll()
  }

  FillGenre() {
    
    this.loading = true;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var qry = "select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ";
    qry = qry + " where 1=1 ";
    if (localStorage.getItem('IsAnnouncement')=="0"){
    qry = qry + " and genreid in(303,297,324,325,326) ";
    }
    else{
      qry = qry + " and genreid in(303,324) ";
    }
    /*
    if ((this.auth.ContentType$=="Signage")){
      qry = qry + " and genreid in(303,297,324,325) ";
    }
    if ((this.auth.ContentType$=="MusicMedia")){
      qry = qry + " and genreid in(326) ";
     }
  if ((this.auth.ContentType$=="Both")){
    qry = qry + " and genreid in(303,297,324,325,326) ";
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
  openGenreModal(mdl) {
    if (this.CustomerId=="0"){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.IsPromoFolder=this.resIsPromoFolder;
    this.IsAutoDelete=this.resIsAutoDelete;
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  onSubmitNewGenre() {
    if (this.NewFolderName == "") {
      this.toastr.info("Folder name cannot be blank", '');
      return;
    }
    var deleteDate = new Date(this.dtpDeleteDate);
    this.serviceLicense.SaveFolder(this.cmbFolder, this.NewFolderName, this.CustomerId,this.IsPromoFolder, this.IsAutoDelete,deleteDate.toDateString()).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
          var params = JSON.stringify({FolderName: this.NewFolderName, IsPromoFolder:this.IsPromoFolder,IsAutoDelete:this.IsAutoDelete,DeleteDate:deleteDate.toDateString() });
          if (this.cmbFolder == "0") {
            this.SaveModifyInfo(0, "New folder is create with name " + this.NewFolderName + " and with these values "+ params);
          }
          else {
            this.SaveModifyInfo(0, "Folder name is modify. Now New name is " + this.NewFolderName + " and with these values "+ params);

          }
          this.cmbFolder = "0";
          this.FolderName="";
          this.resIsPromoFolder=false;
          this.resIsAutoDelete=false;
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
  SaveModifyInfo(tokenid, ModifyText) {
    this.serviceLicense.SaveModifyLogs(tokenid, ModifyText).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
      },
        error => {
        })
  };
  NewfList;
  GetJSONFolderRecord = (array): void => {
    this.NewfList = this.FolderList.filter(order => order.Id == array.Id);
  }
  onChangeFolder(id){
    this.FolderName="";
    this.resIsPromoFolder=false;
    this.resIsAutoDelete=false;
    var sd1= new Date()
      this.dtpDeleteDate=sd1;
    var ArrayItem = {};
    var fName = "";
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.cmbFolder = id;
    this.GetJSONFolderRecord(ArrayItem);
    if (this.NewfList.length > 0) {
      this.FolderName = this.NewfList[0].DisplayName;
      this.resIsPromoFolder=this.NewfList[0].check;
      this.resIsAutoDelete=this.NewfList[0].IsAutoDelete;
      var sd= new Date(this.NewfList[0].DeleteDate)
      this.dtpDeleteDate=sd;

    }
  }
  openFolderDeleteModal(mdl){
    if (this.CustomerId === '0'){
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.cmbFolder === '0'){
      this.toastr.info('Please select a folder name');
      return;
    }
    this.modalService.open(mdl);
  }
  DeleteFolder(){
this.loading = true;
this.serviceLicense.DeleteFolder(this.cmbFolder).pipe()
      .subscribe(data => {
        const returnData = JSON.stringify(data);
        const obj = JSON.parse(returnData);
        if (obj.Responce === '1') {
          this.toastr.info('Folder Deleted', 'Success!');
          this.SaveModifyInfo(
            0,
            'Folder ('+this.FolderName+') is delete'
          );
          this.loading = false;
          this.cmbFolder = '0';
          this.FolderName = '';
          this.resIsPromoFolder=false;
          this.resIsAutoDelete=false;
          this.FillFolder(this.CustomerId);
          this.modalService.dismissAll();
        }
        else {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
          this.loading = false;
        });

  }
  OtherUrl="";
  OtherKey="";
  onChangeTemplateCustomer(id){
    const obj= this.CustomerList.filter(fId => fId.Id === id)
    const url='https://content.nusign.eu/api/login?key='+ obj[0].apikey;
    this.OtherUrl= url;
    this.OtherKey=obj[0].apikey;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  OpenTemplateEditor(){
    if (this.OtherKey===""){
      this.toastr.info('Customer is not registered');
      return;
    }
    else{
    window.open(this.OtherUrl,"_blank")
    }
  }
  
  ReplaceFolderContent(){
    this.loading = true;
    this.serviceLicense.ReplaceFolderContent(this.CustomerId, this.cmbFolder).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;
        if (obj.Responce == "1") {
          this.toastr.info("Content Uploaded", '');
          this.CustomerId="0"
          this.cmbFolder="0"
          this.resIsPromoFolder=false;
          this.resIsAutoDelete=false;
        }
       else if (obj.Responce == "2") {
          this.toastr.info("Content Uploaded", '');
          this.CustomerId="0"
          this.cmbFolder="0"
          this.resIsPromoFolder=false;
          this.resIsAutoDelete=false;
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
  ReloadControls(){
    this.uploader.clearQueue();
    if (this.IsAnnouncement==='0'){
      this.FillFolder(this.CustomerId);
    }
    if (this.IsAnnouncement==='1'){
      this.FillToken(this.CustomerId);
    }
  }
  resetChildForm(){
    this.resetFormSubject.next(true);
 }
 resetChildForm_url(){
  this.resetFormSubject_Url.next(true);
}
resetChildForm_ConvertUrl(){
  this.resetFormSubject_ConvertUrl.next(true);
}
ReloadComponent(componentName){
  this.ComponentName= componentName
  this.auth.SetEditTemplateOpen(false)
}

openViewContent(mdl){
  if (this.cmbFolder=="0"){
    this.toastr.info('Please a select folder name')
    return
  }
  this.FolderContentList=[];
  this.TransferFolderTitleSelected=[];
  this.chkAll_Folder=false
  this.enableEdit=false
  this.enableEdit_genre=false
  this.TransferToFolderList=[]
  this.cmbTransferToFolder= "0"
  this.TransferToFolderList= this.FolderList.filter(o => o.Id != this.cmbFolder)
  this.GetFolderContent(mdl);
  
}
GetFolderContent(mdl){
  this.loading = true;
  this.serviceLicense.GetFolderContent(this.cmbFolder,this.CustomerId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.FolderContentList = JSON.parse(returnData);
        this.FolderContentList= this.FolderContentList.filter(o=> o.MediaType !='Url')
        this.loading = false;
        if (mdl !="null"){
          this.modalService.open(mdl,{ size: 'lg' });
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

}

OpenViewContent(modalName, url,genreId,MediaType){
  let oType="LS"
  if (genreId =="303"){
    oType="PT"
  }
  if (genreId =="324"){
    oType="PT"
  }
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType",oType)
    localStorage.setItem("mViewType",MediaType)
    
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
    EditImage(e, i, tName) {
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      this.enableEdit = true;
      this.enableEditIndex = i;
      this.txtTitle = tName;
    }
    UpdateTitleName(id) {
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      this.loading = true;
      this.pService
        .UpdateContent(id, this.txtTitle,"")
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce == '1') {
              for (var i = 0; i < this.FolderContentList.length; i++) {
                if (this.FolderContentList[i].id == id) {
                  this.FolderContentList[i].title = this.txtTitle;
                  break;
                }
              }
              this.toastr.info('Saved', 'Success!');
              this.loading = false;
              this.enableEdit = false;
            } else {
              this.toastr.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
              this.loading = false;
              this.enableEdit = false;
            }
          },
          (error) => {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            this.enableEdit = false;
          }
        );
    }
    UpdateCancleTitleName() {
      this.enableEdit = false;
    }
    allFolderContent(event){
      const checked = event.target.checked;
      this.TransferFolderTitleSelected=[];
      this.FolderContentList.forEach(item=>{
        item.check = checked;
        this.TransferFolderTitleSelected.push(item.id)
      });
      if (checked==false){
        this.TransferFolderTitleSelected=[];
      }
    }
    SelectFolderContent(fileid, event) {
      this.chkAll_Folder=false
      if (event.target.checked) {
        this.TransferFolderTitleSelected.push(fileid);
      }
      else {
        const index: number = this.TransferFolderTitleSelected.indexOf(fileid);
        if (index !== -1) {
          this.TransferFolderTitleSelected.splice(index, 1);
        }
      }
    }
    
    SaveTransferContent(){
      
      if (this.TransferFolderTitleSelected.length == 0) {
        this.toastr.info("Please select a content");
        return;
      }
  
      if (this.CustomerId == "0") {
        this.toastr.info("Please select a customer name");
        return;
      }
      if (this.cmbTransferToFolder == "0") {
        this.toastr.info("Please select a folder name");
        return;
      }
      this.CDform.get('FromFolderId').setValue(this.cmbFolder); 
      this.CDform.get('FolderId').setValue(this.cmbTransferToFolder);
      this.CDform.get('dfClientId').setValue(this.CustomerId);
      this.CDform.get('TitleList').setValue(this.TransferFolderTitleSelected);
   
      this.loading = true;
      this.sfService.SaveTransferContent(this.CDform.value).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == "1") {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            this.TransferFolderTitleSelected=[];
            this.chkAll_Folder=false
            this.enableEdit=false
            this.cmbTransferToFolder= "0"
            this.FolderContentList=[];
            this.GetFolderContent("null");
          }
          this.loading = false;
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    }

    EditGenre(e, i, genreId) {
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      this.enableEdit_genre = true;
      this.enableEditIndex_genre = i;
      this.cmbGenreEdit = genreId;
    }
    UpdateCancleGenreName() {
      this.enableEdit_genre = false;
    }
    UpdateGenreId(id) {
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      var gObj= this.GenreList.filter(o => o.Id == this.cmbGenreEdit)
      this.loading = true;
      this.pService
        .UpdateContent(id, "Genre",this.cmbGenreEdit)
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce == '1') {
              for (var i = 0; i < this.FolderContentList.length; i++) {
                if (this.FolderContentList[i].id == id) {
                  this.FolderContentList[i].genreId = this.cmbGenreEdit
                  this.FolderContentList[i].genreName = gObj[0].DisplayName
                  break;
                }
              }
              this.toastr.info('Saved', 'Success!');
              this.loading = false;
              this.enableEdit_genre = false;
            } else {
              this.toastr.error(
                'Apologies for the inconvenience.The error is recorded.',
                ''
              );
              this.loading = false;
              this.enableEdit_genre = false;
            }
          },
          (error) => {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            this.enableEdit_genre = false;
          }
        );
    }
}





