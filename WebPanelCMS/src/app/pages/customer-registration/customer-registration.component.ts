import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { CustomerRegService } from 'app/customer-registration/customer-reg.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.scss']
})
export class CustomerRegistrationComponent implements AfterViewInit, OnInit, OnDestroy {
  Regform: UntypedFormGroup;
  submitted = false;
  CustomerList = [];
  CopyCustomerList = [];
  CountryList = [];
  StateList = [];
  CityList = [];
  page: number = 1;
  pageSize: number = 20;
  public loading = false;
  searchText;
  cName;
  cNameCode="";
  citName;
  Code="";
  did;
  IsEditClick: string = "No";
  ModalType;
  NewName;
  ModifyStateName;
  ModifyStateId="0";
  ModifyCityId;
  HeaderText;
  CommonId;
  Country_Id="0";
  MainCustomerList;
  iCheckMain:boolean=true;
  iCheckSub:boolean=false;
PrvTotalToken:number=0;
logindf= localStorage.getItem('dfClientId')
PortalName= localStorage.getItem('PortalName')
IsTrailExtendClick="No"
dtTrialExtendExpiryDate
dtElement
dtOptions: any = {};
dtTrigger
listOfStatus=[
  {Id:"0",DisplayName:""},
  {Id:"Active",DisplayName:"Active"},
  {Id:"Trial",DisplayName:"Trial"}
]
public format: FormatSettings = {
  displayFormat: "dd/MMM/yyyy",
  inputFormat: "dd/MMM/yyyy",
};
fillMode="outline"
listOfContentType=[
  {Id:"Signage",DisplayName:"Signage"},
  {Id:"MusicMedia",DisplayName:"Music"},
  {Id:"Both",DisplayName:"All"}
]
listOfCustomerType=[
  {Id:"MainCustomer",DisplayName:"Main Customer"},
  {Id:"SubCustomer",DisplayName:"Sub Customer"}
]
@ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
  constructor(private router: Router, private formBuilder: UntypedFormBuilder, 
    public toastr: ToastrService, vcr: ViewContainerRef, 
    private cService: CustomerRegService, config: NgbModalConfig, 
    private modalService: NgbModal,public auth:AuthServiceOwn) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  d = new Date();
  year = this.d.getFullYear();
    month = this.d.getMonth();
  day = this.d.getDate();
  public dateTime1 = new Date(this.year+1,this.month,this.day);
  
 async ngOnInit() {
      
this.PrvTotalToken=0;
    this.Regform = this.formBuilder.group({
      countryName: ["", Validators.required],
      cCode: [""],
      stateName: ["", Validators.required],
      cityName: ["", Validators.required],
      customerName: ["", Validators.required],
      customerEmail: ["", [Validators.required, Validators.email]],
      totalToken: ["", Validators.required],
      expiryDate: [this.dateTime1, Validators.required],
      supportEmail: [""],
      supportPhNo: [""],
      Street: [""],
      DfClientId: [""],
      LoginId: [""],
      CustomerType: ["MainCustomer"],
      MainCustomer: ["6"],
      personName:[""],
      dbType:[localStorage.getItem('DBType')],
      ContentType:["Signage"],
      ApiKey:[""],
      loginclientId:[localStorage.getItem('loginclientid')],
      aStatus:["Active"]
    });
    this.CustomerList = [];
     this.DataTableSettings();
   await this.FillCountry();
   await this.FillCustomer();
 
  }
  DataTableSettings() {
    this.dtOptions = {
      pagingType: 'numbers',
      pageLength: 50,
      processing: false,
      dom: 'rtp',
      columnDefs: [{
        'targets': [4,5,6,7], // column index (start from 0)
        'orderable': false,
      },{
        'width':'120px', 'targets': 0,
      },{
        'width':'230px', 'targets': 1,
      },{
        'width':'350px', 'targets': 2,
      }
      ,{
        'width':'100px', 'targets': 3,
      }
      ,{
        'width':'100px', 'targets': 4,
      }
      ,{
        'width':'20px', 'targets': 5,
      },{
        'width':'20px', 'targets': 6,
      },{
        'width':'50px', 'targets': 7,
      }
  ],
      retrieve: true,
    };
  }
  ngAfterViewInit(): void {
    
  }
  filterById(): void {
    
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    
  }
  rerender(): void {
    
  }
  get f() { return this.Regform.controls; }
  Refresh = function () {
    this.dateTime1 = new Date(this.year+1,this.month,this.day);
    this.IsEditClick = "No";
    this.cNameCode="";
    this.PrvTotalToken=0;
    this.Regform = this.formBuilder.group({
      countryName: ["", Validators.required],
      cCode: [""],
      stateName: ["", Validators.required],
      cityName: ["", Validators.required],
      customerName: ["", Validators.required],
      customerEmail: ["", [Validators.required, Validators.email]],
      totalToken: ["", Validators.required],
      expiryDate: [this.dateTime1, Validators.required],
      supportEmail: [""],
      supportPhNo: [""],
      Street: [""],
      DfClientId: [""],
      LoginId: [""],
      CustomerType: ["MainCustomer"],
      MainCustomer: ["6"],
      personName:[""],
      dbType:[localStorage.getItem('DBType')],
      ContentType:["Signage"],
      ApiKey:[""],
      loginclientId:[localStorage.getItem('loginclientid')],
      aStatus:["Active"]
    });
  };
  onChangeCity(_id) {
    let obj = this.CityList.filter(o => o.Id==_id)
    this.citName = obj[0].DisplayName;
    this.ModifyCityId = obj[0].Id;
  }
  onChangeToken() {
    if (this.IsEditClick == "No") {
      this.Code = this.Regform.value.customerName.replace("-", "").substring(0, 5) + "" + this.citName.substring(0, 2) + "00" + this.CustomerList.length;
    }
  }
  onSubmitReg = function (mContent, hitType) {
    var cd= new Date
    var InputDate =  new Date(this.Regform.controls.expiryDate.value)

    if (this.Regform.controls.DfClientId.value ==""){
    if (this.Regform.controls.aStatus.value=="Trial"){
      if (InputDate<=cd){
        this.toastr.info("Please set trial expiry date");
        return
      }
    }
  }
    this.submitted = true;
    if (this.Regform.invalid) {
      return;
    }
    
    if (hitType=="First"){
   var CurrentTotalToken = this.Regform.get('totalToken').value;
    if (this.PrvTotalToken > CurrentTotalToken){
      this.modalService.open(mContent, { centered: true });
      return;
    }
  }
    
    this.loading = true;
    var NewCname= this.cNameCode+this.cName;
    this.Regform.controls.customerName.setValue(NewCname);
    this.cNameCode="";    

    this.cService.SaveCustomer(this.Regform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.Refresh();
          this.FillCustomer();
          return;
        }
        else if (obj.Responce == "2") {
          this.toastr.error("This email is already regsitered.", '');
          this.loading = false;
          return;
        }
        else if (obj.Responce == "0") {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          return;
        }
        else if (obj.Responce != "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.Refresh();
          this.SendMail(obj.Responce);
          return;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillCountry() {
    this.loading = true;
    var qry = "select countrycode as id, countryname as displayname from countrycodes";
    this.cService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CountryList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCountry(CountryID) {
    this.Country_Id = CountryID;
    this.CityList=[];
    this.StateList=[];
    const frm= this.Regform.value;
    frm['cityName']="0";
    frm['stateName']="0";
    frm['Street']="";
    this.FillState(CountryID);
  }
  FillState(CountryID) {
    this.loading = true;
    this.Regform.get('stateName').setValue("0");
    this.ModifyStateId="0";
    this.ModifyStateName=""
    this.StateList=[];
    var qry = "select stateid as id, statename as displayname  from tbstate where countryid = " + CountryID + " order by statename";
    this.cService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.StateList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

    if (this.IsEditClick == "No") {
      var qry = "select countrycode as id , CountryNameShort as displayname from CountryCodes where countryCode = " + CountryID + " ";
      this.cService.FillCombo(qry).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);

          this.cNameCode = obj[0].DisplayName + "-";

          this.loading = false;
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    }

  }
  onChangeState(StateID) {
    var ArrayItem = {};
    ArrayItem["Id"] = StateID;
    ArrayItem["DisplayName"] = "";
    this.ModifyStateId="0";
    this.ModifyStateName=""
    this.NewFilterList=[];
    this.GetJSONRecord(ArrayItem, this.StateList);
    if (this.NewFilterList.length > 0) {
      this.ModifyStateName = this.NewFilterList[0].DisplayName;
    }
    this.ModifyStateId = StateID;
    this.FillCity(StateID);
  }
  FillCity(StateID) {
    this.Regform.get('cityName').setValue("0");
    this.ModifyCityId="0";
    this.citName="";
    this.loading = true;
    var qry = "select cityid as id, cityname as displayname  from tbcity where stateid = " + StateID + " order by cityname";
    this.cService.FillCombo(qry).pipe()
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
  FillCustomer() {
   //this.rerender();
   this.CopyCustomerList=[]
    this.loading = true;
    this.cService.FillCustomer().pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        const objList = JSON.parse(returnData);
        if (this.auth.IsClientAdminLogin$.value==true) {
          this.CustomerList= objList.filter(o => o.DealerDFClientID === this.logindf.toString() ||  o.maindealerid === this.logindf.toString())
        }
        else{
          this.CustomerList= objList
        }
        this.CopyCustomerList=this.CustomerList

        this.rerender();
         
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  openCustomerDeleteModal(mContent, id) {
    this.did = id;
    this.modalService.open(mContent, { centered: true });
  }
  EditCustomer(id) {
    this.loading = true;
    this.cService.EditClickCustomer(id).pipe()
      .subscribe(data => {
        this.IsEditClick = "Yes";
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);

        var d = new Date(obj.expiryDate)
        this.onChangeCountry(obj.countryName);
        this.onChangeState(obj.stateName);
        var Code= obj.customerName.substring(0, 3);
        var CName= obj.customerName.substring(3, obj.customerName.length);
        this.cNameCode= Code;
        this.cName= CName;
        this.PrvTotalToken=obj.totalToken;
        this.Regform = this.formBuilder.group({
          countryName: [obj.countryName],
          cCode: [obj.cCode],
          stateName: [obj.stateName],
          cityName: [obj.cityName],
          customerName: [CName],
          customerEmail: [obj.customerEmail],
          totalToken: [obj.totalToken],
          expiryDate: [d],
          supportEmail: [obj.supportEmail],
          supportPhNo: [obj.supportPhNo],
          Street: [obj.Street],
          DfClientId: [obj.DfClientId],
          LoginId: [obj.LoginId],
          MainCustomer:[obj.MainCustomer],
          CustomerType:[obj.CustomerType],
          personName:[obj.personName],
          ContentType:[obj.ContentType],
          ApiKey:[obj.ApiKey]
        });
        this.dtTrialExtendExpiryDate = d
          if (obj.CustomerType=="MainCustomer"){
              this.iCheckMain=true;   
              this.iCheckSub=false;         
          }
          else{
            this.MainCustomerList= this.CustomerList;
            this.iCheckMain=false;   
            this.iCheckSub=true;         
        }

        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  DeleteCustomer() {
    this.loading = true;
    this.cService.DeleteCustomer(this.did).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.FillCustomer();
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

  SendMail(Id) {
    this.loading = true;
    this.cService.SendMail(Id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Email is Sent", 'Success!');
          this.loading = false;
          this.FillCustomer();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          return;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }

  openCommonModal(modal, ModalType) {
    this.ModalType = ModalType;
    if (ModalType == 'State') {
      this.HeaderText = "State";
      if (this.Country_Id =="0"){
        this.toastr.error("Please select a county");
        return;
      }
      this.NewName = this.ModifyStateName;
      this.CommonId = this.ModifyStateId;
      this.modalService.open(modal);

    }
    if (ModalType == 'City') {
      if (this.ModifyStateId=="0"){
        this.toastr.error("Please select a state");
        return;
      }
      this.HeaderText = "City";
      this.NewName = this.citName;
      this.CommonId = this.ModifyCityId;
      this.modalService.open(modal);
    }
  }
  NewFilterList;
  GetJSONRecord = (array, list): void => {
    this.NewFilterList = list.filter(order => order.Id == array.Id);
  }

  onSubmitModal() {
    this.loading = true;
    this.cService.CitySateNewModify(this.CommonId, this.NewName, this.ModalType, this.ModifyStateId, this.Country_Id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          if (this.ModalType == 'State') {
            this.FillState(this.Country_Id);
          }
          if (this.ModalType == 'City') {
           this.FillCity(this.ModifyStateId);
          }
        }
       else if (obj.Responce == "-2"){
          this.toastr.info("Name is already exixts", '');
          this.loading = false;
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          return;
        }
        this.NewName="";
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SetCustomerType(cType){
    this.MainCustomerList=[];
    if (cType=="SubCustomer"){
      this.SetMainCustomerCombo();
    }
    this.Regform.get('MainCustomer').setValue('6');
    this.Regform.get('CustomerType').setValue(cType);
  }
  SetMainCustomerCombo(){
    this.MainCustomerList= this.CustomerList;
  }
  TemplateAccess(Id){
    this.loading = true;
    this.cService.ClientTemplateRegsiter(Id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Template access is done", 'Success!');
          this.loading = false;
          this.FillCustomer();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          return;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  } 

  UpdateExpiryDate_Template_Creator(Id,status,expDate,key){
    if (key===""){
      this.toastr.info("Please active the template access", '');
      return;
    }
    this.loading = true;
    this.cService.UpdateExpiryDate_Template_Creator(Id,status,expDate).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.FillCustomer();
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
          return;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  } 
  openModalAssignCustomer(mdl){
    this.modalService.open(mdl);
    }
    accountStatus
    accountStatus_ClientId
    openModalTrialExtend(mdl, status,eDate,ClientId){
      this.HeaderText ="Trial Extend"
      this.dtTrialExtendExpiryDate = new Date(eDate)
      this.accountStatus_ClientId= ClientId
      this.accountStatus = status
      this.modalService.open(mdl);
      }
      openModalAccountAccess(mdl,eDate,ClientId){
        this.HeaderText ="Account Activate"
        this.dtTrialExtendExpiryDate = new Date(eDate)
        this.accountStatus_ClientId= ClientId
        this.accountStatus= 'Active'
        this.modalService.open(mdl);
        }
    AccountAccess(){
      this.UpdateClientStatus()
    }
    TrialExtend(){
      this.UpdateClientStatus()
    }

    UpdateClientStatus(){
      this.loading = true;
      this.cService.UpdateClientStatus(this.accountStatus,this.accountStatus_ClientId,this.dtTrialExtendExpiryDate).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == "1") {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            this.FillCustomer();
          }
          else {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
            return;
          }
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    } 


    UpdateKPNStatus(status,ClientId){
      this.loading = true;
      this.cService.UpdateClientKPNStatus(status,ClientId).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == "1") {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            this.FillCustomer();
          }
          else {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
            return;
          }
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    } 

    UpdateSanitizerStatus(status,ClientId){
      this.loading = true;
      this.cService.UpdateClientSanitizerStatus(status,ClientId).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == "1") {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            this.FillCustomer();
          }
          else {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
            return;
          }
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    } 


    ClientLogslist=[]
    openModalClientLogs(mdl,ClientId){
      this.loading = true;
    this.cService.GetClientLogs(ClientId).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.ClientLogslist=[]
          var obj = JSON.parse(returnData);
          if (obj.response == "1"){
            this.ClientLogslist = JSON.parse(obj.data);
        }
        this.modalService.open(mdl);
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
    onChangeStatus(event: Event){
      let selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
      let selectElementValue = event.target['options'][event.target['options'].selectedIndex].value;
      if (selectElementValue=="Active"){
        this.Regform.controls.expiryDate.setValue(this.dateTime1)
        
      }
      else{
        var cd= new Date()
        this.Regform.controls.expiryDate.setValue(cd)
      }
    }
    UpdateServiceStatus(status,ClientId,sericeName){
      this.loading = true;
      this.cService.UpdateServiceStatus(status,ClientId,sericeName).pipe()
        .subscribe(data => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == "1") {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            this.FillCustomer();
          }
          else {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
            return;
          }
        },
          error => {
            this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
            this.loading = false;
          })
    } 
    public getField = (args: any) => {
      return `${args.countryName}_${args.customerName}_${args.customerEmail}_${args.totalToken}_${args.aStatus}`;
    }
    public onFilter(inputValue: string): void {
      this.CustomerList = process(this.CopyCustomerList, {
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
    }}
