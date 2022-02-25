import { Component, OnInit, ViewContainerRef,ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../customer-dashboard/dashboard.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';
import { NgbdSortableHeader_Dashboard,SortEvent } from './dashboard_sortable.directive';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  providers: [DecimalPipe],
})
export class CustomerDashboardComponent implements OnInit {
  TokenList = [];
  MainTokenList = [];
  page: number = 1;
  pageSize: number = 20;
  loading: boolean;
  TotalPlayers = 0;
  OnlinePlayers = 0;
  OfflinePlayer = 0;
  DeviceStatusList = [];
  PlayerFillType = "Total Players";
  TokenInfo;
  searchText;
  //IsAdminLogin: boolean = false;
  CustomerList = [];
  cmbCustomerId = "";
  ActiveTokenListlength=0;
  PublishSearchList=[]
  
  timeLeft: number = 300;
  interval;

  @ViewChildren(NgbdSortableHeader_Dashboard) headers: QueryList<NgbdSortableHeader_Dashboard>;
  compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private dService: DashboardService,
    config: NgbModalConfig, private modalService: NgbModal, private auth: AuthService,
    private pipe: DecimalPipe) {
    config.backdrop = 'static';
    config.keyboard = false;
    console.log("Dashboard");
  }
  ngOnDestroy () {
    clearInterval(this.interval);
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
    this.searchText = "";
    if (filter == "Total") {
      this.TokenList=[];
      this.TokenList= this.MainTokenList;
      this.ActiveTokenListlength =this.TokenList.length;
      this.searchText = "";
      this.PlayerFillType = filter + " Players";
    }
    else {
      this.TokenList=[];
      this.TokenList= this.MainTokenList.filter(order=> order.pStatus===filter)
      this.ActiveTokenListlength =this.TokenList.length;
      if (filter == "Away") {
        this.PlayerFillType = "Offline Players";
      }
      else {
        this.PlayerFillType = filter + " Players";
      }
    }
  }

  onChangeCustomer(deviceValue) {
    this.timeLeft = 300
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

  FillDeviceLastStatus() {
    this.loading = true;
    var qry = "select TokenId as Id, max(StatusDatetime) as DisplayName from tbTokenOverDueStatus where tokenid in(select tokenid from AMPlayerTokens where ClientID="+this.cmbCustomerId+") group by TokenId"
    this.dService.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.DeviceStatusList = JSON.parse(returnData);
          
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
           
        }
      );
  }

  async GetCustomerTokenDetail(type, cid) {
    clearInterval(this.interval);
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
    this.MainTokenList =[];
    this.loading = true;
    await this.FillDeviceLastStatus()

    this.dService.GetCustomerTokenDetailSummary(type, this.cmbCustomerId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);

        if (obj.TotalPlayers != '0') {
          this.TotalPlayers = obj.TotalPlayers;
          this.OnlinePlayers = obj.OnlinePlayers;
          this.OfflinePlayer = obj.OfflinePlayer;
          obj.lstToken.forEach(item => {
            let obj= this.DeviceStatusList.filter(d=>d.Id===item['tokenCode'])
            if (obj.length>0){
              item['dStatus']=obj[0]['DisplayName']
            }
            else{
              item['dStatus']=item['lStatus']
            }
          });
          this.TokenList = obj.lstToken;
          this.MainTokenList = obj.lstToken;

          this.ActiveTokenListlength =this.TokenList.length;
          this.loading = false;
          const objSort:SortEvent   ={
            column:'city',
            direction: 'asc'
           }
           setTimeout(() => { 
            this.onSort(objSort);
          }, 500);
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
        this.startTimer();
  }
  openModal(content, tid, location, city) {
    this.TokenInfo = tid + "-" + location + "-" + city;
    localStorage.setItem("tokenid", tid);
    this.modalService.open(content, { size: 'lgp' });

  }
  onSort({column, direction}: SortEvent) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
 
  if (direction === '' || column === '') {
    this.TokenList = this.MainTokenList;
  } else {
    this.TokenList = [...this.MainTokenList].sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
onChangeEvent(){
  this.PublishSearchList = this.TokenList.filter(country => this.dService.matches(country, this.searchText, this.pipe));
  const total = this.PublishSearchList.length;
  this.ActiveTokenListlength =total
  console.log(total)
}
minutes
seconds
startTimer() {
  this.interval = setInterval(() => {
    if(this.timeLeft > 0) {
      this.timeLeft--;
      this.minutes = Math.floor(this.timeLeft / 60);
this.seconds = Math.floor(this.timeLeft - this.minutes * 60);
    } else {
      this.timeLeft = 300;
      if (this.cmbCustomerId != ""){
        this.GetCustomerTokenDetail('Total', this.cmbCustomerId);
      }
    }
  },1000)
}
}
