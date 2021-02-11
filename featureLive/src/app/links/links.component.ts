import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';



@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  CustomerList: any[];
  lName;
  lPwd;
  public loading = false;
  
  IsAdvikon:boolean= true;

VideoLink0="";
VideoLink90="";
AudioLink0="";
AudioLink90="";
WindowSFLink="";
WindowVideoLink="";
CopyrightLink="";
CopyleftLink="";
StreamLink="";
Sanitizer0="";
AudioLinkSanitizer0="";
SanitizerLower="";
InstantPlay="";
Keyboard="";
SignageVideo0="";
SignageVideo90="";
  constructor(private serviceLicense: SerLicenseHolderService,
     public toastr: ToastrService, vcr: ViewContainerRef, public auth:AuthService) {
  }

  ngOnInit() {
    //================================== Advikon ==========================
    if ( localStorage.getItem('DBType')=='Advikon'){
  this.IsAdvikon= true;
  this.SignageVideo0="https://bit.ly/3c3P3GM";
  this.VideoLink90="https://bit.ly/2TKqbO3"; 
  this.AudioLink0="https://bit.ly/2XDJj13"; 
  this.AudioLink90="https://bit.ly/2B0Awij"; 
  this.Sanitizer0="https://bit.ly/3b41cfN";
  this.AudioLinkSanitizer0="https://bit.ly/371JRCk";

  this.WindowSFLink="https://bit.ly/3gtO8mk";
  this.WindowVideoLink="https://bit.ly/2TLFzcG";
  this.CopyrightLink="https://bit.ly/3d9RpW1";
  this.CopyleftLink="https://bit.ly/2BanHly";
  this.StreamLink="https://bit.ly/2AhYhSm";
  this.SanitizerLower="https://bit.ly/3j7ovrS";
  this.InstantPlay="https://bit.ly/3liIsOD";
  this.Keyboard="https://bit.ly/2QvvOxA";
this.VideoLink0="https://bit.ly/31yZLD4";
    }
    else{
    //================================== Nusign ==========================
     
    this.IsAdvikon= false;

    this.SignageVideo0="https://bit.ly/3dpea8z";
    this.VideoLink90="https://bit.ly/2AsJQes"; 
    this.AudioLink0="https://bit.ly/3gHryGV"; 
    this.AudioLink90="https://bit.ly/2MxTsaN";
    this.Sanitizer0="https://bit.ly/2YM4xf2";
    this.AudioLinkSanitizer0="https://bit.ly/370IYd8";
    this.StreamLink="https://bit.ly/3f79Afk";
    this.SanitizerLower="https://bit.ly/2ZAfIb1";
    this.InstantPlay="https://bit.ly/3hyrc5K";
    this.Keyboard="https://bit.ly/2ElBHuN";
    this.VideoLink0="https://bit.ly/2EwMhio";
    }
    if (this.auth.IsAdminLogin$.value==true) {
      this.FillClientList();
    }
     
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    str = "select DFClientID as id,  ClientName    as displayname from DFClients where CountryCode is not null and DFClients.IsDealer=1 and (dbtype='"+localStorage.getItem('DBType')+"' or dbtype='Both') order by RIGHT(ClientName, LEN(ClientName) - 3)";
    this.serviceLicense.FillCombo(str).pipe()
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
    this.serviceLicense.CustomerLoginDetail(deviceValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        
        var obj = JSON.parse(returnData);
        this.lName= obj.LoginName;
        this.lPwd= obj.LoginPassword;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
