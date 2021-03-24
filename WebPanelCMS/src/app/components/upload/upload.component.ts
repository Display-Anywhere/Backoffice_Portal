import { Component, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
import { FileUploader, FileLikeObject, FileItem, FileSelectDirective, } from 'ng2-file-upload';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MachineService } from '../machine-announcement/machine.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  cmbGenre = "0";
  GenreName = "";
  FolderName = "";
  cmbFolder = "0";
  CustomerId = "0";
  TemplateCustomerId = "0";
  CustomerList: any[];
  GenreList: any[];
  FolderList:any[];
  public loading = false;
  IsAnnouncement="0";
  iframeUrl:SafeResourceUrl;
   
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
  public uploader: FileUploader = new FileUploader({
    url: this.cf.UploadImage,
    itemAlias: 'photo',
  });
  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private cf: ConfigAPI,
    private serviceLicense: SerLicenseHolderService, config: NgbModalConfig,
     private modalService: NgbModal, public auth:AuthService, private sanitizer: DomSanitizer,private mService:MachineService) {
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
  
  ngOnInit() {
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
        }
        if (returnRes=="2"){
          this.toastr.info("Content is already available");
        }
        this.UploaderResponce=[];
        this.uploader.clearQueue()  
      }
      
      //8968680545-- rajinder singh-  Fast Tag

    };

     
    this.FillClientList();
    
    
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
    qry = qry + " and genreid in(303,297,324,325,326) ";
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
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  onSubmitNewGenre() {
    if (this.NewFolderName == "") {
      this.toastr.info("Folder name cannot be blank", '');
      return;
    }

    this.serviceLicense.SaveFolder(this.cmbFolder, this.NewFolderName, this.CustomerId,this.IsPromoFolder).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
          if (this.cmbFolder == "0") {
            this.SaveModifyInfo(0, "New folder is create with name " + this.NewFolderName);
          }
          else {
            this.SaveModifyInfo(0, "Folder name is modify. Now New name is " + this.NewFolderName);

          }
          this.cmbFolder = "0";
          this.FolderName="";
          this.resIsPromoFolder=false;
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
    var ArrayItem = {};
    var fName = "";
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.cmbFolder = id;
    this.GetJSONFolderRecord(ArrayItem);
    if (this.NewfList.length > 0) {
      this.FolderName = this.NewfList[0].DisplayName;
      this.resIsPromoFolder=this.NewfList[0].check;
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
          this.loading = false;
          this.cmbFolder = '0';
          this.FolderName = '';
          this.resIsPromoFolder=false;
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
        }
       else if (obj.Responce == "2") {
          this.toastr.info("Content Uploaded", '');
          this.CustomerId="0"
          this.cmbFolder="0"
          this.resIsPromoFolder=false;
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
