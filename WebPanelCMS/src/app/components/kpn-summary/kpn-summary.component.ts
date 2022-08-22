import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MachineService } from '../machine-announcement/machine.service';

@Component({
  selector: 'app-kpn-summary',
  templateUrl: './kpn-summary.component.html',
  styleUrls: ['./kpn-summary.component.css']
})
export class KpnSummaryComponent implements OnInit {
  loading=false
  ChannelList
  ChannelPlayerList
  constructor(public toastr: ToastrService, private mService:MachineService) { }

  ngOnInit(): void {
    this.FillChannels()
  }

  FillChannels() {
    var q = "";
    q = "select distinct channelid as Id, channelname as DisplayName from  tbPlayerKpnChannels order by channelname";

    this.loading = true;
    this.mService.FillCombo(q).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.ChannelList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeChannel(id){
    this.ChannelPlayerList=[]
    this.loading = true;
    this.mService.GetKpnChannelSummary(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          this.ChannelPlayerList = JSON.parse(obj.data)
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
