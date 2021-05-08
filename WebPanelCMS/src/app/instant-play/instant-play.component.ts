import { Component, OnInit, ViewContainerRef } from '@angular/core';


import { IPlayService } from '../instant-play/i-play.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';

@Component({
  selector: 'app-instant-play',
  templateUrl: './instant-play.component.html',
  styleUrls: ['./instant-play.component.css']
})
export class InstantPlayComponent implements OnInit {
  ActivePlaylist = [];
  PlayerList = [];
  DownloadedSongsList = [];
  AdsList = [];
  SongsList = [];
  SearchText = "";
  cmbAlbum;
  chkSearchRadio: string = "title";
  chkMediaRadio: string = "Audio";
  AlbumList = [];
  FCMID;
  IsVideoToken;
  Search: boolean = true;
  public loading = false;
   
  CustomerList = [];
  SelectedClientId = "0";
  IsCL:boolean=false;
  IsRF:boolean=false;
  tid;
  chkExplicit=false;
  ContentType$="";
  cmbCustomer="0"
  constructor(public toastr: ToastrService, vcr: ViewContainerRef, private ipService: IPlayService,
    public auth:AuthService, private pService: PlaylistLibService) {

  }

  ngOnInit() {
    if(localStorage.getItem('IsRf')=="1"){
      this.IsRF=true;
      this.IsCL=false;
    }
    else{
      this.IsRF=false;
      this.IsCL=true;
    
    }
    
      this.SelectedClientId = "0";
      this.FillClientList();
    
      
   
  }
  FillClientList() {
    this.loading = true;
    var str = "";
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str = "FillCustomer " + i + ", " + localStorage.getItem('dfClientId') + "," + localStorage.getItem('DBType');

    this.ipService.FillCombo(str).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CustomerList = JSON.parse(returnData);
        this.loading = false;
        if ((this.auth.IsAdminLogin$.value == false)) {
           
          this.cmbCustomer=localStorage.getItem('dfClientId')
          this.onChangeCustomer(localStorage.getItem('dfClientId'))
        } 
        // this.FillPlayer(localStorage.getItem('dfClientId'));
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillPlayer(id) {
    this.loading = true;
    this.ipService.FillPlayer(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlayerList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillAds(tid) {
    this.loading = true;
    this.ipService.FillAds(tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AdsList = JSON.parse(returnData);

        this.loading = false;
        //this.SearchContent();
        this.SearchRadioClick(this.chkSearchRadio);
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangePlayer(tid) {
    this.DownloadedSongsList = [];
    this.GetFCMID(tid);
    this.tid=tid;
  }
  chkGenre:boolean=false;
  chkTitle:boolean=true;
  chkVideo:boolean=false
  chkAudio:boolean=true;
  GetFCMID(tid) {
    this.loading = true;
    this.ipService.GetFCMID(tid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.FCMID = obj.FcmId;
          this.IsVideoToken = obj.IsVideoToken;
          this.chkAudio=true;
          this.chkVideo=false;
          this.IsCL=true;
          this.IsRF=false;
          this.chkTitle=true;
          this.chkGenre=false;
          this.chkSearchRadio="title";
          if ((obj.MediaType == "Audio") && (obj.PlayerType == "Copyright")) {
            localStorage.setItem('ContentType', "MusicMedia");
            this.ContentType$="ACR";
            this.chkAudio=true;
          this.chkVideo=false;
            this.IsCL=true;
            this.IsRF=false;
            this.chkTitle=true;
            this.chkGenre=false;
            this.chkSearchRadio="title";
            localStorage.setItem('IsRf', '0');
            this.chkMediaRadio='Audio';
            }
          if ((obj.MediaType == "Audio") && (obj.PlayerType == "DirectLicence")) {
            
            localStorage.setItem('ContentType', "MusicMedia");
            this.chkAudio=true;
          this.chkVideo=false;
            this.ContentType$="ADL";
            this.IsCL=false;
            this.IsRF=true;
            this.chkTitle=true;
            this.chkGenre=false;
            this.chkSearchRadio="title";
            localStorage.setItem('IsRf', '1');
            this.chkMediaRadio='Audio';
            }
          if (obj.MediaType == "Video") {
            localStorage.setItem('ContentType', "MusicMedia");
            this.ContentType$="Video";
            this.IsCL=true;
            this.IsRF=false;
            this.chkTitle=true;
            this.chkGenre=false;
            this.chkAudio=false;
          this.chkVideo=true;
          this.chkSearchRadio="title";
          localStorage.setItem('IsRf', '0');
          this.chkMediaRadio='Video';
            }
          if (obj.MediaType == "Signage") {
            localStorage.setItem('ContentType', "Signage");
            this.ContentType$="Signage";
            this.IsCL=true;
            this.IsRF=false;
            this.chkTitle=false;
            this.chkGenre=true;
            this.chkAudio=false;
          this.chkVideo=true;
          this.chkSearchRadio="Genre";
          this.chkMediaRadio='Video';
          localStorage.setItem('IsRf', '0');
            }
        }
        else {
          this.FCMID = "";
          this.IsVideoToken = "";
        }
        
        this.loading = false;
        this.FillActivePlaylist(tid);
      },
        error => {
          this.FCMID = "";
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillActivePlaylist(tid) {
    this.loading = true;
    this.ipService.FillActivePlaylist(tid, this.SelectedClientId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        this.ActivePlaylist = JSON.parse(returnData);
        
        this.loading = false;
        this.FillAds(tid);
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangePlaylist(pId) {
    this.FillPlaylistSongs(pId);
  }
  FillPlaylistSongs(fileid) {
    this.loading = true;
    this.ipService.PlaylistSong(fileid, "No").pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        this.DownloadedSongsList = obj;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillSearch() {
    if (this.SearchText == "") {
      this.FillSongList();
      return;
    }
    this.loading = true;
    this.pService.CommanSearch(this.chkSearchRadio, this.SearchText, this.chkMediaRadio,false,1,this.SelectedClientId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.SongsList = obj;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillSongList() {
    this.loading = true;
    this.pService.FillSongList(this.chkMediaRadio, this.chkExplicit, this.SelectedClientId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.SongsList = obj;
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SearchContent() {
    if (this.chkSearchRadio == "album") {
      this.FillAlbum();
      this.Search = false;
    }

    else {
      this.Search = true;
      this.FillSearch();
    }

  }
  FillAlbum() {
    this.loading = true;
    var qry = "spSearch_Album_Copyright '" + this.SearchText + "' , " + localStorage.getItem('IsRf');
    this.ipService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AlbumList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillGenre() {
    this.loading = true;
    this.loading = true;
    var qry = "select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ";
    qry = qry + " inner join Titles tit on tit.genreId= tbGenre.genreId ";
    qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    qry = qry + " and (tit.dbtype='"+localStorage.getItem('DBType')+"' or tit.dbtype='Both') ";
    if (this.chkMediaRadio != "Image") {
      qry = qry + " and tit.IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    }
    
    if (this.ContentType$=="Signage"){
      qry = qry + " and tbGenre.GenreId  in(303,297, 325,324) ";
    }
    qry = qry + " group by tbGenre.GenreId,genre ";
    qry = qry + " order by genre ";
    console.log(qry);
    this.ipService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AlbumList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillCategory() {
    this.loading = true;
    var qry = "select  acategory as DisplayName, acategory as Id from titles ";
    qry = qry + " where acategory is not null and IsRoyaltyFree = "+localStorage.getItem('IsRf')+" ";
    if (this.chkMediaRadio == "Audio") {
      qry = qry + " and acategory not like '%video%' and acategory not like '%MP4%' ";

    }
    else if (this.chkMediaRadio == "Video") {
      qry = qry + " and ( acategory like '%video%' or acategory like '%mp4%' ) ";
    }
    else {
      qry = qry + " and ( acategory like '%Image%') ";
    }
    qry = qry + " group by acategory order by acategory ";

    this.ipService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.AlbumList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onChangeAlbum(id) {
    this.SearchText = id;
    this.FillSearch();
  }
  SearchRadioClick(e) {
    this.chkSearchRadio = e;
    this.SearchText = "";
    this.Search = true;
this.chkTitle=true;
this.chkGenre=false;
    if (this.chkSearchRadio == "Genre") {
this.chkGenre=true;
this.chkTitle=false;
      this.SongsList = [];
      this.FillGenre();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Category") {
      this.SongsList = [];
      this.FillCategory();
      this.Search = false;
    }
    if (this.chkSearchRadio == "artist") {
      this.chkGenre=false;
this.chkTitle=false;

    }
    if ((this.chkSearchRadio == "title") || (this.chkSearchRadio == "artist") || (this.chkSearchRadio == "album")) {
      this.SongsList = [];
      this.FillSongList();
    }
  }
  MediaRadioClick(e) {
     
    this.SearchText = "";
    this.Search = true;
    if (e=="Image"){
      this.IsCL= false;
      this.IsRF=false;
     }
     if (e!="Image"){
        if ((this.IsCL==false) && (this.IsRF==false)){
          this.IsCL=true;
          localStorage.setItem('IsRf', '0');
        }
     }
      
    // this.chkTitle = false;
    // this.chkArtist = false;
    if (e == "CL") {
      this.IsCL=true;
      this.IsRF=false;
      localStorage.setItem('IsRf', '0');
    }
    else if (e == "RF") {
      this.IsRF=true;
      this.IsCL=false;
      localStorage.setItem('IsRf', '1');
    }
     
    else {
      this.chkMediaRadio = e;
    }
    if (this.chkMediaRadio=='Video'){
      this.IsCL=true;
      this.IsRF=false;
      localStorage.setItem('IsRf', '0');
    }
    this.SongsList = [];
    if ((this.chkSearchRadio == "title") || (this.chkSearchRadio == "artist") || (this.chkSearchRadio == "album")) {
      this.FillSongList();
    }
    else {

      this.SearchRadioClick(this.chkSearchRadio);
    }
    
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.SearchContent();
    }
  }


  /// Instant Play=========================================
  InstantPlay(Reqid, Reqtype, Requrl, ArId, AlId, titleName, aname) {
    var ReqDeviceToken = this.FCMID;
    var vToken = this.IsVideoToken;
    var parm = JSON.stringify({
      id: Reqid,
      type: Reqtype,
      url: Requrl,
      DeviceToken: ReqDeviceToken,
      title: titleName,
      artistid: ArId,
      albumid: AlId,
      artistname: aname,
      IsVideoToken: vToken,
      tid:this.tid
    })

    this.ipService.SendNoti(parm).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        var obj = JSON.parse(returnData);
        this.loading = false;
        if (obj.Response == "1") {
          this.toastr.info("Request is assigned", '');
        }
        else {
          this.toastr.error("Request is not complete.Please try again later.", '');
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onClickInstant(id, Arid, Alid, mType, tName, aName, ActionType) {
    if (this.FCMID == "") {
      this.toastr.error("Player version is not compatible. Please update player version.");
     return;
    }
    var url = "";
        //url = "http://api.nusign.eu/mp3files/"; 
        url = "http://api.advikon.com/mp3files/";
    if (mType == "Audio") {
      url = url + id + ".mp3";
    }
    if (mType == "Video") {
      url = url + id + ".mp4";
    }
    if (mType == "Image") {
      url = url + id + ".jpg"; 
    }

    this.InstantPlay(id, ActionType, url, Arid, Alid, tName, aName);
  }
  onChangeCustomer(deviceValue) {
     
    this.SelectedClientId = deviceValue;
    this.DownloadedSongsList = [];
    this.ActivePlaylist =[];
    this.SongsList = [];
    this.ContentType$='';
    this.FillPlayer(deviceValue);
    //this.GetCustomerContentType();

  }
  GetCustomerContentType(){
    this.loading = true;
    this.pService.GetClientContenType(this.SelectedClientId).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        
        this.loading = false;
        if (obj.Responce == "1") {
          this.ContentType$=obj.ContentType;
        }
        //this.FillPlayer(this.SelectedClientId);
      },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
  }

}
