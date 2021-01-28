import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLoggedIn$: BehaviorSubject<boolean>;
  public IsAdminLogin$: BehaviorSubject<boolean>;
  public UserId$: string = "0";
  public chkDashboard$: BehaviorSubject<boolean>;
  public chkPlayerDetail$: BehaviorSubject<boolean>;
  public chkPlaylistLibrary$: BehaviorSubject<boolean>;
  public chkScheduling$: BehaviorSubject<boolean>;
  public chkAdvertisement$: BehaviorSubject<boolean>;
  public chkInstantPlay$: BehaviorSubject<boolean>;

  public chkUpload$: BehaviorSubject<boolean>;
  public chkCopyData$: BehaviorSubject<boolean>;
  public chkStreaming$: BehaviorSubject<boolean>;

  public ContentType$: string = "";
  public ClientContentType$: string = "";
  public isTokenInfoClose$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
    var LoginClientid;
    if ((localStorage.getItem('dfClientId') == '6') || (localStorage.getItem('dfClientId') == '88')
      || (localStorage.getItem('dfClientId') == '95') || (localStorage.getItem('dfClientId') == '98')) {
      LoginClientid = true;
    }
    else {
      LoginClientid = false;
    }

    this.IsAdminLogin$ = new BehaviorSubject(LoginClientid);

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


    const chkUpload = localStorage.getItem('dfClientId') === 'true';
    this.chkUpload$ = new BehaviorSubject(chkInstantPlay);

    const chkCopyData = localStorage.getItem('dfClientId') === 'true';
    this.chkCopyData$ = new BehaviorSubject(chkInstantPlay);

    const chkStreaming = localStorage.getItem('dfClientId') === 'true';
    this.chkStreaming$ = new BehaviorSubject(chkInstantPlay);


    this.UserId$ = localStorage.getItem('UserId');
    this.ContentType$ = localStorage.getItem('ContentType');
    this.ClientContentType$ = localStorage.getItem('ClientContentType');
    this.UserRights();
  }

  login() {
    // logic
    localStorage.setItem('loggedIn', 'true');
    this.isLoggedIn$.next(true);
  }
  SetContenType() {
    this.ContentType$ = localStorage.getItem('ContentType');
  }
  logout() {
    // logic
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
  }
  IsAdminLogin() {
    this.IsAdminLogin$.next(true);
    this.UserRights();
  }
  IsUserLogin() {
    this.IsAdminLogin$.next(false);
    this.UserRights();
  }
  UserRights() {
    this.UserId$ = localStorage.getItem('UserId');
    this.ContentType$ = localStorage.getItem('ContentType');
    this.ClientContentType$ = localStorage.getItem('ClientContentType');
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
  }
}
