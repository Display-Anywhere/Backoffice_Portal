import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
  loading
  cmbLibraryFolder="0"
  LibraryFolderList
  SongsList
  CustomerList
  cmbCustomerId="0"
  content_Type=''
  cmbLibraryGenre="325"
  templatedata = {
    imgurl:'',
    title:'',
    desc:'',
    logoimgurl:'',
    desc1:'',
    desc2:'',
    width:'',
    height:'',
    duration:'',
    bgcolor:'bg-white'
  }
  selected_logoName=''
  selected_imgName=''
  templateId=  localStorage.getItem("edittemplate")
  isDisabled=true
  txtTemplateName=''
  constructor(private serviceLicense: SerLicenseHolderService,public toastr: ToastrService,
    public auth: AuthService,private pService: PlaylistLibService,private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.FillClientList()
  }
  FillClientList() {
    this.loading = true;
    var str = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.serviceLicense
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          if (this.auth.IsAdminLogin$.value == false) {
              this.cmbCustomerId = localStorage.getItem('dfClientId');
          }
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  onChangeCustomer(){
   this.FillFolder() 
  }
  FillFolder() {
    this.loading = true;
    var qry =
      'select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ';
    qry = qry + ' inner join Titles tit on tit.folderId= tbFolder.folderId ';

    qry = qry + " where tit.mediatype='Image' ";
    if (this.auth.IsAdminLogin$.value == false) {
      qry =
        qry +
        ' and (tit.dfclientid= ' +
        this.cmbCustomerId +
        ' or tit.dfclientid= ' +
        localStorage.getItem('dfClientId') +
        ')';
    } else {
      qry = qry + ' and tit.dfclientid= ' + this.cmbCustomerId + '';
    }
    qry =
      qry +
      " and (tit.dbtype='" +
      localStorage.getItem('DBType') +
      "' or tit.dbtype='Both') ";
     
     
      qry = qry + ' and tit.GenreId in(325,324) ';
    
    
    qry = qry + ' group by tbFolder.folderId,tbFolder.foldername ';
    qry = qry + ' order by tbFolder.foldername ';
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.LibraryFolderList = JSON.parse(returnData);
          this.loading = false;
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  onChangeLibraryFolder() {
    this.FillContent();
  }
  FillContent() {
    this.loading = true;
    if (this.cmbLibraryFolder=="0"){
      this.pService.FillSongList('Image',false,this.cmbCustomerId).pipe()
      .subscribe((data) => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (this.content_Type=='Library'){
          if (this.templateId=="3"){
            let or="325"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else{
            this.SongsList = obj.filter(o=>o.genreId==this.cmbLibraryGenre);
          }
        }
        else{
          this.SongsList = obj.filter(o=>o.genreId=="326");
        }
        this.loading = false;
      },
      (error) => {
        this.toastr.error(
          'Apologies for the inconvenience.The error is recorded.',
          ''
        );
        this.loading = false;
      }
    );
    }
    else{
    this.pService.CommanSearch('Folder',this.cmbLibraryFolder,'Image',false,'1',this.cmbCustomerId).pipe()
        .subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.SongsList = obj.filter(o=>o.genreId==this.cmbLibraryGenre);
          this.loading = false;
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
    }
  }
  SetImage(url,title){
    if (this.content_Type=='Library'){
      this.templatedata.imgurl= url 
      this.selected_imgName= title
    }
    else{
      this.templatedata.logoimgurl= url 
      this.selected_logoName= title
    }
  }
  FullImageUrl;
  OpenFullImageModal(ObjModal, url) {
    this.FullImageUrl = url;
    this.modalService.open(ObjModal, { size: 'lg' });
  }
  openLibrary(ObjModal,contentType) {
    if (this.cmbCustomerId == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    this.content_Type= contentType
    this.FillContent();
    this.modalService.open(ObjModal, { size: 'lg' });
  }
  CloseEditTemplate(){
    this.auth.SetEditTemplateOpen(false)
  }
  OpenViewContent(modalName){
    let clsName=''
    if (this.cmbLibraryGenre=="325"){
      localStorage.setItem("oType","496")
      clsName='lgx'
    }
    if (this.cmbLibraryGenre=="324"){
      localStorage.setItem("oType","495")
        clsName= 'smg'
      }
      
      let cnt =this.GenrateHtml()
      localStorage.removeItem('innerHtml')
      localStorage.setItem('innerHtml',cnt)
    this.modalService.open(modalName, {
      size: clsName,
    }); 
  }
  GenrateHtml(){
    localStorage.setItem('ngClass',this.templatedata.bgcolor)
    let content_Class=''
    let img_Class=''
    if (this.cmbLibraryGenre=="325"){
      localStorage.setItem("oType","496")
      content_Class='col-lg-11'
      img_Class='col-lg-1'
    }
    if (this.cmbLibraryGenre=="324"){
      localStorage.setItem("oType","495")
        content_Class='col-lg-10'
        img_Class='col-lg-2'
      }

    let cnt =  `<div class="row">
    <div class="col-lg-12 m-0 p-0">
    <img class="img-fluid" src="`+this.templatedata.imgurl+`" >
    </div>
    </div>
    <div class="row mt-2" >
    <div class="`+content_Class+` border-top-right-radius30 bg-white mb-2">
    <h3>`+this.templatedata.title+`</h3>
    <p>`+this.templatedata.desc+`</p>
    </div>
    <div class="`+img_Class+`">
    <img class="img-thumbnail mx-auto d-block mt-4" src="`+this.templatedata.logoimgurl+`">
    </div>
    </div>`
    
    if (this.templateId=="3"){
      cnt=""
      cnt=`<div class="row mt-2 mb-2">
      <div class="col-lg-4 m-0 pl-0">
      <img class="img-fluid" src="`+this.templatedata.imgurl+`" >
      </div>
      <div class="col-lg-8">
      <div class="row">
      <div class="col-lg-12 mr-0 pr-0 text-right">
      <img class="col-lg-2 img-thumbnail mr-2 mt-2" src="`+this.templatedata.logoimgurl+`">
      </div>
      </div>
      <div class="row">
      <div class="col-lg-12 mr-0 pr-0">
      <h3 class="text-success">`+this.templatedata.title+`</h3>
      <p>`+this.templatedata.desc+`</p>
      </div>
      <div class="col-lg-12 mr-0 pr-0 bg-success mt-3 border-top-bottom-radius30">
      <p class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</p>
      <p>Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      
      </div>
      </div>
      
      </div>
      </div>
      `
      if (this.cmbLibraryGenre=="324"){
      cnt=""
    cnt=`<div class="row mt-2">
    <div class="col-lg-12 mr-0 pr-0 text-left mb-2">
    <img class="col-lg-3 img-thumbnail mr-2 mt-2" src="`+this.templatedata.logoimgurl+`">
    </div>
    
    <div class="col-lg-12 m-0 p-0">
    <img class="img-fluid" src="`+this.templatedata.imgurl+`" >
    </div>
    
    <div class="col-lg-12 mr-0 pr-0 mt-2">
    <h4 class="text-success">`+this.templatedata.title+`</h4>
    <p>`+this.templatedata.desc+`</p>
    </div>
    <div class="col-lg-12 mr-0 pr-0 bg-success mt-3 pt-4 pb-3">
    <p class="text-white">`+this.templatedata.desc1+`</p>
    <p>`+this.templatedata.desc2+`</p>
    
    </div>
    
    
    </div>`
      }
    }
    if (this.templateId==="1"){
      let title=`<h1 class="fa-4x mb-3">`+this.templatedata.title+`</h1>`
      if (this.cmbLibraryGenre=="324"){
        title=`<h3 class="mb-3">`+this.templatedata.title+`</h3>`
      }
      cnt=""
      cnt=`<div class="row mt-2 mb-2">
      <div class="col-lg-12 mt-2 text-right mb-5">
      <img class="img-thumbnail" width="100" height="100" src="`+this.templatedata.logoimgurl+`">
      </div>
      <div class="col-lg-12 mr-0 pr-0 text-center pb-5">
      `+title+`
      <p class=" fa-2x mb-5"><strong>`+this.templatedata.desc+`</strong></p>
      <i class="fa fa-exclamation-circle fa-5x" aria-hidden="true"></i>
      </div>
      
      </div>
      `
    }
    return cnt
  }
  SaveTemplate(){
    if (this.templatedata.duration==''){
      this.toastr.info('Duration cannot be blank','');
      return
    }
    this.loading= true
    let cnt =this.GenrateHtml()
    let genreId=''
    if (this.cmbLibraryGenre=="325"){
      genreId="496"
    }
    if (this.cmbLibraryGenre=="324"){
      genreId="495"
    }
    let body={
      "id":0,
      "tName": this.txtTemplateName,
      "genreid":genreId,
      "width":this.templatedata.width,
      "height":this.templatedata.height,
      "tHtml": cnt,
      "dfclientId": this.cmbCustomerId,
      "duration": this.templatedata.duration,
      "bgcolor": this.templatedata.bgcolor
    }
    this.pService.SaveOwnTemplates(body).pipe()
        .subscribe((data) => {
          this.loading = false;
          this.toastr.info("Saved")
          this.auth.SetEditTemplateOpen(false)
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  CustomRatio(e){
    if (e.target.checked) {
      this.isDisabled=false
    }
    else{
      this.isDisabled=true
      this.templatedata.width=''
      this.templatedata.height=''
    }

  }
}
