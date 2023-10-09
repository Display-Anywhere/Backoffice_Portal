import { Component, OnInit, ViewContainerRef, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrayerserService } from '../prayer/prayerser.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-prayer',
  templateUrl: './prayer.component.html',
  styleUrls: ['./prayer.component.css']
})
export class PrayerComponent implements OnInit {
  PrayerList = [];
  Prayerform: UntypedFormGroup;
  CustomerList = [];
  TokenList = [];
  CustomerSelected = [];
  TokenSelected = [];

  SearchCustomerList = [];
  SearchTokenList = [];
  loading: boolean = false;
  SearchPDate;
  cmbSearchCustomer = 0;
  cmbSearchToken = 0;
pid;
submitted;
UserPrayerTabId =1
IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  @ViewChildren("checkboxesCustomer") checkboxesCustomer: QueryList<ElementRef>;

  constructor(private formBuilder: UntypedFormBuilder, public toastr: ToastrService,
    vcr: ViewContainerRef, private pService: PrayerserService,config: NgbModalConfig, 
    private modalService: NgbModal, public auth:AuthServiceOwn) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    var cd = new Date;
    const dt = new Date('Mon Mar 09 2020 ' + cd.getHours() + ':' + cd.getMinutes() + ':00');

    this.Prayerform = this.formBuilder.group({
      sDate: [cd, Validators.required],
      eDate: [cd, Validators.required],
      startTime: [dt, Validators.required],
      duration: [0, Validators.required],
      tokenid: [this.TokenSelected],
    });
    this.PrayerList = [];
    this.SearchPDate = cd;
    this.CustomerList = [];

    this.TokenList = [];
    this.FillClientList();
  }

  get f() { return this.Prayerform.controls; }
  onSubmitPrayer = function () {

    this.submitted = true;
    if (this.Prayerform.invalid) {
      return;
    }
    if (this.Prayerform.value.duration == 0) {
      this.toastr.error("Duration should be greater than zero");
      return;
    }
    if (this.CustomerSelected.length == 0) {
      this.toastr.error("Please select customer");
      return;
    }
    if (this.TokenSelected.length == 0) {
      this.toastr.error("Select atleast one token");
      return;
    }

    this.SavePrayer();
  }
  Refresh() {
    var cd = new Date;
    const dt = new Date('Mon Mar 09 2020 ' + cd.getHours() + ':' + cd.getMinutes() + ':00');

    this.CustomerSelected = [];
    this.TokenList = [];
    this.TokenSelected = [];

    this.Prayerform = this.formBuilder.group({
      sDate: [cd, Validators.required],
      eDate: [cd, Validators.required],
      startTime: [dt, Validators.required],
      duration: [0, Validators.required],
      tokenid: [this.TokenSelected],
    });
    
    this.checkboxesCustomer.forEach((element) => {
      element.nativeElement.checked = false;
    });

  }
  SavePrayer() {

    var sTime = this.Prayerform.value.startTime;
    const dt = new Date('Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00');
    this.Prayerform.get('startTime').setValue(dt.toTimeString().slice(0, 5));

    this.loading = true;
    this.pService.SavePrayer(this.Prayerform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", '');
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

  SelectCustomer(fileid, event) {
    this.CustomerSelected=[];
    this.CustomerSelected.push(fileid);
    if (this.CustomerSelected.length!=0){
      this.FillTokenInfo();
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
  FillClientList() {
    var str="";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.loading = true;
    this.pService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.SearchCustomerList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillTokenInfo() {
    this.loading = true;
    this.pService.FillTokenInfoPrayer(this.CustomerSelected[0]).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.TokenList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCustomer(e) {
    this.loading = true;
    this.pService.FillTokenInfo(e).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SearchTokenList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  openPrayerDeleteModal(mContent, id){
    this.pid = id;
    this.modalService.open(mContent, { centered: true });
  }
  DeleteParyer(){
    this.loading = true;
    this.pService.DeletePrayer(this.pid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce=="1"){
          this.toastr.info("Deleted", '');
          this.SearchPrayer();
        }
        else{
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SearchPrayer(){
   this.loading = true;
    this.pService.FillSearchPayer(this.SearchPDate, this.cmbSearchToken).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PrayerList = JSON.parse(returnData);
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
}
