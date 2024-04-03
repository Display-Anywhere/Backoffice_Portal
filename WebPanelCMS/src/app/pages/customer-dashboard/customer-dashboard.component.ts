import { DecimalPipe } from '@angular/common';
import { Component, OnInit,Input,ViewContainerRef, ElementRef, ViewChild,QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { StoreForwardService } from 'app/mock-api/services/store-forward.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  providers: [DecimalPipe]
})
export class CustomerDashboardComponent implements OnInit  {
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  loading=false
  CustomerTotals={
    NrOfOnlineDevices:"0",
    NrOfOfflineDevices:"0",
    NrOfSchedulingIssues:"0",
    NrOfDownloadIssues:"0"
  }
  cmbCustomer="0"
  CustomerList=[]
  listOfDashboardCustomerCities=[]
  listOfDashboardCustomerCityDevices=[]
  constructor(public toastrSF: ToastrService,private sfService: StoreForwardService,
    public auth:AuthServiceOwn,private modalService: NgbModal)
    {  }
  async ngOnInit(){
    await this.FillClient()
  }
  FillClient() {
    var q = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.loading = true;
    this.sfService.FillCombo(q).pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          this.cmbCustomer=localStorage.getItem('dfClientId')
          await this.onChangeCustomer(localStorage.getItem('dfClientId'));
        },
        (error) => {
          this.toastrSF.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }

  async onChangeCustomer(id){
    await this.GetDashboardCustomerTotals()
    await this.GetDashboardCities()
  }
  GetDashboardCustomerTotals(){
    this.loading = true;
    this.CustomerTotals={
      NrOfOnlineDevices:"0",
      NrOfOfflineDevices:"0",
      NrOfSchedulingIssues:"0",
      NrOfDownloadIssues:"0"
    }
    this.sfService.GetDashboardCustomerTotals(this.cmbCustomer).pipe().subscribe(async (data) => {
      this.loading = false;
      var returnData = JSON.stringify(data);
      var objData = JSON.parse(returnData);
      if (objData.response!="0"){
        let obj = JSON.parse(objData.data)
        this.CustomerTotals= obj[0]
      }
    },
    (error) => {
      this.toastrSF.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
    }
  );
  }
  GetDashboardCities(){
    this.loading = true;
    this.listOfDashboardCustomerCities=[]
    this.sfService.GetDashboardCities(this.cmbCustomer).pipe().subscribe(async (data) => {
      this.loading = false;
      var returnData = JSON.stringify(data);
      var objData = JSON.parse(returnData);
      if (objData.response!="0"){
        this.listOfDashboardCustomerCities = JSON.parse(objData.data)
      }
    },
    (error) => {
      this.toastrSF.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
    }
  );
  } 
  async OpenViewDashboardCityDevices(modalName,id){
    await this.GetDashboardCityDevices(id)
    this.modalService.open(modalName, {
      size: 'lg',
      centered: true
    }); 
  }
  GetDashboardCityDevices(id){
    this.loading = true;
    this.listOfDashboardCustomerCityDevices=[]
    this.sfService.GetDashboardCityDevices(this.cmbCustomer,id).pipe().subscribe(async (data) => {
      this.loading = false;
      var returnData = JSON.stringify(data);
      var objData = JSON.parse(returnData);
      if (objData.response!="0"){
        this.listOfDashboardCustomerCityDevices= JSON.parse(objData.data)
      }
    },
    (error) => {
      this.toastrSF.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
    }
  );
  } 

}
