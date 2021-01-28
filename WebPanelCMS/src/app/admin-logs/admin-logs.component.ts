import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { SerAdminLogService } from '../admin-logs/ser-admin-log.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {
  CustomerList: any[];
  LogList = [];
  public loading = false;
   
  page: number = 1;
  pageSize: number = 20;
   
  
  constructor(private adminService: SerAdminLogService,public auth:AuthService,
     public toastr: ToastrService, vcr: ViewContainerRef) {
   }

  ngOnInit() {
     
    this.FillClientList();
 
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.adminService.FillCombo(str).pipe()
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

  onChangeCustomer(deviceValue) {
    this.loading = true;
     
    this.adminService.FillAdminLogs(deviceValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.LogList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }


}
