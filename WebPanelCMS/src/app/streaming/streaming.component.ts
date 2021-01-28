import { Component, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
import { FileUploader, FileLikeObject, FileItem, FileSelectDirective, } from 'ng2-file-upload';

import { ConfigAPI } from '../class/ConfigAPI';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StreamService } from './stream.service';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.css']
})
export class StreamingComponent implements OnInit {

  StreamName = "";
  StreamLink = "";
  sImgPath = "";
  EditStreamId = "0";
  CustomerId = "0";
  CustomerList: any[];
  cmbOwnerCustomer = "0";
  cmbCopyCustomer = "0";
  cmbSearchToken = "0";
  cmbSearchCustomer = "0";
  public loading = false;
   
  IsEditStream: boolean = false;
  StreamList;
  AssignTokenList = [];
  AssignStreamList = [];
  MiddleImgList = [];

  TokenList: any[];
  TokenStreamList: any[];
  AssignAddNewStreamList: any[];
  cmbMiddleCustomer = [];
  cmbMiddleToken = [];
  MiddleTokenList: any[];
  page: number = 1;
  pageSize: number = 50;
  public uploader: FileUploader = new FileUploader({
    url: this.cf.UploadStreamImage,
    itemAlias: 'photo',
  });
  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private cf: ConfigAPI,
    private serviceStream: StreamService, config: NgbModalConfig, private modalService: NgbModal,
    public auth:AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.uploader.onCompleteAll = () => {

      this.uploader = new FileUploader({
        url: this.cf.UploadStreamImage,
        itemAlias: 'photo',
      })

      this.toastr.info("Content Uploaded");
      this.FillStreamList(this.CustomerId, "", "StreamList");
      this.clear();
      // this.uploader.clearQueue();
      //  this.uploader.onProgressAll(0);
    };
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');


    this.serviceStream.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.StreamList = [];
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }


  onChangeCustomer(id) {
    this.uploader.clearQueue();
    this.IsEditStream = false;
    this.StreamName = "";
    this.StreamLink = "";
    this.FillStreamList(id, "", "StreamList");

  }
  ChooseFile() {

    this.uploader.clearQueue();
  }
  ngOnInit() {
    this.TokenList = [];
    this.TokenStreamList = [];
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (file._file.size > 35850) {
        this.toastr.info("File size limit is exceeded");
        this.uploader.clearQueue();
        return;

      }
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      // console.log('ImageUpload:uploaded:', item, status, response);
      //8968680545-- rajinder singh-  Fast Tag

    };

     
    this.FillClientList();

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
    if (this.StreamName == "") {
      this.toastr.info("Stream name cannot be blank");
      return;
    }
    if (this.StreamLink == "") {
      this.toastr.info("Stream link cannot be blank");
      return;
    }
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('StreamName', this.StreamName);
      form.append('CustomerId', this.CustomerId);
      form.append('StreamLink', this.StreamLink);
    };
    this.uploader.uploadAll()
  }


  SaveModifyInfo(tokenid, ModifyText) {
    this.serviceStream.SaveModifyLogs(tokenid, ModifyText).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
      },
        error => {
        })
  };
  DeleteStream() {
    this.IsEditStream = false;
    this.loading = true;
    this.serviceStream.DeleteStream(this.EditStreamId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.toastr.info("Stream Deleted", '');

        this.FillStreamList(this.CustomerId, "", "StreamList");
        this.clear();
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onClickEditStream(id, sname, slink, imgPath) {
    this.IsEditStream = true;
    this.EditStreamId = id,
      this.StreamName = sname;
    this.StreamLink = slink;
    this.sImgPath = imgPath;
  }
  openStreamDeleteModal(mContent, id) {
    this.EditStreamId = id;
    this.modalService.open(mContent, { centered: true });
  }
  RefreshStream() {
    this.IsEditStream = false;
    this.clear();
  }
  clear() {
    this.EditStreamId = "0",
      this.StreamName = "";
    this.StreamLink = "";
    this.sImgPath = "";
    this.uploader.clearQueue();
  }
  UpdateStream() {
    this.IsEditStream = false;
    this.loading = true;
    this.serviceStream.UpdateStream(this.CustomerId, this.EditStreamId, this.StreamName, this.StreamLink, this.sImgPath).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.toastr.info("Update", '');

        this.FillStreamList(this.CustomerId, "", "StreamList");
        this.clear();
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }
  FillStreamList(id, Tokenid, ArrayFill) {
    this.loading = true;
    this.serviceStream.FillStreamList(id, Tokenid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        if (ArrayFill == "StreamList") {
          this.StreamList = JSON.parse(returnData);
        }
        if (ArrayFill == "AssignStreamList") {
          this.AssignStreamList = JSON.parse(returnData);
        }
        if (ArrayFill == "AssignAddNewStreamList") {
          this.AssignAddNewStreamList = JSON.parse(returnData);
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }











  onChangeOwnerCustomer(id) {

    this.FillStreamList(id, "", "AssignAddNewStreamList");
  }

  StreamSelected = [];
  allStream(event) {
    const checked = event.target.checked;
    this.StreamSelected = [];
    this.AssignAddNewStreamList.forEach(item => {
      item.check = checked;
      this.StreamSelected.push(item.StreamId)
    });
    if (checked == false) {
      this.StreamSelected = [];
    }
  }
  SelectStream(fileid, event) {
    if (event.target.checked) {
      this.StreamSelected.push(fileid);
    }
    else {
      const index: number = this.StreamSelected.indexOf(fileid);
      if (index !== -1) {
        this.StreamSelected.splice(index, 1);
      }
    }
  }
  TokenSelected = [];

  allToken(event) {
    const checked = event.target.checked;
    this.TokenSelected = [];
    this.TokenList.forEach(item => {
      item.check = checked;
      this.TokenSelected.push(item.tokenid)
    });
    if (checked == false) {
      this.TokenSelected = [];
    }
  }
  SelectToken(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected.push(fileid);
    }
    else {
      const index: number = this.TokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected.splice(index, 1);
      }
    }
  }
  onChangeCopyCustomer(id) {
    this.FillTokenInfo(id, "TokenList");
  }
  FillTokenInfo(deviceValue, ArrayFill) {
    this.loading = true;
    this.serviceStream.FillTokenInfo(deviceValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        if (ArrayFill == "TokenList") {
          this.TokenList = JSON.parse(returnData);
        }
        if (ArrayFill == "AssignTokenList") {
          this.AssignTokenList = JSON.parse(returnData);
        }
        if (ArrayFill == "MiddleTokenList") {
          this.MiddleTokenList = JSON.parse(returnData);
        }

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  AssignStream() {
    if (this.StreamSelected.length == 0) {
      this.toastr.info("Please select a stream");
      return;
    }
    if (this.TokenSelected.length == 0) {
      this.toastr.info("Please select a token");
      return;
    }
    this.loading = true;
    this.serviceStream.AssignStream(this.cmbOwnerCustomer, this.TokenSelected, this.StreamSelected).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.cmbOwnerCustomer = "0";
          this.StreamSelected = [];
          this.AssignAddNewStreamList = [];
          this.TokenList = [];
          this.TokenSelected = [];
          this.cmbCopyCustomer = "0";
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }



  onChangeSearchCustomer(id) {
    this.FillTokenInfo(id, "AssignTokenList");
    this.AssignStreamList = [];
  }
  onChangeSearchToken(Tokenid) {
    this.FillStreamList(null, Tokenid, "AssignStreamList");
  }
  openTokenStreamDeleteModal(mContent, id) {
    this.EditStreamId = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteTokenStream() {
    this.loading = true;
    this.serviceStream.DeleteAssignStream(this.cmbSearchToken, this.EditStreamId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.toastr.info("Stream Deleted", '');
        this.FillStreamList(null, this.cmbSearchToken, "AssignStreamList");
        this.EditStreamId = "0";
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  onChangeMiddleCustomer(id) {
    this.FillTokenInfo(id, "MiddleTokenList");
    this.MiddleImgList = [];
  }
  onChangeMiddleToken(id) {
    this.FillMiddleImage(id, this.cmbMiddleCustomer);
  }
  FillMiddleImage(id, clientId) {
    this.loading = true;
    this.serviceStream.FillMiddleImage(id, clientId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.MiddleImgList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SetMiddleImg(id) {
    this.loading = true;
    this.serviceStream.SetMiddleImg(this.cmbMiddleToken, id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.MiddleImgList.forEach(item => {
            if (item.id == id) {
              item.IsFind = id;
            }

          });
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  DeleteMiddleImgModal(mContent, id) {
    this.EditStreamId = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteMiddelImg() {
    this.loading = true;
    this.serviceStream.DeleteMiddleImg(this.cmbMiddleToken, this.EditStreamId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.MiddleImgList.forEach(item => {
            if (item.id == this.EditStreamId) {
              item.IsFind = "0";
            }

          });
          this.EditStreamId = "0";
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
