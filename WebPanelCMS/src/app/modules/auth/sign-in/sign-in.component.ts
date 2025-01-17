import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { UloginService } from 'app/mock-api/services/ulogin.service';
@Component({                                    
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,FontAwesomeModule],
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    loading = false
    resApiObj
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,library: FaIconLibrary,private ulService: UloginService,
    )
    {
        library.addIconPacks(fab);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        localStorage.setItem('DBType', 'Nusign');
        localStorage.setItem('code','')
        localStorage.setItem('PortalName', "nusign");
        localStorage.setItem('IsAnnouncement', '0');        
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [''],
            DBType: [localStorage.getItem('DBType')]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

       
        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (response) =>
                {
                  const returnData = JSON.stringify(response);
                const obj = JSON.parse(returnData);
                if (obj.Responce=="0"){
                   // Re-enable the form
                   this.signInForm.enable();
                   // Reset the form
                   this.signInNgForm.resetForm();
                   // Set the alert
                   this.alert = {
                       type   : 'error',
                       message: 'Wrong email or password',
                   };
                   // Show the alert
                   this.showAlert = true;
                  return
              }
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) =>
                {
                  console.log(response)
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password',
                    };

                    // Show the alert
                    this.showAlert = true;
                },
            );
    }
   
}


/* 

this.ulService
.uLogin(this.signInForm.value)
.pipe()
.subscribe(
  (data) => {
    this.loading = false;
    const returnData = JSON.stringify(data);
    const obj = JSON.parse(returnData);
    this.resApiObj =obj
    if (obj.Responce === '1') {
      if (obj.IsTwoWayAuthActive == '1') {
        const frmValue = this.signInForm.value
        // this.SendOtpEmail(frmValue['email'])
      } else {
        this.ApiObject(obj);
      }
    } else if (obj.Responce === '0') {
      // Re-enable the form
      this.signInForm.enable();

      // Reset the form
      this.signInNgForm.resetForm();

      // Set the alert
      this.alert = {
          type   : 'error',
          message: 'Wrong email or password',
      };

      // Show the alert
      this.showAlert = true;
    } else {
       
    }
    //this.SaveModifyInfo('0', 'Login');
    
  },
  (error) => {
    
    this.loading = false;
  }
); */