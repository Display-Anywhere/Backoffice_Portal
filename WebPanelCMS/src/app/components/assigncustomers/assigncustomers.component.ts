import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { SerAdminLogService } from '../admin-logs/ser-admin-log.service';


@Component({
  selector: 'app-assigncustomers',
  templateUrl: './assigncustomers.component.html',
  styleUrls: ['./assigncustomers.component.css']
})
export class AssigncustomersComponent implements OnInit {
  CustomerList: any[];
  public loading = false;
  searchText
  Assign_CustomerList =[]
  ClientSelected=[]
  cmbCustomer
  constructor(private adminService: SerAdminLogService,public auth:AuthService,private modalService: NgbModal,
    public toastr: ToastrService, vcr: ViewContainerRef) { }

  ngOnInit(): void {
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
        if (i==1){
        this.auth.SetClientId('0');
        }
        else{
          this.auth.SetClientId(localStorage.getItem('dfClientId'));
        }
        
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeCustomer(deviceValue) {
    this.Assign_CustomerList=[]
    var str = "";
    str = "select DFClientID as Id, '' as displayname  from DFClients where AssignClientId= " + deviceValue 
    this.adminService.FillCombo(str).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      this.loading = false;
      this.CustomerList.forEach(item => {
        if (item['Id'] !=deviceValue){
        var ob= obj.filter(p => p.Id === item['Id'])
        if (ob.length>0){
          item['check']=true
          this.ClientSelected.push(item['Id'])
        }
        else{
          item['check']=false
        }
        this.Assign_CustomerList.push(item)
      }
      });
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
  }
  SelectClient(fileid, event) {
          const index: number = this.ClientSelected.indexOf(fileid);
            if (index !== -1) {
              this.ClientSelected.splice(index, 1);
           }
    if (event.target.checked) {
      this.ClientSelected.push(fileid)
    }
    
  }
  SaveAssignCustomers(){
    if (this.ClientSelected.length==0){
      this.toastr.error("Please select customers.", '');
      return
    }
    this.loading= true 
    this.adminService.AssignCustomers(this.cmbCustomer,this.ClientSelected).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      this.loading = false;
      this.cmbCustomer=""
      this.ClientSelected=[]
      this.modalService.dismissAll()
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
  }
}
