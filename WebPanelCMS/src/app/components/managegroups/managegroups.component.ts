import { Component, OnInit,ViewChild ,QueryList, ViewChildren} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { TokenInfoServiceService } from '../token-info/token-info-service.service';

import {NgbdSortableHeader, SortEvent} from '../../components/sortable.directive';
 
@Component({
  selector: 'app-managegroups',
  templateUrl: './managegroups.component.html',
  styleUrls: ['./managegroups.component.css']
})
export class ManagegroupsComponent implements OnInit {

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  GroupActive = 1;
  GroupList = [];
  SearchGroupList = [];
  cmbSearchGroup = '';
  cmbGroup = '0';
  ModifyGroupName = '';
  GroupTokenList = [];
  grpSearchText = '';
  GroupSearchTokenList = [];
  GroupTokenSelected = [];
  cid="";
  MainTokenList=[];
  public loading = false;
  obj:SortEvent   ={
    column:'city',
    direction: 'asc'
   }
    compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  constructor( public toastr: ToastrService,private serviceLicense: SerLicenseHolderService, private modalService: NgbModal,private tService: TokenInfoServiceService,) { }

  async ngOnInit() {
    this.cid=localStorage.getItem('tcid')
    this.GroupActive = 1;
    this.cmbSearchGroup="";
    this.GroupSearchTokenList=[];
 
     await  this.FillGroup();
 await this.FillTokenInfo();
   
  }  
   
    

  FillGroup() {
    
    this.loading = true;
    const qry =
      'select GroupId as id, GroupName as displayname  from tbGroup where dfClientId = ' +
      this.cid +
      ' order by GroupName';
    this.serviceLicense
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          this.GroupList = JSON.parse(returnData);
          this.SearchGroupList = JSON.parse(returnData);
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
  onChangeSearchGroup(id) {
    this.GroupSearchTokenList = [];
    if (id !== '0') {
      this.GroupSearchTokenList = this.MainTokenList.filter(
        (order) => order.GroupId === id
      );
    }
  }
  onChangeGroup(id) {
    let NewFilterList = [];
    NewFilterList = this.GroupList.filter((order) => order.Id === id);
    if (NewFilterList.length > 0) {
      this.ModifyGroupName = NewFilterList[0].DisplayName;
    }
    else{
      this.ModifyGroupName = '';
      this.cmbGroup = '0';
    }
  }
  openCommonModal(modal, ModalType) {
    this.modalService.open(modal);
  }
  onSubmitModal() {
    this.loading = true;
    this.tService
      .CitySateNewModify(
        this.cmbGroup,
        this.ModifyGroupName,
        'Group',
        '0',
        '0',
        this.cid
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.FillGroup();
          } else if (obj.Responce == '-2') {
            this.toastr.info('Name is already exixts', '');
            this.loading = false;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            return;
          }
          this.cmbGroup = '0';
          this.ModifyGroupName = '';
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

  SelectGroupToken(fileid, event) {
    if (event.target.checked) {
      this.GroupTokenSelected.push(fileid);
    } else {
      const index: number = this.GroupTokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.GroupTokenSelected.splice(index, 1);
      }
    }
  }

  UpdateTokenGroups() {
    if (this.cmbGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    if (this.GroupTokenSelected.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    this.CallAPIGropsTokenUpdate(this.GroupTokenSelected, this.cmbGroup);
  }
  openDeleteModal(id) {
    this.GroupTokenSelected = [];
    this.GroupTokenSelected.push(id);
    this.CallAPIGropsTokenUpdate(this.GroupTokenSelected, '0');
  }
  CallAPIGropsTokenUpdate(gts, grpid) {
    this.loading = true;
    this.serviceLicense
      .UpdateTokenGroups(gts, grpid)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            
            this.GroupTokenSelected = [];
            this.GroupTokenList = [];
            this.FillTokenInfo();
            
            if (this.cmbSearchGroup !== '0') {
              this.GroupSearchTokenList = this.MainTokenList.filter(
                (order) => order.GroupId === this.cmbSearchGroup
              );
            }
            this.cmbGroup = '0';
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            return;
          }
          this.cmbGroup = '0';
          this.ModifyGroupName = '';
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

  OpenDeleteGroupModal(modal) {
    if (this.cmbGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    this.modalService.open(modal);
  }
  DeleteGroup() {
    this.loading = true;
    this.serviceLicense
      .DeleteGroup(this.cmbGroup)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.MainTokenList.forEach((e) => {
              const gid = e.GroupId;
              if (gid === this.cmbGroup) {
                e.GroupId = '0';
              }
            });
            
            this.GroupTokenSelected = [];
            this.GroupSearchTokenList = [];
            this.FillGroup();
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            return;
          }
          this.cmbGroup = '0';
          this.cmbSearchGroup = '0';
          this.ModifyGroupName = '';
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

  
MainGroupTokenList=[];
  FillTokenInfo() {
      
    this.loading = true;
    this.serviceLicense
      .FillTokenInfo(this.cid, '0')
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
    
          this.MainTokenList = JSON.parse(returnData);
          this.GroupTokenList = [];
          this.MainGroupTokenList=[];
          this.MainGroupTokenList = this.MainTokenList.filter(
            (order) => order.GroupId === '0'
          );
          this.GroupTokenList =this.MainGroupTokenList
          
          
          
         
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
  SetSort(){
    const obj:SortEvent   ={
      column:'city',
      direction: 'asc'
     }
     setTimeout(() => { 
      this.onSort(obj);
    }, 500);
     
      
  }
  onSort({column, direction}: SortEvent) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.GroupTokenList = this.MainGroupTokenList;
    } else {
      this.GroupTokenList = [...this.MainGroupTokenList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}
