import { Component, OnInit, ViewContainerRef, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbTimepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateInputFillMode, FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { process } from '@progress/kendo-data-query';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { AdsService } from 'app/mock-api/services/ads.service';
import { SerLicenseHolderService } from 'app/mock-api/services/ser-license-holder.service';
import { StoreForwardService } from 'app/mock-api/services/store-forward.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-normalad',
  templateUrl: './normalad.component.html',
  styleUrls: ['./normalad.component.scss']
})
export class NormaladComponent {
  public format: FormatSettings = {
    displayFormat: "dd/MMM/yyyy",
    inputFormat: "dd/MMM/yyyy",
  };
  fillMode="outline"
  selectedFillMode: DateInputFillMode = "outline";
  DemandsActiveId=1
  Adform: FormGroup;
  submitted = false;
  public loading = false;
  listOfPlayingType=[
    {Id:"0",DisplayName:""},
    {Id:"Hard Stop",DisplayName:"Hard Stop"},
    {Id:"Soft Stop",DisplayName:"Soft Stop"}
  ]
  listOfPlayingMode=[
    {Id:"Time",DisplayName:"Time"},
    {Id:"Minutes",DisplayName:"Minutes"},
    {Id:"Song",DisplayName:"Content"},
    {Id:"Seconds",DisplayName:"Seconds"}
  ]
  listOfType=[
    {Id:"Audio",DisplayName:"Audio"},
    {Id:"Video",DisplayName:"Video"},
    {Id:"Picture",DisplayName:"Image"}
  ]
  page: number = 1;
  pageSize: number = 20;
  fileUpload = { status: '', message: '', filePath: '' };
  error: string;
  //options: UploaderOptions;
  formData: FormData;
  //files: UploadFile[];
  files: [];
  //uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  IsTime: boolean = true;
  Category = [];
  InputFileName: string = "No file chosen...";
  CountryList = [];
  aid;
  IsEditClick: string = "No";
  advtid: number = 0;
  fPath: string = "";
  @ViewChildren("checkboxesCountry") checkboxesCountry: QueryList<ElementRef>;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  InputAccept: string = ".mp3";
  UserId;
  StateList=[];
  CityList=[];
  GroupList=[];
  AddNewTabSelected=false
  IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
  
  constructor(private router: Router, private formBuilder: FormBuilder, public toastr: ToastrService, vcr: ViewContainerRef
    , config: NgbModalConfig, private modalService: NgbModal, private aService: AdsService,private serviceLicense: SerLicenseHolderService,
    public auth:AuthServiceOwn, configTime: NgbTimepickerConfig,private sfService: StoreForwardService,) {
    config.backdrop = 'static';
    config.keyboard = false;
    configTime.seconds = false;
    configTime.spinners = false;
    //this.options = { concurrency: 1, maxUploads: 3 };
   // this.files = []; // local uploading files array
    //this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
   // this.humanizeBytes = humanizeBytes;
  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  CustomerList = [];
  SearchCustomerList = [];
  CustomerSelected = [];
  CountrySelected = [];
  StateSelected = [];
  CitySelected = [];
  GroupSelected = [];
  TokenList = [];
  MainTokenList = [];
  TokenSelected = [];
  AdsList = [];
  SearchADate;
  cmbSearchCustomer = "0";
  time

  ngOnInit() {

    this.UserId = localStorage.getItem('UserId');
     
    var cd = new Date();
    this.CustomerList = [];
    this.TokenList = [];
    this.MainTokenList=[];
    this.AdsList = [];
    this.time = new Date()
  
    this.Adform = this.formBuilder.group({
      aName: ["", Validators.required],
      cName: [""],
      pType: ["", Validators.required],
      category: ["0"],
      sDate: [cd],
      eDate: [cd],
      pMode: ["Time"],
      TotalFrequancy: [0],
      type: ["Audio"],
      FilePath: ["f"],
      wList: [""],
      CustomerLst: ["0"],
      TokenLst: [this.TokenSelected],
      sTime: [this.time],
      CountryLst: [this.CountrySelected],
      aid: [this.advtid],
      FilePathNew: [''],
      imagetime:[10]
    });
    this.dropdownList = [
      { "id": "2", "itemName": "Mon" },
      { "id": "3", "itemName": "Tue" },
      { "id": "4", "itemName": "Wed" },
      { "id": "5", "itemName": "Thu" },
      { "id": "6", "itemName": "Fri" },
      { "id": "7", "itemName": "Sat" },
      { "id": "1", "itemName": "Sun" }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Week",
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Week',
      unSelectAllText: 'Week',
      itemsShowLimit: 1
    };
    this.FillSearchClientList();

    this.SearchADate = cd;

  }



  onItemSelect(item: any) {


  }
  onSelectAll(items: any) {

  }
  get f() { return this.Adform.controls; }
  Refresh = function () {
    var cd = new Date();
    this.time = new Date();
    this.TokenList = [];
    this.MainTokenList=[];
    // this.AdsList = [];
    this.CustomerSelected = [];
    this.TokenSelected = [];
    this.selectedItems = [];
    this.CountrySelected = [];
    this.CustomerList = [];
    this.StateList=[];
    this.CityList=[];
    this.GroupList=[];
    this.fPath = "";
    this.advtid = 0;
    this.Adform.get('aName').setValue(" ");
    this.Adform.get('cName').setValue("");
    this.Adform.get('pType').setValue(" ");
    this.Adform.get('category').setValue("0");
    this.Adform.get('sDate').setValue(cd);
    this.Adform.get('eDate').setValue(cd);
    this.Adform.get('aid').setValue(this.advtid);
    this.Adform.get('TotalFrequancy').setValue(0);
    this.Adform.get('type').setValue("Audio");
    this.Adform.get('sTime').setValue(this.time);
    this.Adform.get('FilePath').setValue("");
    this.Adform.get('pMode').setValue("Time");
    this.Adform.get('CustomerLst').setValue("0");
    this.Adform.get('TokenLst').setValue(this.TokenSelected);
    this.Adform.get('CountryLst').setValue(this.CountrySelected);
    this.Adform.get('wList').setValue('');
    this.Adform.get('imagetime').setValue(10);
    this.InputAccept = ".mp3";
    

    this.checkboxesCountry.forEach((element) => {
      element.nativeElement.checked = false;
    });
    if (this.IsEditClick == "No") {
      this.myInputVariable.nativeElement.value = "";
      this.InputFileName = "No file chosen...";
    }
    this.IsEditClick = "No";
    this.FillCountry();
  };

  onSubmitAd = function () {
    this.submitted = true;
    if (this.IsEditClick == "No") {
      // if (this.Adform.value.FilePath == "") {
      //   this.toastr.error("The path cannot be empty");
      //   return;
      // }

    }
    if (this.Adform.value.wList.length == 0) {
      this.toastr.error("Please select a week day");
      return;
    }
    if (this.Adform.value.pMode != "Time") {
      if (this.Adform.value.TotalFrequancy == "") {
        this.toastr.error("Please select a frequency of playing mode");
        return;
      }
    }
    
    
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Select the token(s) from this list");
      return;
    }

    if (this.Adform.invalid) {
      return;
    }
    this.Adform.get('TokenLst').setValue(this.TokenSelected);

    if (this.IsEditClick == "No") {
      //this.startUpload();
      this.SaveAndUpload();
    }
    if (this.IsEditClick == "Yes") {

      this.UpdateAds();
    }
  }
  SelectCustomer(fileid, event) {
    if (event.target.checked) {
      this.CustomerSelected.push(fileid);
    }
    else {
      const index: number = this.CustomerSelected.indexOf(fileid);
      if (index !== -1) {
        this.CustomerSelected.splice(index, 1);
      }
    }

    this.FillTokenInfo();
  }
  FillTokenInfo() {
    if (this.CustomerSelected.length == 0) {
      this.TokenList = [];
      this.MainTokenList=[];
      this.StateList=[];
      this.CityList=[];
      this.GroupList=[];
      return;
    }
    this.loading = true;

    this.aService.FillTokenInfo(this.CustomerSelected).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        this.TokenList = JSON.parse(returnData);
        this.MainTokenList= this.TokenList;

        this.FillGroup();
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
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
    //this.toastr.info(JSON.stringify(this.TokenSelected), 'Success!');
  }
  FillClientList() {
    var str = "";
    if (this.CountrySelected.length == 0) {
      this.CustomerList = [];
      this.TokenList = [];
      this.MainTokenList=[];
      return;
    }

    if (this.auth.IsAdminLogin$.value == true) {
      str = "select DFClientID as id,  ClientName as displayname from DFClients where CountryCode in(" + this.CountrySelected + ") and DFClients.IsDealer=1 and (dbtype='"+localStorage.getItem('DBType')+"' or dbtype='Both') order by RIGHT(ClientName, LEN(ClientName) - 3)";
    }
    else {
      str = "";
      str = "select DFClientID as id, ClientName  as displayname  from ( ";
      str = str + " select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
      str = str + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      str = str + " where DFClients.CountryCode in(" + this.CountrySelected + ")  and (dbtype='"+localStorage.getItem('DBType')+"' or dbtype='Both') and DFClients.DealerDFClientID= " + localStorage.getItem('dfClientId') + "    ";
      str = str + " union all select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
      str = str + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      str = str + " where DFClients.CountryCode in(" + this.CountrySelected + ")  and (dbtype='"+localStorage.getItem('DBType')+"' or dbtype='Both') and DFClients.MainDealerid= " + localStorage.getItem('dfClientId') + "    ";
      str = str + "   ) as a order by RIGHT(ClientName, LEN(ClientName) - 3) ";
    }
    this.loading = true;
    this.aService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.FillState();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillSearchClientList() {
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.loading = true;

    this.aService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchCustomerList = JSON.parse(returnData);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        this.cmbSearchCustomer=localStorage.getItem('dfClientId')
        this.Adform.get('CustomerLst').setValue(localStorage.getItem('dfClientId'));
        this.SearchAd()
        this.FillCategory();
        this.onChangeCustomer(localStorage.getItem('dfClientId'))
    },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  SearchAd() {
    this.FillSearchAds();
  }
  FillSearchAds() {
    this.AdsList=[]
    var sTime1 = new Date(this.SearchADate);
    
    if (this.cmbSearchCustomer == "0") {
      return;
    }
    this.loading = true;
    this.aService.FillSearchAds(this.cmbSearchCustomer, sTime1.toDateString()).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AdsList = JSON.parse(returnData);

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

























/*

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        

        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':

        // The file is downloaded
        break;

    }
    this.toastr.info(output.type);
    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    var g = output.file.responseStatus;
    this.toastr.info(g + " responseStatus");
    return;
    if (output.file.responseStatus == 200) {
      this.toastr.info("Saved");
      this.loading = false;
    }
    else {
      this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
      this.loading = false;
    }

  }

  startUpload(): void {
    this.loading = true;
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://localhost:60328/api/SaveAdsAndUploadFile',
      method: 'POST',
      data: { fcom: JSON.stringify(this.Adform.value) }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

*/

  SaveAndUpload() {
    this.loading = true;
    const formData = new FormData();

    var sTime = this.Adform.value.sTime;
    const dt = new Date('Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00');
    //this.Adform.get('sTime').setValue(dt.toTimeString().slice(0, 5));
    
    var startDate = new Date(this.Adform.value.sDate);
    //this.Adform.get('sDate').setValue(startDate.toDateString());

    var endDate = new Date(this.Adform.value.eDate);
    //this.Adform.get('eDate').setValue(endDate.toDateString());

    formData.append('fcom', JSON.stringify(this.Adform.value));
    formData.append('profile', this.Adform.get('FilePathNew').value);

    this.aService.upload(formData).subscribe(
      res => {
        this.fileUpload = res
        var returnData = JSON.stringify(res);
        var obj = JSON.parse(returnData);
        if (obj.Responce == 1) {
          this.toastr.info("Saved", '');
          this.Refresh();
          this.loading = false;
        }
        if (obj.Responce == 0) {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }

      }
      ,
      err => {
        this.error = err
        this.loading = false;
      }
    );
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.files = file;
      this.Adform.get('FilePathNew').setValue(file);
      this.InputFileName = file.name.replace("C:\\fakepath\\", "");
    }
    else {
      this.files = [];
      this.InputFileName = "No file chosen...";
    }
  }


  onChangePlayingMode(e) {
    if (e == "Time") {
      this.IsTime = true;
    }
    else {
      this.IsTime = false;
    }
  }
  FillCategory() {
    this.loading = true;
    var qry = "select AdvtTypeId as id, AdvtTypeName as displayname from tbAdvertisementType order by AdvtTypeName";
    this.aService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.Category = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeType(e) {
    if (e == "Audio") {
      this.InputAccept = ".mp3";
    }
    if (e == "Video") {
      this.InputAccept = ".mp4";
    }
    if (e == "Picture") {
      this.InputAccept = "image/x-png,image/jpeg";
    }
  }

  onChange(e) {
    this.InputFileName = e.replace("C:\\fakepath\\", "");
  }

  SelectCountry(fileid, event) {
    if (event.target.checked) {
      this.CountrySelected.push(fileid);
    }
    else {
      const index: number = this.CountrySelected.indexOf(fileid);
      if (index !== -1) {
        this.CountrySelected.splice(index, 1);
      }
    }
    this.StateList=[];
    this.CityList=[];
    this.GroupList=[];
    this.FillClientList();
  }
  FillCountry() {
    this.loading = true;
    var strCou = "";
    if (this.IsEditClick == "No") {
      strCou = "SELECT distinct CountryCodes.CountryCode as Id, CountryCodes.CountryName as DisplayName, 'true' as [check] FROM AMPlayerTokens ";
      strCou = strCou + " INNER JOIN CountryCodes ON AMPlayerTokens.CountryId = CountryCodes.CountryCode ";
      strCou = strCou + " where  AMPlayerTokens.ClientId in ( ";
      strCou = strCou + " select distinct DFClients.DFClientID from DFClients ";
      strCou = strCou + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      strCou = strCou + " where DFClients.CountryCode is not null and DFClients.DealerDFClientID= " + localStorage.getItem('dfClientId') + "    ";
      strCou = strCou + " union all select distinct DFClients.DFClientID  from DFClients ";
      strCou = strCou + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
      strCou = strCou + " where DFClients.CountryCode is not null and DFClients.MainDealerid= " + localStorage.getItem('dfClientId') + "    ";
      strCou = strCou + " ) ";
      strCou = strCou + " order by CountryCodes.CountryName ";
    }
    else {

    }
    
    this.aService.FillCombo(strCou).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CountryList = JSON.parse(returnData);
        this.loading = false;
        this.FillSearchClientList();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  openAdsDeleteModal(mContent, id) {
    this.aid = id;
    this.modalService.open(mContent, { centered: true });
  }


  UpdateAds() {
    this.loading = true;
    var sTime = this.Adform.value.sTime;
    const dt = new Date('Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00');
    //this.Adform.get('sTime').setValue(dt.toTimeString().slice(0, 5));

    var startDate = new Date(this.Adform.value.sDate);
    //this.Adform.get('sDate').setValue(startDate.toDateString());

    var endDate = new Date(this.Adform.value.eDate);
    //this.Adform.get('eDate').setValue(endDate.toDateString());

    this.aService.UpdateAds(this.Adform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Updated", '');
          this.SaveModifyInfo(
            0,
            'New advertisement is uploaded '
          );
          this.Refresh();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  EditAds(id) {
    this.IsEditClick = "Yes";
    this.loading = true;
    this.advtid = id;
    this.AddNewTabSelected =true
    this.aService.FillSaveAds(id, this.cmbSearchCustomer).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        console.log(obj)
        var sd = new Date(obj.sDate);
        var ed = new Date(obj.eDate);
        var st = new Date(obj.sTime);
        this.onChangePlayingMode(obj.pMode);
        this.CountryList = obj.lstCountry;
        //this.TokenList = obj.lstToken;
        //this.MainTokenList= this.TokenList;
        //this.CustomerList = obj.lstCustomer;
        //this.CustomerSelected = obj.CustomerLst;
        this.TokenSelected = obj.TokenLst;
        this.selectedItems = obj.wList;
        this.CountrySelected = obj.CountryLst;
        this.loading = false;
        this.Adform.get('wList').setValue(this.selectedItems);
        this.Adform.get('aName').setValue(obj.aName);
        this.Adform.get('cName').setValue(obj.cName);
        this.Adform.get('pType').setValue(obj.pType);
        this.Adform.get('category').setValue(obj.category);
        this.Adform.get('sDate').setValue(sd);
        this.Adform.get('eDate').setValue(ed);
        this.Adform.get('pMode').setValue(obj.pMode);
        this.Adform.get('TotalFrequancy').setValue(obj.TotalFrequancy);
        this.Adform.get('type').setValue(obj.type);
        this.Adform.get('imagetime').setValue(obj.imagetime);

        var time: NgbTimeStruct = { hour: st.getHours(), minute: st.getMinutes(), second: 0 };
        this.Adform.get('sTime').setValue(st);
        this.fPath = obj.FilePath;
        //this.Adform.get('CustomerLst').setValue(obj.CustomerLst);
        this.Adform.get('TokenLst').setValue(this.TokenSelected);
        this.Adform.get('CountryLst').setValue(this.CountrySelected);
        this.Adform.get('aid').setValue(this.advtid);
        this.InputAccept=""
        if (obj.type == "Audio") {
          this.InputAccept = ".mp3";
        }
        if (obj.type == "Video") {
          this.InputAccept = ".mp4";
        }
        if (obj.type == "Picture") {
          this.InputAccept = "image/x-png,image/jpeg";
        }

        //this.FillState();
        this.FillGroup();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  DeleteAds() {
    this.loading = true;
    this.aService.DeleteAds(this.aid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", '');
          this.FillSearchAds();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
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






















  SelectState(fileid, event) {
    if (event.target.checked) {
      this.StateSelected.push(fileid);
    }
    else {
      const index: number = this.StateSelected.indexOf(fileid);
      if (index !== -1) {
        this.StateSelected.splice(index, 1);
      }
    }
     this.TokenList=[];
     this.CityList=[];
     if (this.StateSelected.length==0){
       this.TokenList= this.MainTokenList;
       return;
     }
     var ObjLocal;
    for (var counter = 0; counter < this.StateSelected.length; counter++) { 		      
     ObjLocal = this.MainTokenList.filter(order => order.StateId ==this.StateSelected[counter]);
      if( ObjLocal.length > 0 ) {
        ObjLocal.forEach((obj)=>{
          this.TokenList.push(obj);
         // var existNotification = this.TokenList.find(({tokenid}) => obj.tokenid === tokenid);
        //  if(!existNotification){
         //   this.TokenList.push(obj);
        //  }
        });
     }
       
  }  
 
   this.FillCity();
  }
  SelectCity(fileid, event) {
    if (event.target.checked) {
      this.CitySelected.push(fileid);
    }
    else {
      const index: number = this.CitySelected.indexOf(fileid);
      if (index !== -1) {
        this.CitySelected.splice(index, 1);
      }
    }

    this.TokenList=[];
    if (this.CitySelected.length==0){
      this.TokenList= this.MainTokenList;
      return;
    }
    var ObjLocal;
   for (var counter = 0; counter < this.CitySelected.length; counter++) { 		      
    ObjLocal = this.MainTokenList.filter(order => order.CityId ==this.CitySelected[counter]);
     if( ObjLocal.length > 0 ) {
       ObjLocal.forEach((obj)=>{
         this.TokenList.push(obj);
        // var existNotification = this.TokenList.find(({tokenid}) => obj.tokenid === tokenid);
       //  if(!existNotification){
        //   this.TokenList.push(obj);
       //  }
       });
    }
      
 } 
    
  }
  SelectGroup(fileid, event) {
    if (event.target.checked) {
      this.GroupSelected.push(fileid);
    }
    else {
      const index: number = this.GroupSelected.indexOf(fileid);
      if (index !== -1) {
        this.GroupSelected.splice(index, 1);
      }
    }

    
    this.TokenList=[];
    if (this.GroupSelected.length==0){
      this.TokenList= this.MainTokenList;
      return;
    }
    var ObjLocal;
   for (var counter = 0; counter < this.GroupSelected.length; counter++) { 		      
    ObjLocal = this.MainTokenList.filter(order => order.GroupId ==this.GroupSelected[counter]);
     if( ObjLocal.length > 0 ) {
       ObjLocal.forEach((obj)=>{
         this.TokenList.push(obj);
        // var existNotification = this.TokenList.find(({tokenid}) => obj.tokenid === tokenid);
       //  if(!existNotification){
        //   this.TokenList.push(obj);
       //  }
       });
    }
      
 } 



  }






  FillState() {
    this.StateSelected=[];

    this.loading = true;
    var qry = "select stateid as id, statename as displayname  from tbstate where countryid in( " + this.CountrySelected + " ) order by statename";
    this.aService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.StateList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillCity() {
    this.CitySelected = [];
    this.loading = true;
    var qry = "select cityid as id, cityname as displayname  from tbcity where stateid in( " + this.StateSelected + " ) order by cityname";
    this.aService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
         
        this.CityList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillGroup() {
    this.loading = true;
    var qry = "select GroupId as id, GroupName as displayname  from tbGroup where dfClientId in( "+this.CustomerSelected+" ) order by GroupName";
    this.aService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.GroupList = JSON.parse(returnData);
        
        this.FillState();
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SaveModifyInfo(tokenid, ModifyText) {
    this.sfService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }
  OpenViewContent(modalName, url,MediaType){
    let oType="LS"
     if (MediaType=="Picture"){
      MediaType="Image"
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
    async onChangeCustomer(e){
      await this.FillCustomerTokenList(e)
    }
    FillCustomerTokenList(cid){
      this.loading = true;
      this.serviceLicense
        .FillTokenInfo(cid, '0')
        .pipe()
        .subscribe(
          (data) => {
            this.loading = false;
            var returnData = JSON.stringify(data);
            const objData = JSON.parse(returnData);
            this.TokenList= objData
            this.MainTokenList= objData
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
    public getField = (args: any) => {
      return `${args.city}_${args.location}_${args.MediaType}_${args.gName}_${args.tokenCode}`;
    }
    public onFilter(inputValue: string): void {
      this.TokenList = process(this.MainTokenList, {
          filter: {
              logic: 'or',
              filters: [
                  {
                      field: this.getField,
                      operator: 'contains',
                      value: inputValue
                  }
              ]
          }
      }).data;
    
      this.dataBinding? this.dataBinding.skip = 0 : null;
    }
    NormalAdsonTabSelect(e: SelectEvent){
      if (e.index==0){
        this.AddNewTabSelected=false
      }

    }
}
//https://www.truecodex.com/course/angular-6/file-upload-in-angular-6-7-with-progress-bar-using-web-api
