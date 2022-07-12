import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-authorize-sso',
  templateUrl: './authorize-sso.component.html',
  styleUrls: ['./authorize-sso.component.css']
})
export class AuthorizeSSOComponent implements OnInit {

  constructor(private auth: AuthService) { 
    this.auth.isAuthenticated$.subscribe((res: boolean) => {
      if (res) {
        this.auth.idTokenClaims$.subscribe((IdToken) => (
          this.ValidateSSO(IdToken?.email_verified,IdToken?.email)
          )
        );
      }
      else{
      }
    });
  }

  ngOnInit() {
    this.loginSSO()
  }
  ValidateSSO(email_verified:any,email:any){
    console.log(email_verified)
    console.log(email)
  }
  loginSSO() {
    this.auth.loginWithRedirect();
  }
}
