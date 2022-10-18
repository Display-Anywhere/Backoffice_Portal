import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
  edittemplategenre= localStorage.getItem("edittemplategenre")
  loading
  color
  cmbLibraryFolder="0"
  LibraryFolderList
  SongsList
  CustomerList
  cmbCustomerId="0"
  content_Type=''
  cmbLibraryGenre="325"
  templatedata = {
    _Id:'0',
    imgurl:'',
    title:'',
    desc:'',
    logoimgurl:'',
    logoimgurl2:'',
    text1:'',
    text2:'',
    text3: '',
    text4: '',
    text5: '',
    text6: '',
    text7: '',
    text8: '',
    text9: '',
    text10: '',
    width:'',
    height:'',
    duration:'',
    bgcolor:'#ffffff',
    imgurl2:'',
    imgurl3:'',
    imgurl4:'',
    imgurl5:'',
    imgurl6:'',
    imgurl7:'',
    imgurl8:'',
    selected_logoName:'',
    selected_logoName2:'',
    selected_imgName:'',
    selected_imgName2:'',
    selected_imgName3:'',
    selected_imgName4:'',
    selected_imgName5:'',
    selected_imgName6:'',
    selected_imgName7:'',
    selected_imgName8:'',
    bgImgColor:'#000'
    }
    MenuList=[]
  templateId=  localStorage.getItem("edittemplate")
  isDisabled=true
  txtTemplateName=''
  IsClickPreview= false
  IframeSRC: SafeResourceUrl
   //templateHost ='http://localhost:4202'
   templateHost ='https://templates.nusign.eu'
  constructor(private serviceLicense: SerLicenseHolderService,public toastr: ToastrService,
    public auth:AuthServiceOwn,private pService: PlaylistLibService,private modalService: NgbModal,
    private router: Router,public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.FillClientList()
    if (this.templateId=="1"){
      this.templatedata.title='Wearing a Face Mask'
      this.templatedata.desc='is required to enter'
      this.templatedata.bgcolor='#ffc107'
    }
    if (this.templateId=="7"){
      this.templatedata.title='Everyone is Welcome!'
      this.templatedata.desc='Open House Event'
      this.templatedata.text1='Find Houses'
    }
    if (this.templateId=="5"){
      this.templatedata.bgcolor='#ffc107'
    }
    if (this.templateId=="4"){
      this.templatedata.title='Wet your hands with clean, running water (warm or cold), turn off the tap, and apply soap'
      this.templatedata.desc='Lather your hands by rubbing them together with the soap'
      this.templatedata.text1='Scrub your hands for at least 20 seconds. Rinse your hands well under clean, running water.'
      this.templatedata.bgcolor='#2e703e'
    }
    if (this.templateId=="6"){
      this.templatedata.bgcolor='#dbe0e1'
    }
    if (this.templateId=="14"){
      this.templatedata.bgImgColor='#3c5b4c'
    }
    
    if (this.templateId=="3"){
      this.templatedata.bgcolor='#007bff'
      this.templatedata.bgImgColor='#ffffff'
    }
    if (this.templateId=="9"){
      this.templatedata.title='House For Sale'
      this.templatedata.desc='$0,00,000'
      this.templatedata.text1='The built-up area is 178 Square feet.'
      this.templatedata.text2= '+000 0000 000'
      this.templatedata.text3= 'abc@abc.com'
      this.templatedata.bgcolor='#02086c'
    }
    if (this.templateId=="11"){
      this.templatedata.title='House For Sale'
      this.templatedata.desc='$0,00,000'
      this.templatedata.text1='The built-up area is 178 Square feet.'
      this.templatedata.text2= 'House For Sale'
      this.templatedata.text3= '$0,00,00'
      this.templatedata.text4='The built-up area is 278 Square feet.'
      this.templatedata.bgcolor='#ffc107'
    }
    if (this.templateId=="10"){
      this.templatedata.title='Fashion'
      this.templatedata.desc='Runway Show'
      this.templatedata.text1='Address, Ciy'
    }
    if (this.templateId=="12"){
      this.templatedata.title='Sale Starts'
      this.templatedata.desc='For limited period'
      this.templatedata.text1='10'
      this.templatedata.text2= 'NUSG77'
    }
    if (this.templateId=="13"){
      this.templatedata.title='Fashion Event Proposal'
      this.templatedata.desc='Fashion Entertaiment'
      this.templatedata.text1='Fashion & Design'
      this.templatedata.text2= 'Fashion Team'
      this.templatedata.text3= 'fashion@fashion.com'
      this.templatedata.text4='Jan 01, 1900'
      this.templatedata.text5='Prepared for'
      this.templatedata.text6='Prepared By'
    }
    if (this.templateId=="2"){
      this.templatedata.bgcolor='#023814'
      this.templatedata.bgImgColor='#ffffff'
    }
   
    if (this.templateId=="14"){
      this.templatedata.title='Winter'
      this.templatedata.desc='New Collections'
    }
    if (this.templateId=="16"){
      this.templatedata.bgcolor='#5b6c70'
    }
    if (this.templateId=="21"){
      this.templatedata.title='HALLOWEEN PARTY'
      this.templatedata.desc='SCARY NIGHT PARTY'
      this.templatedata.text1='PlEASE JOIN US'
      this.templatedata.text2= 'DJ PNGTREE & JIMMY LI'
      this.templatedata.text3= 'WINETASTING & PAIRINGS'
      this.templatedata.text4= '2022/06/21'
      this.templatedata.bgcolor='#000000'
    }
    if (this.templateId=="22"){
      this.templatedata.title='2022'
      this.templatedata.desc='NEW YEAR'
      this.templatedata.text1='EVENT'
      this.templatedata.text2= 'EXCLUSIVE'
      this.templatedata.text3= 'GOLDEN STYLE'
      this.templatedata.text4= 'MORDEN 2022'
      this.templatedata.text5='69 SAMPLE STREET'
      this.templatedata.text6='June 21,2022'
      this.templatedata.text7='orem ipsum dolor sit amet, an'
      this.templatedata.text8='ad mei wisi integre fabellas. Eos an'
      this.templatedata.bgcolor='#000000'
    }
    if (this.templateId=="23"){
      this.templatedata.title='MERRY'
      this.templatedata.desc='Christmas'
      this.templatedata.bgcolor='#006533'
    }
    if (this.templateId=="24"){
      this.templatedata.title='SKIN CARE'
      this.templatedata.desc='Classic has the same behavior with time grade has the same behavior with time and pattern has the same behavior with time the noble quality is showed finely.'
      this.templatedata.text1='50'
      this.templatedata.text2='PRINNNIAL CODE DEWS THE RAINFALL IN SOUTHERN CHINA HAS INCREASINGLY REDUCED.'
      this.templatedata.bgcolor='#ffc107'
    }
    if (this.templateId=="25"){
      this.templatedata.title='DELICIOUS'
      this.templatedata.desc='Be Inspired'
      this.templatedata.text1='PRINNNIAL CODE DEWS THE RAINFALL IN SOUTHERN CHINA HAS INCREASINGLY REDUCED.'
      this.templatedata.text2='Master Class'
      this.templatedata.text3='PRINNNIAL CODE DEWS THE RAINFALL IN SOUTHERN CHINA HAS INCREASINGLY REDUCED.'
      this.templatedata.bgcolor='#000000'
    }
    if (this.templateId=="26"){
      this.templatedata.title='Double'
      this.templatedata.desc='QUARTER'
      this.templatedata.text1='POUNDER with'
      this.templatedata.text2= 'CHEESE'
      this.templatedata.text3= '€22'
      this.templatedata.text4= '€22'
      this.templatedata.text5='€22'
      this.templatedata.text6='€22'
      this.templatedata.text7='For more information: +0000-000-0000'
      this.templatedata.text8='information@demo.com'
      this.templatedata.bgcolor='#000000'
    }
    if (this.templateId=="29"){
      this.templatedata.title='FAST FOOD'
      this.templatedata.desc='RESTAURANT'
      this.templatedata.text1='OPENS 9AM-10PM'
      this.templatedata.text2= 'HAMBURGER SPECIAL'
      this.templatedata.text3= '€22'
      this.templatedata.text4= 'HAMBURGER SPECIAL'
      this.templatedata.text5='€10'
      this.templatedata.text6='+0000-000-0000'
      this.templatedata.bgcolor='#3f2315'
    }
    if (this.templateId=="27"){
      this.templatedata.title='High Quality at Lowest Rates'
      this.templatedata.desc='Cras justo odio\nDapibus ac facilisis in\nMorbi leo risus\nPorta ac consectetur ac\nVestibulum at eros'
      this.templatedata.text1='0000-000-0000'
      this.templatedata.text2= '0000-000-0000'
      this.templatedata.text3= 'For more information: 0000-000-0000 information@misterburger.com'
      this.templatedata.bgcolor='#007bff'
    }
    if (this.templateId=="31"){
      this.templatedata.title='SCHOOL'
      this.templatedata.desc='ADMISSION'
      this.templatedata.text1='Now Open For'
      this.templatedata.text2= 'Registration'
      this.templatedata.text3= 'For more Information 000 123 456 798'
      this.templatedata.text4= 'The Best Education For Your Children'
      this.templatedata.bgcolor='#405649'
    }
    if (this.templateId=="32"){
      this.templatedata.title='ADMISSION'
      this.templatedata.desc='2023'
      this.templatedata.text1='OPEN NOW'
      this.templatedata.text2= 'For more Information 000 123 456 798'
      this.templatedata.text3= 'The Best Education For Your Children'
      this.templatedata.bgcolor='#FFD300'
    }
    if (this.templateId=="33"){
      this.templatedata.title='Event Announcement'
      this.templatedata.desc='Digital'
      this.templatedata.text1='Marketing'
      this.templatedata.text2= 'Lorem ipsum color sit amet, consecteture adiposcing elit.\nMaecenas ullamcorper enim sit am'
      this.templatedata.text3= '27 NOVEMBER 2022 | 09:00 AM'
      this.templatedata.text4= 'For more information email@demo.com'
      this.templatedata.bgcolor='#022E44'
    }
    if (this.templateId=="34"){
      this.templatedata.title='A Better Legal System'
      this.templatedata.desc='Great Lawyer'
      this.templatedata.text1='Great Law Firm'
      this.templatedata.text2= 'Lorem ipsum color sit amet, consecteture adiposcing elit.\nMaecenas ullamcorper enim sit am'
      this.templatedata.text3= 'CONTACT US'
      this.templatedata.text4= 'www.yourwebsite.com'
      this.templatedata.text5= '123 Street,BE'
      this.templatedata.text6= '000 123 456 798'
      this.templatedata.bgcolor='#109dab'
    }
    if (this.templateId=="35"){
      this.templatedata.title='Your\nMedical\nClinic'
      this.templatedata.desc='Lorem ipsum color sit amet, consecteture adiposcing elit.\nMaecenas ullamcorper enim sit am'
      this.templatedata.text1= 'www.yourwebsite.com'
      this.templatedata.text2= '123 Street,BE'
      this.templatedata.text3 = '000 123 456 798'
      this.templatedata.bgcolor='#062E4E'
    }
    if (this.templateId=="15"){
      this.cmbLibraryGenre='324'
    }

    if (this.edittemplategenre === 'LS'){
      this.cmbLibraryGenre='325'
    }
    if (this.edittemplategenre === 'PT'){
      this.cmbLibraryGenre='324'
    }

    if ((this.templateId=="2") && ((this.cmbLibraryGenre=="324"))){
      this.templatedata.bgImgColor='#000000'
    }
    if ((this.templateId=="3") && ((this.cmbLibraryGenre=="324"))){
      this.templatedata.bgImgColor='#000000'
    }
    let template_data = localStorage.getItem("edittemplatecontent")
    localStorage.removeItem("edittemplatecontent")
    if (template_data != null){
      const t_data = JSON.parse(template_data)
      this.templatedata = t_data
      if (this.templatedata.bgImgColor==undefined) {
        this.templatedata.bgImgColor ='#000'
      }
      let genreId=''
    if (t_data.genreId =="496"){
      genreId="325"
    }
    if (t_data.genreId=="495"){
      genreId="324"
    }
      this.cmbLibraryGenre = genreId
      this.cmbCustomerId= t_data.clientid
      this.txtTemplateName= t_data.TemplateName
      if (this.templateId =='37'){
        this.MenuList = JSON.parse(t_data.text10)
      }
      
      this.OpenViewContent()
    }
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
    localStorage.setItem('IsRf',"0")
    localStorage.removeItem('ContentType')
    if (this.cmbLibraryFolder=="0"){
      this.pService.FillSongList('Image',false,this.cmbCustomerId).pipe()
      .subscribe((data) => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (this.content_Type=='Library'){
          if (this.templateId=="3"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="2"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="12"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="14"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="33"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="34"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="35"){
            let or="324"
            if (this.cmbLibraryGenre=="325"){
              or="324"
            }
            this.SongsList = obj.filter(o=>o.genreId==or);
          }
          else if (this.templateId=="37"){
            let or="325"
            if (this.cmbLibraryGenre=="324"){
              or="325"
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
  SetImage(url,title, imgCount){
    if (this.content_Type=='Library'){
      if (imgCount==1){
        this.templatedata.imgurl= url 
        this.templatedata.selected_imgName =title
      }
      if (imgCount==2){
        this.templatedata.imgurl2= url 
        this.templatedata.selected_imgName2 =title
      }
      if (imgCount==3){
        this.templatedata.imgurl3= url 
        this.templatedata.selected_imgName3 =title
      }
      if (imgCount==4){
        this.templatedata.imgurl4= url 
        this.templatedata.selected_imgName4 =title
      }
      if (imgCount==5){
        this.templatedata.imgurl5= url 
        this.templatedata.selected_imgName5 =title
      }
      if (imgCount==6){
        this.templatedata.imgurl6= url 
        this.templatedata.selected_imgName6 =title
      }
      if (imgCount==7){
        this.templatedata.imgurl7= url 
        this.templatedata.selected_imgName7 =title
      }
      if (imgCount==8){
        this.templatedata.imgurl8= url 
        this.templatedata.selected_imgName8 =title
      }
    }
    else{
      if (imgCount==1){
      this.templatedata.logoimgurl= url 
      this.templatedata.selected_logoName= title
      }
      if (imgCount==2){
      this.templatedata.logoimgurl2= url 
      this.templatedata.selected_logoName2= title
      }
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
  OpenViewContent(){
    this.templatedata.text10 = JSON.stringify(this.MenuList)
    var textoffer= this.templatedata.text1 
    var offer= textoffer.replace('%','')
    let IframeSRC_Safe = this.templateHost+ '?templateId='+this.templateId+'&title='+this.templatedata.title.replace(/\n\r?/g, '<br />')+'&desc='+this.templatedata.desc.replace(/\n\r?/g, '<br />')+'&logosrc='+this.templatedata.logoimgurl+ '&ngClass='+this.templatedata.bgcolor.replace('#','')+'&imgSrc='+this.templatedata.imgurl+ '&text1='+offer+'&text2='+this.templatedata.text2.replace(/\n\r?/g, '<br />')+'&imgSrc2='+this.templatedata.imgurl2+'&imgSrc3='+this.templatedata.imgurl3+'&imgSrc4='+this.templatedata.imgurl4+'&imgSrc5='+this.templatedata.imgurl5+'&imgSrc6='+this.templatedata.imgurl6+'&imgSrc7='+this.templatedata.imgurl7+'&imgSrc8='+this.templatedata.imgurl8+ '&text3='+this.templatedata.text3+ '&text4='+this.templatedata.text4+ '&text5='+this.templatedata.text5+ '&text6='+this.templatedata.text6+ '&text7='+this.templatedata.text7+ '&text8='+this.templatedata.text8+ '&text9='+this.templatedata.text9+ '&text10='+this.templatedata.text10+'&bgImgColor='+this.templatedata.bgImgColor.replace('#','')+'&logosrc2='+this.templatedata.logoimgurl2
    // 1 
    //let IframeSRC_Safe = "http://localhost:4201/#/?templateId=1&title=Wearing a Face Mask&desc=is required to enter&logosrc=http://api.nusign.eu/mp3files/238708.jpg&ngClass=bg-warning&imgSrc=&text1=&text2=" 
    // 2
    // let IframeSRC_Safe = "http://localhost:4201/#/?templateId=1&title=Wearing a Face Mask&desc=is required to enter&logosrc=http://api.nusign.eu/mp3files/221491.jpg&ngClass=bg-warning&imgSrc=&text1=&text2=" 
    // 3
    // let IframeSRC_Safe = "http://localhost:4201/#/?templateId=1&title=Wearing a Face Mask&desc=is required to enter&logosrc=http://api.nusign.eu/mp3files/221493.jpg&ngClass=bg-warning&imgSrc=&text1=&text2="
    // 4
    // let IframeSRC_Safe = "http://localhost:4201/#/?templateId=1&title=Wearing a Face Mask&desc=is required to enter&logosrc=http://api.nusign.eu/mp3files/239054.jpg&ngClass=bg-warning&imgSrc=&text1=&text2="
    // 5 
    // let IframeSRC_Safe = "http://localhost:4201/#/?templateId=1&title=Wearing a Face Mask&desc=is required to enter&logosrc=http://api.nusign.eu/mp3files/239055.jpg&ngClass=bg-warning&imgSrc=&text1=&text2="
      console.log(IframeSRC_Safe)
      this.IframeSRC = this.sanitizer.bypassSecurityTrustResourceUrl(IframeSRC_Safe);
      this.IsClickPreview=true
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
    <p class="text-white">`+this.templatedata.text1+`</p>
    <p>`+this.templatedata.text2+`</p>
    
    </div>
    
    
    </div>`
      }
    }
    if (this.templateId==="1"){
      localStorage.setItem('logosrc',this.templatedata.logoimgurl)
      localStorage.setItem('title',this.templatedata.title)
      localStorage.setItem('desc',this.templatedata.desc)
      cnt=""
      cnt =`<div class="row temp temp-0">
      <div class="col-12 d-flex justify-content-end">
        <img src="assets/basic-images/logo.png" alt="">
      </div>
      <div class="col-12 text-center content">
        <h3>Wearing a Face Mask</h3>
        <h4>is required to enter</h4>
        <img src="assets/images/temp-0/exclamation.png" alt="">
      </div>
    </div>`
      /*cnt=`  
      <div class="col-12 d-flex justify-content-end">
        <img src="`+this.templatedata.logoimgurl+`" alt="">
      </div>
      <div class="col-12 text-center content">
        <h3>`+this.templatedata.title+`</h3>
        <h4>`+this.templatedata.desc+`</h4>
        <img src="assets/images/temp-0/exclamation.png" alt="">
      </div>
  `*/
    }
    return cnt
  }
  SaveTemplate(){
    if (this.templatedata.duration==''){
      this.toastr.info('Duration cannot be blank','');
      return
    }
    this.loading= true
    /*
    imgurl2:'',
    imgurl3:'',
    imgurl4:'',
    imgurl5:'',
    imgurl6:''
    */
   let text_10= this.templatedata.text10
   if (this.templateId =='37'){
    text_10 =''
    text_10 = JSON.stringify(this.MenuList)
   }
    let cnt =
      [{
        templateId:this.templateId,
        title:this.templatedata.title,
        desc:this.templatedata.desc,
        logosrc:this.templatedata.logoimgurl.replace('http:','https:'),
        logosrc2:this.templatedata.logoimgurl2.replace('http:','https:'),
        ngClass:this.templatedata.bgcolor.replace('#',''),
        imgSrc:this.templatedata.imgurl.replace('http:','https:'),
        text1:this.templatedata.text1,
        text2:this.templatedata.text2,
        text3:this.templatedata.text3,
        text4:this.templatedata.text4,
        text5:this.templatedata.text5,
        text6:this.templatedata.text6,
        text7:this.templatedata.text7,
        text8:this.templatedata.text8,
        text9:this.templatedata.text9,
        text10:text_10,
        imgSrc2:this.templatedata.imgurl2.replace('http:','https:'),
        imgSrc3:this.templatedata.imgurl3.replace('http:','https:'),
        imgSrc4:this.templatedata.imgurl4.replace('http:','https:'),
        imgSrc5:this.templatedata.imgurl5.replace('http:','https:'),
        imgSrc6:this.templatedata.imgurl6.replace('http:','https:'),
        imgSrc7:this.templatedata.imgurl7.replace('http:','https:'),
        imgSrc8:this.templatedata.imgurl8.replace('http:','https:'),
        selected_logoName:this.templatedata.selected_logoName,
        selected_logoName2:this.templatedata.selected_logoName2,
        selected_imgName:this.templatedata.selected_imgName,
        selected_imgName2:this.templatedata.selected_imgName2,
        selected_imgName3:this.templatedata.selected_imgName3,
        selected_imgName4:this.templatedata.selected_imgName4,
        selected_imgName5:this.templatedata.selected_imgName5,
        selected_imgName6:this.templatedata.selected_imgName6,
        selected_imgName7:this.templatedata.selected_imgName7,
        selected_imgName8:this.templatedata.selected_imgName8,
        bgImgColor:this.templatedata.bgImgColor.replace('#',''),
      }]
    //this.GenrateHtml()
    let genreId=''
    if (this.cmbLibraryGenre=="325"){
      genreId="496"
    }
    if (this.cmbLibraryGenre=="324"){
      genreId="495"
    }
    let body={
      "id":this.templatedata._Id,
      "tName": this.txtTemplateName,
      "genreid":genreId,
      "width":this.templatedata.width,
      "height":this.templatedata.height,
      "tHtml":JSON.stringify(cnt),
      "dfclientId": this.cmbCustomerId,
      "duration": this.templatedata.duration,
      "bgcolor": this.templatedata.bgcolor.replace('#','')
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
  onChangeLibraryGenre(){
    this.IsClickPreview = false
  }
  ShowBackgroundImageLibrary () {
    if (this.templateId ==='1'){
      return false
    }
    else if (this.templateId ==='4'){
      return false
    }
    else if (this.templateId ==='15'){
      return false
    }
    else if (this.templateId ==='16'){
      return false
    }
    else if (this.templateId ==='17'){
      return false
    }
    else if (this.templateId ==='18'){
      return false
    }
    else if (this.templateId ==='21'){
      return false
    }
    else if (this.templateId ==='22'){
      return false
    }
    else if (this.templateId ==='27'){
      return false
    }
     
    else{
      return true
    }
  }
  ShowBackgroundImageLibraryMultiple () {
    if (this.templateId ==='8'){
      return true
    }
    else if (this.templateId ==='9'){
      return true
    }
    else if (this.templateId ==='11'){
      return true
    }
    else if (this.templateId ==='10'){
      return true
    }
    else if (this.templateId ==='14'){
      return true
    }
    else if (this.templateId ==='25'){
      return true
    }
    else if (this.templateId ==='26'){
      return true
    }
    else if (this.templateId ==='39'){
      return true
    }
    else{
      return false
    }
  }
  ShowPortraitGenre () {
    return true
    if (this.templateId ==='5'){
      return false
    }
    else if (this.templateId ==='7'){
      return false
    }
    else if (this.templateId ==='8'){
      return false
    }
    else{
      return true
    }
  }
  ResetCompanylogo (){
    this.templatedata.selected_logoName =''
    this.templatedata.logoimgurl =''
  }
  ResetCompanylogo2 (){
    this.templatedata.selected_logoName2 =''
    this.templatedata.logoimgurl2 =''
  }
  addMenu(){
    this.MenuList=[
      ...this.MenuList,
      {
        id:Math.random(),
        title: this.templatedata.desc,
        price: this.templatedata.text1,
        desc:this.templatedata.text2,
      }
    ]
    this.templatedata.desc =""
    this.templatedata.text1 =""
    this.templatedata.text2 =""
  }
  removeMenu(id){
    this.MenuList= this.MenuList.filter(o => o.id != id)
  }
}
