import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import * as CanvasJs from 'src/assets/canvasjs.min.js'
import { SerAdminLogService } from 'src/app/components/admin-logs/ser-admin-log.service';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-new-playlist-library',
  templateUrl: './new-playlist-library.component.html',
  styleUrls: ['./new-playlist-library.component.css']
})
export class NewPlaylistLibraryComponent implements OnInit {
  //"./node_modules/jquery/dist/jquery.min.js",  
  data = [];
  JsonList = [];
  JsonItem = {};
  GraphList = [];
  public loading = false;
  mediatype = "Audio";
  mediaStyle = "Copyright";
  page: number = 1;
  pageSize: number = 20;
  AutoSearchRadio="";

  NewMusic: boolean = false;
  AutoBPM: boolean = false;
  rDate: boolean = false;
  eLevel: boolean = false;
  eLanguage: boolean = false;
  eYear: boolean = false;
  BitRate: boolean = false;
  AlbumList;
  FilterValue;
  CustomerMediaType = '';
  rdoAudio: boolean;
  rdoVideo: boolean;
  constructor(private adminService: SerAdminLogService, public toastr: ToastrService,
    vcr: ViewContainerRef, public auth: AuthServiceOwn) {

  }

  ngOnInit() {
    this.CustomerMediaType =  localStorage.getItem('CustomerMediaType');
    this.NewIsCL = false;
    this.NewIsDL = false;
    this.rdoAudio = true;
    this.rdoVideo = false;
    this.JsonList = [];
    this.NewGenreList = [];
    this.GraphList = [];

    if (this.CustomerMediaType === 'Audio Copyright') {
      this.rdoAudio = true;
      this.rdoVideo = false;
      this.NewIsCL = true;
      this.NewIsDL = false;
      this.mediatype = 'Audio';
      this.mediaStyle = 'Copyright';
      localStorage.setItem('IsRf', '0');
    }
    if (this.CustomerMediaType === 'Audio DirectLicence') {
      this.rdoAudio = true;
      this.rdoVideo = false;
      this.NewIsCL = false;
      this.NewIsDL = true;
      this.mediatype = 'Audio';
      this.mediaStyle = 'DL';
      localStorage.setItem('IsRf', '1');
    }
    if (this.CustomerMediaType === 'Video') {
      this.rdoAudio = false;
      this.rdoVideo = true;
      this.NewIsCL = true;
      this.NewIsDL = false;
      this.mediatype = 'Video';
      this.mediaStyle = 'Copyright';
      localStorage.setItem('IsRf', '0');
    }
    if (this.CustomerMediaType === 'Signage') {
      this.rdoAudio = false;
      this.rdoVideo = true;
      this.NewIsCL = true;
      this.NewIsDL = false;
      this.mediatype = 'Video';
      this.mediaStyle = 'Copyright';
      localStorage.setItem('IsRf', '0');
    }
    this.GetGenreList();
  }
  Chart() {
    let chart = new CanvasJs.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: false,
      legend: {
        horizontalAlign: "right",
        verticalAlign: "center"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name} (#percent%)",
        indexLabel: "(#percent%)",
        legendText: "{name}",
        indexLabelPlacement: "inside",
        dataPoints: this.GraphList
      }]
    });

    chart.render();
  }
  NewIsCL: boolean = true;
  NewIsDL: boolean = false;
  MediaType(mType) {
    this.mediatype = mType;
    if (mType == "Video") {
      this.NewIsCL = true;
      this.NewIsDL = false;
      this.mediaStyle = "Copyright";
    }
if (this.mediatype=="Image"){
  this.GetGenreList();
  return;
}
if (this.AutoSearchRadio==""){
  this.GetGenreList();
}
else{
  this.AutoSearchRadioClick(this.AutoSearchRadio)
}
  }
  MediaStyle(mSyle) {
    this.mediaStyle = mSyle;
    if (this.AutoSearchRadio==""){
      this.GetGenreList();
    }
    else{
      this.AutoSearchRadioClick(this.AutoSearchRadio)
    }
  }


  GetGenreList() {
    // this.JsonList = [];
    // this.GraphList = [];
    this.loading = true;
    this.adminService.GetGenreList(this.mediatype, this.mediaStyle, this.AutoSearchRadio, this.FilterValue).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.data = JSON.parse(returnData);
        this.loadPage(0);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  };

  SavePlaylist() {


    var mediaStyle, mediatype;

    if ($("#txtPlaylistName").val() == "") {
      this.toastr.info('Playlist name cannot be blank')
      return;
    }
    if ($("#txtSongs").val() == "") {
      this.toastr.info('Number of songs cannot be blank')
      return;
    }

    if (this.NewGenreList.length == 0) {
      this.toastr.info('Select atleast one genre')
      return;
    }


    if ($("#rdoCopyright").prop("checked")) {
      mediaStyle = $("#rdoCopyright").val();
    }
    if ($("#rdoDirect").prop("checked")) {
      mediaStyle = $("#rdoDirect").val();
    }

    if ($("#rdoVideo").prop("checked")) {
      mediatype = $("#rdoVideo").val();
    }
    if ($("#rdoAudio").prop("checked")) {
      mediatype = $("#rdoAudio").val();
    }

    this.JsonItem["plName"] = $("#txtPlaylistName").val();
    this.JsonItem["MediaType"] = mediatype;
    this.JsonItem["MediaStyle"] = mediaStyle;
    this.JsonItem["TotalSongs"] = $("#txtSongs").val();
    this.JsonItem["formatid"] = localStorage.getItem("FormatID");
    this.JsonItem["DBType"] = localStorage.getItem("DBType");
    this.JsonItem["clientid"] = localStorage.getItem('AutoClientId');
    this.JsonItem["lstGenrePer"] = this.NewGenreList;

    this.JsonList.push(this.JsonItem);

    this.loading = true;

    this.adminService.NewSavePlaylist(this.JsonList).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "2") {
          this.toastr.info("Songs are not found with current pattern.", '');
        }
        if (obj.Responce == "1") {
          this.toastr.info("Playlist is Saved", '');
          $("#txtPlaylistName").val('');
          $("#txtSongs").val('');
          this.ClearList()
        }
        if (obj.Responce == "0") {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  NewGenreList = [];
  onChangeRange(e, gid, gname) {
    var GenreItem = {}
    var GraphItem = {}
    var k = $("#chkGenre" + gid).prop("checked");
    if (k == false) {
      if (e != 0) {
        k = true;
        $("#chkGenre" + gid).prop("checked", true)
      }
    }
    if (k == true) {
      if (e != 0) {


        GenreItem["GenreId"] = gid;
        GenreItem["GenrePercentage"] = e;
        GenreItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        GenreItem["MediaType"] = this.mediatype;

        this.removeDuplicateRecord(GenreItem);
        this.NewGenreList.push(GenreItem);


        GraphItem["y"] = e * 100;
        GraphItem["name"] = gname + '(' + this.mediatype + ')';
        GraphItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        GraphItem["MediaType"] = this.mediatype;
        this.GraphRemoveDuplicateRecord(GraphItem);
        this.GraphList.push(GraphItem);
      }
      else {
        $("#chkGenre" + gid).prop("checked", false)
        GenreItem["GenreId"] = gid;
        GenreItem["GenrePercentage"] = "0";
        GenreItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        this.removeDuplicateRecord(GenreItem);

        GraphItem["y"] = "0";
        GraphItem["name"] = gname + '(' + this.mediatype + ')';
        GraphItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        this.GraphRemoveDuplicateRecord(GraphItem);
      }
      this.Chart();
    }

  }

  onChangeCheckBox(e, gid, gname) {
    var GenreItem = {}
    var GraphItem = {}
    if (e.target.checked == true) {
      var k = $("#" + gid).val();
      if (k != 0) {
        GenreItem["GenreId"] = gid;
        GenreItem["GenrePercentage"] = k;
        GenreItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        GenreItem["MediaType"] = this.mediatype;


        this.removeDuplicateRecord(GenreItem);
        this.NewGenreList.push(GenreItem);

        GraphItem["y"] = e * 100;
        GraphItem["name"] = gname + '(' + this.mediatype + ')';
        GraphItem["GenreIdMediaType"] = gid + '' + this.mediatype;
        GraphItem["MediaType"] = this.mediatype;
        this.GraphRemoveDuplicateRecord(GraphItem);
        this.GraphList.push(GraphItem);

      }
    }
    else {
      $("#" + gid).val('0');
      GenreItem["GenreId"] = gid;
      GenreItem["GenrePercentage"] = "0";
      GenreItem["GenreIdMediaType"] = gid + '' + this.mediatype;
      GenreItem["MediaType"] = this.mediatype;

      this.removeDuplicateRecord(GenreItem);

      GraphItem["y"] = "0";
      GraphItem["name"] = gname + '(' + this.mediatype + ')';
      GraphItem["GenreIdMediaType"] = gid + '' + this.mediatype;
      GraphItem["MediaType"] = this.mediatype;
      this.GraphRemoveDuplicateRecord(GraphItem);
    }
    this.Chart();
  }


  removeDuplicateRecord = (array): void => {
    this.NewGenreList = this.NewGenreList.filter(order => order.GenreIdMediaType !== array.GenreIdMediaType);
  }
  GraphRemoveDuplicateRecord = (array): void => {
    this.GraphList = this.GraphList.filter(order => order.GenreIdMediaType !== array.GenreIdMediaType);
  }

  loadPage(page) {
    for (var i = 0; i < this.data.length; i++) {
      var ismatch = false;
      for (var j = 0; j < this.NewGenreList.length; j++) {
        var mtypeId = this.data[i].genreid + '' + this.mediatype;
        if (mtypeId == this.NewGenreList[j].GenreIdMediaType) {
          ismatch = true;
          this.data[i].iChecked = true;
          this.data[i].GenrePercentage = this.NewGenreList[j].GenrePercentage;
          break;
        }
      }
      if (!ismatch) {
        this.data[i].iChecked = false;
        this.data[i].GenrePercentage = 0;
      }
    }
  };
  ClearList() {
    $("#rdoAudio").prop("checked", true);
    this.mediatype = "Audio";
    this.JsonList = [];
    this.NewGenreList = [];
    this.GraphList = [];
    this.AutoBPM = false;
    this.rDate = false;
    this.BitRate=false;
    this.eLevel = false;
    this.AutoSearchRadio = "";
    this.NewMusic = false;
    this.eLanguage=false;
    this.eYear=false;

    this.GetGenreList();
    this.Chart();
  }
  reset() {

    this.AutoBPM = false;
    this.rDate = false;
    this.BitRate=false;
    this.eLevel = false;
    this.eLanguage=false;
    this.eYear=false;

    this.AutoSearchRadio = "";
    this.GetGenreList();
    this.NewMusic = false;
  }
  AutoSearchRadioClick(e) {
    this.AutoSearchRadio = e;
    this.FilterValue = "";
    if (this.AutoSearchRadio == "NewVibe") {
      this.AutoBPM = false;
      this.rDate = false;
      this.BitRate=false;
      this.eLevel = false;
      this.NewMusic = true;
      this.eLanguage=false;
      this.eYear=false;
      this.GetGenreList();
    }
    if (this.AutoSearchRadio == "BPM") {
      this.AutoBPM = true;
      this.rDate = false;
      this.BitRate=false;
      this.eLevel = false;
      this.NewMusic = false;
      this.eLanguage=false;
      this.eYear=false;
      this.data = [];
      this.FillBPM();
    }
    if (this.AutoSearchRadio == "ReleaseDate") {
      this.AutoBPM = false;
      this.rDate = true;
      this.BitRate=false;
      this.eLevel = false;
      this.NewMusic = false;
      this.eLanguage=false;
      this.eYear=false;
      this.data = [];
      this.FillReleaseDate();
    }
    if (this.AutoSearchRadio == "BitRate") {
      this.AutoBPM = false;
      this.rDate = false;
      this.BitRate=true;
      this.eLevel = false;
      this.NewMusic = false;
      this.eLanguage=false;
      this.eYear=false;
      this.data = [];
      this.FillBitRate();
    }
    if (this.AutoSearchRadio == "Language") {
      this.AutoBPM = false;
      this.rDate = false;
      this.BitRate=false;
      this.eLevel = false;
      this.NewMusic = false;
      this.eLanguage=true;
      this.eYear=false;
      this.data = [];
      this.FillLanguage();
    }
    if (this.AutoSearchRadio == "Year") {
      this.AutoBPM = false;
      this.rDate = false;
      this.BitRate=false;
      this.eLevel = false;
      this.NewMusic = false;
      this.eLanguage=false;
      this.eYear=true;
      this.data = [];
      this.FillYear();
    }
    if (this.AutoSearchRadio == "EngeryLevel") {
      this.AutoBPM = false;
      this.rDate = false;
      this.BitRate=false;
      this.eLevel = true;
      this.NewMusic = false;
      this.eLanguage=false;
      this.eYear=false;
      this.data = [];
      this.FillEngeryLevel();
    }
  }
  
  FillYear() {
    this.loading = true;
    var rf = "0";
    if (this.mediaStyle == "DL") {
      rf = "1";
    }
    else {
      rf = "0";
    }
    var qry = "select  TitleYear as Id,  TitleYear as DisplayName  from titles ";
    qry = qry + " where TitleYear is not null and TitleYear!=0 and IsRoyaltyFree = " + rf + " ";
    qry = qry + " and titles.mediatype='" + this.mediatype + "' ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by TitleYear order by TitleYear desc";
    this.adminService.FillCombo(qry).pipe()
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
  FillLanguage() {
    this.loading = true;
    var rf = "0";
    if (this.mediaStyle == "DL") {
      rf = "1";
    }
    else {
      rf = "0";
    }
    var qry = "select  Language as Id,  Language as DisplayName  from titles ";
    qry = qry + " where Language is not null  and Language!='' and IsRoyaltyFree = " + rf + " ";
    qry = qry + " and titles.mediatype='" + this.mediatype + "' ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by Language order by Language ";
    this.adminService.FillCombo(qry).pipe()
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
  FillEngeryLevel() {
    var rf = "0";
    if (this.mediaStyle == "DL") {
      rf = "1";
    }
    else {
      rf = "0";
    }
    var qry = "select cast(EngeryLevel as nvarchar(20)) +' Star' as DisplayName, EngeryLevel as Id from titles  ";
    qry = qry + " where EngeryLevel is not null and mediatype='" + this.mediatype + "' and IsRoyaltyFree = " + rf + " ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by EngeryLevel order by EngeryLevel ";

    this.adminService.FillCombo(qry).pipe()
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
  FillReleaseDate() {
    this.loading = true;
    var rf = "0";
    if (this.mediaStyle == "DL") {
      rf = "1";
    }
    else {
      rf = "0";
    }
    var qry = "select FORMAT(ReleaseDate,'MMM')+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as DisplayName ,";
    qry = qry + " cast(month(ReleaseDate) as nvarchar(10))+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as Id , month(ReleaseDate) as rMonth ";
    qry = qry + " from titles where ReleaseDate is not null and mediatype='" + this.mediatype + "' and IsRoyaltyFree = " + rf + " ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by year(ReleaseDate), month(ReleaseDate), FORMAT(ReleaseDate,'MMM')";
    qry = qry + " order by year(ReleaseDate) desc, month(ReleaseDate) desc";
    this.adminService.FillCombo(qry).pipe()
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
  FillBitRate() {
    this.loading = true;
    var qry = 'select  bitrate as DisplayName, bitrate as Id from titles ';
    qry = qry + " where bitrate is not null and bitrate !='' ";
    qry = qry + " and mediatype='" +  this.mediatype + "' ";
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    if (this.mediatype != 'Image') {
      qry = qry + ' and IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }
    if (this.auth.ContentType$ == 'Signage') {
      qry = qry + ' and titles.GenreId in(303,297, 325,324) ';
    }
    if (
      this.mediatype == 'Image' &&
      this.auth.ContentType$ == 'MusicMedia'
    ) {
      qry = qry + ' and tbGenre.GenreId=326 ';
    }
    qry = qry + ' group by bitrate order by bitrate ';
    this.adminService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.AlbumList = JSON.parse(returnData);
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
  FillBPM() {
    var rf = "0";
    if (this.mediaStyle == "DL") {
      rf = "1";
    }
    else {
      rf = "0";
    }
    this.loading = true;
    var dbtype= localStorage.getItem('DBType');
    var qry = "GetBPM '" + this.mediatype + "' , " + rf + " , "+ dbtype;
    
    this.adminService.FillCombo(qry).pipe()
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
  onChangeFilter(e) {
    this.FilterValue = e;
    this.GetGenreList();
  }
}
