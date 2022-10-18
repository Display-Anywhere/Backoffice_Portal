import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';

@Component({
  selector: 'app-joan-devices',
  templateUrl: './joan-devices.component.html',
  styleUrls: ['./joan-devices.component.css']
})
export class JoanDevicesComponent implements OnInit {
  loading=false
  DevicesList=[]
  page: number = 1;
  pageSize: number = 20;
  DevicesList_count=0
  roomResourcesList=[]
  constructor(public toastr: ToastrService,private serviceLicense: SerLicenseHolderService, private modalService: NgbModal) { }

  async ngOnInit() {
    await this.FillClientList()
  }
  async FillClientList() {
    this.loading = true;
    this.DevicesList=[]
    this.serviceLicense.GetJoanDeviceStatus().pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.response =="1"){
          let res = JSON.parse(obj.data)
          this.DevicesList_count = res.count
          this.DevicesList = res.results
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  OpenRoomInfo(modalName,data){
    this.roomResourcesList= data
    this.modalService.open(modalName, {
      size: 'lg',
    });
  }
}
