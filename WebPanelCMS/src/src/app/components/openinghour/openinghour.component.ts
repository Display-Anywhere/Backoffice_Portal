import { Component, OnInit,QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  NgbModalConfig,NgbModal,NgbNavChangeEvent,NgbTimepickerConfig,NgbTimeStruct,NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import {NgbdSortableHeader, SortEvent} from '../../components/sortable.directive';

@Component({
  selector: 'app-openinghour',
  templateUrl: './openinghour.component.html',
  styleUrls: ['./openinghour.component.css']
})
export class OpeninghourComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  OpeningRebootActive=1;
 
  OpeningHoursList = [];
  MainOpeningHoursList=[];
  RebootTimePlayerList = [];
  openSearchText;
  RebootSearchText;
  OpeningHourTokenSelected = [];
  RebotTimeTokenSelected = [];
  frmOpeningHour: FormGroup;
  frmRebootTime: FormGroup;
  time: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  time2: NgbTimeStruct = {hour: 23, minute: 59, second: 0};
  cid="";
  selectedItems=[];
  loading = false;
  compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  constructor(public toastr: ToastrService,private formBuilder: FormBuilder,private serviceLicense: SerLicenseHolderService,
    ) { }

  ngOnInit(): void {
    this.cid=localStorage.getItem('tcid');
    this.OpeningHoursList = [];
    this.MainOpeningHoursList =[];
    this.RebootTimePlayerList =[];

    this.SetFormOpeningHour();
   
    this.FillTokenOpeningHours();
    this.SetFormRebootTime();
    this.FillTokenRebotTime();
  }

  SetFormOpeningHour() {
    this.frmOpeningHour = this.formBuilder.group({
      startTime: [this.time, Validators.required],
      EndTime: [this.time2, Validators.required],
      wList: [this.selectedItems, Validators.required],
      TokenList: [this.OpeningHourTokenSelected],
    });
  }
  SetFormRebootTime() {
    this.frmRebootTime = this.formBuilder.group({
      startTime: [this.time, Validators.required],
      TokenList: [this.RebotTimeTokenSelected],
    });
  }
  UpdateTokenOpeningHours() {
    if (!this.frmOpeningHour.invalid) {
      return;
    }
    if (this.OpeningHourTokenSelected.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    this.frmOpeningHour.controls.TokenList.setValue(
      this.OpeningHourTokenSelected
    );
    const sTime = this.frmOpeningHour.value.startTime;
    const eTime = this.frmOpeningHour.value.EndTime;
    const dt = new Date(
      'Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00'
    );
    const dt2 = new Date(
      'Mon Mar 09 2020 ' + eTime.hour + ':' + eTime.minute + ':00'
    );
    this.frmOpeningHour
      .get('startTime')
      .setValue(dt.toTimeString().slice(0, 5));
    this.frmOpeningHour.get('EndTime').setValue(dt2.toTimeString().slice(0, 5));
    this.loading = true;
    this.serviceLicense
      .SaveOpeningHours(this.frmOpeningHour.value)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
          }
          this.selectedItems = [];
          this.OpeningHourTokenSelected = [];
          this.frmOpeningHour.get('startTime').setValue(sTime);
          this.frmOpeningHour.get('EndTime').setValue(eTime);
          this.frmOpeningHour.get('wList').setValue(this.selectedItems);

          this.FillTokenOpeningHours();
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

  UpdateTokenRebootTime() { 
    
    const sTime = this.frmRebootTime.value.startTime;
    
if ((sTime.hour==0) && (sTime.minute==0)){
  this.toastr.info('Reboot time never set 00:00');
  return;
}

    const dt = new Date(
      'Mon Mar 09 2020 ' + sTime.hour + ':' + sTime.minute + ':00'
    );

    if (this.RebotTimeTokenSelected.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    this.frmRebootTime.controls.TokenList.setValue(
      this.RebotTimeTokenSelected
    );
    
    this.frmRebootTime
      .get('startTime')
      .setValue(dt.toTimeString().slice(0, 5));
    this.loading = true;
    this.serviceLicense
      .SaveRebootTime(this.frmRebootTime.value)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
          }
          this.RebotTimeTokenSelected = [];
          this.frmRebootTime.get('startTime').setValue(sTime);
          this.FillTokenRebotTime();
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

  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  
  SelectRebootTimeToken(fileid, event) {
    if (event.target.checked) {
      this.RebotTimeTokenSelected.push(fileid);
    } else {
      const index: number = this.RebotTimeTokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.RebotTimeTokenSelected.splice(index, 1);
      }
    }
  }

  SelectOpeningHourToken(fileid, event) {
    if (event.target.checked) {
      this.OpeningHourTokenSelected.push(fileid);
    } else {
      const index: number = this.OpeningHourTokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.OpeningHourTokenSelected.splice(index, 1);
      }
    }
  }
  
  FillTokenRebotTime() {
    this.loading = true;
    this.serviceLicense
      .FillTokenInfo(this.cid, '0')
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.RebootTimePlayerList = JSON.parse(returnData);
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
  FillTokenOpeningHours() {
    
    this.loading = true;
    this.serviceLicense
      .FillTokenOpeningHours(this.cid, '0')
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.OpeningHoursList = JSON.parse(returnData);
          this.MainOpeningHoursList= JSON.parse(returnData);
          this.loading = false;
          const obj:SortEvent   ={
            column:'city',
            direction: 'asc'
           }
           setTimeout(() => { 
            this.onSort(obj);
          }, 500);
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
  onSort({column, direction}: SortEvent) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.OpeningHoursList = this.MainOpeningHoursList;
    } else {
      this.OpeningHoursList = [...this.MainOpeningHoursList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}
