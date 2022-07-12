import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { UloginService } from 'src/app/login/ulogin.service';
import { VisitorsService } from 'src/app/visitors.service';

@Component({
  selector: 'app-login-sbit',
  templateUrl: './login-sbit.component.html',
  styleUrls: ['./login-sbit.component.css']
})
export class LoginSbitComponent implements OnInit {
  loginform: FormGroup;
  submitted = false;
  public loading = false;
  ipAddress;
  emailText=''
  loginpage='Nusign'
  IsSbit='Yes'

  constructor(public toastr: ToastrService, private router: Router, private formBuilder: FormBuilder,
     private ulService: UloginService, private visitorsService: VisitorsService,
      public authService: AuthServiceOwn,private auth0: AuthService) {
        this.auth0.isAuthenticated$.subscribe((res: boolean) => {
          if (res) {
            this.auth0.idTokenClaims$.subscribe((IdToken) => (
              this.ValidateSSO(IdToken?.email_verified,IdToken?.email)
              )
            );
          }
          else{
          }
        });
       }
       ValidateSSO(email_verified:any,email:any){
        if (email_verified == false){
          this.toastr.error('Your email is not verified for SSO. Please verify your email', '');
          return
        }
        this.loginSSOwithAPI(email)
      }
      loginSSO() {
        this.auth0.loginWithRedirect();
      }
      loginSSOwithAPI(email){
        this.loading = true;
      this.ulService.CustomerLoginEmailVerify(email).pipe()
        .subscribe(data => {
          const returnData = JSON.stringify(data);
  
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            localStorage.setItem('UserId', obj.UserId);
            localStorage.setItem('dfClientId', obj.dfClientId);
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
            if (obj.UserId != 0 && obj.chkEventMeeting == true){
              localStorage.setItem('chkDashboard', 'false');
              localStorage.setItem('chkPlayerDetail', 'true');
            }
            this.authService.login();
            if ((obj.dfClientId === '6') || (obj.dfClientId === '95') || (obj.dfClientId === '6')) {
              this.authService.IsAdminLogin();
            }
            else if ((obj.dfClientId === '167') && (obj.UserId==='112')) {
              localStorage.setItem('UserId', '0');
              this.authService.IsClienAdminLogin();
            }
            else if ((obj.dfClientId === '183') && (obj.UserId==='0')) {
              this.authService.IsClienAdminLogin();
            }
            else {
              this.authService.IsUserLogin();
            }
            
            if (localStorage.getItem('UserId') === '-1') {
              this.router.navigate(['DJPlaylistLibrary']);
            }
            else {
              
              this.router.navigate(['LicenseHolderControl']);
              // this.router.navigate(['DJPlaylistLibrary']);
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
          this.loading = false;
        },
          error => {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
            this.loading = false;
          });
      }

      ngOnInit() {
        this.authService.logout();
        localStorage.setItem('DBType', 'Nusign');
        localStorage.setItem('IsSbit', this.IsSbit);
    
        
        if (localStorage.getItem('DBType')==="Advikon"){
          this.emailText='jan@advikon.eu'
        }
        else{
          this.emailText='info@nusign.be'
        }
        localStorage.setItem('IsAnnouncement','0')
        this.loginform = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
          DBType: [localStorage.getItem('DBType')]
        });
        // lso@lcd.dk
        // Player!@#97player
    
        this.visitorsService.getIpAddress().subscribe(res => {
          localStorage.setItem('ipAddress', res['ip']);
        });
      }
    
      get f() { return this.loginform.controls; }
    
      onSubmit() {
    
        this.submitted = true;
        if (this.loginform.invalid) {
          return;
        }
        
        this.loading = true;
        this.ulService.uLogin(this.loginform.value).pipe()
          .subscribe(data => {
            const returnData = JSON.stringify(data);
    
            const obj = JSON.parse(returnData);
            if (obj.Responce === '1') {
              localStorage.setItem('UserId', obj.UserId);
              localStorage.setItem('dfClientId', obj.dfClientId);
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
              if (obj.UserId != 0 && obj.chkEventMeeting == true){
                localStorage.setItem('chkDashboard', 'false');
                localStorage.setItem('chkPlayerDetail', 'true');
              }
              this.authService.login();
              if ((obj.dfClientId === '6') || (obj.dfClientId === '95') || (obj.dfClientId === '6')) {
                this.authService.IsAdminLogin();
              }
              else if ((obj.dfClientId === '167') && (obj.UserId==='112')) {
                localStorage.setItem('UserId', '0');
                this.authService.IsClienAdminLogin();
              }
              else if ((obj.dfClientId === '183') && (obj.UserId==='0')) {
                this.authService.IsClienAdminLogin();
              }
              else {
                this.authService.IsUserLogin();
              }
              
              if (localStorage.getItem('UserId') === '-1') {
                this.router.navigate(['DJPlaylistLibrary']);
              }
              else {
                
                this.router.navigate(['LicenseHolderControl']);
                // this.router.navigate(['DJPlaylistLibrary']);
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
            this.loading = false;
          },
            error => {
              this.toastr.error('Apologies for the inconvenience.The error is recorded.', '');
              this.loading = false;
            });
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
    }
    

