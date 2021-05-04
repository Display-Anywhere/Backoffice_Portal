import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreForwardService } from 'src/app/store-and-forward/store-forward.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';

@Component({
  selector: 'app-copy-content',
  templateUrl: './copy-content.component.html',
  styleUrls: ['./copy-content.component.css']
})
export class CopyContentComponent implements OnInit {

  constructor(public toastr: ToastrService, public auth:AuthService, 
    private sfService: StoreForwardService,private formBuilder: FormBuilder, 
    private modalService: NgbModal, private serviceLicense: SerLicenseHolderService) { }

  page: number = 1;
  pageSize: number = 50;
 
   
  public loading = false;
  CustomerList: any[];
  cmbCustomer = '0';
  cmbFolder:number;
  FolderList: any[];
  ContentList:any[];
  TransferTitleSelected = [];

  CustomerSearchList: any[];
  cmbSearchCustomer: number;
  cmbSearchFolder:number;
  FolderSearchList: any[];
  CDform: FormGroup;
  chkAll:boolean=false;
  NewFolderName: string = "";
  FolderName = "";
  ngOnInit(): void {
    this.CDform = this.formBuilder.group({
      FolderId: [this.cmbSearchFolder],
      TitleList: [this.TransferTitleSelected],
      dfClientId: [this.cmbSearchCustomer],
      FromFolderId:[this.cmbFolder]
    });

    this.FillClient();
    this.ContentList=[];
    this.cmbSearchCustomer=0;
    this.cmbSearchFolder=0;
  }
  FillClient() {
    var q = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.loading = true;
    this.sfService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        this.CustomerList = JSON.parse(returnData);
        this.CustomerSearchList = JSON.parse(returnData);
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.cmbCustomer = localStorage.getItem('dfClientId');
          this.onChangeCustomer(this.cmbCustomer);
        } 
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  } 
  FillFolder(id, list) {
    this.loading = true;
    var qry="";
    if (list=="Search"){
      qry = "select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ";
      qry = qry + " where isnull(IsPromoFolder,0)=0 and  tbFolder.dfclientid=" + id + " ";
      qry = qry + " group by tbFolder.folderId,tbFolder.foldername ";
      qry = qry + " order by tbFolder.foldername ";
    }
    if (list=="Main"){
     qry = "select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ";
    qry = qry + " left join Titles tit on tit.folderId= tbFolder.folderId ";
    qry = qry + " where isnull(IsPromoFolder,0)=0 and  tbFolder.dfclientid=" + id + " ";
    if (this.auth.ContentType$ == "Signage") {
      qry = qry + " and tit.GenreId in(303,297, 325,324) ";
    }
    qry = qry + " group by tbFolder.folderId,tbFolder.foldername ";
    qry = qry + " order by tbFolder.foldername ";
  }
    this.sfService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        if (list=="Main"){
          this.FolderList = JSON.parse(returnData);
        } 
        if (list=="Search"){
          this.FolderSearchList = JSON.parse(returnData);
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCustomer(e){
    this.TransferTitleSelected=[];
    this.ContentList=[];
    this.cmbFolder=0;
      this.FillFolder(e, "Main");
     
    
  }
  onChangeFolder(e){
    this.chkAll= false;
    
    this.FillSearch(e);
  }
  NewfList;
  GetJSONFolderRecord = (array): void => {
    this.NewfList = this.FolderSearchList.filter(order => order.Id == array.Id);
  }
  FillSearch(fid) {
    
    this.loading = true;
    this.sfService.GetFolderContent(fid, this.cmbCustomer).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        this.ContentList = obj;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  allContent(event){
    
    const checked = event.target.checked;
    this.TransferTitleSelected=[];
    this.ContentList.forEach(item=>{
      item.check = checked;
      this.TransferTitleSelected.push(item.id)
    });
    if (checked==false){
      this.TransferTitleSelected=[];
    }
  }
  SelectContent(fileid, event) {
    if (event.target.checked) {
      this.TransferTitleSelected.push(fileid);
    }
    else {
      const index: number = this.TransferTitleSelected.indexOf(fileid);
      if (index !== -1) {
        this.TransferTitleSelected.splice(index, 1);
      }
    }
  }
  onChangeSearchCustomer(e){
    this.FillFolder(e, "Search");
  }
  SaveContent(){
    if (this.ContentList.length == 0) {
      this.toastr.info("Please select a content");
      return;
    }
    if (this.TransferTitleSelected.length == 0) {
      this.toastr.info("Please select a content");
      return;
    }

    if (this.cmbSearchCustomer == 0) {
      this.toastr.info("Please select a customer name");
      return;
    }
    if (this.cmbSearchFolder == 0) {
      this.toastr.info("Please select a folder name");
      return;
    }
    this.CDform.get('FromFolderId').setValue(this.cmbFolder); 
    this.CDform.get('FolderId').setValue(this.cmbSearchFolder);
    this.CDform.get('dfClientId').setValue(this.cmbSearchCustomer);
    this.CDform.get('TitleList').setValue(this.TransferTitleSelected);
 
    this.loading = true;
    this.sfService.SaveCopyContent(this.CDform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.cmbSearchCustomer = 0;
          this.cmbSearchFolder = 0;
          this.cmbCustomer = '0';
          this.cmbFolder = 0;
          this.ContentList = [];
          this.TransferTitleSelected = [];
          this.chkAll= false;

        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }
  openGenreModal(mdl) {
    if (this.cmbSearchCustomer==0){
      this.toastr.info("Please select a customer name");
      return;
    }
    this.NewFolderName = this.FolderName;
    this.modalService.open(mdl);
  }
  onSubmitNewGenre() {
    if (this.NewFolderName == "") {
      this.toastr.info("Folder name cannot be blank", '');
      return;
    }

    this.serviceLicense.SaveFolder(this.cmbSearchFolder, this.NewFolderName, this.cmbSearchCustomer,false,false,'01-01-1900').pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
         
          this.FolderName="";
          this.FillFolder(this.cmbSearchCustomer,"Search");
          this.modalService.dismissAll();
        }
        else if (obj.Responce == "-2") {
          this.toastr.info("This folder name already exists", '');
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
  onChangeSearchFolder(e){
    this.FolderName="";
    var ArrayItem = {};
    ArrayItem["Id"] = e;
    ArrayItem["DisplayName"] = "";
    this.GetJSONFolderRecord(ArrayItem);
    if (this.NewfList.length > 0) {
      this.FolderName = this.NewfList[0].DisplayName;
    }
  }
}
