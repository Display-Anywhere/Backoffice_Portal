import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UloginService } from '../login/ulogin.service';
import { VisitorsService } from '../visitors.service';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceOwn } from '../auth/auth.service';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  submitted = false;
  public loading = false;
  ipAddress;
  emailText = '';
  loginpage = 'Nusign';
  IsSbit = 'No';
  IsTwoWayActive= "1"
  randomNumber = ''
  EnterOTPCode = ''
  resApiObj:any
  constructor(
    public toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ulService: UloginService,
    private visitorsService: VisitorsService,
    public authService: AuthServiceOwn,
    private auth0: AuthService
  ) {}

  ngOnInit() {
    this.authService.logout();
    localStorage.setItem('DBType', 'Nusign');
    localStorage.setItem('IsSbit', this.IsSbit);

    localStorage.setItem('loginpage', this.loginpage);
    if (localStorage.getItem('DBType') === 'Advikon') {
      this.emailText = 'jan@advikon.eu';
    } else {
      this.emailText = 'info@nusign.be';
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
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          this.resApiObj =obj
          if (obj.Responce === '1') {
            if (obj.IsTwoWayAuthActive == '1') {
              this.IsTwoWayActive= "1"
              this.SendOtpEmail()
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
          this.loading = false;
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
    if (obj.UserId != 0 && obj.chkEventMeeting == true) {
      localStorage.setItem('chkDashboard', 'false');
      localStorage.setItem('chkPlayerDetail', 'true');
    }
    this.authService.login();
    if (
      obj.dfClientId === '6' ||
      obj.dfClientId === '95' ||
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
      this.router.navigate(['LicenseHolderControl']);
      // this.router.navigate(['DJPlaylistLibrary']);
    }
  }

  SendOtpEmail() {
    try {
      const frmValue = this.loginform.value
      const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.randomNumber=''
      for (var i = 0; i < 10; i++) {
        this.randomNumber += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }
      this.ulService
      .SendOTP(frmValue['email'], this.randomNumber.toUpperCase()).pipe().subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('One time code is sent. Please check your email', '');
          }
        },
        (error) => {}
      );
      

    } catch (error) {}
  }
  MatchOtp(){
    if (this.EnterOTPCode.toUpperCase()== this.randomNumber.toUpperCase()){
      this.ApiObject(this.resApiObj)
    }
    else{
      this.toastr.error('One time code is not match', '');
    }
  }
}
//Enter_the_Application_Id_here > 80a7b076-4c4a-429e-9b6f-402f3e5e49c5
// Enter_the_Tenant_Info_Here => b8e4b8e1-2211-4845-8e03-cf1e88544864
