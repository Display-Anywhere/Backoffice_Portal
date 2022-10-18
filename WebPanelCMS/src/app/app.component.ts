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
    this.router.navigate(['']);
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
}
