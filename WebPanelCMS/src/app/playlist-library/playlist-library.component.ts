import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,PipeTransform
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistLibService } from '../playlist-library/playlist-lib.service';
import * as $ from 'jquery';
import { AuthServiceOwn } from '../auth/auth.service';
import * as Shuffle from 'shuffle';
import { SerLicenseHolderService } from '../license-holder/ser-license-holder.service';
// import {ModuleRegistry, AllCommunityModules} from '@ag-grid-community/all-modules';
// import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {
  NgbdSortableHeader_playlist,
  SortEvent,
} from './playlist_sortable.directive';
import { Router } from '@angular/router';
import { trim } from 'jquery';
import { StoreForwardService } from '../store-and-forward/store-forward.service';

@Component({
  selector: 'app-playlist-library',
  templateUrl: './playlist-library.component.html',
  styleUrls: ['./playlist-library.component.css'],
  providers: [DecimalPipe],
})
export class PlaylistLibraryComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private pService: PlaylistLibService,
    public auth:AuthServiceOwn,private sfService: StoreForwardService,
    private serviceLicense: SerLicenseHolderService,private pipe: DecimalPipe, private router: Router
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    // ModuleRegistry.registerModules(AllCommunityModules);
    // ModuleRegistry.register(ClientSideRowModelModule);
  }
  @ViewChild('flocation') flocationElement: ElementRef;
  @ViewChildren(NgbdSortableHeader_playlist)
  headers: QueryList<NgbdSortableHeader_playlist>;
  headers_library: QueryList<NgbdSortableHeader_playlist>;
  compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  get f() {
    return this.playlistform.controls;
  }

  PlaylistSongsList = [];
  MainPlaylistSongsList = [];
  PlaylistSongsSortList=[];
  PlaylistList = [];
  MainPlaylistList = [];
  SpecialPlaylistList = [];
  Top50PlaylistList = [];
  PlaylistLibrary = [];
  PlaylistSelected = [];
  SongsList = [];
  MainSongsList = [];
  playlistform: FormGroup;
  SongsSelected = [];
  submittedPlaylistform = false;
  public loading = false;
  tid = [];
  Search: boolean = true;
  SearchText = '';
  cmbAlbum;
  chkSearchRadio: string = 'title';
  chkMediaRadio: string = 'Audio';
  AlbumList = [];
  FormatList = [];
  CopyFormatList = [];
  CopyFormatListClone = [];
  formatid: string = '0';
  DeleteFormatid: string = '0';
  IsAdminLogin1: boolean = false;
  IsCategoryShow: boolean = false;
  IsSubAdminLogin: boolean = false;
  chkTitle: boolean = false;
  chkArtist: boolean = false;
  pid;
  NewFormatName: string = '';
  IsNormalPlaylist: boolean = true;
  IsFirstTimeDrag: boolean = true;
  chkMute: boolean = true;
  chkFixed: boolean = true;
  selectedRowPL = [];
  IsCL: boolean = false;
  IsRF: boolean = false;
  playlistSize
  PlaylistSearchText = '';
  plArray = [];
  IsAutoPlaylistHide: boolean = true;
  IsOptionButtonHide: boolean = true;
  txtMsg: string = '';
  txtDeletedFormatName: string = '';
  txtCommonMsg: string;
  TokenList = [];
  private rowSelection;
  CopyFormatId = '0';
  txtDelPer = '0';
  chkExplicit: boolean = false;
  HeaderName = 'Album';
  chkVideo: boolean = false;
  chkAudio: boolean = false;
  chkMixed: boolean = false;
  chkImage: boolean = false;
  chkUrl: boolean = false;
  PlaylistSongContentType: string = '';
  NewName = '';
  HeaderName2 = '';
  LoginDfClientId;
  PageNo = 1;
  chkGenre: boolean = false;
  selectedRow;
  CustomerList = [];
  CustomerMediaTypeList = [];
  cmbCustomer = '0';
  cmbCustomerMediaType = '';
  rdoName = 'Genre';
  txtSearch1 = '';
  txtSearch2 = '';
  DBType = '';
  chkEnergy: boolean = false;
  ForceUpdateTokenid = '';
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  OldValue;
  NewList;
  plLastName: string = '';
  SettingPname = '';
  selectedRowsIndexes = [];

  enableEdit = false;
  enableEditIndex = null;
  txtTitle: string;
  ImageTimeInterval = [];
  chkDuplicate = false;
  isImgFind = 'No';
  
   
  searchText = '';
  cmbVolume="90"
  IsVolumeLevelModal=false;
  IsDownloadModal=false;
  TokenSelected = [];
  IscmbCustomerMediaTypeChange=true
  OtherKey="";
  OtherUrl="";
  IschkViewOnly=0;
  PlaylistExpiryList=[];
  cmbPublishId=""
  PortalName= localStorage.getItem('PortalName')
  isSanitizerActive=false
  async ngOnInit() {
    localStorage.setItem('IsAnnouncement', '0');
    $('#dis').attr('unselectable', 'on');
    $('#dis').css('user-select', 'none');
    $('#dis').on('selectstart', false);

    $('#disPL').attr('unselectable', 'on');
    $('#disPL').css('user-select', 'none');
    $('#disPL').on('selectstart', false);

    this.DBType = localStorage.getItem('DBType');

    this.LoginDfClientId = localStorage.getItem('dfClientId');

    this.chkGenre = false;
    if (
      this.auth.ContentType$ == 'MusicMedia' ||
      this.auth.ContentType$ == 'Both'
    ) {
      this.chkAudio = true;
      this.chkVideo = false;
      this.HeaderName = 'Album';
      this.chkMediaRadio = 'Audio';
    }
    if (this.auth.ContentType$ == 'Signage') {
      this.chkAudio = false;
      this.chkVideo = true;
      this.HeaderName = 'Label';
      this.chkMediaRadio = 'Video';
    }
    this.rowSelection = 'multiple';
    this.txtCommonMsg = 'Are you sure to delete?';
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;
    this.txtDeletedFormatName = '';
    this.IsFirstTimeDrag = true;
    if (localStorage.getItem('IsRf') == '1') {
      this.IsRF = true;
      this.IsCL = false;
    } else {
      this.IsRF = false;
      this.IsCL = true;
    }

    this.playlistform = this.formBuilder.group({
      plName: ['', Validators.required],
      id: [''],
      formatid: ['0'],
    });

    this.PlaylistSongsList = [];
    this.MainPlaylistSongsList = [];
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.SongsList = [];
    this.MainSongsList = [];
    await this.FillsplPlaylist()
    await this.FillClientList();
    this.chkTitle = true;
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  }

  FillClientList() {
    this.loading = true;
    var str = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    str =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.serviceLicense
      .FillCustomerWithKey(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          if (this.auth.IsAdminLogin$.value == false) {
            this.cmbCustomer = localStorage.getItem('dfClientId');
            this.onChangeCustomer(this.cmbCustomer);
          }
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
  GetCustomerContentType() {
    this.loading = true;
    this.pService
      .GetClientContenType(this.cmbCustomer)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.loading = false;
          if (obj.Responce == '1') {
            localStorage.setItem('ContentType', obj.ContentType);

            this.auth.SetContenType();
            this.SearchText = '';
            this.Search = true;
            this.chkSearchRadio = 'title';
            this.rdoName = 'Genre';
            this.chkAudio = false;
            this.chkVideo = false;
            this.chkImage = false;
            this.chkUrl=false;

            this.IsCL = false;
            this.IsRF = false;
            localStorage.setItem('IsRf', '0');

            if (
              this.auth.ContentType$ == 'MusicMedia' ||
              this.auth.ContentType$ == 'Both'
            ) {
              this.chkAudio = true;
              this.chkVideo = false;
              this.chkImage = false;
              this.chkUrl=false;
              this.HeaderName = 'Album';
              this.chkMediaRadio = 'Audio';
              this.IsCL = true;
              this.IsRF = false;
              localStorage.setItem('IsRf', '0');
            }
            if (this.auth.ContentType$ == 'Signage') {
              this.chkAudio = false;
              this.chkVideo = true;
              this.chkImage = false;
              this.chkUrl=false;
              this.HeaderName = 'Label';
              this.chkMediaRadio = 'Video';
              this.IsCL = true;
              this.IsRF = false;
              localStorage.setItem('IsRf', '0');
            }
            this.rowSelection = 'multiple';
            this.txtCommonMsg = 'Are you sure to delete?';
            this.IsAutoPlaylistHide = true;
            this.IsOptionButtonHide = true;
            this.txtDeletedFormatName = '';
            this.IsFirstTimeDrag = true;

            this.playlistform = this.formBuilder.group({
              plName: ['', Validators.required],
              id: [''],
              formatid: ['0'],
            });

            this.OneTimeFillFormat();

            if (
              this.auth.ContentType$ == 'Signage' &&
              this.chkMediaRadio == 'Video'
            ) {
              this.SongsList = [];
              this.MainSongsList = [];
              this.chkSearchRadio = 'Genre';
              this.SearchText = '';
              this.Search = false;
            }
          }
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
  onChangeCustomer(id) {
    this.PageNo = 1;
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.PlaylistSongsList = [];
    this.MainPlaylistSongsList = [];
    this.cmbCustomerMediaType = '';
    this.FormatList = [];
    this.CopyFormatList = [];
    this.CopyFormatListClone = [];
    this.SongsList = [];
    this.MainSongsList = [];
    this.formatid = '0';

    this.PlaylistLibrary = [];
    //this.GetCustomerContentType();
    this.GetPublishSchedule()
    this.GetCustomerMediaType(id);
    //this.LoginDfClientId = this.cmbCustomer;
    this.GetDefaultHotelTvPlaylist()
    const obj= this.CustomerList.filter(fId => fId.Id === id)
    const url='https://content.nusign.eu/api/login?key='+ obj[0].apikey;
    this.OtherUrl= url+'&redirectUri=https://content.nusign.eu/my-templates/';
    this.OtherKey=obj[0].apikey;
    this.isSanitizerActive= obj[0].isSanitizerActive
  }
  onChangeCustomerMediaType(id) {
    this.IscmbCustomerMediaTypeChange=true
    this.PageNo = 1;
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.PlaylistSongsList = [];
    this.MainPlaylistSongsList = [];
    this.formatid = '0';
    this.FormatList = [];
    this.CopyFormatList = [];
    this.CopyFormatListClone = [];
    this.PlaylistLibrary = [];
    this.GetCustomerContentType_new();
    //this.LoginDfClientId = this.cmbCustomer;
  }

  GetCustomerContentType_new() {
    this.auth.SetContenType();
    this.SearchText = '';
    this.Search = true;
    this.chkSearchRadio = 'title';
    this.rdoName = 'Genre';
    this.chkAudio = false;
    this.chkVideo = false;
    this.chkImage = false;
    this.chkUrl=false;
    this.IsCL = false;
    this.IsRF = false;
    localStorage.setItem('IsRf', '0');
    localStorage.setItem('CustomerMediaType', this.cmbCustomerMediaType);
    if (this.cmbCustomerMediaType == 'Audio Copyright') {
      this.chkAudio = true;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      this.HeaderName = 'Album';
      this.chkMediaRadio = 'Audio';
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('ContentType', 'MusicMedia');
      localStorage.setItem('IsRf', '0');
    }
    if (this.cmbCustomerMediaType == 'Audio DirectLicence') {
      this.chkAudio = true;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      this.HeaderName = 'Album';
      this.chkMediaRadio = 'Audio';
      this.IsCL = false;
      this.IsRF = true;
      localStorage.setItem('ContentType', 'MusicMedia');
      localStorage.setItem('IsRf', '1');
    }
    if (this.cmbCustomerMediaType == 'Video') {
      this.chkAudio = false;
      this.chkVideo = true;
      this.chkImage = false;
      this.chkUrl=false;
      this.HeaderName = 'Label';
      this.chkMediaRadio = 'Video';
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('ContentType', 'MusicMedia');
      localStorage.setItem('IsRf', '0');
    }
    if (this.cmbCustomerMediaType == 'Signage') {
      this.chkAudio = false;
      this.chkVideo = true;
      this.chkImage = false;
      this.chkUrl=false;
      this.HeaderName = 'Label';
      this.chkMediaRadio = 'Video';
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('ContentType', 'Signage');
      localStorage.setItem('IsRf', '0');
    }
    if (this.cmbCustomerMediaType === 'Signage'){
      this.rdoName = 'Orientation';
    }
    else{
      this.rdoName = 'Genre';
    }
    this.rowSelection = 'multiple';
    this.txtCommonMsg = 'Are you sure to delete?';
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;
    this.txtDeletedFormatName = '';
    this.IsFirstTimeDrag = true;
    this.auth.SetContenType();
    this.playlistform = this.formBuilder.group({
      plName: ['', Validators.required],
      id: [''],
      formatid: ['0'],
    });

    

    if (this.chkMediaRadio == 'Video') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.chkSearchRadio = 'title';
      this.SearchText = '';
      this.Search = false;
      this.SearchText = '';
      this.Search = true;
      this.chkGenre=false;
      this.chkTitle=true;
    }

    if (this.cmbCustomerMediaType == 'Signage') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.chkSearchRadio = 'title';
      this.SearchText = '';
      this.Search = true;
      this.chkGenre=false;
      this.chkTitle=true;
    }
    this.OneTimeFillFormat();
  }

  GetCustomerMediaType(cid) {
    this.loading = true;
    var str = '';
    str = 'GetCustomerMediaType ' + cid;

    this.pService
      .FillCombo(str)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.CustomerMediaTypeList = JSON.parse(returnData);
          var mType= localStorage.getItem('mType')
          if(mType!=null){
            this.cmbCustomerMediaType=mType
            this.onChangeCustomerMediaType(mType)
          }
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

  ManualPlaylist() {
    if (this.formatid == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.IsAutoPlaylistHide = false;
    this.IsOptionButtonHide = false;
    this.flocationElement.nativeElement.focus();
  }
  SelectPlaylist(fileid, event, tids) {
    this.PlaylistSelected = [];
    this.PlaylistSelected.push(fileid);
    this.FillPlaylistSongs(fileid, 'No', 'Yes', tids);
  }
  FillPlaylistSongs(fileid, IsBestOffPlaylist, IsNormal, tids) {
    this.PlaylistSearchText=""
    this.ForceUpdateTokenid = tids;
    if (IsNormal == 'Yes') {
      this.IsNormalPlaylist = true;
    } else {
      this.IsNormalPlaylist = false;
    }
    this.PlaylistSelected = [];
    this.ImageTimeInterval = [];
    this.PlaylistSongsSortList=[];
    this.PlaylistSelected.push(fileid);
    
    this.loading = true;
    this.pService
      .PlaylistSong(fileid, IsBestOffPlaylist)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);

          this.PlaylistSongsList = obj;
          this.MainPlaylistSongsList = obj;
          this.PlaylistSongsSortList = obj;
          if (obj.length > 0) {
            const objImg = this.PlaylistSongsList.filter(
              (order) => order.isImgFind === 'Yes'
            );
            if (objImg.length > 0) {
              this.isImgFind = 'Yes';
            } else {
              this.isImgFind = 'No';
            }
            
            this.PlaylistSongContentType = obj[0].MediaType;
          } else {
            this.PlaylistSongContentType = '';
          }
          this.loading = false;
          this.UpdatePlaylistListArray();
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
  onSubmitPlaylist() {
    this.submittedPlaylistform = true;
    if (this.playlistform.invalid) {
      return;
    }
    if (this.playlistform.value.formatid == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }

    this.loading = true;
    this.pService
      .SavePlaylist(this.playlistform.value)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.IsAutoPlaylistHide = true;
            this.IsOptionButtonHide = true;

            if (this.plLastName == '') {
              this.NewName = this.playlistform.value.plName + '  (0)';
            } else {
              this.NewName =
                this.playlistform.value.plName + '  (' + this.plLastName;
            }
            this.plLastName = '';
            this.SaveModifyInfo(
              0,
              'Playlist is create/modify with name ' +
                this.playlistform.value.plName
            );
            this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
            this.PlaylistSongsList = [];
            this.MainPlaylistSongsList = [];
          } else if (obj.Responce == '2') {
            this.toastr.info('Playlist name already exists', 'Success!');
            this.loading = false;
            this.IsAutoPlaylistHide = true;
            this.IsOptionButtonHide = true;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
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
  SelectSongList(fileid, event) {
    if (event.target.checked) {
      this.SongsSelected.push(fileid);
    } else {
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
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.ForceUpdateTokenid != '') {
      if (this.MainPlaylistSongsList.length == 1) {
        this.toastr.info(
          'This playlist is active and you can not delete all content'
        );
        return;
      }
    }

    if (id == 0) {
      if (this.selectedRowPL.length == 0) {
        this.toastr.info('Please select a title', '');
        return;
      }
      if (this.ForceUpdateTokenid != '') {
        if (this.MainPlaylistSongsList.length == this.selectedRowPL.length) {
          this.toastr.info(
            'This playlist is in used. You cannot empty the content'
          );
          return;
        }
      }
    }
    if (id != 0) {
      this.selectedRowPL = [];
      this.tid.push[id];
    }
    this.modalService.open(mContent);
    this.flocationElement.nativeElement.focus();
  }

  SearchContent() {
    if (this.chkSearchRadio == 'album') {
      this.FillAlbum();
      this.Search = false;
    } else {
      // this.Search = true;
      this.FillSearch();
    }
  }
  SearchRadioClick(e) {
    
    this.AlbumList = [];
    this.selectedRowsIndexes = [];
    this.chkSearchRadio = e;
    this.SearchText = '';
    this.Search = true;
    this.chkExplicit = false;

    this.chkTitle = false;
    this.chkGenre = false;
    this.chkEnergy = false;

    if (this.chkSearchRadio == 'ReleaseDate') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillReleaseDate();
      this.Search = false;
      this.HeaderName2 = 'Release Date';
    }
    if (this.chkSearchRadio == 'BPM') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillBPM();
      this.Search = false;
      this.HeaderName2 = 'BPM';
    }
    if (this.chkSearchRadio == 'EngeryLevel') {
      this.chkEnergy = true;
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillEngeryLevel();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'NewVibe') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillSearch();
      this.Search = true;
      this.HeaderName2 = 'Release Date';
    }
    if (this.chkSearchRadio == 'Genre') {
      this.chkGenre = true;
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillGenre();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'Category') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillCategory();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'Language') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillLanguage();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'Year') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillYear();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'BestOf') {
      this.FillTop50PlaylistList();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'Folder') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillFolder();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'Label') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillLabel();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'BitRate') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillBitRate();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'splPlaylist') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillsplPlaylist();
      this.Search = false;
    }
    if (this.chkSearchRadio == 'title') {
      this.chkTitle = true;
    }
    if (
      this.chkSearchRadio == 'title' ||
      this.chkSearchRadio == 'artist' ||
      this.chkSearchRadio == 'album'
    ) {
      this.SongsList = [];
      this.MainSongsList = [];
      this.FillSongList();
    }
  }
  MediaRadioClick(e) {
    this.SearchText = '';
    this.Search = true;
    this.chkGenre = false;
    if (this.cmbCustomerMediaType === 'Signage'){
      this.rdoName = 'Orientation';
    }
    else{
      this.rdoName = 'Genre';
    }

    if (e == 'Audio') {
      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      this.IsRF = false;
      this.IsCL = false;

      this.chkAudio = true;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('IsRf', '0');
    }
    if (e == 'Video') {
      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      this.chkAudio = false;
      this.chkVideo = true;
      this.chkImage = false;
    }
    if (e == 'Image') {
      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;

      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = true;
    }
    if (e == 'Url') {
      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl=false;
      
      this.chkAudio = false;
      this.chkVideo = false;
      this.chkImage = false;
      this.chkUrl= true;
    }

    if (e == 'Image') {
      this.IsCL = false;
      this.IsRF = false;
      this.rdoName = 'Orientation';
    }
    if (e != 'Image') {
      if (this.IsCL == false && this.IsRF == false) {
        this.IsCL = true;
        localStorage.setItem('IsRf', '0');
      }
    }

    // this.chkTitle = false;
    // this.chkArtist = false;
    if (e == 'CL') {
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('IsRf', '0');
    } else if (e == 'RF') {
      this.IsRF = true;
      this.IsCL = false;
      localStorage.setItem('IsRf', '1');
    } else {
      this.chkMediaRadio = e;
    }
    if (this.chkMediaRadio == 'Video') {
      this.IsCL = true;
      this.IsRF = false;
      localStorage.setItem('IsRf', '0');
    }
    if (this.chkMediaRadio == 'Audio' && this.IsCL == true) {
      this.HeaderName = 'Album';
    } else if (this.chkMediaRadio == 'Image') {
      this.HeaderName = 'Folder';
    } else {
      this.HeaderName = 'Label';
    }

    this.SongsList = [];
    this.MainSongsList = [];
    if (this.OldValue == 'Image') {
      this.chkSearchRadio = 'title';
    }

    this.OldValue = this.chkMediaRadio;

    if (this.chkMediaRadio == 'Image' && this.chkSearchRadio != 'Folder') {
      this.chkSearchRadio = 'title';
    }
    if (
      this.IsRF == true &&
      (this.chkSearchRadio == 'Folder' || this.chkSearchRadio == 'NewVibe')
    ) {
      this.chkSearchRadio = 'title';
    }
    this.SearchRadioClick(this.chkSearchRadio);
  }

  FillAlbum() {
    this.loading = true;
    var qry =
      "spSearch_Album_Copyright '" +
      this.SearchText +
      "', " +
      localStorage.getItem('IsRf') +
      ",'" +
      this.chkMediaRadio +
      "','" +
      localStorage.getItem('DBType') +
      "'";

    this.pService
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
  FillEngeryLevel() {
    var qry =
      "select cast(EngeryLevel as nvarchar(20)) +' Star' as DisplayName, EngeryLevel as Id from titles  ";
    qry =
      qry +
      " where EngeryLevel is not null and mediatype='" +
      this.chkMediaRadio +
      "' and IsRoyaltyFree = " +
      localStorage.getItem('IsRf') +
      ' ';
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    qry = qry + ' group by EngeryLevel order by EngeryLevel ';

    this.pService
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
  FillReleaseDate() {
    this.loading = true;
    var qry =
      "select FORMAT(ReleaseDate,'MMM')+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as DisplayName ,";
    qry =
      qry +
      " cast(month(ReleaseDate) as nvarchar(10))+'-'+ cast(year(ReleaseDate) as nvarchar(10)) as Id , month(ReleaseDate) as rMonth ";
    qry =
      qry +
      " from titles where ReleaseDate is not null and mediatype='" +
      this.chkMediaRadio +
      "' and IsRoyaltyFree = " +
      localStorage.getItem('IsRf') +
      ' ';
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    qry =
      qry +
      " group by year(ReleaseDate), month(ReleaseDate), FORMAT(ReleaseDate,'MMM')";
    qry = qry + ' order by year(ReleaseDate) desc, month(ReleaseDate) desc';

    this.pService
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
    this.loading = true;
    var dbtype = localStorage.getItem('DBType');
    var qry =
      "GetBPM '" +
      this.chkMediaRadio +
      "' ,  " +
      localStorage.getItem('IsRf') +
      ', ' +
      dbtype;

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.AlbumList = JSON.parse(returnData);

          var ArrayItem = {};
          if (this.chkSearchRadio == 'BPM') {
            ArrayItem['Id'] = '-7777';
            ArrayItem['DisplayName'] = 'Custom Search';
            ArrayItem['check'] = false;
            this.AlbumList.push(ArrayItem);
          }

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


  FillsplPlaylist() {
    this.loading = true;
    var qry = "select PlaylistID as Id , name  as DisplayName from Playlists where isPredefined=1 and Description='splPlaylist' order by name"
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.SpecialPlaylistList = JSON.parse(returnData);
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

  FillBitRate() {
    this.loading = true;
    var qry = 'select  bitrate as DisplayName, bitrate as Id from titles ';
    qry = qry + " where bitrate is not null and bitrate !='' ";
    qry = qry + " and mediatype='" + this.chkMediaRadio + "' ";
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    if (this.chkMediaRadio != 'Image') {
      qry = qry + ' and IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }
    if (this.auth.ContentType$ == 'Signage') {
      qry = qry + ' and titles.GenreId in(303,297, 325,324,326) ';
    }
    if (
      this.chkMediaRadio == 'Image' &&
      this.auth.ContentType$ == 'MusicMedia'
    ) {
      qry = qry + ' and tbGenre.GenreId=326 ';
    }
    qry = qry + ' group by bitrate order by bitrate ';
    this.pService
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
  FillGenre() {
    this.loading = true;
    var qry =
      'select tbGenre.GenreId as Id, genre as DisplayName  from tbGenre ';
    qry = qry + ' inner join Titles tit on tit.genreId= tbGenre.genreId ';
    qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    qry =
      qry +
      " and (tit.dbtype='" +
      localStorage.getItem('DBType') +
      "' or tit.dbtype='Both') ";
    if (this.chkMediaRadio != 'Image') {
      qry =
        qry + ' and tit.IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }

    if (this.chkMediaRadio == 'Image') {
      qry = qry + ' and tbGenre.GenreId in(325,324,326) ';
    }
    else if (this.chkMediaRadio == 'Url') {
      qry = qry + ' and tbGenre.GenreId in(495,496) ';
    } else {
      if (this.auth.ContentType$ == 'Signage') {
        qry = qry + ' and tbGenre.GenreId in(297,303) ';
      }
    }
    qry = qry + ' group by tbGenre.GenreId,genre ';
    qry = qry + ' order by genre ';
    this.pService
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
  FillFolder() {
    this.loading = true;
    var qry =
      'select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ';
    qry = qry + ' inner join Titles tit on tit.folderId= tbFolder.folderId ';

    qry = qry + " where tit.mediatype='" + this.chkMediaRadio + "' ";
    if (this.auth.IsAdminLogin$.value == false) {
      qry =
        qry +
        ' and (tit.dfclientid= ' +
        this.cmbCustomer +
        ' or tit.dfclientid= ' +
        localStorage.getItem('dfClientId') +
        ')';
    } else {
      qry = qry + ' and tit.dfclientid= ' + this.cmbCustomer + '';
    }
    qry =
      qry +
      " and (tit.dbtype='" +
      localStorage.getItem('DBType') +
      "' or tit.dbtype='Both') ";
    if (this.chkMediaRadio != 'Image') {
      qry =
        qry + ' and tit.IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }
    if (this.chkMediaRadio == 'Image') {
      qry = qry + ' and tit.GenreId in(325,324,326) ';
    }
    if ((this.cmbCustomerMediaType == 'Signage') && (this.chkMediaRadio == 'Video')) {
      qry = qry + ' and tit.GenreId in(303,297) ';
    }
    if (this.chkMediaRadio == 'Url') {
      qry = qry + ' and tit.GenreId in(496,495) ';
    }
    qry = qry + ' group by tbFolder.folderId,tbFolder.foldername ';
    qry = qry + ' order by tbFolder.foldername ';
    this.pService
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

  FillLanguage() {
    this.loading = true;
    var qry = 'select  Language as Id,  Language as DisplayName  from titles ';
    qry =
      qry +
      " where Language is not null  and Language!='' and IsRoyaltyFree = " +
      localStorage.getItem('IsRf') +
      ' ';
    qry = qry + " and titles.mediatype='" + this.chkMediaRadio + "' ";
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    qry = qry + ' group by Language order by Language ';
    this.pService
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

  FillYear() {
    this.loading = true;
    var qry =
      'select  TitleYear as Id,  TitleYear as DisplayName  from titles ';
    qry =
      qry +
      ' where TitleYear is not null and TitleYear!=0 and IsRoyaltyFree = ' +
      localStorage.getItem('IsRf') +
      ' ';
    qry = qry + " and titles.mediatype='" + this.chkMediaRadio + "' ";
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    qry = qry + ' group by TitleYear order by TitleYear desc';
    this.pService
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
  FillCategory() {
    this.loading = true;
    var qry = 'select  acategory as DisplayName, acategory as Id from titles ';
    qry =
      qry +
      ' where acategory is not null and IsRoyaltyFree = ' +
      localStorage.getItem('IsRf') +
      ' ';
    if (this.chkMediaRadio == 'Audio') {
      qry =
        qry +
        " and acategory not like '%video%' and acategory not like '%MP4%' ";
    } else if (this.chkMediaRadio == 'Video') {
      qry =
        qry + " and ( acategory like '%video%' or acategory like '%mp4%' ) ";
    } else {
      qry = qry + " and ( acategory like '%Image%') ";
    }
    qry = qry + ' group by acategory order by acategory ';

    this.pService
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
  onChangeAlbum(id, mContent) {
    this.selectedRowsIndexes=[];
    if (id == '-7777') {
      this.txtSearch1 = '';
      this.txtSearch2 = '';
      this.modalService.open(mContent);
      return;
    }
if (id=="0"){
  this.SongsList = [];
  this.MainSongsList = []
  return
}
    this.SearchText = id;
    if (id == '318') {
      this.chkExplicit = true;
    } else {
      this.chkExplicit = false;
    }
    this.FillSearch();
  }
  FillSearch() {
    this.PageNo = 1;
    if (this.chkSearchRadio != 'NewVibe') {
      if (this.SearchText == '') {
        this.FillSongList();
        return;
      }
    }
    
    
    this.loading = true;
    this.pService
      .CommanSearch(
        this.chkSearchRadio,
        this.SearchText,
        this.chkMediaRadio,
        this.chkExplicit,
        '1',
        this.cmbCustomer
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.SongsList = obj;
          this.MainSongsList =obj
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
  FillSongList() {
   /* if (this.auth.ContentType$ == 'Signage' && this.chkMediaRadio == 'Video') {
      this.SongsList = [];
      this.MainSongsList = [];
      this.chkSearchRadio = 'title';
      this.chkGenre = false;
      this.SearchText = '';
      this.Search = true;
      this.SearchRadioClick(this.chkSearchRadio);
      this.FillTop50PlaylistList();
    } else {
     */ 
      
      this.selectedRowsIndexes = [];
      this.loading = true;
      this.pService
        .FillSongList(this.chkMediaRadio, this.chkExplicit, this.cmbCustomer)
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            this.SongsList = obj;
            this.MainSongsList = obj
            this.loading = false;
            
            this.FillTop50PlaylistList();
          },
          (error) => {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
        );
    //}
  }
  FillFormat() {
    this.loading = true;
    var qry = '';

    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    } else {
    }
    qry = '';
    qry =
      'select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid';
    qry =
      qry +
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithEvent,0)=0 and ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cmbCustomer +
      ' OR sf.dfclientid=' +
      this.cmbCustomer +
      ") and sf.mediatype='" +
      this.cmbCustomerMediaType +
      "' group by  sf.formatname";

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.CopyFormatList = this.FormatList;
          this.CopyFormatListClone = this.FormatList;
          this.PlaylistLibrary = [];
          this.loading = false;
          //  this.FillSongList();
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
  GetJSONRecord = (array): void => {
    this.NewList = this.FormatList.filter((order) => order.Id == array.Id);
  };
  onChangeFormat(id, l) {
    var ArrayItem = {};
    var fName = '';
    ArrayItem['Id'] = id;
    ArrayItem['DisplayName'] = '';
    this.GetJSONRecord(ArrayItem);
    if (this.NewList.length > 0) {
      fName = this.NewList[0].DisplayName;
    }
    this.formatid = id;
    this.txtDeletedFormatName = fName;
    this.playlistform = this.formBuilder.group({
      plName: ['', Validators.required],
      id: [''],
      formatid: [this.formatid],
    });
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.PlaylistSongsList = [];
    this.MainPlaylistSongsList = [];
    if (this.formatid == '') {
      return;
    }
    if (this.formatid == '0') {
      return;
    }
    this.RefillCopyFormat(id);
    this.PlaylistLibrary = [];
    this.FillPlaylist(id);
    this.CancleManual();
  }
  RefillCopyFormat(id) {
    this.CopyFormatList = [];
    this.CopyFormatList = this.CopyFormatListClone.filter(
      (order) => order.Id != id
    );
  }
  FillPlaylist(id) {
    this.PlaylistList = [];
    this.MainPlaylistList = [];
    this.loading = true;
    this.pService
      .Playlist(id)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          this.PlaylistList = JSON.parse(returnData);
          this.MainPlaylistList = JSON.parse(returnData);
          this.loading = false;
          const obj: SortEvent = {
            column: 'DisplayName',
            direction: 'asc',
          };
          setTimeout(() => {
            this.onSort(obj);
          }, 500);

          setTimeout(() => {
            if (this.PlaylistList.length > 0) {
              if (this.NewName !== '') {
                const NewPlList = this.PlaylistList.filter(
                  (order) => order.DisplayName === this.NewName
                );
                this.PlaylistList.forEach((student) => {
                  if (student.Id === NewPlList[0].Id) {
                    student.check = true;
                  } else {
                    student.check = false;
                  }
                });
                this.NewName = '';
                this.SelectPlaylist(NewPlList[0].Id, '', NewPlList[0].tokenIds);
              } else {
                this.PlaylistSelected = [];
                  this.PlaylistSelected.push(this.PlaylistList[0].Id);
                  this.PlaylistList.forEach(item => {
                  
                  if (item["Id"]=== this.PlaylistSelected[0]){
                    item["check"]=true
                  }
                  else{
                    item["check"]=false
                  }
                });
                this.SelectPlaylist(
                  this.PlaylistList[0].Id,
                  '',
                  this.PlaylistList[0].tokenIds
                );
              }
            }
          }, 700);
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
  AddFormat(id, plName, isBestOff) {
    if (this.formatid == '') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.formatid == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.pService
      .SavePlaylistFromBestOf(id, plName, this.formatid, isBestOff)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.SaveModifyInfo(
              0,
              'Special playlist ('+plName+') is added in campaign' 
            );
            this.loading = false;
            this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
            this.PlaylistSongsList = [];
            this.MainPlaylistSongsList = [];
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
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
  onPlaylistClick(id, pname) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.IsAutoPlaylistHide = false;
    this.IsOptionButtonHide = false;
    var plName = pname.split('(');
    this.plLastName = plName[1].trim();
    this.playlistform = this.formBuilder.group({
      plName: [plName[0].trim(), Validators.required],
      id: [id],
      formatid: [this.formatid],
    });
  }
  AddSong(UpdateModel) {
    var NewList = [];
    var h = this.PlaylistSelected[0];
    NewList = this.PlaylistList.filter((order) => order.Id === h);
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (
      this.PlaylistSongContentType == 'Audio' &&
      NewList[0].IsMixedContent == false &&
      (this.chkMediaRadio == 'Video' || this.chkMediaRadio == 'Image')
    ) {
      this.toastr.info(
        "You cannot add Video/Images content in this playlist directly. First you need to set 'MIXED' content in playlist settings.",
        ''
      );
      return;
    }
    if (
      this.PlaylistSongContentType == 'Video' &&
      NewList[0].IsMixedContent == false &&
      this.chkMediaRadio == 'Audio'
    ) {
      this.toastr.info(
        "You cannot add audio content in this playlist directly. First you need to set 'MIXED' content in playlist settings.",
        ''
      );
      return;
    }
    if (
      this.PlaylistSongContentType == 'Image' &&
      NewList[0].IsMixedContent == false &&
      this.chkMediaRadio == 'Audio'
    ) {
      this.toastr.info(
        "You cannot add audio content in this playlist directly. First you need to set 'MIXED' content in playlist settings.",
        ''
      );
      return;
    }
    this.getSelectedRows();
    if (this.PlaylistSelected.length == 0) {
      this.toastr.error('Please select a playlist', '');
      return;
    }
    if (this.SongsSelected.length == 0) {
      this.toastr.error('Select atleast one content', '');
      return;
    }

    this.loading = true;
    this.pService
      .AddPlaylistSong(
        this.PlaylistSelected,
        this.SongsSelected,
        'SFPlaylist',
        NewList[0].IsDuplicate
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.loading = false;
          if (obj.Responce == '1') {
            this.SelectPlaylist(
              this.PlaylistSelected[0],
              '',
              this.ForceUpdateTokenid
            );
            let pl= this.MainPlaylistList.filter(fId => fId.Id === this.PlaylistSelected[0])
            let pln= pl[0].DisplayName.split('(')
            this.SaveModifyInfo(
              0,
              'New content is added in playlist ('+trim(pln[0])+') '
            );
            if (this.ForceUpdateTokenid != '') {
            }
            this.GetPlaylistContenSize()
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
          this.checkboxes.forEach((element) => {
            element.nativeElement.checked = false;
          });
          this.selectedRowsIndexes = [];
          this.SongsSelected = [];
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
  PublishModal(UpdateModel) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.ForceUpdateTokenid != '') {
      this.modalService.open(UpdateModel, { centered: true });
    }
    else{
      this.toastr.info('This playlist is not assigned to any location');
      return;      
    }
    this.flocationElement.nativeElement.focus();
  }

  getSelectedRowsPL() {
    this.tid = [];

    for (var val of this.selectedRowPL) {
      
      var k = this.PlaylistSongsList[val].sId;
      this.tid.push(k);
    }
  }
  DeleteTitle(UpdateModel) {
    if (this.selectRowsPL.length > 0) {
      this.getSelectedRowsPL();
    }

   

    this.loading = true;
    this.pService
      .DeleteTitle(this.PlaylistSelected[0], this.tid, 'No')
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.tid = [];
            this.selectedRowPL = [];
            this.PlaylistSearchText="";
            this.PlaylistSongsList = [];
            this.MainPlaylistSongsList=[]
            this.SelectPlaylist(
              this.PlaylistSelected[0],
              '',
              this.ForceUpdateTokenid
            );
            let pl= this.MainPlaylistList.filter(fId => fId.Id === this.PlaylistSelected[0])
            let pln= pl[0].DisplayName.split('(')
            this.SaveModifyInfo(
              0,
              'Content is deleted from playlist ('+trim(pln[0])+')'
            );
            if (this.ForceUpdateTokenid != '') {
              // this.modalService.open(UpdateModel, { centered: true });
            }
            this.GetPlaylistContenSize()
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.SearchContent();
    }
  }
  FillTop50PlaylistList() {
    this.loading = true;
    var qry =
      'GetBestPlaylist ' +
      localStorage.getItem('IsRf') +
      ",'" +
      localStorage.getItem('DBType') +
      "'";
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.Top50PlaylistList = JSON.parse(returnData);
          this.loading = false;
          //this.FillCopyFormat();
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
  onPlaylistDeleteClick(mContent) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.txtMsg = '';
    this.txtCommonMsg = 'Are you sure to delete?';
    this.modalService.open(mContent);
  }
  DeletePlaylist(forceDelete) {
    this.loading = true;
    this.pService
      .DeletePlaylist(this.pid, forceDelete)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.SaveModifyInfo(
              0,
              'Playlist is deleted.'
            );
            this.loading = false;
            this.FillPlaylist(this.formatid);
            this.modalService.dismissAll();
          } else if (obj.Responce == '2') {
            this.txtCommonMsg = '';
            this.txtMsg =
              'This playlist cannot be deleted, as it is assigned to tokens';
            this.loading = false;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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
  FillPlaylistLibrary(id) {
    this.loading = true;
    var qry =
      'GetPlaylistLibrary_new ' + localStorage.getItem('IsRf') + ',' + id;

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);

          this.PlaylistLibrary = JSON.parse(returnData);
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

  openFormatModal(mContent) {
    if (this.cmbCustomer === '0') {
      this.toastr.info('Please select customer name', '');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.cmbCustomerMediaType === '') {
      this.toastr.info('Please select media type', '');
      return;
    }

    this.NewFormatName = '';
    this.NewFormatName = this.txtDeletedFormatName;
    this.modalService.open(mContent);
    this.flocationElement.nativeElement.focus();
  }
  onSubmitNewFormat() {
    if (this.NewFormatName == '') {
      this.toastr.info('Campaign name cannot be blank', '');
      return;
    }

    this.pService
      .SaveFormat(
        this.formatid,
        this.NewFormatName,
        this.cmbCustomer,
        this.cmbCustomerMediaType
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce != '-2') {
            this.toastr.info('Saved', 'Success!');

            this.loading = false;
            if (this.txtDeletedFormatName == '') {
              this.SaveModifyInfo(
                0,
                'New campaign is create with name ' + this.NewFormatName
              );
            } else {
              this.SaveModifyInfo(
                0,
                'Campaign is modify. Now New name is ' + this.NewFormatName
              );
            }
            this.formatid = '0';
            this.txtDeletedFormatName = '';
            this.PlaylistList = [];
            this.MainPlaylistList = [];
            this.PlaylistSongsList = [];
            this.FillFormat();
          } else if (obj.Responce == '-2') {
            this.toastr.info('This campaign name already exists', '');
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
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
  plChange() {
    if (this.IsFirstTimeDrag == true) {
      this.IsFirstTimeDrag = false;
      this.ArrayLoop();
    }
  }
  onPlaylistSettingClick(
    id,
    mContent,
    chkMu,
    chkFixed,
    Mixed,
    tids,
    spName,
    Duplicate, volume, playlistSize
  ) {
    this.pid = id;
    this.txtDelPer = '0';
    this.chkMute = chkMu;
    this.chkFixed = chkFixed;
    this.chkMixed = Mixed;
    this.ForceUpdateTokenid = tids;
    this.GetPlaylistContenSize_spl(id)

    var pName = spName.split('(');
    var pLastName = pName[1].trim();
    this.SettingPname = pName[0].trim() + '  (' + pLastName;

    this.chkDuplicate = Duplicate;
    this.cmbVolume= volume;
    this.modalService.open(mContent);
  }
  SettingPlaylist(UpdateModel) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.pService
      .SettingPlaylist(
        this.pid,
        this.chkMute,
        this.chkFixed,
        this.chkMixed,
        this.chkDuplicate, this.cmbVolume
      )
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            const params = JSON.stringify({ playlistid: this.pid, Mute:this.chkMute, Fixed:this.chkFixed, Mixed: this.chkMixed, chkDuplicate: this.chkDuplicate });
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.NewName = this.SettingPname;
            this.SaveModifyInfo(
              0,
              'Playlist setting is changed with these values ' +
              params
            );
            this.FillPlaylist(this.formatid);
            if (this.ForceUpdateTokenid != '') {
              this.modalService.open(UpdateModel, { centered: true });
            }
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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

  selectWithShift(rowIndex) {
    var lastSelectedRowIndexInSelectedRowsList =
      this.selectedRowsIndexes.length - 1;
    var lastSelectedRowIndex = this.selectedRowsIndexes[
      lastSelectedRowIndexInSelectedRowsList
    ];
    var selectFromIndex = Math.min(rowIndex, lastSelectedRowIndex);
    var selectToIndex = Math.max(rowIndex, lastSelectedRowIndex);
    this.selectRows(selectFromIndex, selectToIndex);
  }
  selectRows(selectFromIndex, selectToIndex) {
    for (
      var rowToSelect = selectFromIndex;
      rowToSelect <= selectToIndex;
      rowToSelect++
    ) {
      this.select(rowToSelect);
    }
  }
  setMultipleClickedRow = function (event, index, songLst, lock) {
    if (event.ctrlKey) {
      // this.selectedRowsIndexes=[];
      this.changeSelectionStatus(index);
    } else if (event.shiftKey) {
      this.selectWithShift(index);
    } else {
      this.selectedRowsIndexes = [index];
    }
    return;
  };

  changeSelectionStatus(rowIndex) {
    if (this.isRowSelected(rowIndex)) {
      this.unselect(rowIndex);
    } else {
      this.select(rowIndex);
    }
  }

  isRowSelected(rowIndex) {
    return this.selectedRowsIndexes.indexOf(rowIndex) > -1;
  }
  unselect(rowIndex) {
    var rowIndexInSelectedRowsList = this.selectedRowsIndexes.indexOf(rowIndex);
    var unselectOnlyOneRow = 1;
    this.selectedRowsIndexes.splice(
      rowIndexInSelectedRowsList,
      unselectOnlyOneRow
    );
  }
  select(rowIndex) {
    if (!this.isRowSelected(rowIndex)) {
      this.selectedRowsIndexes.push(rowIndex);
    }
  }

  moveUp = function (num) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (num > 0) {
      var tmp = this.PlaylistSongsList[num - 1];
      var tmpPL = this.plArray[num - 1];

      this.PlaylistSongsList[num - 1] = this.PlaylistSongsList[num];
      this.plArray[num - 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;

      this.ArrayLoop();
      this.selectedRow--;
      this.selectedRowPL = [];
      this.selectPL(this.selectedRow);
    }
    this.UpdateSRNo('','');
  };
  moveDown = function (num) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (num < this.PlaylistSongsList.length - 1) {
      var tmp = this.PlaylistSongsList[num + 1];
      var tmpPL = this.plArray[num + 1];

      this.PlaylistSongsList[num + 1] = this.PlaylistSongsList[num];
      this.plArray[num + 1] = this.plArray[num];

      this.PlaylistSongsList[num] = tmp;
      this.plArray[num] = tmpPL;
      this.ArrayLoop();
      this.selectedRow++;
      this.selectedRowPL = [];
      this.selectPL(this.selectedRow);
    }
    this.UpdateSRNo('','');
  };
  setClickedRow(i) {
    this.selectedRow = i;
  }
  ArrayLoop() {
    this.plArray = [];
    var srno = 1;
    for (let prop in this.PlaylistSongsList) {
      this.plArray.push({
        index: srno,
        titleid: this.PlaylistSongsList[prop].id,
        id: this.PlaylistSongsList[prop].sId,
      });
      srno++;
    }
  }
  UpdateSRNo(UpdateModel,IsFillPlaylist) {
    if (this.plArray.length == 0) {
      return;
    }

    this.loading = true;
    this.pService
      .UpdatePlaylistSRNo(this.PlaylistSelected, this.plArray)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            //this.toastr.info("Saved", 'Success!');
            this.loading = false;
            if (this.ForceUpdateTokenid != '') {
              //   this.modalService.open(UpdateModel, { centered: true });
            }

            let pl= this.MainPlaylistList.filter(fId => fId.Id === this.PlaylistSelected[0])
            let pln= pl[0].DisplayName.split('(')
            this.SaveModifyInfo(
              0,
              'Content sequence is changed for playlist ('+trim(pln[0])+') '
            );


            if (IsFillPlaylist=="Yes"){
              
              this.SelectPlaylist(this.PlaylistSelected[0],'','');
            }
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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

  SaveModifyInfo(tokenid, ModifyText) {
    this.pService
      .SaveModifyLogs(tokenid, ModifyText)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
        },
        (error) => {}
      );
  }
  openModel(content) {
    if (this.formatid == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    localStorage.setItem('FormatID', this.formatid);
    localStorage.setItem('AutoClientId', this.cmbCustomer);
    this.modalService.open(content, { size: 'lg' });
    this.flocationElement.nativeElement.focus();
  }
  ModelClose() {
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;

    this.onChangeFormat(this.formatid, this.txtDeletedFormatName);
    this.modalService.dismissAll();
  }
  openDeleteFormatModal(content) {
    if (this.formatid == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.txtCommonMsg = 'Are you sure to delete?';
    this.txtMsg = '';
    this.DeleteFormatid = this.formatid;
    this.modalService.open(content);
    this.flocationElement.nativeElement.focus();
  }

  DeleteFormat(IsForceDelete) {
    this.submittedPlaylistform = true;
    this.loading = true;
    this.pService
      .DeleteFormat(this.DeleteFormatid, IsForceDelete)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.SaveModifyInfo(
              0,
              'Campaign is deleted. CampaignName: ' +
                this.txtDeletedFormatName +
                ' and unique id :' +
                this.formatid
            );
            this.formatid = '0';
            this.DeleteFormatid = '0';
            this.txtMsg = '';
            this.FillFormat();
            this.PlaylistList = [];
            this.MainPlaylistList = [];
            this.PlaylistSongsList = [];
            this.modalService.dismissAll('Cross click');
          } else if (obj.Responce == '2') {
            this.txtMsg =
              'This campaign cannot be deleted, as it is assigned to tokens';
            this.txtCommonMsg = '';
            this.loading = false;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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
  FillTokenInfo(formatid, playlistid) {
    this.TokenList = [];
    this.loading = true;
    this.pService
      .FillTokenInfo_formatANDplaylist(formatid, playlistid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);

          this.TokenList = JSON.parse(returnData);
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
  ViewTokens(modal, modalname, HitType) {
    this.IsDownloadModal=false
    if (HitType=="Download"){
      if (this.PlaylistSelected.length == 0) {
        this.toastr.info('Please select playlist');
        return;
      }
      this.pid= this.PlaylistSelected[0]
      this.IsDownloadModal=true
    }
    this.IsVolumeLevelModal=false
    this.modalService.open(modal, { size: 'lg' });
    if (modalname == 'Format') {
      this.FillTokenInfo(this.formatid, 0);
    }
    if (modalname == 'Playlist') {
      this.FillTokenInfo(0, this.pid);
    }
    this.flocationElement.nativeElement.focus();
  }

  UpdatePlaylistListArray() {
    this.PlaylistList.forEach((student) => {
      if (student.Id === this.PlaylistSelected[0]) {
        var dn = student.DisplayName.split('(');
        student.DisplayName =
          dn[0] + ' (' + this.PlaylistSongsList.length + ')';
      }
    });
  }

  FillCopyFormat() {
    this.loading = true;
    var qry = '';
    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    } else {
      qry =
        'FillFormat ' +
        this.cmbCustomer +
        ",'" +
        localStorage.getItem('DBType') +
        "'";
    }
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          // this.CopyFormatList = JSON.parse(returnData);
          // this.CopyFormatListClone = JSON.parse(returnData);
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

  onChangeCopyFormat(id) {
    this.CopyFormatId = id;
    this.FillPlaylistLibrary(id);
  }

  Copyformat() {
    if (this.formatid == '0') {
      this.toastr.info('Please select a campaign name. Where you want to copy');
      return;
    }
    if (this.CopyFormatId == '0') {
      this.toastr.info('Please select a campaign name. Which you want to copy');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;

    this.pService
      .CopyFormat(this.formatid, this.CopyFormatId, this.cmbCustomer)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.SaveModifyInfo(0, 'Campaign copied');
            this.formatid = '0';
            this.CopyFormatId = '0';
            this.PlaylistList = [];
            this.MainPlaylistList = [];
            this.PlaylistSongsList = [];
            this.PlaylistLibrary = [];
            this.FillFormat();
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
          }
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

  onDeletePercentageClick(mContent) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.modalService.open(mContent);
  }

  DeleteTitlePercentage() {
    this.loading = true;
    this.pService
      .DeleteTitlePercentage(this.pid, this.txtDelPer)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.SaveModifyInfo(
              0,
              'Content is delete from playlist('+this.pid+') with percentage  ' +
                this.txtDelPer
            );
            this.loading = false;
            this.SelectPlaylist(this.pid, '', this.ForceUpdateTokenid);
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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

    var qry = 'select  label as DisplayName, label as Id from titles ';
    qry = qry + " where label is not null and label !='' ";
    qry = qry + " and mediatype='" + this.chkMediaRadio + "' ";
    qry =
      qry +
      " and (titles.dbtype='" +
      localStorage.getItem('DBType') +
      "' or titles.dbtype='Both') ";
    if (this.chkMediaRadio != 'Image') {
      qry = qry + ' and IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }
    if (this.auth.ContentType$ == 'Signage') {
      qry = qry + ' and titles.GenreId in(303,297, 325,324,326) ';
    }
    if (
      this.chkMediaRadio == 'Image' &&
      this.auth.ContentType$ == 'MusicMedia'
    ) {
      qry = qry + ' and tbGenre.GenreId=326 ';
    }
    qry = qry + ' group by label order by label ';
    this.pService
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
  OnChangeExplicit(event) {
    const checked = event.target.checked;
    this.SearchRadioClick(this.chkSearchRadio);
  }
  CancleManual() {
    this.plLastName = '';
    this.playlistform.get('plName').setValue('');
    this.IsAutoPlaylistHide = true;
    this.IsOptionButtonHide = true;
  }
  EditImage(e, i, tName) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.enableEdit = true;
    this.enableEditIndex = i;
    this.txtTitle = tName;
  }
  UpdateTitleName(id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.loading = true;
    this.pService
      .UpdateContent(id, this.txtTitle)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            for (var i = 0; i < this.SongsList.length; i++) {
              if (this.SongsList[i].id == id) {
                this.SongsList[i].title = this.txtTitle;
                break;
              }
            }
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.enableEdit = false;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            this.enableEdit = false;
          }
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
          this.enableEdit = false;
        }
      );
  }
  UpdateCancleTitleName() {
    this.enableEdit = false;
  }

  onScrollDown() {
    
    this.PageNo += 1;
    this.appendItems();
  }
  appendItems() {
    
    
    this.loading = true;
    this.pService
      .CommanSearch(
        this.chkSearchRadio,
        this.SearchText,
        this.chkMediaRadio,
        this.chkExplicit,
        this.PageNo,
        this.cmbCustomer
      )
      .pipe()
      .subscribe(
        (data) => {
          // var prvList= this.SongsList;

          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          for (var i = 0; i < obj.length; i++) {
            this.SongsList.push(obj[i])
          }
          //this.SongsList =obj;
          this.MainSongsList =this.SongsList;

          this.loading = false;
          //
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

  isRowSelectedPL(rowIndex) {
    return this.selectedRowPL.indexOf(rowIndex) > -1;
  }
  setMultipleClickedRowPL = function (event, index, songLst, lock) {
    if (event.ctrlKey) {
      this.changeSelectionStatusPL(index);
    } else if (event.shiftKey) {
      this.selectWithShiftPL(index);
    } else {
      this.selectedRowPL = [index];
    }
    this.selectedRow = index;
    console.log(songLst)
    return;
  };

  changeSelectionStatusPL(rowIndex) {
    if (this.isRowSelectedPL(rowIndex)) {
      this.unselectPL(rowIndex);
    } else {
      this.selectPL(rowIndex);
    }
  }
  selectWithShiftPL(rowIndex) {
    var lastSelectedRowIndexInSelectedRowsList = this.selectedRowPL.length - 1;
    var lastSelectedRowIndex = this.selectedRowPL[
      lastSelectedRowIndexInSelectedRowsList
    ];
    var selectFromIndex = Math.min(rowIndex, lastSelectedRowIndex);
    var selectToIndex = Math.max(rowIndex, lastSelectedRowIndex);
    this.selectRowsPL(selectFromIndex, selectToIndex);
  }
  selectRowsPL(selectFromIndex, selectToIndex) {
    for (
      var rowToSelect = selectFromIndex;
      rowToSelect <= selectToIndex;
      rowToSelect++
    ) {
      this.selectPL(rowToSelect);
    }
  }

  unselectPL(rowIndex) {
    var rowIndexInSelectedRowsList = this.selectedRowPL.indexOf(rowIndex);
    var unselectOnlyOneRow = 1;
    this.selectedRowPL.splice(rowIndexInSelectedRowsList, unselectOnlyOneRow);
  }
  selectPL(rowIndex) {
    if (!this.isRowSelectedPL(rowIndex)) {
      this.selectedRowPL.push(rowIndex);
    }
  }

  PLShuffle(UpdateModel) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.PlaylistSongsList.length == 0) {
      return;
    }

    var deck = Shuffle.shuffle({ deck: this.PlaylistSongsList });
    this.PlaylistSongsList = [];
    this.PlaylistSongsList = deck.cards;
    this.plArray = [];
    var srno = 1;
    for (let prop in this.PlaylistSongsList) {
      this.plArray.push({
        index: srno,
        titleid: this.PlaylistSongsList[prop].id,
        id: this.PlaylistSongsList[prop].sId,
      });
      srno++;
    }

    this.UpdateSRNo(UpdateModel,'');
    this.flocationElement.nativeElement.focus();
  }

  CustomSearch() {
    if (this.txtSearch1 == '') {
      this.toastr.info('Please enter the search values', '');
      return;
    }
    if (this.txtSearch2 == '') {
      this.toastr.info('Please enter the search values', '');
      return;
    }

    this.SearchText = this.txtSearch1 + '-' + this.txtSearch2;
    var ArrayItem = {};

    var aList = this.AlbumList.filter((order) => order.Id != '-7777');

    this.AlbumList = [];
    this.AlbumList = aList;

    ArrayItem = {};
    ArrayItem['Id'] = this.txtSearch1 + '-' + this.txtSearch2;
    ArrayItem['DisplayName'] = this.txtSearch1 + '-' + this.txtSearch2;
    ArrayItem['check'] = true;
    this.AlbumList.push(ArrayItem);

    ArrayItem = {};
    ArrayItem['Id'] = '-7777';
    ArrayItem['DisplayName'] = 'Custom Search';
    ArrayItem['check'] = false;
    this.AlbumList.push(ArrayItem);

    this.FillSearch();
    this.modalService.dismissAll();
  }

  CloseCommonSearch() {
    this.SearchRadioClick(this.chkSearchRadio);
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  OneTimeFillFormat() {
    this.loading = true;
    var qry = '';

    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    } else {
    }
    qry = '';
    qry =
      'select max(sf.Formatid) as id , sf.formatname as displayname from tbSpecialFormat sf left join tbSpecialPlaylistSchedule_Token st on st.formatid= sf.formatid';
    qry =
      qry +
      ' left join tbSpecialPlaylistSchedule sp on sp.pschid= st.pschid  where isnull(LinkWithEvent,0)=0 and  ';
    qry =
      qry +
      " (dbtype='" +
      localStorage.getItem('DBType') +
      "' or dbtype='Both') and  (st.dfclientid=" +
      this.cmbCustomer +
      ' OR sf.dfclientid=' +
      this.cmbCustomer +
      ") and sf.mediatype='" +
      this.cmbCustomerMediaType +
      "' group by  sf.formatname";

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.FormatList = JSON.parse(returnData);
          this.CopyFormatList = JSON.parse(returnData);
          this.CopyFormatListClone = this.CopyFormatList;
          this.loading = false;
          this.OneTimeFillCopyFormat();
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

  OneTimeFillCopyFormat() {
    this.loading = true;
    var qry = '';
    if (this.auth.IsAdminLogin$.value == true) {
      qry = "FillFormat 0,'" + localStorage.getItem('DBType') + "'";
    } else {
      qry =
        'FillFormat ' +
        this.cmbCustomer +
        ",'" +
        localStorage.getItem('DBType') +
        "'";
    }
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          // this.CopyFormatList = JSON.parse(returnData);
          // this.CopyFormatListClone = JSON.parse(returnData);
          this.loading = false;
          this.SearchRadioClick(this.chkSearchRadio);
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

  ForceUpdateAll() {
    this.loading = true;
    this.serviceLicense
      .ForceUpdate(this.ForceUpdateTokenid)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Update request is submit', 'Success!');
            this.SaveModifyInfo(
              0,
              'Pubish request is submitted for ' +
              JSON.stringify(this.ForceUpdateTokenid)
            );
            this.loading = false;
          } else {
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  SaveImageTimeInterval(titleid, Type) {
    if (this.ImageTimeInterval.length === 0) {
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (Type === 'All') {
      const ImgInterval = this.ImageTimeInterval[0].ImgInterval;
      this.ImageTimeInterval = [];
      let ArrImg = {};
      this.PlaylistSongsList.forEach((item) => {
        ArrImg = {};
        ArrImg['ImgInterval'] = ImgInterval;
        ArrImg['titleid'] = item.id;
        ArrImg['splId'] = this.PlaylistSelected[0];
        this.ImageTimeInterval.push(ArrImg);
      });
    }
    this.SaveImageTimeInterval_API(Type);
  }
  OnChangeImgInterval(e, tid) {
    const ArrImg = {};
    ArrImg['ImgInterval'] = e;
    ArrImg['titleid'] = tid;
    ArrImg['splId'] = this.PlaylistSelected[0];
    this.ImageTimeInterval = [];
    // this.ImageTimeInterval = this.ImageTimeInterval.filter(order => order.titleId !== tid && order.splId !== this.PlaylistSelected[0]);

    this.ImageTimeInterval.push(ArrImg);
  }
  SaveImageTimeInterval_API(type) {
    this.loading = true;
    this.pService
      .SaveImageTimeInterval(this.ImageTimeInterval)
      .pipe()
      .subscribe(
        (data) => {
          const returnData = JSON.stringify(data);
          const obj = JSON.parse(returnData);
          if (obj.Responce === '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            if (type === 'All') {
              this.PlaylistSongsList.forEach((item) => {
                item.ImageTimeInterval = this.ImageTimeInterval[0].ImgInterval;
              });
              // this.FillPlaylistSongs(this.PlaylistSelected[0],'No','Yes', this.ForceUpdateTokenid)
            }
            this.ImageTimeInterval = [];
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
            this.loading = false;
            this.ImageTimeInterval = [];
          }
        },
        (error) => {
          this.toastr.error(
            'Apologies for the inconvenience.The error is recorded.',
            ''
          );
          this.loading = false;
          this.ImageTimeInterval = [];
        }
      );
  }
  lblUpperMsg = '';
  ForceAction = 'No';
  titleDeleteIdOwn = '0';
  openTitleDeleteModalOwn(mContent, id) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.lblUpperMsg = 'Are you sure to delete?';
    this.ForceAction = 'No';
    this.ViewPlaylists = '';
    this.titleDeleteIdOwn = id;
    this.modalService.open(mContent);
  }
  TitlePlaylists = [];
  DeleteTitleOwn(ForceDelete) {
    this.loading = true;
    this.pService
      .DeleteTitleOwn(this.titleDeleteIdOwn, ForceDelete)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.tid = [];
            this.ForceAction = 'No';
            this.ViewPlaylists = '';
            this.SongsList = this.SongsList.filter(
              (order) => order.id !== this.titleDeleteIdOwn
            );
            this.titleDeleteIdOwn = '0';
            this.modalService.dismissAll();
          } else if (obj.Responce == '2') {
            this.lblUpperMsg =
              'This title is assigned to playlists. Would you like contiue delete ?';
            this.loading = false;
            this.ForceAction = 'Yes';
            this.TitlePlaylists = obj.TitlePlaylists;
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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
  ViewPlaylists = '';
  ViewTitlePlaylists() {
    this.ViewPlaylists = 'Yes';
  }

  
  ngAfterViewInit(): void {
     
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event

    
  }
  

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.PlaylistList = this.MainPlaylistList;
    } else {
      this.PlaylistList = [...this.MainPlaylistList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }

    // sorting countries
  }
  VolumeLevelSetting(modalTokenInfo){
    
    if (this.ForceUpdateTokenid[0] === '') {
      this.toastr.info('No tokens are available with selected playlist');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.IsVolumeLevelModal=true
    this.FillTokenInfo(0, this.pid);
    this.modalService.open(modalTokenInfo, { size: 'lg' });
  }
  SelectToken(fileid, event) {
    if (event.target.checked) {
      this.TokenSelected.push(fileid);
    } else {
      const index: number = this.TokenSelected.indexOf(fileid);
      if (index !== -1) {
        this.TokenSelected.splice(index, 1);
      }
    }
  }
  SavePlaylistTokenVolume(UpdateModel){
    if (this.TokenSelected.length === 0) {
      this.toastr.info('Please select atleast one location');
      return;
    }
    this.loading = true;
    this.pService
      .SavePlaylistTokenVolume(this.pid,this.cmbVolume,this.TokenSelected)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.TokenSelected=[];
            this.loading = false;
            this.NewName = this.SettingPname;
            if (this.ForceUpdateTokenid != '') {
              this.modalService.open(UpdateModel, { centered: true });
            }
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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
  onClickSpecialPlaylists(){
    this.IscmbCustomerMediaTypeChange = false
  }


  onSort_Libray({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.SongsList = this.MainSongsList;
    } else {
      this.SongsList = [...this.MainSongsList].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }

    // sorting countries
  }
  OpenViewContent(modalName, url,oType,MediaType){
if (MediaType!="Url"){
  window.open(url, '_blank'); 
  return
}
console.log(url)
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType",oType)
    if (oType=="496"){
      this.modalService.open(modalName, {
        size: 'Template',
      }); 
    }
    if (oType=="495"){
      this.modalService.open(modalName,{
        size: 'PT-Template'
      }); 
    }
    
  }
  OpenEditTemplates(Urltype){
    if (Urltype=="google"){
      this.router.navigate(['Upload']);
      localStorage.setItem('innerpage','template');
    }
    else{
    if (this.cmbCustomer == '0') {
      this.toastr.info('Please select a customer name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.OtherKey===""){
      this.toastr.info('Customer is not registered');
      return;
    }
    else{
    window.open(this.OtherUrl,"_blank")
    }
  }
  this.flocationElement.nativeElement.focus();
  }
  OpenSensorSettings(modalName){
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
          this.modalService.open(modalName, {
            size: 'lgSx',
          }); 
          this.flocationElement.nativeElement.focus();
      }

      CloseSensorSettings(){
        localStorage.setItem('IsAnnouncement', '0');
      }

      PlaylistSort(SortModel) {
        if (this.PlaylistSelected.length == 0) {
          this.toastr.info('Please select playlist');
          return;
        }
        if (this.IschkViewOnly==1){
          this.toastr.info('This feature is not available in view only');
          return;
        }
        this.FillPlaylistSortContent();
        this.modalService.open(SortModel, { centered: true ,size: 'lgo'});
        this.flocationElement.nativeElement.focus();
      }

      FillPlaylistSortContent() {
        this.IsNormalPlaylist = true;
      this.loading = true;
      this.PlaylistSongsSortList=[]
      this.pService
        .PlaylistSong(this.PlaylistSelected[0], 'No')
        .pipe()
        .subscribe(
          (data) => {
            var returnData = JSON.stringify(data);
            var obj = JSON.parse(returnData);
            this.PlaylistSongsSortList = obj;
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


async    SavePlaylistSort(ForceUpdate){
        this.plArray = [];
        for (let prop in this.PlaylistSongsSortList) {
          this.plArray.push({
            index: this.PlaylistSongsSortList[prop].SrNo,
            titleid: this.PlaylistSongsSortList[prop].id,
            id: this.PlaylistSongsSortList[prop].sId,
          });
        }
      await  this.UpdateSRNo(ForceUpdate,'Yes');
      
      }

      OnChangeSortInterval(e, sId) {
        var prvSrNo="0"
        this.PlaylistSongsSortList.forEach(item => {
          if (item["sId"]==sId){
            prvSrNo= item["SrNo"]
            item["SrNo"]=e
          }
        });
        this.PlaylistSongsSortList.forEach(item => {
          if ((item["SrNo"]==e) && (item["sId"]!=sId)){
            item["SrNo"]=prvSrNo
          }
        });
      }
      PlaylistSortModalClose(){
        this.SelectPlaylist(this.PlaylistSelected[0],'','');
      }
      onChangeEvent_Playlist(){
        if (this.PlaylistSearchText!=""){
          this.PlaylistSongsList = this.PlaylistSongsList.filter(country => this.matches(country, this.PlaylistSearchText, this.pipe));
        }
        else{
          this.PlaylistSongsList=[]
          this.PlaylistSongsList= this.MainPlaylistSongsList
        }
      }
      matches(country, term: string, pipe: PipeTransform) {
        return country.title.toLowerCase().includes(term.toLowerCase());
      }


      async PlaylistExpiry(SortModel) {
        if (this.PlaylistSelected.length == 0) {
          this.toastr.info('Please select playlist');
          return;
        }
        if (this.IschkViewOnly==1){
          this.toastr.info('This feature is not available in view only');
          return;
        }
       await this.FillPlaylistContent();
        this.modalService.open(SortModel, { centered: true ,size: 'lgo'});
        this.flocationElement.nativeElement.focus();
      }

      FillPlaylistContent() {
          this.IsNormalPlaylist = true;
        this.loading = true;
        this.pService
          .PlaylistSong(this.PlaylistSelected[0], 'No')
          .pipe()
          .subscribe(
            (data) => {
              var returnData = JSON.stringify(data);
              var obj = JSON.parse(returnData);
              obj.forEach(item => {
                if (item["DeleteDate"]){
                  var cd = new Date(item["DeleteDate"]);
                  item["DeleteDate"]=cd
                  item["NewDeleteDate"]=item["DeleteDate"]
                }
                
              });
              this.PlaylistExpiryList = obj;
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
      onChangeExpiryDate(){
        this.PlaylistExpiryList.forEach(item => {
          if (item["DeleteDate"]!=""){
            var eDate = new Date(item["DeleteDate"]);
            item["NewDeleteDate"]= eDate.toDateString()
          }
          else{
            item["NewDeleteDate"]=""
          }
        });
      }
      SavePlaylistContentExpiry(){

        this.pService
      .SavePlaylistContentExpiry(this.PlaylistExpiryList)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info("Saved", 'Success!');
            this.loading = false;
            let pl= this.MainPlaylistList.filter(fId => fId.Id === this.PlaylistSelected[0])
            let pln= pl[0].DisplayName.split('(')
            this.SaveModifyInfo(
              0,
              'Content expiry set for playlist ('+trim(pln[0])+') '
            );
            this.SelectPlaylist(this.PlaylistSelected[0],'','');
            
          } else {
            this.toastr.error(
              'Apologies for the inconvenience.The error is recorded.',
              ''
            );
          }
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

      ResetDeleteDate(id){
        this.PlaylistExpiryList.forEach(item => {
          if (item["sId"]==id){
            item["NewDeleteDate"]= ""
            item["DeleteDate"]= ""
          }
        });


      }



      OpenTemplatesUrl(modalName){
        if (this.IschkViewOnly==1){
          this.toastr.info('This feature is not available in view only');
          return;
        }
              this.modalService.open(modalName, {
                size: 'lgSx',
              }); 
              this.flocationElement.nativeElement.focus();
          }


          PlaylistContentStatus(mContent,tid) {
            if (this.PlaylistSelected.length == 0) {
              this.toastr.info('Please select playlist');
              return;
            }
            if (this.IschkViewOnly==1){
              this.toastr.info('This feature is not available in view only');
              return;
            }
            localStorage.setItem('tokenClient',this.cmbCustomer.toString());
            localStorage.setItem('tokenid',tid);
            localStorage.setItem('dpid',this.PlaylistSelected[0]);
            this.modalService.open(mContent, {  size: 'lg',
            windowClass: 'tokenmodal', });
            this.flocationElement.nativeElement.focus();
          }

          OpenContentBlock(modalName){
          if (this.IschkViewOnly==1){
            this.toastr.info('This feature is not available in view only');
            return;
          }
          localStorage.setItem('bCId',this.cmbCustomer);
          localStorage.setItem('mType',this.cmbCustomerMediaType);
          this.modalService.open(modalName, {
            size: 'mdSx',
          }); 
          this.flocationElement.nativeElement.focus();
        }
        RefillCommonSearch(){
        this.SearchContent();
        }

       async PublishSchedule(){
         
          
          if (this.cmbPublishId=="0"){
            this.toastr.info('Please set publish schedule');
            return;
          }
          this.loading = true;
          this.serviceLicense.SavePublishToken(this.cmbPublishId,this.ForceUpdateTokenid).pipe().subscribe((data) => {
                var returnData = JSON.stringify(data);
                var obj = JSON.parse(returnData);
                if (obj.Responce == '1') {
                  this.toastr.info('Update request is submit', 'Success!');
                  this.SaveModifyInfo(0,'Pubish schedule is submitted for ' +JSON.stringify(this.ForceUpdateTokenid));
                  this.loading = false;
                } else {
                  this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
                }
                this.loading = false;
              },
              (error) => {
                this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
                this.loading = false;
              }
            );
        }
GetPublishSchedule(){
  var qry = "select id as Id,publishHr as DisplayName from tbPublishSchedule where clientid= "+this.cmbCustomer+" "
    this.serviceLicense.FillCombo(qry).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          if (obj.length!=0){
            this.cmbPublishId=obj[0]['Id']
          }
          else{
            this.cmbPublishId="0"
          }
        },
        (error) => {
         
        }
      );
}
SetDefaultHotelTvPlaylist() {
  this.loading = true;
this.pService.SaveDefaultPlaylistHotelTV(this.pid, this.cmbCustomer).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.AssignDefaultPlaylistSchedule()
            this.GetDefaultHotelTvPlaylist()
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
          }
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
}
AssignDefaultPlaylistSchedule(){
  var body =`{
    "CustomerId": "95",
    "FormatId": "325",
    "PlaylistId": "0",
    "startTime": "00:00",
    "EndTime": "23:59",
    "startDate": "Thu Mar 31 2022",
    "EndDate": "Thu Mar 31 2022",
    "wList": [],
    "TokenList": [
        {
            "tokenId": "107",
            "schType": "Normal"
        }
    ],
    "lstPlaylist": [
        {
            "Id": "01847",
            "pName": "Test Tv  (6)",
            "splId": ${this.pid},
            "sTime": "00:00",
            "eTime": "23:59",
            "wId": "1,2,3,4,5,6,7",
            "wName": "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
            "PercentageValue": "0",
            "volume": "90"
        }
    ],
    "ScheduleType": "Normal",
    "PercentageValue": "0",
    "volume": "90"
}`
  this.loading = true;
  this.sfService.SaveSF(JSON.parse(body)).pipe().subscribe(
    (data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.Responce == '1') {
        this.toastr.info("Saved", 'Success!');
        this.modalService.dismissAll()
        this.loading = false;
      } else {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      }
      this.loading = false;
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
}
DefaultHotelTvPlaylist
GetDefaultHotelTvPlaylist() {
this.pService.GetDefaultPlaylistHotelTV(this.cmbCustomer).pipe().subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.response == '1') {
            var resObj = JSON.parse(obj.data)
            this.DefaultHotelTvPlaylist = resObj[0].splplaylistid.toString()
          }
        },
        (error) => {
        }
      );
}
GetPlaylistContenSize() {
  this.loading = true;
  this.pService.Playlist(this.formatid).pipe().subscribe((data) => {
        const returnData = JSON.stringify(data);
        var PlaylistList = JSON.parse(returnData);
        var obj = PlaylistList.filter(o => o.Id == this.PlaylistSelected[0])
        this.loading = false;
        this.playlistSize = obj[0].playlistsize
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
}
GetPlaylistContenSize_spl(id) {
  this.loading = true;
  this.pService.Playlist(this.formatid).pipe().subscribe((data) => {
        const returnData = JSON.stringify(data);
        var PlaylistList = JSON.parse(returnData);
        var obj = PlaylistList.filter(o => o.Id == id)
        this.loading = false;
        this.playlistSize = obj[0].playlistsize
      },
      (error) => {
        this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
        this.loading = false;
      }
    );
}
}


///https://stackoverflow.com/questions/34523276/how-enable-multiple-row-selection-in-angular-js-table/34523640
//datatable
//[dtOptions]="dtOptions"
//[dtTrigger]="dtTrigger"