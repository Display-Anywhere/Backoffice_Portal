import { Component, OnInit } from '@angular/core';
import { AuthServiceOwn } from './auth/auth.service';
import {
  NgbModalConfig,
  NgbModal,
  NgbNavChangeEvent,
  NgbTimepickerConfig,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { TokenInfoServiceService } from './components/token-info/token-info-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { SerLicenseHolderService } from './license-holder/ser-license-holder.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  SearchTokenId = '';
  FindText=''
  loading = false;
  ClientName = '';
  LastStatus = '';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  iframeUrl=false
  FoundRecordList=[]
  searchText=''
  loginclientid= localStorage.getItem('dfClientId')
  DemoUserActive=false
  constructor(
    public authService: AuthServiceOwn,
    private modalService: NgbModal,
    private tService: TokenInfoServiceService,
    public toastr: ToastrService,
    public auth: AuthServiceOwn,
    private router: Router,private auth0: AuthService, private serviceLicense: SerLicenseHolderService
  ) {
    
  }
  title = 'WebPanelCMS';
  public isCollapsed = true;
  ngOnInit() {
    this.isCollapsed = true;
  }
  SearchToken(e, modalName) {
    if (e.keyCode === 13) {
      if (this.FindText == '') {
        return;
      }
      this.FindStringInTable(modalName);
    }
  }
  tokenInfoClose() {
    this.SearchTokenId = '';
    this.FindText =''
    this.modalService.dismissAll();
  }
  FindStringInTable(modalName) {
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    this.loading = true;

    this.tService.FindStringInTable(this.FindText,i,localStorage.getItem('dfClientId'),localStorage.getItem('DBType')).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '0') {
            this.toastr.info('Records not found');
            this.loading = false;
            this.SearchTokenId =''
            this.FindText=''
            return;
          } 
          this.FindText=''
          this.FoundRecordList =JSON.parse(obj.data)
          this.loading = false;
          this.modalService.open(modalName, {
            size: 'lg',
            windowClass: 'tokenmodal',
          });
        },
        (error) => {
          this.loading = false;
        }
      );
      
  }
  FillTokenInfo(tokenid,modalName) {
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    this.loading = true;
    this.SearchTokenId= tokenid
    this.tService.FindToken(this.SearchTokenId,i,localStorage.getItem('dfClientId'),localStorage.getItem('DBType')).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);

          var obj = JSON.parse(returnData);
          if (obj.Responce == '0') {
            this.toastr.info('Token number is not found');
            this.loading = false;
            this.SearchTokenId =''
            return;
          } else {
            this.ClientName = obj.message;
            this.LastStatus = obj.status;
          }

          localStorage.setItem('tokenid', this.SearchTokenId);
          this.modalService.open(modalName, {
            size: 'lg',
            windowClass: 'tokenmodal',
          });

          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
      
  }

  logout() {
    //this.auth0.logout()
    this.authService.logout();
    window.location.href="https://uat.display-anywhere.com/"
    //this.router.navigate(['']);
  }
  OpenManual(){
    this.iframeUrl =true
  }
  CheckViewOnly(rotue){
    var IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
    if (IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.router.navigate([rotue]);
    
  }
  Enable_Disable_2FA(status) {
    this.loading = true;
    this.serviceLicense.UpdateTwoWayAuth(status,'0').pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            localStorage.setItem('IsTwoWayAuthActive', status);
            this.auth.SetTwoWayAuthActive()
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
  DemoUser() {
    this.DemoUserActive=true
    localStorage.setItem('chkDashboard', 'true');
    localStorage.setItem('chkPlayerDetail', 'true');
    localStorage.setItem('chkPlaylistLibrary', 'true');
    localStorage.setItem('chkScheduling', 'true');
    localStorage.setItem('chkAdvertisement', 'false');
    localStorage.setItem('chkInstantPlay', 'false');
    localStorage.setItem('chkUpload', 'true');
    localStorage.setItem('chkCopyData', 'false');
    localStorage.setItem('chkStreaming', 'false');
    localStorage.setItem('chkViewOnly', 'false');
    localStorage.setItem('chkEventMeeting', 'false');
    localStorage.setItem('isKpnActive','false') 
    localStorage.setItem('isSanitizerActive','false') 
    this.authService.IsUserLogin();
    this.router.navigate(['Dashboard']);
  }
  AdminUser(){
    this.DemoUserActive=false
    let obj = JSON.parse(localStorage.getItem('ApiObject'))
    localStorage.setItem('UserId', obj.UserId);
    localStorage.setItem('dfClientId', obj.dfClientId);
    localStorage.setItem('IsTwoWayAuthActive', obj.IsTwoWayAuthActive);
    localStorage.setItem('loginclientid', obj.dfClientId);
    localStorage.setItem('IsRf', obj.IsRf);
    localStorage.setItem('chkDashboard', obj.chkDashboard);
    localStorage.setItem('chkPlayerDetail', obj.chkPlayerDetail);
    localStorage.setItem('chkPlaylistLibrary', obj.chkPlaylistLibrary);
    localStorage.setItem('chkScheduling', obj.chkScheduling);
    localStorage.setItem('chkAdvertisement', obj.chkAdvertisement);
    localStorage.setItem('chkInstantPlay', obj.chkInstantPlay);
    localStorage.setItem('ClientContentType', obj.ContentType);

    localStorage.setItem('chkUpload', obj.chkUpload);
    localStorage.setItem('chkCopyData', obj.chkCopyData);
    localStorage.setItem('chkStreaming', obj.chkStreaming);
    localStorage.setItem('chkViewOnly', obj.chkViewOnly);
    localStorage.setItem('chkEventMeeting', obj.chkEventMeeting);
    localStorage.setItem('isKpnActive',obj.isKpnActive) 
    localStorage.setItem('isSanitizerActive',obj.isSanitizerActive) 
    if (obj.UserId != 0 && obj.chkEventMeeting == true) {
      localStorage.setItem('chkDashboard', 'false');
      localStorage.setItem('chkPlayerDetail', 'true');
    }
    this.authService.login();
    if (
      obj.dfClientId === '6' ||
      obj.dfClientId === '201' ||
      obj.dfClientId === '6'
    ) {
      this.authService.IsAdminLogin();
    } else if (obj.dfClientId === '167' && obj.UserId === '112') {
      localStorage.setItem('UserId', '0');
      this.authService.IsClienAdminLogin();
    } else if (obj.dfClientId === '183' && obj.UserId === '0') {
      this.authService.IsClienAdminLogin();
    } else {
      this.authService.IsUserLogin();
    }

    if (localStorage.getItem('UserId') === '-1') {
      this.router.navigate(['DJPlaylistLibrary']);
    } else {
      this.router.navigate(['Dashboard']);
      // this.router.navigate(['DJPlaylistLibrary']);
    }
  }
}
