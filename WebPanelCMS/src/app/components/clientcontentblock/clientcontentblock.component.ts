import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef , ViewChildren,  QueryList, PipeTransform} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { NgbdSortableHeader_contentBlock, SortEvent } from './contentBlock_sortable.directive';
@Component({
  selector: 'app-clientcontentblock',
  templateUrl: './clientcontentblock.component.html',
  styleUrls: ['./clientcontentblock.component.css']
})
export class ClientcontentblockComponent implements OnInit {
  loading=false
  CustomerList
  cmbCustomer
  ContentBlockList
  cmbSearchContentType="artist"
  cmbContentType="artist"
  ActiveTab=1
  IschkViewOnly=0;
  
  SearchText="";
  mediatype=""
  longmediatype=""
  ContentSearchList=[]
  MainContentSearchList=[]
  ContentSearchList_Search=[]
  ContentSearchText=""
  @ViewChildren(NgbdSortableHeader_contentBlock)
  headers: QueryList<NgbdSortableHeader_contentBlock>;
  compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  ContentSelected = [];
  chkAll_Assign=false
  chkAll_Search=false
  ContentSelected_Search = [];
  constructor(private formBuilder: FormBuilder,public toastr: ToastrService,vcr: ViewContainerRef,
    config: NgbModalConfig,private modalService: NgbModal,private pService: PlaylistLibService,
    public auth: AuthService,private serviceLicense: SerLicenseHolderService,private pipe: DecimalPipe, 
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  }

  async ngOnInit() {
    this.cmbCustomer = localStorage.getItem('bCId');
    this.longmediatype = localStorage.getItem('mType');
    this.mediatype='Video'
    if (this.longmediatype=='Audio Copyright'){
      this.mediatype='Audio'
    }
    await this.GetClientContentBlock(this.cmbSearchContentType);
  }
  GetClientContentBlock(contenttype) {
    this.loading = true;
    let body = {
      "clientid":this.cmbCustomer,
      "contentid":[],
      "contenttype":contenttype,
      "longmediatype":this.longmediatype
    }
    this.pService.GetClientContentBlock(body).pipe().subscribe((data) => {
          this.ContentBlockList=[]
          if (data['response']=="1"){
            this.ContentBlockList = JSON.parse(data['data']);
          }
          console.log(this.ContentBlockList)
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  onChangeSearchContentType(e){
    this.GetClientContentBlock(e)
  }
  openDeleteModal(mContent, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.ContentSelected_Search.length==0){
      this.toastr.info('Please select atleast one content');
      return;
    }
    
    this.modalService.open(mContent);
  }
  DeleteBlockContent(){
    this.loading = true;
    this.pService.DeleteClientContentBlock(this.ContentSelected_Search).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.ContentSelected_Search = []
            this.chkAll_Search=false;
            this.GetClientContentBlock(this.cmbSearchContentType);
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
  onChangeContentType(e){
    this.SearchText="";
    this.ContentSearchText="";
    this.ContentSearchList=[]
    this.MainContentSearchList=[]
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.SearchContent();
    }
  }
  SearchContent() {
    this.ContentSearchText="";
    if (this.SearchText==""){
      return
    }
    this.loading = true;
    let body = {
      "mediatype":this.mediatype,
      "searchtext":this.SearchText,
      "contenttype":this.cmbContentType,
      "clientid":this.cmbCustomer,
      "longmediatype":this.longmediatype
    }
    this.pService.ContentTitleArtistSearch(body).pipe().subscribe((data) => {
          this.ContentSearchList=[]
          this.MainContentSearchList=[]
          if (data['response']=="1"){
            this.ContentSearchList = JSON.parse(data['data']);
            this.MainContentSearchList= this.ContentSearchList
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  AddBlockContentRequest(mContent,id){
      if (this.IschkViewOnly==1){
        this.toastr.info('This feature is not available in view only');
        return;
      }
      if (this.ContentSelected.length==0){
        this.toastr.info('Please select atleast one content');
        return;
      }
      this.modalService.open(mContent);
  }
  AddBlockContent(){
    this.loading = true;
    let body = {
      "clientid":this.cmbCustomer,
      "contentid":this.ContentSelected,
      "contenttype":this.cmbContentType,
      "longmediatype":this.longmediatype
    }
    this.pService.SaveClientContentBlock(body).pipe().subscribe((data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == '1') {
            this.toastr.info('Blocked', 'Success!');
            this.loading = false;
            for (let index = 0; index < this.ContentSelected.length; index++) {
              const element = this.ContentSelected[index];
              this.ContentSearchList = this.ContentSearchList.filter(od => od.id !== element)
            }
            this.MainContentSearchList= []
            this.MainContentSearchList= this.ContentSearchList
            this.chkAll_Assign=false
            this.ContentSelected = []
            this.GetClientContentBlock(this.cmbSearchContentType);
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.ContentSearchList = this.MainContentSearchList;
    } else {
      this.ContentSearchList = [...this.MainContentSearchList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  allToken_Assign(event) {
    const checked = event.target.checked;
    this.ContentSelected = [];
    if (this.ContentSearchText==''){
    this.ContentSearchList.forEach((item) => {
      item.check = checked;
      this.ContentSelected.push(item.id);
    });
  }
  else{
    this.ContentSearchList_Search.forEach((item) => {
      item.check = checked;
      this.ContentSelected.push(item.id);
    });
  }
    if (checked == false) {
      this.ContentSelected = [];
    }
  }
  SelectContentBlock(fileid, event) {
    if (event.target.checked) {
      this.ContentSelected.push(fileid);
    } else {
      const index: number = this.ContentSelected.indexOf(fileid);
      if (index !== -1) {
        this.ContentSelected.splice(index, 1);
      }
    }
  }
  onChangeEvent_Assign(){
    this.ContentSearchList_Search = this.ContentSearchList.filter(country => this.matches(country, this.ContentSearchText, this.pipe));
    const total = this.ContentSearchList_Search.length;
  }
  matches(country, term: string, pipe: PipeTransform) {
    return country.title.toLowerCase().includes(term.toLowerCase())
      || country.artist.toLowerCase().includes(term.toLowerCase())
  }


  allToken_Search(event) {
    const checked = event.target.checked;
    this.ContentSelected_Search = [];
    
    this.ContentBlockList.forEach((item) => {
      item.check = checked;
      this.ContentSelected_Search.push(item.id);
    });
    
    if (checked == false) {
      this.ContentSelected_Search = [];
    }
  }
  SelectContentBlockSearch(fileid, event) {
    if (event.target.checked) {
      this.ContentSelected_Search.push(fileid);
    } else {
      const index: number = this.ContentSelected_Search.indexOf(fileid);
      if (index !== -1) {
        this.ContentSelected_Search.splice(index, 1);
      }
    }
  }

}
