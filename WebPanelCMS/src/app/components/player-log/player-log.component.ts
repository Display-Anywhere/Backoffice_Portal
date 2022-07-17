import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PlayerlogsService } from './playerlogs.service';
@Component({
  selector: 'app-player-log',
  templateUrl: './player-log.component.html',
  styleUrls: ['./player-log.component.css']
})
export class PlayerLogComponent implements OnInit {

  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private plService: PlayerlogsService) {
     
  }
  PlayedSongList = [];
  SearchSongDate;

  page: number = 1;
  pageSize: number = 30;
  searchSongText;
  public loading = false;

  PlayedAdsList = [];
  SearchAdsDate;

  pageAds: number = 1;
  pageSizeAds: number = 30;
  searchAdsText;

  PlayedSanitiserList = [];
  SearchSanitiserDate;

  pageSanitiser: number = 1;
  pageSizeSanitiser: number = 30;
  searchSanitiserText;
  PlayerLogActiveTabId=1
  ngOnInit() {
    var cd = new Date();
    this.SearchSongDate = cd;
    this.SearchAdsDate = cd;
    this.SearchSanitiserDate = cd;
    this.SearchPlayedSong();
  }
  SearchPlayedSong() {

    var sTime1 = new Date(this.SearchSongDate);

    this.loading = true;

    this.plService.FillPlayedSongsLog(sTime1.toDateString()).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlayedSongList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SearchPlayedAds() {
    this.loading = true;
    var sTime1 = new Date(this.SearchAdsDate);
   
    this.plService.FillPlayedAdsLog(sTime1.toDateString()).pipe()
      .subscribe(data => {

        var returnData = JSON.stringify(data);

        this.PlayedAdsList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SearchPlayedSanitiser(){
    var sTime1 = new Date(this.SearchSanitiserDate);

    this.loading = true;

    this.plService.FillPlayedSanitiserLog(sTime1.toDateString()).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlayedSanitiserList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
}
