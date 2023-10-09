import { Component, OnInit,ViewChild ,QueryList, ViewChildren} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { TokenInfoServiceService } from '../token-info/token-info-service.service';

import {NgbdSortableHeader, SortEvent} from '../../components/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { SerCopyDataService } from 'src/app/copy-data/ser-copy-data.service';
import { UntypedFormBuilder } from '@angular/forms';
 
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
  cmbChangeGroup='0';
  ModifyGroupName = '';
  GroupTokenList = [];
  
  grpSearchText = '';
  grpSearchText_Change=''
  GroupSearchTokenList = [];
  GroupTokenSelected = [];
  cid="";
  MainTokenList=[];
  GroupTokenList_Change=[];
  GroupTokenList_Search_Change=[]
  GroupTokenList_Search_Assign=[]
  GroupTokenListlength_Change=0;
  page: number = 1;
  pageSize: number = 20;


  public loading = false;
  chkAll_Change: boolean = false;
  TokenSelected_Change = [];
  
  chkAll_Assign=false;
  searchTextGroup=''
  obj:SortEvent   ={
    column:'city',
    direction: 'asc'
   }
    compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  constructor( public toastr: ToastrService,private serviceLicense: SerLicenseHolderService, 
    private modalService: NgbModal,private tService: TokenInfoServiceService,private pipe: DecimalPipe,
    private cService: SerCopyDataService,private formBuilder: UntypedFormBuilder) { }

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

  

  UpdateTokenGroups() {
    if (this.cmbGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    if (this.GroupTokenSelected.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    console.log(this.GroupTokenSelected)
    this.CallAPIGropsTokenUpdate(this.GroupTokenSelected, this.cmbGroup,'',false);
  }
  openDeleteModal(id) {
    this.GroupTokenSelected = [];
    this.GroupTokenSelected.push(id);
    this.CallAPIGropsTokenUpdate(this.GroupTokenSelected, '0','',false);
  }
  CallAPIGropsTokenUpdate(gts, grpid,updateFrom,IsCheckGroupSchedule) {
    this.loading = true;
    this.serviceLicense
      .UpdateTokenGroups(gts, grpid,IsCheckGroupSchedule)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.GroupTokenSelected = [];
            this.GroupTokenList = [];
            this.GroupTokenList_Search_Change=[];
            this.GroupTokenList_Search_Assign=[]
            this.grpSearchText_Change='';
            this.cmbChangeGroup = '0'
            this.grpSearchText=''
            
            if ((updateFrom=="Change") && (obj.lstPlaylistSch.length!=0)){
              this.SaveSchedule(obj.lstPlaylistSch,this.cid);
            }
            else{
              this.toastr.info('Saved', 'Success!');
              this.loading = false;
              this.FillTokenInfo();

            }
            this.GroupSearchTokenList=[];
            setTimeout(() => { 
              if (this.cmbSearchGroup !== '0') {
                this.GroupSearchTokenList = this.MainTokenList.filter(
                  (order) => order.GroupId === this.cmbSearchGroup
                );
              }
              }, 500);
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
          this.GroupTokenList_Change=[];
          this.GroupTokenList_Change = this.MainTokenList;
          this.GroupTokenListlength_Change =this.GroupTokenList_Change.length
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


  allToken_Assign(event) {
    const checked = event.target.checked;
    this.GroupTokenSelected = [];
    if (this.grpSearchText==''){
    this.GroupTokenList.forEach((item) => {
      item.check = checked;
      this.GroupTokenSelected.push(item.tokenid);
    });
  }
  else{
    this.GroupTokenList_Search_Assign.forEach((item) => {
      item.check = checked;
      this.GroupTokenSelected.push(item.tokenid);
    });
  }
    if (checked == false) {
      this.GroupTokenSelected = [];
    }
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
  onChangeEvent_Assign(){
    this.GroupTokenList_Search_Assign = this.GroupTokenList.filter(country => this.serviceLicense.matches(country, this.grpSearchText, this.pipe));
    const total = this.GroupTokenList_Search_Assign.length;
  }






  allToken_Change(event) {
    const checked = event.target.checked;
    this.TokenSelected_Change = [];
    if (this.grpSearchText_Change==''){
    this.GroupTokenList_Change.forEach((item) => {
      item.check = checked;
      this.TokenSelected_Change.push(item.tokenid);
    });
  }
  else{
    this.GroupTokenList_Search_Change.forEach((item) => {
      item.check = checked;
      this.TokenSelected_Change.push(item.tokenid);
    });
  }
    if (checked == false) {
      this.TokenSelected_Change = [];
    }
  }

  SelectGroupToken_Change(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected_Change.push(fileid);
    } else {
      const index: number = this.TokenSelected_Change.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected_Change.splice(index, 1);
      }
    }
  }

  onChangeEvent(){
    this.GroupTokenList_Search_Change = this.GroupTokenList_Change.filter(country => this.serviceLicense.matches(country, this.grpSearchText_Change, this.pipe));
    const total = this.GroupTokenList_Search_Change.length;
    this.GroupTokenListlength_Change =total
    console.log(this.GroupTokenList_Search_Change)
  }
  GetCheckedToken(){
    this.GroupTokenList_Change.forEach(item => {
      let obj = this.TokenSelected_Change.indexOf(item["tokenid"])
      if (obj != -1){
        item["check"]=true
      }
    });
   
  }
  UpdateGroup(){
    if (this.cmbChangeGroup === '0') {
      this.toastr.info('Please select a group');
      return;
    }
    if (this.TokenSelected_Change.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    this.CallAPIGropsTokenUpdate(this.TokenSelected_Change, this.cmbChangeGroup,'Change',true);
  }
  SaveSchedule(ScheduleList,dfclientid) {
     
    var CDform = this.formBuilder.group({
          SchList: [ScheduleList],
          TokenList: [this.TokenSelected_Change],
          dfClientId: [dfclientid]
        });
    
        CDform.get('SchList').setValue(ScheduleList);
        CDform.get('dfClientId').setValue(dfclientid);
        CDform.get('TokenList').setValue(this.TokenSelected_Change);
        this.loading = true;
        this.cService.SaveCopySchedule(CDform.value).pipe()
          .subscribe(data => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            if (obj.Responce == "1") {
              this.ForceUpdateAll();
            }
          },
            error => {
              this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
              this.loading = false;
            })
      }
    
      ForceUpdateAll() {
        this.loading = true;
        this.serviceLicense
          .ForceUpdate(this.TokenSelected_Change)
          .pipe()
          .subscribe(
            (data) => {
              var returnData = JSON.stringify(data);
              var obj = JSON.parse(returnData);
              if (obj.Responce == '1') {
                this.toastr.info('Update request is submit', 'Success!');
                this.loading = false;

              } else {
              }
              this.loading = false;
              this.FillTokenInfo();
            },
            (error) => {
              this.loading = false;
            }
          );
      }
       
}
