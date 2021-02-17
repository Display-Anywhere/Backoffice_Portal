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
  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    private tService: TokenInfoServiceService,
    public toastr: ToastrService,
    public auth: AuthService,
    private router: Router
  ) {}

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
}
