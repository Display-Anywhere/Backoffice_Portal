import { Component, OnInit, ViewContainerRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
import * as $ from 'jquery';
import { AuthServiceOwn } from '../auth/auth.service';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
//import {ModuleRegistry, AllCommunityModules} from '@ag-grid-community/all-modules';
//import {ClientSideRowModelModule} from "@ag-grid-community/client-side-row-model";
@Component({
  selector: 'app-djplaylist-library',
  templateUrl: './djplaylist-library.component.html',
  styleUrls: ['./djplaylist-library.component.css']
})
export class DJplaylistLibraryComponent implements OnInit {

  PlaylistSongsList = [];
  PlaylistList = [];
  SpecialPlaylistList = [];
  PlaylistLibrary = [];
  PlaylistSelected = [];
  SongsList = [];
  playlistform: UntypedFormGroup;
  SongsSelected = [];
  submittedPlaylistform = false;
  public loading = false;
  tid;
  Search: boolean = true;
  
  SearchText = "";
  cmbAlbum;
  chkSearchRadio: string = "title";
  chkMediaRadio: string = "Audio";
  AlbumList = [];
  FormatList = [];
  CopyFormatList = [];
  formatid: string = "0";
  DeleteFormatid: string = "0";
  IsAdminLogin1: boolean = false
  IsCategoryShow: boolean = false;
  IsSubAdminLogin: boolean = false;
  chkTitle: boolean = false;
  chkArtist: boolean = false;
  pid;
  NewFormatName: string = "";
  IsNormalPlaylist: boolean = true;
  IsFirstTimeDrag: boolean = true;
  chkMute: boolean = true;
  chkFixed: boolean = true;
  selectedRow;
  IsCL: boolean = false;
  IsRF: boolean = false;
   

  plArray = [];
  IsAutoPlaylistHide: boolean = true;
  IsOptionButtonHide: boolean = true;
  txtMsg: string = "";
  txtDeletedFormatName: string = "";
  txtCommonMsg: string;
  TokenList = [];
  private rowSelection;
  CopyFormatId = "0";
  txtDelPer = "0";
  chkExplicit: boolean = false;
  HeaderName="Album";
  NewName="";
  dtpReleaseDate;
  currentRate = 0;

  PageNo = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  constructor(private formBuilder: UntypedFormBuilder, public toastr: ToastrService,
    vcr: ViewContainerRef, config: NgbModalConfig, private modalService: NgbModal,
    private pService: PlaylistLibService, public auth:AuthServiceOwn, configRating: NgbRatingConfig) {

    config.backdrop = 'static';
    config.keyboard = false;
    configRating.max = 5;
    //ModuleRegistry.registerModules(AllCommunityModules);
    //ModuleRegistry.register(ClientSideRowModelModule);
    
  }

  ngOnInit() {
    $("#dis").attr('unselectable', 'on');
    $("#dis").css('user-select', 'none');
    $("#dis").on('selectstart', false);


    this.rowSelection = "multiple";
    this.txtCommonMsg = "Are you sure to delete?";
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;
    this.txtDeletedFormatName = "";
    this.IsFirstTimeDrag = true;
    if (localStorage.getItem('IsRf') == "1") {
      this.IsRF = true;
      this.IsCL = false;
    }
    else {
      this.IsRF = false;
      this.IsCL = true;

    }

     
    if (localStorage.getItem('dfClientId') == "64") {
      this.IsCategoryShow = true;
    }
    /*
    if (localStorage.getItem('dfClientId') == "71") {
      this.IsSubAdminLogin = true;
    }
    else {
      this.IsSubAdminLogin = false;
    }*/
    this.playlistform = this.formBuilder.group({
      plName: ["", Validators.required],
      id: [""],
      formatid: ["0"]
    });

    this.PlaylistSongsList = [];
    this.PlaylistList = [];

    this.SongsList = [];

    this.FillFormat();
    this.chkTitle = true;


    // if ((localStorage.getItem('dfClientId') == "2") || (localStorage.getItem('dfClientId') == "91") || (localStorage.getItem('dfClientId') == "92") || (localStorage.getItem('dfClientId') == "93")) {
    //   this.IsAutoPlaylistHide = false;
    //   this.IsOptionButtonHide = false;

    // }
  }
  ManualPlaylist() {
    if (this.formatid == "0") {
      this.toastr.info("Please select a format name");
      return;
    }
    this.IsAutoPlaylistHide = false;
    this.IsOptionButtonHide = false;
  }
  SelectPlaylist(fileid, event) {
    this.PlaylistSelected = [];
    this.PlaylistSelected.push(fileid);
    this.FillPlaylistSongs(fileid, "No", "Yes");
  }
  FillPlaylistSongs(fileid, IsBestOffPlaylist, IsNormal) {
    if (IsNormal == "Yes") {
      this.IsNormalPlaylist = true;
    }
    else {
      this.IsNormalPlaylist = false;
    }
    this.PlaylistSelected = [];
    this.PlaylistSelected.push(fileid);
    this.loading = true;
    this.pService.PlaylistSong(fileid, IsBestOffPlaylist).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.PlaylistSongsList = obj;
        this.loading = false;
        this.UpdatePlaylistListArray();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  get f() { return this.playlistform.controls; }
  onSubmitPlaylist() {
    this.submittedPlaylistform = true;
    if (this.playlistform.invalid) {
      return;
    }
    if (this.playlistform.value.formatid == "0") {
      this.toastr.info('Please select a format name');
      return;
    }
    this.loading = true;
    this.pService.SavePlaylist(this.playlistform.value).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.IsAutoPlaylistHide = true;
          this.IsOptionButtonHide = true;
          // if ((localStorage.getItem('dfClientId') == "91") || (localStorage.getItem('dfClientId') == "92") || (localStorage.getItem('dfClientId') == "93")) {
          //   this.IsAutoPlaylistHide = false;
          //   this.IsOptionButtonHide = false;

          // }
          this.NewName=this.playlistform.value.plName+ '  (0)';
          this.SaveModifyInfo(0, "New playlist is create with name " + this.playlistform.value.plName);
          this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
          this.PlaylistSongsList = [];
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  SelectSongList(fileid, event) {
    if (event.target.checked) {
      this.SongsSelected.push(fileid);
    }
    else {
      const index: number = this.SongsSelected.indexOf(fileid);
      if (index !== -1) {
        this.SongsSelected.splice(index, 1);
      }
    }
    // this.toastr.info(JSON.stringify(this.SongsSelected), 'Success!');
  }
  getSelectedRows() {
    this.SongsSelected = [];
    var k = this.SongsList[0];
    for (var val of this.selectedRowsIndexes) {
      var k = this.SongsList[val].id;
      this.SongsSelected.push(k);
    }


  }
  openTitleDeleteModal(mContent, id) {

    this.tid = id;
    this.modalService.open(mContent);
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
   
  SearchRadioClick(e) {
    this.selectedRowsIndexes = [];
    this.chkSearchRadio = e;
    this.SearchText = "";
    this.Search = true;
    
    this.chkExplicit=false;

    if (this.chkSearchRadio == "ReleaseDate") {
      this.SongsList = [];
      this.FillReleaseDate();
      this.Search = false;
    }

    if (this.chkSearchRadio == "Genre") {
      this.SongsList = [];
      this.FillGenre();
      this.Search = false;
    }
    if (this.chkSearchRadio == "BPM") {
      this.SongsList = [];
      this.FillBPM();
      this.Search = false;
    }
    if (this.chkSearchRadio == "EngeryLevel") {
      this.SongsList = [];
      this.FillEngeryLevel();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Category") {
      this.SongsList = [];
      this.FillCategory();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Language") {
      this.SongsList = [];
      this.FillLanguage();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Year") {
      this.SongsList = [];
      this.FillYear();
      this.Search = false;
    }
    if (this.chkSearchRadio == "BestOf") {
      this.FillSpecialPlaylistList();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Folder") {
      this.SongsList = [];
      this.FillFolder();
      this.Search = false;
    }
    if (this.chkSearchRadio == "Label") {
      this.SongsList = [];
      this.FillLabel();
      this.Search = false;
    }
    if (this.chkSearchRadio == "NewVibe") {
      this.SongsList = [];
      this.FillSearch();
      this.Search = true;
    }
    if ((this.chkSearchRadio == "title") || (this.chkSearchRadio == "artist") || (this.chkSearchRadio == "album")) {

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
     if ((this.chkMediaRadio=='Audio') &&(this.IsCL==true)){
       this.HeaderName="Album";
     }
     else if (this.chkMediaRadio=='Image'){
      this.HeaderName="Folder";
     }
     else{
       this.HeaderName="Label";
     }
    this.SongsList = [];
    if ((this.chkSearchRadio == "title") || (this.chkSearchRadio == "artist") || (this.chkSearchRadio == "album")) {

      this.FillSongList();
    }
    else {

      this.SearchRadioClick(this.chkSearchRadio);
    }
  }
  FillAlbum() {
    this.loading = true;
    var qry = "spSearch_Album_Copyright '" + this.SearchText + "', " + localStorage.getItem('IsRf')+",'"+this.chkMediaRadio+"','" + localStorage.getItem('DBType') + "'";

    this.pService.FillCombo(qry).pipe()
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
      
    var qry = "select cast(EngeryLevel as nvarchar(20)) +' Star' as DisplayName, EngeryLevel as Id from titles  ";
    qry = qry + " where EngeryLevel is not null and mediatype='" + this.chkMediaRadio + "' and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    
    qry = qry + " group by EngeryLevel order by EngeryLevel ";

    this.pService.FillCombo(qry).pipe()
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
    var qry = "select FORMAT(ReleaseDate,'MMM')+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as DisplayName ,";
    qry = qry + " cast(month(ReleaseDate) as nvarchar(10))+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as Id , month(ReleaseDate) as rMonth ";
    qry = qry + " from titles where ReleaseDate is not null and mediatype='" + this.chkMediaRadio + "' and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    qry = qry + " group by year(ReleaseDate), month(ReleaseDate), FORMAT(ReleaseDate,'MMM')";
    qry = qry + " order by year(ReleaseDate) desc, month(ReleaseDate) desc";
    console.log(qry);
    this.pService.FillCombo(qry).pipe()
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
  FillBPM() {
    this.loading = true;
    var dbtype= localStorage.getItem('DBType');
    var qry = "GetBPM '" + this.chkMediaRadio + "' ,  " + localStorage.getItem('IsRf') + ", "+ dbtype;
    this.pService.FillCombo(qry).pipe()
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
    var qry = "select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ";
    qry = qry + " inner join Titles tit on tit.genreId= tbGenre.genreId ";
    qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    qry = qry + " and (tit.dbtype='"+localStorage.getItem('DBType')+"' or tit.dbtype='Both') ";
    if (this.chkMediaRadio != "Image") {
      qry = qry + " and tit.IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    }
    qry = qry + " group by tbGenre.GenreId,genre ";
    qry = qry + " order by genre ";
    this.pService.FillCombo(qry).pipe()
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
  
  FillFolder() {
    this.loading = true;
    var qry = "select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ";
    qry = qry + " inner join Titles tit on tit.folderId= tbFolder.folderId ";
    qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    qry = qry + " and (tit.dbtype='"+localStorage.getItem('DBType')+"' or tit.dbtype='Both') ";
    if (this.chkMediaRadio != "Image") {
      qry = qry + " and tit.IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    }
    qry = qry + " group by tbFolder.folderId,tbFolder.foldername ";
    qry = qry + " order by tbFolder.foldername ";

    this.pService.FillCombo(qry).pipe()
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
    var qry = "select  Language as Id,  Language as DisplayName  from titles ";
    qry = qry + " where Language is not null  and Language!='' and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    qry = qry + " and titles.mediatype='" + this.chkMediaRadio + "' ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by Language order by Language ";
   this.pService.FillCombo(qry).pipe()
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
    qry = qry + " where acategory is not null and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    if (this.chkMediaRadio == "Audio") {
      qry = qry + " and acategory not like '%video%' and acategory not like '%MP4%'  ";
      if (this.IsCL==true){
        qry = qry + " and acategory not like '%DL%' "
      }
      
    }
    else if (this.chkMediaRadio == "Video") {
      qry = qry + " and ( acategory like '%video%' or acategory like '%mp4%' ) ";
    }
    else {
      qry = qry + " and ( acategory like '%Image%') ";
    }
    qry = qry + " group by acategory order by acategory ";

    this.pService.FillCombo(qry).pipe()
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
    if (id=="318"){
      this.chkExplicit=true;
    }
    else{
      this.chkExplicit=false;
    }

    this.FillSearch();
  }
  FillSearch() {
    this.PageNo=1;
    if (this.chkSearchRadio!="NewVibe"){
    if (this.SearchText == "") {
      this.FillSongList();
      return;
    }
  }
  
    this.loading = true;
    this.pService.CommanSearch(this.chkSearchRadio, this.SearchText, this.chkMediaRadio, this.chkExplicit,"1",localStorage.getItem('dfClientId'),"0").pipe()
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
    this.selectedRowsIndexes = [];
    this.loading = true;
    this.pService.FillSongList(this.chkMediaRadio, this.chkExplicit,localStorage.getItem('dfClientId')).pipe()
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
  FillFormat() {
    this.loading = true;
    var qry = "";

    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'"+ localStorage.getItem('DBType') +"'";
    }
    else {
      qry = "select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid";
      qry = qry + " left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where ";
      qry = qry + " (dbtype='"+ localStorage.getItem('DBType') +"' or dbtype='Both') and  (st.dfclientid=" + localStorage.getItem('dfClientId') + " OR sf.dfclientid=" + localStorage.getItem('dfClientId') + ") group by  sf.formatname";
    }

    this.pService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.FormatList = JSON.parse(returnData);
        this.loading = false;
        this.FillSongList();
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  NewList;
  GetJSONRecord = (array): void => {
    this.NewList = this.FormatList.filter(order => order.Id == array.Id);
  }
  onChangeFormat(id, l) {
    var ArrayItem = {};
    var fName = "";
    ArrayItem["Id"] = id;
    ArrayItem["DisplayName"] = "";
    this.GetJSONRecord(ArrayItem);
    if (this.NewList.length > 0) {
      fName = this.NewList[0].DisplayName;
    }
    this.formatid = id;
    this.txtDeletedFormatName = fName;
     this.playlistform = this.formBuilder.group({
      plName: ["", Validators.required],
      id: [""],
      formatid: [this.formatid]
    });
    this.PlaylistList = [];
    this.PlaylistSongsList = [];
    if (this.formatid == "") {
      return;
    }
    if (this.formatid == "0") {
      return;
    }
    this.FillPlaylist(id);
  }
  FillPlaylist(id) {
    this.PlaylistList = [];
    this.loading = true;
    this.pService.Playlist(id).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.PlaylistList = JSON.parse(returnData);
        

        this.loading = false;
        
        if (this.PlaylistList.length > 0) {
          if (this.NewName!=""){
            var NewPlList = this.PlaylistList.filter(order => order.DisplayName === this.NewName  );
            this.PlaylistList.forEach((student) => {
              if (student.Id === NewPlList[0].Id) {
                student.check = true;
              }
            });
            this.NewName="";
            this.SelectPlaylist(NewPlList[0].Id, "");
          }
          else{
            this.SelectPlaylist(this.PlaylistList[0].Id, "");
          }
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  AddFormat(id, plName, isBestOff) {
    if (this.formatid == "") {
      this.toastr.info("Please select a format name");
      return;
    }
    if (this.formatid == "0") {
      this.toastr.info("Please select a format name");
      return;
    }

    this.loading = true;
    this.pService.SavePlaylistFromBestOf(id, plName, this.formatid, isBestOff).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
          this.PlaylistSongsList = [];
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onPlaylistClick(id, pname) {
    this.IsAutoPlaylistHide = false;
    this.IsOptionButtonHide = false;
    var plName = pname.split("(")

    this.playlistform = this.formBuilder.group({
      plName: [plName[0].trim(), Validators.required],
      id: [id],
      formatid: [this.formatid]
    });
  }
  AddSong() {
    this.getSelectedRows();
    if (this.PlaylistSelected.length == 0) {
      this.toastr.error("Please select a playlist", '');
      return;
    }
    if (this.SongsSelected.length == 0) {
      this.toastr.error("Select atleast one song", '');
      return;
    }

    this.loading = true;
    this.pService.AddPlaylistSong(this.PlaylistSelected, this.SongsSelected, "SFPlaylist", false).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        this.loading = false;
        if (obj.Responce == "1") {
          this.SelectPlaylist(this.PlaylistSelected[0], "");
          this.SaveModifyInfo(this.SongsSelected, "New songs is added in " + this.PlaylistSelected + " playlist ");

        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
        this.checkboxes.forEach((element) => {
          element.nativeElement.checked = false;
        });
        this.selectedRowsIndexes = [];
        this.SongsSelected = [];
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  DeleteTitle() {
    this.loading = true;
    this.pService.DeleteTitle(this.PlaylistSelected[0], this.tid, "No").pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.SelectPlaylist(this.PlaylistSelected[0], "");
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.SearchContent();
    }
  }
  FillSpecialPlaylistList() {
    this.loading = true;
    var qry = "GetBestPlaylist " + localStorage.getItem('IsRf')+ ",'" + localStorage.getItem('DBType') + "'";
    this.pService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.SpecialPlaylistList = JSON.parse(returnData);
        this.loading = false;
        this.FillCopyFormat();

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  onPlaylistDeleteClick(mContent) {
    this.txtMsg = "";
    this.txtCommonMsg = "Are you sure to delete?";
    this.modalService.open(mContent);
  }
  DeletePlaylist(forceDelete) {
    this.loading = true;
    this.pService.DeletePlaylist(this.pid, forceDelete).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.FillPlaylist(this.formatid);
          this.modalService.dismissAll();
        }
        else if (obj.Responce == "2") {
          this.txtCommonMsg = "";
          this.txtMsg = "This playlist cannot be deleted, as it is assigned to tokens";
          this.loading = false;
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillPlaylistLibrary(id) {
    this.loading = true;
    var qry = "GetPlaylistLibrary " + localStorage.getItem('IsRf') + "," + id;

    this.pService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        console.log(returnData);
        this.PlaylistLibrary = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }


  openFormatModal(mContent) {
    this.NewFormatName = "";
    this.NewFormatName = this.txtDeletedFormatName;
    this.modalService.open(mContent);
  }
  onSubmitNewFormat() {

    if (this.NewFormatName == "") {
      this.toastr.info("Format name cannot be blank", '');
      return;
    }

    this.pService.SaveFormat(this.formatid, this.NewFormatName,localStorage.getItem('dfClientId'),'').pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce != "-2") {
          this.toastr.info("Saved", 'Success!');

          this.loading = false;
          if (this.txtDeletedFormatName == "") {
            this.SaveModifyInfo(0, "New format is create with name " + this.NewFormatName);
          }
          else {
            this.SaveModifyInfo(0, "Format is modify. Now New name is " + this.NewFormatName);

          }
          this.formatid = "0";
          this.txtDeletedFormatName = "";
          this.PlaylistList = [];
          this.PlaylistSongsList = [];
          this.FillFormat();
        }
        else if (obj.Responce == "-2") {
          this.toastr.info("This format name already exists", '');
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  plChange() {
    if (this.IsFirstTimeDrag == true) {
      this.IsFirstTimeDrag = false;
      this.ArrayLoop();
    }
  }
  onPlaylistSettingClick(id, mContent, chkMu, chkFixed) {
    this.pid = id;
    this.txtDelPer = "0";
    this.chkMute = chkMu;
    this.chkFixed = chkFixed
    this.modalService.open(mContent);
  }

  SettingPlaylist() {
    this.loading = true;
    this.pService.SettingPlaylist(this.pid, this.chkMute, this.chkFixed,false,false,'90').pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
          this.FillPlaylist(this.formatid);
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  setClickedRow = function (index) {
    this.selectedRow = index;
  }





  selectWithShift(rowIndex) {
    var lastSelectedRowIndexInSelectedRowsList = this.selectedRowsIndexes.length - 1;
    var lastSelectedRowIndex = this.selectedRowsIndexes[lastSelectedRowIndexInSelectedRowsList];
    var selectFromIndex = Math.min(rowIndex, lastSelectedRowIndex);
    var selectToIndex = Math.max(rowIndex, lastSelectedRowIndex);
    this.selectRows(selectFromIndex, selectToIndex);
  }
  selectRows(selectFromIndex, selectToIndex) {
    for (var rowToSelect = selectFromIndex; rowToSelect <= selectToIndex; rowToSelect++) {
      this.select(rowToSelect);
    }
  }
  setMultipleClickedRow = function (event, index, songLst, lock) {
    if (event.ctrlKey) {
      // this.selectedRowsIndexes=[];
      this.changeSelectionStatus(index);
    }
    else if (event.shiftKey) {
      this.selectWithShift(index);
    } else {
      this.selectedRowsIndexes = [index];
    }
    return;

  }



  changeSelectionStatus(rowIndex) {
    if (this.isRowSelected(rowIndex)) {
      this.unselect(rowIndex);
    } else {
      this.select(rowIndex);
    }
  }

  isRowSelected(rowIndex) {
    return this.selectedRowsIndexes.indexOf(rowIndex) > -1;
  };
  selectedRowsIndexes = [];

  unselect(rowIndex) {
    var rowIndexInSelectedRowsList = this.selectedRowsIndexes.indexOf(rowIndex);
    var unselectOnlyOneRow = 1;
    this.selectedRowsIndexes.splice(rowIndexInSelectedRowsList, unselectOnlyOneRow);
  }
  select(rowIndex) {
    if (!this.isRowSelected(rowIndex)) {
      this.selectedRowsIndexes.push(rowIndex)
    }
  }












  moveUp = function (num) {
    if (num > 0) {
      var tmp = this.PlaylistSongsList[num - 1];
      var tmpPL = this.plArray[num - 1];

      this.PlaylistSongsList[num - 1] = this.PlaylistSongsList[num];
      this.plArray[num - 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;

      this.ArrayLoop();
      this.selectedRow--;
    }
  }
  moveDown = function (num) {
    if (num < this.PlaylistSongsList.length - 1) {
      var tmp = this.PlaylistSongsList[num + 1];
      var tmpPL = this.plArray[num + 1];

      this.PlaylistSongsList[num + 1] = this.PlaylistSongsList[num];
      this.plArray[num + 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;
      this.ArrayLoop();
      this.selectedRow++;
    }
  }
  ArrayLoop() {
    this.plArray = [];
    var srno = 0;
    for (let prop in this.PlaylistSongsList) {
      this.plArray.push({
        "index": srno, "titleid": this.PlaylistSongsList[prop].id
      });
      srno++;
    }

  }
  UpdateSRNo() {

    this.loading = true;
    this.pService.UpdatePlaylistSRNo(this.PlaylistSelected, this.plArray).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  SaveModifyInfo(tokenid, ModifyText) {
    this.pService.SaveModifyLogs(tokenid, ModifyText).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
      },
        error => {
        })
  };

  openModel(content) {
    if (this.formatid == "0") {
      this.toastr.info("Please select a format name");
      return;
    }
    localStorage.setItem("FormatID", this.formatid);
    this.modalService.open(content, { size: 'lg' });
  }
  ModelClose() {
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;
    this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
    this.modalService.dismissAll();
  }
  openDeleteFormatModal(content) {
    if (this.formatid == "0") {
      this.toastr.info("Please select a format name");
      return;
    }
    this.txtCommonMsg = "Are you sure to delete?";
    this.txtMsg = "";
    this.DeleteFormatid = this.formatid;
    this.modalService.open(content);
  }

  DeleteFormat(IsForceDelete) {
    this.submittedPlaylistform = true;
    this.loading = true;
    this.pService.DeleteFormat(this.DeleteFormatid, IsForceDelete).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.SaveModifyInfo(0, "Format is deleted. FormatName: " + this.txtDeletedFormatName + " and unique id :" + this.formatid);
          this.formatid = "0";
          this.DeleteFormatid = "0";
          this.txtMsg = "";
          this.FillFormat();
          this.PlaylistList = [];
          this.PlaylistSongsList = [];
          this.modalService.dismissAll('Cross click');
        }
        else if (obj.Responce == "2") {
          this.txtMsg = "This format cannot be deleted, as it is assigned to tokens";
          this.txtCommonMsg = "";
          this.loading = false;
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  FillTokenInfo(formatid, playlistid) {
    this.TokenList = [];
    this.loading = true;
    this.pService.FillTokenInfo_formatANDplaylist(formatid, playlistid).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);

        this.TokenList = JSON.parse(returnData);
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  ViewTokens(modal, modalname) {
    this.modalService.open(modal, { size: 'lg' });
    if (modalname == "Format") {
      this.FillTokenInfo(this.formatid, 0)
    }
    if (modalname == "Playlist") {
      this.FillTokenInfo(0, this.pid)
    }
  }


  UpdatePlaylistListArray() {
    this.PlaylistList.forEach((student) => {
      if (student.Id === this.PlaylistSelected[0]) {
        var dn = student.DisplayName.split("(");
        student.DisplayName = dn[0] + " (" + this.PlaylistSongsList.length + ")";
      }
    });
  }







  FillCopyFormat() {
    this.loading = true;
    var qry = "";
    qry = "FillFormat "+localStorage.getItem('dfClientId')+",'"+ localStorage.getItem('DBType') +"'";
    this.pService.FillCombo(qry).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        this.CopyFormatList = JSON.parse(returnData);
        this.loading = false;

      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  onChangeCopyFormat(id) {
    this.CopyFormatId = id;
    this.FillPlaylistLibrary(id);
  }

   

  onDeletePercentageClick(mContent) {
    this.modalService.open(mContent);
  }

  DeleteTitlePercentage() {
    this.loading = true;
    this.pService.DeleteTitlePercentage(this.pid, this.txtDelPer).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Deleted", 'Success!');
          this.loading = false;
          this.SelectPlaylist(this.pid, "");
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }

  FillYear() {
    this.loading = true;
    var qry = "select  TitleYear as Id,  TitleYear as DisplayName  from titles ";
    qry = qry + " where TitleYear is not null and TitleYear!=0 and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    qry = qry + " and titles.mediatype='" + this.chkMediaRadio + "' ";
    qry = qry + " and (titles.dbtype='"+localStorage.getItem('DBType')+"' or titles.dbtype='Both') ";
    qry = qry + " group by TitleYear order by TitleYear desc ";
    this.pService.FillCombo(qry).pipe()
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
  FillLabel() {
    this.loading = true;


    // var qry = "select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ";
    // qry = qry + " inner join Titles tit on tit.folderId= tbFolder.folderId ";
    // qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    // qry = qry + " and (tit.dbtype='"+localStorage.getItem('DBType')+"' or tit.dbtype='Both') ";
    // if (this.chkMediaRadio != "Image") {
    //   qry = qry + " and tit.IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    // }
    // qry = qry + " group by tbFolder.folderId,tbFolder.foldername ";
    // qry = qry + " order by tbFolder.foldername ";






    var qry = "select  label as DisplayName, label as Id from titles ";
    qry = qry + " where label is not null and label !='' ";
    qry = qry + " and mediatype='" + this.chkMediaRadio + "' ";
    if (this.chkMediaRadio != "Image") {
      qry = qry + " and IsRoyaltyFree = " + localStorage.getItem('IsRf') + " ";
    }
    qry = qry + " group by label order by label ";
    this.pService.FillCombo(qry).pipe()
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
  OnChangeExplicit(event) {
    const checked = event.target.checked;
    this.SearchRadioClick(this.chkSearchRadio);
  }
  CancleManual(){
    this.playlistform.get('plName').setValue("");
    this.playlistform.get('id').setValue("");
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;

  }
  UpdateEnergyLevel(TitleId, value){
    var EnergyLevel= value+1;
    this.loading = true;
    this.pService.UpdateEnergyLevel(TitleId,EnergyLevel).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.Responce == "1") {
          this.toastr.info("Saved", 'Success!');
          this.loading = false;
        }
        else {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        }
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })

  }
  onScrollDown () {
    this.PageNo += 1;
    this.appendItems();
     
  }
  appendItems() {
    
    this.selectedRowsIndexes = [];

    this.loading = true;
    this.pService.CommanSearch(this.chkSearchRadio, this.SearchText, this.chkMediaRadio, this.chkExplicit,this.PageNo,localStorage.getItem('dfClientId'),"0").pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.length!=0){
        for(var i = 0; i < obj.length; i++){
        this.SongsList.push(obj[i]);
        }
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
 
  }
  onUp() {
    this.toastr.info('scrolled up!');
  }
   
} 
///https://stackoverflow.com/questions/34523276/how-enable-multiple-row-selection-in-angular-js-table/34523640
