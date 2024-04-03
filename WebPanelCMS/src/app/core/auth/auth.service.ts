import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigAPI } from 'app/class/ConfigAPI';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { cloneDeep } from 'lodash-es';
import { AuthServiceOwn } from 'app/auth/auth.service';
@Injectable({providedIn: 'root'})
export class AuthService
{
    private _authenticated: boolean = false;
    private readonly _secret: any;
    public _user = {
        id    : '',
        name  : '',
        email : '',
        avatar: 'assets/images/avatars/brian-hughes.jpg',
        status: 'online',
    };
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,public authService: AuthServiceOwn,
        private _userService: UserService,private cApi:ConfigAPI
    )
    {
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.cApi.uLogin, credentials).pipe(
            switchMap((response: any) =>
            {
                const returnData = JSON.stringify(response);
                const obj = JSON.parse(returnData);

                if (obj.Responce=="0"){
                     
                    return of(response);
                }
                else{
                // Store the access token in the local storage
                this.accessToken = this._generateJWTToken();

                // Set the authenticated flag to true
                this._authenticated = true;
                this._user.name= obj.ClientName
                this._user.email= obj.UserName
                this._user.id= obj.dfClientId
                this._user.avatar= obj.profileimageurl
                // Store the user on the user service
                this._userService.user = cloneDeep(this._user);
                this.ApiObject(obj)
                // Return a new observable with the response
                return of(response);
                }
            }),
        );
    }
    ApiObject(obj) {
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
         
         
          
      }
    private _generateJWTToken(): string
    {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'Fuse',
            exp: exp,
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }
    private _base64url(source: any): string
    {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) =>
            {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;
        this.authService.logout();
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
