import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TokenInfoServiceService } from '../token-info/token-info-service.service';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-commonsearch',
  templateUrl: './commonsearch.component.html',
  styleUrls: ['./commonsearch.component.scss']
})
export class CommonsearchComponent implements OnInit {
  FindText=""
  SearchTokenId = ''
  loading = false
  FoundRecordList=[]
  gridViewList=[]
  ClientName = '';
  LastStatus = '';
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;
  constructor( public toastr: ToastrService,
    private vcr: ViewContainerRef,public auth: AuthServiceOwn,
    config: NgbModalConfig,private modalService: NgbModal,private tService: TokenInfoServiceService){

  }
  ngOnInit(){

  }
  SearchToken(e, modalName) {
    if (e.keyCode === 13) {
      if (this.FindText == '') {
        return;
      }
      this.FindStringInTable(modalName);
    }
  }
  tokenInfoClose() {
    this.SearchTokenId = '';
    this.FindText =''
    this.modalService.dismissAll();
  }
  FindStringInTable(modalName) {
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    this.loading = true;

    this.tService.FindStringInTable(this.FindText,i,localStorage.getItem('dfClientId'),localStorage.getItem('DBType')).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '0') {
            this.toastr.info('Records not found');
            this.loading = false;
            this.SearchTokenId =''
            this.FindText=''
            return;
          } 
          this.FindText=''
          this.FoundRecordList =JSON.parse(obj.data)
          this.gridViewList =JSON.parse(obj.data)
          this.loading = false;
          this.modalService.open(modalName, {
            size: 'lg',
            windowClass: 'tokenmodal',
          });
        },
        (error) => {
          this.loading = false;
        }
      );
      
  }
  FillTokenInfo(tokenid,modalName) {
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    this.loading = true;
    this.SearchTokenId= tokenid
    this.tService.FindToken(this.SearchTokenId,i,localStorage.getItem('dfClientId'),localStorage.getItem('DBType')).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);

          var obj = JSON.parse(returnData);
          if (obj.Responce == '0') {
            this.toastr.info('Token number is not found');
            this.loading = false;
            this.SearchTokenId =''
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
  public getField = (args: any) => {
    return `${args.CityName}_${args.Location}_${args.mediatype}_${args.ClientName}_${args.TokenID}_${args.StateName}`;
  }
  public onFilter(inputValue: string): void {
    this.gridViewList = process(this.FoundRecordList, {
        filter: {
            logic: 'or',
            filters: [
                {
                    field: this.getField,
                    operator: 'contains',
                    value: inputValue
                }
            ]
        }
    }).data;
  
    this.dataBinding? this.dataBinding.skip = 0 : null;
  }
}
