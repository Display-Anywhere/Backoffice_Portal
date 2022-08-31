import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthServiceOwn {
  public isLoggedIn$: BehaviorSubject<boolean>;
  public isKpnActive$: BehaviorSubject<boolean>;
  public isSanitizerActive$: BehaviorSubject<boolean>;
  public IsAdminLogin$: BehaviorSubject<boolean>;
  public IsClientAdminLogin$: BehaviorSubject<boolean>;
  public UserId$: string = "0";
  public chkDashboard$: BehaviorSubject<boolean>;
  public chkPlayerDetail$: BehaviorSubject<boolean>;
  public chkPlaylistLibrary$: BehaviorSubject<boolean>;
  public chkScheduling$: BehaviorSubject<boolean>;
  public chkAdvertisement$: BehaviorSubject<boolean>;
  public chkInstantPlay$: BehaviorSubject<boolean>;
  public chkViewOnly$: BehaviorSubject<boolean>;
  public chkEventMeeting$: BehaviorSubject<boolean>;
  
  public chkUpload$: BehaviorSubject<boolean>;
  public chkCopyData$: BehaviorSubject<boolean>;
  public chkStreaming$: BehaviorSubject<boolean>;
  public IsTwoWayAuthActive$: string = "0";
  public ContentType$: string = "";
  public ClientContentType$: string = "";
  public isTokenInfoClose$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsEditTemplateOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  onIsEditTemplateOpen = this.IsEditTemplateOpen$.asObservable();

  public ClientId$ = new BehaviorSubject<string>("0");
  constructor() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
    var LoginClientid;
    if ((localStorage.getItem('dfClientId') == '6') || (localStorage.getItem('dfClientId') == '88') || (localStorage.getItem('dfClientId') == '95') || (localStorage.getItem('dfClientId') == '98')) {
      LoginClientid = true;
    }
    else {
      LoginClientid = false;
    }
    var LoginClientAdminid;
    if ((localStorage.getItem('dfClientId') == '167') && localStorage.getItem('UserId')==='112') {
      LoginClientAdminid = true;
    }
    else if ((localStorage.getItem('dfClientId') == '183') && localStorage.getItem('UserId')==='0') {
      LoginClientAdminid = true;
    }
    else {
      LoginClientAdminid = false;
    }
    this.IsAdminLogin$ = new BehaviorSubject(LoginClientid);
    this.IsClientAdminLogin$ = new BehaviorSubject(LoginClientAdminid);

    const chkDashboard = localStorage.getItem('dfClientId') === 'true';
    this.chkDashboard$ = new BehaviorSubject(chkDashboard);

    const chkPlayerDetail = localStorage.getItem('dfClientId') === 'true';
    this.chkPlayerDetail$ = new BehaviorSubject(chkPlayerDetail);

    const chkPlaylistLibrary = localStorage.getItem('dfClientId') === 'true';
    this.chkPlaylistLibrary$ = new BehaviorSubject(chkPlaylistLibrary);

    const chkScheduling = localStorage.getItem('dfClientId') === 'true';
    this.chkScheduling$ = new BehaviorSubject(chkScheduling);

    const chkAdvertisement = localStorage.getItem('dfClientId') === 'true';
    this.chkAdvertisement$ = new BehaviorSubject(chkAdvertisement);

    const chkInstantPlay = localStorage.getItem('dfClientId') === 'true';
    this.chkInstantPlay$ = new BehaviorSubject(chkInstantPlay);

    const chkViewOnly = localStorage.getItem('chkViewOnly') === 'true';
    this.chkViewOnly$ = new BehaviorSubject(chkViewOnly);

    const chkEventMeeting = localStorage.getItem('chkEventMeeting') === 'true';
    this.chkEventMeeting$ = new BehaviorSubject(chkEventMeeting);

    const chkUpload = localStorage.getItem('dfClientId') === 'true';
    this.chkUpload$ = new BehaviorSubject(chkUpload);

    const chkCopyData = localStorage.getItem('dfClientId') === 'true';
    this.chkCopyData$ = new BehaviorSubject(chkCopyData);

    const chkStreaming = localStorage.getItem('dfClientId') === 'true';
    this.chkStreaming$ = new BehaviorSubject(chkStreaming);

    const isKpnActive = localStorage.getItem('isKpnActive') === 'true';
    this.isKpnActive$ = new BehaviorSubject(isKpnActive);

    const isSanitizerActive = localStorage.getItem('isSanitizerActive') === 'true';
    this.isSanitizerActive$ = new BehaviorSubject(isSanitizerActive);
    
    this.UserId$ = localStorage.getItem('UserId');
    this.IsTwoWayAuthActive$ = localStorage.getItem('IsTwoWayAuthActive');
    this.ClientId$.next(localStorage.getItem('dfClientId'));
    this.ContentType$ = localStorage.getItem('ContentType');
    this.ClientContentType$ = localStorage.getItem('ClientContentType');
    this.UserRights();
  }
  SetEditTemplateOpen(value) {
    this.IsEditTemplateOpen$.next(value);
  }
  login() {
    // logic
    localStorage.setItem('loggedIn', 'true');
    this.isLoggedIn$.next(true);
  }
  SetTwoWayAuthActive() {
    this.IsTwoWayAuthActive$ = localStorage.getItem('IsTwoWayAuthActive');
  }
  SetContenType() {
    this.ContentType$ = localStorage.getItem('ContentType');
  }
  SetClientId(id) {
    this.ClientId$.next(id);
  }
  logout() {
    // logic
    localStorage.clear();
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
  }
  IsAdminLogin() {
    this.IsAdminLogin$.next(true);
    this.UserRights();
  }
  IsClienAdminLogin() {
    this.IsClientAdminLogin$.next(true);
    this.UserRights();
  }
  IsUserLogin() {
    this.IsClientAdminLogin$.next(false);
    this.IsAdminLogin$.next(false);
    this.UserRights();
  }
  UserRights() {
    this.IsTwoWayAuthActive$ = localStorage.getItem('IsTwoWayAuthActive');
    this.UserId$ = localStorage.getItem('UserId');
    this.ContentType$ = localStorage.getItem('ContentType');
    this.ClientContentType$ = localStorage.getItem('ClientContentType');
    if (localStorage.getItem('isKpnActive') == 'true') {
      this.isKpnActive$.next(true);
    }
    else {
      this.isKpnActive$.next(false);
    }
    if (localStorage.getItem('isSanitizerActive') == 'true') {
      this.isSanitizerActive$.next(true);
    }
    else {
      this.isSanitizerActive$.next(false);
    }
    
    if (localStorage.getItem('chkDashboard') == 'true') {
      this.chkDashboard$.next(true);
    }
    else {
      this.chkDashboard$.next(false);
    }

    if (localStorage.getItem('chkPlayerDetail') == 'true') {
      this.chkPlayerDetail$.next(true);
    }
    else {
      this.chkPlayerDetail$.next(false);
    }

    if (localStorage.getItem('chkPlaylistLibrary') == 'true') {
      this.chkPlaylistLibrary$.next(true);
    }
    else {
      this.chkPlaylistLibrary$.next(false);
    }

    if (localStorage.getItem('chkScheduling') == 'true') {
      this.chkScheduling$.next(true);
    }
    else {
      this.chkScheduling$.next(false);
    }

    if (localStorage.getItem('chkAdvertisement') == 'true') {
      this.chkAdvertisement$.next(true);
    }
    else {
      this.chkAdvertisement$.next(false);
    }
    if (localStorage.getItem('chkInstantPlay') == 'true') {
      this.chkInstantPlay$.next(true);
    }
    else {
      this.chkInstantPlay$.next(false);
    }
    if (localStorage.getItem('chkUpload') == 'true') {
      this.chkUpload$.next(true);
    }
    else {
      this.chkUpload$.next(false);
    }
    if (localStorage.getItem('chkCopyData') == 'true') {
      this.chkCopyData$.next(true);
    }
    else {
      this.chkCopyData$.next(false);
    }
    if (localStorage.getItem('chkStreaming') == 'true') {
      this.chkStreaming$.next(true);
    }
    else {
      this.chkStreaming$.next(false);
    }
    if (localStorage.getItem('chkViewOnly') == 'true') {
      this.chkViewOnly$.next(true);
    }
    else {
      this.chkViewOnly$.next(false);
    }
    if (localStorage.getItem('chkEventMeeting') == 'true') {
      this.chkEventMeeting$.next(true);
    }
    else {
      this.chkEventMeeting$.next(false);
    }
    
  }
}
