import { Component, OnInit, ViewContainerRef, Inject, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UloginService } from '../login/ulogin.service';
import { VisitorsService } from '../visitors.service';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from '../auth/auth.service';
import { AuthService } from '@auth0/auth0-angular';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest , EventMessage, EventType} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit,OnDestroy {
  loginform: UntypedFormGroup;
  submitted = false;
  public loading = false;
  ipAddress;
  emailText = '';
  loginpage = 'Nusign';
  PortalName="nusign" //nusign sbit DM
  IsTwoWayActive= "0"
  randomNumber = ''
  EnterOTPCode = ''
  resApiObj:any
  private readonly _destroying$ = new Subject<void>();
  constructor(
    public toastr: ToastrService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private ulService: UloginService,
    private visitorsService: VisitorsService,
    public authService: AuthServiceOwn,private http: HttpClient,
    private auth0: AuthService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private MauthService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit() {
    
    this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
        });
        this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        this.setLoginDisplay();
      });
    this.authService.logout();
    localStorage.setItem('DBType', 'Nusign');
    localStorage.setItem('code','')
    localStorage.setItem('PortalName', this.PortalName);
    localStorage.setItem('host', 'https://api.nusign.eu/api/')
    //localStorage.setItem('host', 'http://localhost:60328/api/')
    if (localStorage.getItem('DBType') === 'Advikon') {
      this.emailText = 'info@display-anywhere.com';
    } else {
      this.emailText = 'info@display-anywhere.com';
    }
    localStorage.setItem('IsAnnouncement', '0');
    this.loginform = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      DBType: [localStorage.getItem('DBType')],
    });
    // lso@lcd.dk
    // Player!@#97player

    this.visitorsService.getIpAddress().subscribe((res) => {
      localStorage.setItem('ipAddress', res['ip']);
    });
  }

  get f() {
    return this.loginform.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginform.invalid) {
      return;
    }
    this.IsTwoWayActive= "0"
    this.loading = true;
    this.ulService
      .uLogin(this.loginform.value)
      .pipe()
      .subscribe(
        (data) => {
          this.loading = false;
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          this.resApiObj =obj
          if (obj.Responce === '1') {
            if (obj.IsTwoWayAuthActive == '1') {
              const frmValue = this.loginform.value
              this.SendOtpEmail(frmValue['email'])
            } else {
              this.ApiObject(obj);
            }
          } else if (obj.Responce === '0') {
            this.toastr.error('Login user/password is wrong', '');
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
          this.SaveModifyInfo('0', 'Login');
          
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
  }
  SaveModifyInfo(tokenid, ModifyText) {
    this.ulService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }

  ApiObject(obj) {
    console.log(obj)
    localStorage.setItem('ApiObject', JSON.stringify(obj));
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
    if ((obj.dfClientId == '201') && (obj.UserId == '0')) {
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

  SendOtpEmail(email) {
    try {
      this.loading = true;
      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.randomNumber=''
      for (var i = 0; i < 10; i++) {
        this.randomNumber += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }
      this.ulService
      .SendOTP(email, this.randomNumber.toUpperCase()).pipe().subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          this.loading = false;
          if (obj.Responce === '1') {
            this.IsTwoWayActive= "1"
            this.toastr.info('One time code is sent. Please check your email', '');
          }
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
        }
      );
      

    } catch (error) {
      this.toastr.error(
        'Apologies for the inconvenience.The error is recorded.',
        ''
      );
      this.loading = false;
    }
  }
  MatchOtp(){
    const enterCode= this.EnterOTPCode+'_'+this.resApiObj.dfClientId
    const sentCode=this.randomNumber.toUpperCase()+'_'+this.resApiObj.dfClientId
    if (enterCode== sentCode){
      this.ApiObject(this.resApiObj)
    }
    else{
      this.toastr.error('One time code is not match', '');
    }
  }


  ValidateSSO(email_verified:any,email:any){
    if (email_verified == false){
      this.toastr.error('Your email is not verified for SSO. Please verify your email', '');
      return
    }
    this.loginSSOwithAPI(email)
  }
  loginSSO() {
    //this.auth0.loginWithRedirect();
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.MauthService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.MauthService.instance.setActiveAccount(response.account);
          });
      } else {
        this.MauthService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.MauthService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.MauthService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.MauthService.loginRedirect();
      }
    }
  }
  loginSSOwithAPI(email){
    this.loading = true;
  this.ulService.CustomerLoginEmailVerify(email).pipe()
    .subscribe(data => {
      this.loading = false;
      const returnData = JSON.stringify(data);

      const obj = JSON.parse(returnData);
      this.resApiObj =obj
      if (obj.Responce === '1') {
        if (obj.IsTwoWayAuthActive == '1') {
          this.SendOtpEmail(email)
        } else {
          this.ApiObject(obj);
        }
      }
      else if (obj.Responce === '0') {
        this.toastr.error('Login user/password is wrong', '');
      }
      else {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
      }
      this.SaveModifyInfo(
        '0',
        'Login'
      );
     
    },
      error => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
        this.loading = false;
      });
  }
  setLoginDisplay() {
    const loginDisplay = this.MauthService.instance.getAllAccounts().length > 0;
    if (loginDisplay ==true){
      this.getMicrosoftProfile()
    }
  }
  async getMicrosoftProfile(){
    this.loading = true;
    this.http.get('https://graph.microsoft.com/v1.0/me')
  .subscribe(profile => {
    this.loginSSOwithAPI(profile['userPrincipalName'])
  });
    this.loading = false;
    
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
//Enter_the_Application_Id_here > 80a7b076-4c4a-429e-9b6f-402f3e5e49c5
// Enter_the_Tenant_Info_Here => b8e4b8e1-2211-4845-8e03-cf1e88544864
