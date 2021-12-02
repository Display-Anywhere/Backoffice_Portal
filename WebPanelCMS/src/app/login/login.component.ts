import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UloginService } from '../login/ulogin.service';
import { VisitorsService } from '../visitors.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  submitted = false;
  public loading = false;
  ipAddress;
  emailText=''
  loginpage='PPDS'
  constructor(public toastr: ToastrService, private router: Router, private formBuilder: FormBuilder, private ulService: UloginService, private visitorsService: VisitorsService, public authService: AuthService) { }
  ngOnInit() {
    this.authService.logout();
    localStorage.setItem('DBType', 'Nusign');
// google api key AIzaSyDZ3wMG5rYQ1CMlS1OLgNCIIk2cRRFRMrc
    
    if (localStorage.getItem('DBType')==="Advikon"){
      this.emailText='jan@advikon.eu'
    }
    else{
      this.emailText='info@screensolutions.nl'
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
          this.authService.login();
          if ((obj.dfClientId === '6') || (obj.dfClientId === '95') || (obj.dfClientId === '88') || (obj.dfClientId === '98')) {
            this.authService.IsAdminLogin();
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
