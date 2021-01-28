import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../customer-dashboard/dashboard.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  TokenList = [];
  page: number = 1;
  pageSize: number = 20;
  loading: boolean;
  TotalPlayers = 0;
  OnlinePlayers = 0;
  OfflinePlayer = 0;
  PlayerFillType = "Total Players";
  TokenInfo;
  searchText;
  //IsAdminLogin: boolean = false;
  CustomerList = [];
  cmbCustomerId = "";

  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private dService: DashboardService,
    config: NgbModalConfig, private modalService: NgbModal, private auth: AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
    console.log("Dashboard");
  }

  ngOnInit() {

    this.TokenList = [{}];
    this.FillClientList();
  }
  FillSubClientList() {
    var q = "";
    q = "select DFClientID as id,ClientName as displayname from ( ";
    q = q + " select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
    q = q + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
    q = q + " where DFClients.CountryCode is not null and DFClients.DealerDFClientID= " + localStorage.getItem('dfClientId') + "    ";
    q = q + " union all select distinct DFClients.DFClientID,DFClients.ClientName from DFClients ";
    q = q + " inner join AMPlayerTokens on DFClients.DfClientid=AMPlayerTokens.Clientid ";
    q = q + " where DFClients.CountryCode is not null and DFClients.MainDealerid= " + localStorage.getItem('dfClientId') + "    ";
    q = q + "   ) as a order by ClientName desc ";
    this.loading = true;
    this.dService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');
    this.dService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
         
        if ((this.auth.IsAdminLogin$.value == false)) {
          this.cmbCustomerId = localStorage.getItem('dfClientId');
          this.GetCustomerTokenDetail('Total', localStorage.getItem('dfClientId'));
        }

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  GetCustomerTokenDetailFilter(filter) {
    if (filter == "Total") {
      this.searchText = "";
      this.PlayerFillType = filter + " Players";
    }
    else {
      this.searchText = filter;
      if (filter == "Away") {
        this.PlayerFillType = "Offline Players";
      }
      else {
        this.PlayerFillType = filter + " Players";
      }
    }
  }

  onChangeCustomer(deviceValue) {
    this.cmbCustomerId = deviceValue;
    this.GetCustomerTokenDetail('Total', deviceValue);
  }
  RefershClick() {
    var cid;
    if (this.auth.IsAdminLogin$.value == true) {
     // cid = this.cmbCustomerId;
    }
    else {
      //cid = localStorage.getItem('dfClientId');
    }
    this.GetCustomerTokenDetail('Total', cid);
  }
  GetCustomerTokenDetail(type, cid) {
    this.PlayerFillType = type + " Players";

    if (this.auth.IsAdminLogin$.value == true) {
//      cid = this.cmbCustomerId;
    }
    else {
  //    cid = localStorage.getItem('dfClientId');
    }
    this.TotalPlayers = 0;
    this.OnlinePlayers = 0;
    this.OfflinePlayer = 0;
    this.TokenList =[];
    this.loading = true;
    this.dService.GetCustomerTokenDetailSummary(type, this.cmbCustomerId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);

        if (obj.TotalPlayers != '0') {
          this.TotalPlayers = obj.TotalPlayers;
          this.OnlinePlayers = obj.OnlinePlayers;
          this.OfflinePlayer = obj.OfflinePlayer;
          this.TokenList = obj.lstToken;
          this.loading = false;
          this.GetCustomerTokenDetailFilter('Total');
        }
        else {
          this.loading = false;
        }
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  openModal(content, tid, location, city) {
    this.TokenInfo = tid + "-" + location + "-" + city;
    localStorage.setItem("tokenid", tid);
    this.modalService.open(content, { size: 'lg' });

  }
}
