import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
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

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  SearchTokenId = '';
  loading = false;
  ClientName = '';
  LastStatus = '';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  iframeUrl=false
  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    private tService: TokenInfoServiceService,
    public toastr: ToastrService,
    public auth: AuthService,
    private router: Router,private idle: Idle, private keepalive: Keepalive
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(3600);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(3600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(1800);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  title = 'WebPanelCMS';
  public isCollapsed = true;
  ngOnInit() {
    this.isCollapsed = true;
  }
  SearchToken(e, modalName) {
    if (e.keyCode === 13) {
      if (this.SearchTokenId == '') {
        return;
      }
      this.FillTokenInfo(modalName);
    }
  }
  tokenInfoClose() {
    this.SearchTokenId = '';
    this.modalService.dismissAll();
  }

  FillTokenInfo(modalName) {
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    this.loading = true;

    this.tService
      .FindToken(
        this.SearchTokenId,
        i,
        localStorage.getItem('dfClientId'),
        localStorage.getItem('DBType')
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);

          var obj = JSON.parse(returnData);
          if (obj.Responce == '0') {
            this.toastr.info('Token number is not found');
            this.loading = false;
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
    this.authService.logout();
    this.router.navigate(['']);
  }
  OpenManual(){
    this.iframeUrl =true
  }
}
