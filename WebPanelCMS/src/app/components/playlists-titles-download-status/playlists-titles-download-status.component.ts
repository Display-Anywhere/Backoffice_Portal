import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  NgbModalConfig,
  NgbModal,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';

import { MachineService } from '../machine-announcement/machine.service';
import { SerLicenseHolderService } from 'src/app/license-holder/ser-license-holder.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SerCopyDataService } from 'src/app/copy-data/ser-copy-data.service';
import { TokenInfoServiceService } from '../token-info/token-info-service.service';
import { AdsService } from 'src/app/ad/ads.service';
@Component({
  selector: 'app-playlists-titles-download-status',
  templateUrl: './playlists-titles-download-status.component.html',
  styleUrls: ['./playlists-titles-download-status.component.css'],
})
export class PlaylistsTitlesDownloadStatusComponent implements OnInit {
  clid="";
  tid="";
  loading = false;
  dpid="";
  cmbPlaylist=""
  PlaylistList=[];
  ContentList=[];
  AdsDownloadContentList=[];
  AdsContentList=[]
  adsPlContentList=[]
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private tService: TokenInfoServiceService,
    private mService: MachineService,
    public auth: AuthService,
    private serviceLicense: SerLicenseHolderService,
    private cService: SerCopyDataService,
    private aService: AdsService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    this.clid = localStorage.getItem('tokenClient');
    this.tid = localStorage.getItem('tokenid');
    this.dpid = localStorage.getItem('dpid');
    await this.getPlayerCurrentDaySchedule()
    await this.GetAdsDownloadStatus();
  }
  getPlayerCurrentDaySchedule() {
    this.loading = true;
    let weekId=new Date().getDay()
    this.tService.GetSplPlaylistDateWiseLive(Number(this.tid),Number(this.clid),weekId).pipe().subscribe((data) => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.PlaylistList=[]
        obj.forEach(item => {
          let find = this.PlaylistList.filter(
            (order) => order.splPlaylistId === item['splPlaylistId']
          );
          if (find.length===0){
            this.PlaylistList.push({
              "splPlaylistId":item['splPlaylistId'],
              "splPlaylistName":item['splPlaylistName']
            })
          }
        });
        this.loading = false;
         if (this.dpid!=""){
          this.onChangePlaylist(this.dpid)
         }
        
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
  }
  onChangePlaylist(id){
    this.GetPlaylistsTitlesDownloadStatus(id)
  }
  GetPlaylistsTitlesDownloadStatus(id){
    this.loading = true;
    this.ContentList=[];
    this.tService.GetPlaylistsTitlesDownloadStatus(this.tid,id).pipe().subscribe((data) => {
      if (data['response']=="1"){
        this.ContentList = JSON.parse(data['data']);
        console.log(this.ContentList)
      }
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
  }


  GetAdsDownloadStatus(){
    this.loading = true;
    this.AdsDownloadContentList=[];
    this.adsPlContentList=[]
    this.AdsContentList=[]
    this.tService.GetAdsDownloadStatus(this.tid).pipe().subscribe((data) => {
      if (data['response']=="1"){
        this.AdsDownloadContentList = JSON.parse(data['data']);
        this.FillAdsPlaylist()
        this.FillAdsStatus()
      }
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
  }
  FillAdsPlaylist() {
    this.loading = true;
    var qry = " select p.titleid as Id ,t.title as DisplayName  from tbPlaylistAdsSchedule ps  "+
    " inner join tbPlaylistAdsSchedule_Token pt on pt.pSchId= ps.pSchId  inner join tbSpecialPlaylists_Titles p on p.splPlaylistId= ps.splPlaylistId  inner join Titles t on t.titleid= p.titleid "+
    " where pt.tokenId="+this.tid+"  and ps.eDate > GETDATE()"
    this.tService.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          this.adsPlContentList=[]
          obj.forEach(item => {
            let arr={}
            arr['Title']=item['DisplayName']
            let isF= this.AdsDownloadContentList.filter(od=> od.id === Number(item['Id']))
            if (isF.length!=0){
              arr['IsFind']=1
            }
            else{
              arr['IsFind']=0
            }
            this.adsPlContentList.push(arr);
          });
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  FillAdsStatus() {
    var sTime1 = new Date();
    
    this.loading = true;
    this.tService.FillSearchAds(this.clid, sTime1.toDateString(),this.tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        let obj = JSON.parse(returnData);
        this.AdsContentList=[]
        obj.forEach(item => {
          let arr={}
          arr['Title']=item['adName']
          let isF= this.AdsDownloadContentList.filter(od=> od.id === Number(item['id']))
          if (isF.length!=0){
            arr['IsFind']=1
          }
          else{
            arr['IsFind']=0
          }
          this.AdsContentList.push(arr);
        });
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
