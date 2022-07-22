import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from '../auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



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
  dailypwd
  IsTwoWayAuthActive= localStorage.getItem('IsTwoWayAuthActive')
  IsAdvikon:boolean= true;
  IschkViewOnly=0;
  iframeUrl=false;
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
viewsonic="";
UserId = localStorage.getItem('UserId');
IsSbit= localStorage.getItem('IsSbit')
SmartTv="https://bit.ly/3vl4Gqm"
  constructor(private serviceLicense: SerLicenseHolderService,
     public toastr: ToastrService, vcr: ViewContainerRef, public auth:AuthServiceOwn,private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
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
  this.viewsonic="https://bit.ly/3tkqrCi"
    }
    else{
    //================================== Nusign ==========================
     
    this.IsAdvikon= false;
if ((localStorage.getItem('IsSbit') == 'Yes')){

  this.SignageVideo0="";
  this.VideoLink90=""; 
  this.AudioLink0="https://bit.ly/3yyS6Wv"; 
  this.AudioLink90="";
  this.Sanitizer0="https://bit.ly/3sfZ4vi";
  this.AudioLinkSanitizer0="";
  this.StreamLink="";
  this.SanitizerLower="";
  this.InstantPlay="https://bit.ly/3FkW06p";
  this.Keyboard="https://bit.ly/3kHqCpr";
  this.VideoLink0="https://bit.ly/3MW4dAQ";
  this.viewsonic="https://bit.ly/3KQFeNQ"
}
else{
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
    this.viewsonic="https://bit.ly/3eiur1O"
    }
  }
    if (this.auth.IsAdminLogin$.value==true) {
      this.FillClientList();
    }
    if (this.auth.IsAdminLogin$.value==false) {
      this.FillClientAdminList();
    }
     this.GenerateDailyPwd()
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    str = "select DFClientID as id,  ClientName    as displayname from DFClients where CountryCode is not null and DFClients.IsDealer=1 and (dbtype='"+localStorage.getItem('DBType')+"' or dbtype='Both') order by ClientName";
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
  FillClientAdminList() {
    this.loading = true;
    var str = "";
    str = "select DFClientID as id,  ClientName    as displayname from DFClients where CountryCode is not null and (DFClients.DealerDFClientID='"+localStorage.getItem('dfClientId'  )+"' or DFClients.maindealerid='"+localStorage.getItem('dfClientId'  )+"')  order by ClientName";
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
  OpenManual(){
    this.iframeUrl =true
  }
  HideManual(){
    this.iframeUrl =false
  }
  GenerateDailyPwd(){
    var dt= new Date
    let day = dt.getDate();
    let month = dt.getMonth();
    let year = dt.getFullYear();
   let password = (((day + month + year) * (day * 3 + month* 2)) + day) % 10000;
   this.dailypwd=password
  }


  UpdateTwoWayAuth(status){
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.serviceLicense.UpdateTwoWayAuth(status).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.IsTwoWayAuthActive= status
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          }
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }

}
