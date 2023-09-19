import { Component, OnInit,ViewChild,ViewChildren,QueryList,ElementRef } from '@angular/core';
import { HorizontalAlign, VerticalAlign } from '@progress/kendo-angular-layout';
import { MachineService } from '../machine-announcement/machine.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbItem } from "@progress/kendo-angular-navigation";
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ExpansionPanelComponent } from "@progress/kendo-angular-layout";
import { SelectEvent, TabCloseEvent } from "@progress/kendo-angular-layout"
import {
  SVGIcon,
  saveIcon,
  anchorIcon,
  codeIcon,
} from "@progress/kendo-svg-icons";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
@Component({
  selector: 'app-media-library-with-tab',
  templateUrl: './media-library-with-tab.component.html',
  styleUrls: ['./media-library-with-tab.component.css']
})
export class MediaLibraryWithTabComponent implements OnInit {
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  loading = false;
  tid=[]
  ExpansionPanelMediaType
  public svgCart: SVGIcon = saveIcon;
  public LibraryGenreItems = [];
  public PlaylistContextMenu=[]
  public LibraryGenreScrollViewData = [];
  public width = "100%";
  public height = "320px";
  public pageable = true;
  public hAlign: HorizontalAlign = "stretch";
  public vAlign: VerticalAlign = "stretch";
  public letters: string = "0123456789ABCDEF";
  hexColors=["#27856a","#537aa1","#e61e32","#5179a1","#ff4632","#ba5d07","#777777","#d84000","#8d67ab","#0d73ec"]
  breadCrumbItems: BreadCrumbItem[]=[{text: "Genres",title: "0"}]
  LibraryGenreList=[]
  selectedLibraryGenre=""
  selectedLibrarySubGenre=""
  selectedLibrarySubGenreId=""
  chkSignageMediaType="Video"
  cmbCustomer="0"
  MainContentList=[]
  ContentList=[]
  ContentPageNo=1
  ShowContent=false
  PlaylistTypeListItems=[]
  FilterPlaylistTypeDropdownDefaultValue={}
  txtplaylistname=""
  cmbPlaylistType
  selectedContentId=[]
  PlaylistLists= []
  MainPlaylistLists= []
  PlaylistContentLists=[]
  SelectedPlaylistName=""
  PlaylistSelectedForContent
  CustomerList=[]
  expansionpanelIndex
  SelectionTitle
  rdoSearchFilter="Genre"
  rdoSearchFilterList=[]
  cmdrdoSearchFilter=null
  txtCommonSearch=""
  cmbFormat
  NewFormatName=""
  txtDeletedFormatName=""
  FormatList=[]
  CopyFormatList = []
  CopyFormatListClone=[] 
  FilterFormatDropdownDefaultValue={}
  IschkViewOnly=0;
  txtCommonMsg=""
  txtMsg=""
  DeleteFormatid
  NewPlaylistName=""
  UpdatePlaylistId="0"
  @ViewChild('flocation') flocationElement: ElementRef;
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;

  constructor(private mService:MachineService,public toastr: ToastrService,private pService: PlaylistLibService,
    private modalService: NgbModal,public auth:AuthServiceOwn,private cApi: ConfigAPI) {
   }

  async ngOnInit(){
    localStorage.setItem('IsRf', '0');
    await this.FillClient()
    this.IschkViewOnly = this.auth.chkViewOnly$.value ? 1 : 0;
  }
  FillClient() {
    var q = '';
    var i = this.auth.IsAdminLogin$.value ? 1 : 0;
    q =
      'FillCustomer ' +
      i +
      ', ' +
      localStorage.getItem('dfClientId') +
      ',' +
      localStorage.getItem('DBType');

    this.loading = true;
    this.pService.FillCombo(q).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          this.cmbCustomer=localStorage.getItem('dfClientId')
          this.onChangeCustomer(localStorage.getItem('dfClientId'));
           
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
  async onChangeCustomer(id) {
    this.panels.forEach((panel, idx) => {
      if (panel.expanded){
        panel.toggle();
      }
    });
    this.selectedContentId=[]
    this.SelectionTitle=[]
    this.ExpansionPanelMediaType =""
    localStorage.setItem('selecteddfClientId',id)
    if (this.expansionpanelIndex ==3){
     // await this.GetLibraryPlaylists(1)
    }
    if (this.expansionpanelIndex ==4){
     // await this.GetLibraryPlaylists(2)
    }
    if (this.expansionpanelIndex ==5){
     // await this.GetLibraryPlaylists(3)
    }
    await this.onAction(0,'Audio')
  }
  public async onAction(index: number,mediaType): Promise<void> {
    if (this.cmbCustomer=="0"){
      this.toastr.info("Please select customer.", '');
      
      return
    }
    this.txtCommonSearch=""
    this.rdoSearchFilterList=[]
    this.panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
    this.ExpansionPanelMediaType = mediaType
    this.SelectedPlaylistName=""
    this.PlaylistContentLists=[];
    this.expansionpanelIndex=index
    if (this.ExpansionPanelMediaType=='Signage'){
      localStorage.setItem('ContentType', 'Signage')
      this.rdoSearchFilter="title"
      this.rdoSearchFilterList=[]
      this.cmdrdoSearchFilter=null
      this.txtCommonSearch=""
    }
    else{
      localStorage.setItem('ContentType', 'MusicMedia')
      this.rdoSearchFilter="Genre"
      this.rdoSearchFilterList=[]
      this.cmdrdoSearchFilter=null
      this.txtCommonSearch=""
    }
    if ((index ==0) || (index ==1)){
      await this.GetLibraryGenre()
    }
    if (index ==2){
      await this.FillSongList()
    }
    await this.FillFormat()    
    if (index ==3){
      await this.GetLibraryPlaylists(1)
      this.PlaylistLists=[]
    }
    if (index ==4){
      await this.GetLibraryPlaylists(2)
      this.PlaylistLists=[]
    }
    if (index ==5){
      await this.GetLibraryPlaylists(3)
      this.PlaylistLists=[]
    }
  }
  GetLibraryGenre() {
    this.breadCrumbItems=[{text: "Genres",title: "0"}]
    this.loading = true;
    let objLibraryGenreList=[]
    let objLibraryGenreItems=[]
    this.LibraryGenreItems=[]
    this.LibraryGenreList=[]
    this.LibraryGenreScrollViewData=[]
    let scrolLimit=24
    this.ShowContent=false
    this.mService.GetLibraryGenre(this.ExpansionPanelMediaType).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          objLibraryGenreList = JSON.parse(obj.data)
        }
        let rowIndex=0
        var eventjsonlength= objLibraryGenreList.length

        if (objLibraryGenreList.length<scrolLimit){
          scrolLimit=objLibraryGenreList.length
        }
        let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
        for (let index = 0; index < ScrollPageCount; index++) {
          this.LibraryGenreScrollViewData.push({page:index})
        }
        for(var i = 0; i < objLibraryGenreList.length; i++){
          this.LibraryGenreList.push({title: objLibraryGenreList[i].genrename,id: objLibraryGenreList[i].id})
          objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].genrename,id: objLibraryGenreList[i].id})
          rowIndex++
          eventjsonlength--
          if (rowIndex==scrolLimit){
            this.LibraryGenreItems.push(objLibraryGenreItems)
            objLibraryGenreItems=[]
            rowIndex=0
            if (eventjsonlength < 24 ){
              scrolLimit = eventjsonlength
            }
          }
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  public async onbreadCrumbItemClick(item: BreadCrumbItem): Promise<void> {
    const index = this.breadCrumbItems.findIndex((e) => e.text === item.text);
    this.breadCrumbItems = this.breadCrumbItems.slice(0, index + 1);
    console.log(this.breadCrumbItems)
    if (this.breadCrumbItems.length==1){
      await this.GetLibraryGenre()
    }
    if (this.breadCrumbItems.length==2){
      const id=this.breadCrumbItems[0].title
      const genrename=this.breadCrumbItems[0].text
      this.breadCrumbItems =[{text: genrename,title: id},
        {text: "Sub Genre",title: ""}
      ] 
     // await this.GetLibrarySubGenre(id, genrename)
  }
    this.MainContentList=[]
    this.ContentList=[]
    this.ShowContent=false
    this.rdoSearchFilter= null
  }
  async GetLibrarySubGenre(id,genrename) {
    if (this.breadCrumbItems.length==2){
      this.selectedLibrarySubGenre=genrename
      this.selectedLibrarySubGenreId=id
      this.rdoSearchFilter= null
      await this.FillSearch()
      return 
    }
    
    this.loading = true;
    this.LibraryGenreList=[]
    let objLibraryGenreList=[]
    this.LibraryGenreItems=[]
    let objLibraryGenreItems=[]
    let scrolLimit=24
    this.LibraryGenreScrollViewData=[]
    const index = this.breadCrumbItems.findIndex((e) => e.text === "Genres");
    this.breadCrumbItems = this.breadCrumbItems.slice(0, index + 1);

     this.breadCrumbItems =[{text: genrename,title: id},
      {text: "Sub Genre",title: ""}
    ] 
    console.log(this.breadCrumbItems)
    this.mService.GetLibrarySubGenre(id,this.ExpansionPanelMediaType).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          objLibraryGenreList = JSON.parse(obj.data)
        }
        let rowIndex=0
        var eventjsonlength= objLibraryGenreList.length

        if (objLibraryGenreList.length<scrolLimit){
          scrolLimit=objLibraryGenreList.length
        }
        let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
        for (let index = 0; index < ScrollPageCount; index++) {
          this.LibraryGenreScrollViewData.push({page:index})
        }
        for(var i = 0; i < objLibraryGenreList.length; i++){
          this.LibraryGenreList.push({title: objLibraryGenreList[i].genre,id: objLibraryGenreList[i].genreId})
          objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].genre,id: objLibraryGenreList[i].genreId})
          rowIndex++
          eventjsonlength--
          if (rowIndex==scrolLimit){
            this.LibraryGenreItems.push(objLibraryGenreItems)
            objLibraryGenreItems=[]
            rowIndex=0
            if (eventjsonlength < 24 ){
              scrolLimit = eventjsonlength
            }
          }
        }
        this.loading = false;
      },
        error => {
          this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  public onFilter(inputValue: string): void {
    if (this.rdoSearchFilter !='Genre'){
      return
    }
    let scrolLimit=24
    let objLibraryGenreItems=[]
    this.LibraryGenreScrollViewData=[]
    this.LibraryGenreItems=[]
    let SearchResult = process(this.LibraryGenreList, {
        filter: {
            logic: 'or',
            filters: [
                {
                    field: 'title',
                    operator: 'contains',
                    value: inputValue
                }
            ]
        }
    }).data;

        let rowIndex=0
        var eventjsonlength= SearchResult.length

        if (SearchResult.length<scrolLimit){
          scrolLimit=SearchResult.length
        }
        let ScrollPageCount= Math.round(SearchResult.length/scrolLimit)
        for (let index = 0; index < ScrollPageCount; index++) {
          this.LibraryGenreScrollViewData.push({page:index})
        }
        
        for(var i = 0; i < SearchResult.length; i++){
          objLibraryGenreItems.push({color: this.getRandomColor(), title: SearchResult[i].title,id: SearchResult[i].id})
          rowIndex++
          eventjsonlength--
          if (rowIndex==scrolLimit){
            this.LibraryGenreItems.push(objLibraryGenreItems)
            objLibraryGenreItems=[]
            rowIndex=0
            if (eventjsonlength < 24 ){
              scrolLimit = eventjsonlength
            }
          }
        }
  }
  random(mn, mx) {
    return Math.random() * (mx - mn) + mn;
  }
  getRandomColor() {
    let color = this.hexColors[(Math.floor(this.random(1, 11))) - 1]
    return color;
  }
  FillSearch() {
    this.ContentPageNo = 1;
    this.MainContentList=[]
    this.ContentList=[]
    this.loading = true;
    let SubGenereId=""
    let CrumbItems=[]
    this.breadCrumbItems.forEach(item => {
      if (item['text']=="Sub Genre"){
        item['text']=this.selectedLibrarySubGenre
        item['title']=this.selectedLibrarySubGenreId
        SubGenereId=this.selectedLibrarySubGenreId
      }
      else{
        SubGenereId= this.selectedLibrarySubGenreId
      }
      CrumbItems.push(item)
    });
    CrumbItems.push({text: "Content",title: "Content"})
    this.breadCrumbItems=CrumbItems
    if (this.cmbCustomer=="0"){
      return
    }
    this.pService.CommanSearch('Genre',SubGenereId,this.ExpansionPanelMediaType,false,'1',this.cmbCustomer,"0").pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.ContentList = obj;
          this.MainContentList =obj
          this.ShowContent=true
          this.loading = false;
          await this.GetSpecialPlayListType()
        },
        (error) => {
          this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );
  }
  
public getField = (args: any) => {
  return `${args.title}_${args.genreName}_${args.Artist}`;
}
public onContentFilter(inputValue: string): void {
  this.ContentList = process(this.MainContentList, {
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
  async onSelect(e,modelName,titleid){
    if (titleid=="0"){
      this.selectedContentId=[]
      this.selectedContentId=this.SelectionTitle
    }
    else{
      this.selectedContentId.push(titleid.toString())
    }
    if (this.selectedContentId.length==0){
      this.toastr.info("Please select content.", '');
      return
    }
  const text=e.item.text
  const value=e.item.value
  if (value=="NewPl"){
    this.txtplaylistname=""
    await this.FillFormat()
    this.modalService.open(modelName, {
      centered: true,
      windowClass: 'fade',
    });
  }
  else{
    await this.AddContentInPlaylist(this.selectedContentId,value)
  }
}
GetSpecialPlayListType() {
  this.loading = true;
  this.PlaylistTypeListItems=[]
  this.mService.GetSpecialPlayListType().pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        let objres = JSON.parse(obj.data)
        objres.forEach(async item => {
          let arr={}
          arr["value"]=item["Id"]
          arr["text"]=item["Name"]
          this.PlaylistTypeListItems.push(arr)
          await this.GetLibraryPlaylists(item["Id"])
        });
        if (this.PlaylistTypeListItems.length>0){
          this.FilterPlaylistTypeDropdownDefaultValue={
            value:this.PlaylistTypeListItems[0].value,
            text:this.PlaylistTypeListItems[0].text
          }
          this.cmbPlaylistType={
            value:this.PlaylistTypeListItems[0].value,
            text:this.PlaylistTypeListItems[0].text
          }
        }
      }
      this.loading = false;
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
}
  async GetLibraryPlaylists(PlaylistTypeId) {
  if (this.cmbCustomer=="0"){
    this.toastr.info("Please select customer.", '');
    return
  }
  this.PlaylistContextMenu=[]
  this.PlaylistLists=[]
  this.MainPlaylistLists=[]
  let arr={
    text: 'New Playlist',
    value:'NewPl',
    }
  this.PlaylistContextMenu.push(arr)
  this.loading = true;
  await this.mService.GetLibraryPlaylists(this.cmbCustomer.toString(),PlaylistTypeId.toString()).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        let objres = JSON.parse(obj.data)

        if (this.ExpansionPanelMediaType !='Regular'){
          this.PlaylistLists=objres
        }
        this.MainPlaylistLists=objres
        let arrInner={
          text:"Playlist – " +objres[0].Name,
          items:[]
        }
        objres.forEach(item => {
          let arrChild={}
          arrChild["text"] = item["splPlaylistName"]
          arrChild["value"] = item["splPlaylistId"]
          arrInner["items"].push(arrChild)
        });
        this.PlaylistContextMenu.push(arrInner)
      }
      this.loading = false;
    },
      error => {
        this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
}
  SaveNewPlaylist(){
    if (this.cmbFormat.Id == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.txtplaylistname == '') {
      return;
    }
    let payload={
      id:null,
      plName:this.txtplaylistname,
      formatid: this.cmbFormat.Id
    }
    this.loading = true;
    this.pService.SavePlaylist(payload).pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.loading = false;
            if (obj.MediaType=="New"){
              await this.SaveNewPlaylistWithType(obj.message)
            }
            else{
              this.toastr.info('Saved', 'Success!');
            }
          } else if (obj.Responce == '2') {
            this.toastr.info('Playlist name already exists', 'Success!');
            this.loading = false;
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
  SaveNewPlaylistWithType(playlistid){
    if (this.cmbCustomer=="0"){
      this.toastr.info("Please select customer.", '');
      return
    }
  
    let payload={
      splPlaylistId:playlistid,
      DfClientId:this.cmbCustomer,
      tbSpecialPlaylistTypeId:this.cmbPlaylistType.value.toString()
    }
    this.loading = true;
    this.pService.SavePlaylistWithPlaylistType(payload).pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.loading = false;
            this.toastr.info('Saved', 'Success!');
            await this.AddContentInPlaylist(this.selectedContentId,playlistid)
            await this.GetSpecialPlayListType()
            this.modalService.dismissAll()
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
  AddContentInPlaylist(contentid,splPlaylistId) {
    var NewList = [];
    let PlaylistSelected=[]
    PlaylistSelected.push(splPlaylistId)
    let SongsSelected=[]
    SongsSelected= contentid
    this.loading = true;
    this.pService.AddPlaylistSong(PlaylistSelected,SongsSelected,'SFPlaylist',false).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.loading = false;
          if (obj.Responce == '1') {
            this.toastr.info('Content added in playlist', 'Success!');
            this.selectedContentId=[]
            this.SelectionTitle=[]
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

  FillPlaylistSongs(splPlaylistId,playlistname) {
    this.SelectedPlaylistName=playlistname
    this.PlaylistSelectedForContent=splPlaylistId
    this.PlaylistContentLists=[];
    this.loading = true;
    this.pService.PlaylistSong(splPlaylistId, "No").pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.PlaylistContentLists = obj;
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
  openTitleDeleteModal(mContent,id) {
    if (id == 0) {
      this.toastr.info('Please select a title', '');
      return;
    }
    this.tid.push(id.toString());
     
    console.log(this.tid)
    this.modalService.open(mContent);
  }
  DeleteTitle() {
    this.loading = true;
    this.pService.DeleteTitle(this.PlaylistSelectedForContent, this.tid, 'No').pipe().subscribe(
        async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Deleted', 'Success!');
            this.loading = false;
            this.tid = [];
            await this.FillPlaylistSongs(this.PlaylistSelectedForContent,this.SelectedPlaylistName)
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
  async onChangeSearchFilter(){
    let functionname=""
    let SubGenereId=""
    this.breadCrumbItems.forEach(item => {
      if (item['text']=="Sub Genre"){
        SubGenereId=item['title']
      }
    });
    
    if(this.rdoSearchFilter=="album")(
      functionname=this.cApi.GetGenreAlbum
    )
    if(this.rdoSearchFilter=="artist")(
      functionname=this.cApi.GetGenreArtists
    )
    let url=functionname+"/"+this.selectedLibrarySubGenreId+"/"+this.ExpansionPanelMediaType
    await this.getRadioAlbumArtistFilter(url)
    this.MainContentList=[]
    this.ContentList=[]
  }
  async ResetSearch(){
    this.rdoSearchFilter= null
    this.cmdrdoSearchFilter=null
    this.rdoSearchFilterList=[]
    await this.FillSearch()
  }
  async getRadioAlbumArtistFilter(url){
    this.loading = true;
    this.cmdrdoSearchFilter= null
    await this.pService.getRadioAlbumArtistFilter(url).pipe().subscribe(async (data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      this.rdoSearchFilterList=JSON.parse(obj.data)
      this.loading = false;
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );
  }
  async onChangeFilterdropdown_old(e){
    this.MainContentList=[]
    this.ContentList=[]
    this.loading = true;
    let searchText=""
    let searchType=""
    let mediaType=this.ExpansionPanelMediaType
    if(this.rdoSearchFilter=="album"){
      searchText=e.id
      searchType="genrealbum"
    }
    if(this.rdoSearchFilter=="artist"){
      searchText=e.name
      searchType="genreartist"
    }
    await this.CommanSearch(searchType,searchText,this.selectedLibrarySubGenreId,mediaType)
  }
  CommanSearch(searchType,searchText,SubGenreId,MediaType){
    this.loading = true;
    this.MainContentList=[]
    this.ContentList=[]
    this.pService.CommanSearch(searchType,searchText,MediaType,false,'1',this.cmbCustomer,SubGenreId).pipe().subscribe(async (data) => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      this.ContentList = obj;
      this.MainContentList =obj
      this.ShowContent=true
      this.selectedContentId=[]
      this.loading = false;
      await this.GetSpecialPlayListType()
    },
    (error) => {
      this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
      this.loading = false;
    }
  );

  }
  async SearchRadioClick(){
    this.txtCommonSearch=""
    this.cmdrdoSearchFilter =null
    this.rdoSearchFilterList=[]
    if (this.ExpansionPanelMediaType=='Signage'){
      this.ContentList = []
      this.MainContentList =[]
      if (this.rdoSearchFilter=='title'){
        await this.FillSongList()
      }
      if (this.rdoSearchFilter=='orientation'){
        this.rdoSearchFilterList=[]
        this.rdoSearchFilterList=[
          {
              "DisplayName": "Landscape MP4",
              "Id": "297",
              "check": false
          },
          {
              "DisplayName": "Portrait MP4",
              "Id": "303",
              "check": false
          }
      ]
      }
      if (this.rdoSearchFilter=='folder'){
        await this.FillFolder()
      }
    }
  }
  async SearchContent(){
    this.breadCrumbItems=[]
    let mediaType=this.ExpansionPanelMediaType
    if (this.ExpansionPanelMediaType=='Signage'){
      mediaType= this.chkSignageMediaType
    }
    if (this.rdoSearchFilter !='Genre'){
      if (this.rdoSearchFilter.toLowerCase() =='album'){
        await this.FillAlbum()
      }
      else{
        await this.CommanSearch(this.rdoSearchFilter.toLowerCase(),this.txtCommonSearch,"",mediaType)
      }
    }
    if (this.rdoSearchFilter =='Genre'){
      this.txtCommonSearch=""
      this.ShowContent=false
      this.breadCrumbItems=[{text: "Genres",title: "0"}]
      this.onFilter("")
    }
  }
  FillAlbum() {
    this.loading = true;
    this.rdoSearchFilterList=[]
    var qry =
      "spSearch_Album_Copyright '" +
      this.txtCommonSearch +
      "', " +
      localStorage.getItem('IsRf') +
      ",'" +
      this.ExpansionPanelMediaType +
      "','" +
      localStorage.getItem('DBType') +
      "'";

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          this.rdoSearchFilterList = JSON.parse(returnData);
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
  async onChangeFilterdropdown(e){
    let searchText=""
    let searchType=""
    let mediaType=this.ExpansionPanelMediaType
    searchText=e.Id
    searchType="album"
    if (this.ExpansionPanelMediaType=='Signage'){
      mediaType= this.chkSignageMediaType
      if (this.rdoSearchFilter=='orientation'){
        searchType="Genre"
      }
      if (this.rdoSearchFilter=='folder'){
        searchType="Folder"
      }
    }
    await this.CommanSearch(searchType,searchText,"",mediaType)
  }

  FillSongList() {
    
       this.loading = true;
       this.pService
         .FillSongList(this.chkSignageMediaType, false, this.cmbCustomer)
         .pipe()
         .subscribe(
           async (data) => {
             var returnData = JSON.stringify(data);
             var obj = JSON.parse(returnData);
             this.ContentList = obj;
             this.MainContentList =obj
             this.ShowContent=true
             this.selectedContentId=[]
             this.loading = false;
             await this.GetSpecialPlayListType()
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
   FillFolder() {
    this.rdoSearchFilterList=[]
    this.loading = true;
    var qry =
      'select tbFolder.folderId as Id, tbFolder.foldername as DisplayName  from tbFolder ';
    qry = qry + ' inner join Titles tit on tit.folderId= tbFolder.folderId ';

    qry = qry + " where tit.mediatype='" + this.chkSignageMediaType + "' ";
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
    if (this.chkSignageMediaType != 'Image') {
      qry =
        qry + ' and tit.IsRoyaltyFree = ' + localStorage.getItem('IsRf') + ' ';
    }
    if (this.chkSignageMediaType == 'Image') {
      qry = qry + ' and tit.GenreId in(325,324,326) ';
    }
    if ((this.ExpansionPanelMediaType == 'Signage') && (this.chkSignageMediaType == 'Video')) {
      qry = qry + ' and tit.GenreId in(303,297) ';
    }
    if (this.chkSignageMediaType == 'Url') {
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
          this.rdoSearchFilterList = JSON.parse(returnData);
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
  async onChangeSignageMediaType(){
    this.rdoSearchFilter="title"
    await this.FillSongList()
  }
  onSubmitNewFormat() {
    if (this.NewFormatName == '') {
      this.toastr.info('Campaign name cannot be blank', '');
      return;
    }

    this.pService
      .SaveFormat(
        this.cmbFormat.Id,
        this.NewFormatName,
        this.cmbCustomer,
        this.ExpansionPanelMediaType
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
            this.txtDeletedFormatName = '';
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
  FillFormat() {
    this.FilterFormatDropdownDefaultValue={}
    this.cmbFormat={}
    this.FormatList=[]
    this.CopyFormatList = []
    this.CopyFormatListClone=[] 
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
      ")  group by  sf.formatname";
      
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          console.log(obj)
          let objArr={
            "DisplayName": "",
            "Id": "0",
            "check": false
          }
          this.FormatList.push(objArr)
          obj.forEach(item => {
            this.FormatList.push(item)
          })
          this.CopyFormatList = this.FormatList;
          this.CopyFormatListClone = this.FormatList;
          this.loading = false;
          if (this.ExpansionPanelMediaType =='Regular'){
            this.PlaylistLists=[]
            this.SelectedPlaylistName=""
            this.PlaylistContentLists=[];
            this.cmbFormat={DisplayName: 'Other Services', Id: '476', check: false}
            this.FilterFormatDropdownDefaultValue={DisplayName: 'Other Services', Id: '476', check: false}
            setTimeout(() => { 
              this.onChangeFormatPlaylist(this.cmbFormat)
             }, 1000);
            
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
  openDeleteFormatModal(content) {
    if (this.cmbFormat.Id == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.txtCommonMsg = 'Are you sure to delete?';
    this.txtMsg = '';
    this.DeleteFormatid = this.cmbFormat.Id;
    this.modalService.open(content);
    this.flocationElement.nativeElement.focus();
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
    this.NewFormatName = '';
    this.NewFormatName = this.cmbFormat.DisplayName;
    this.modalService.open(mContent);
    this.flocationElement.nativeElement.focus();
  }
  onChangeFormat(e){
    this.txtDeletedFormatName = e.DisplayName
  }
  DeleteFormat(IsForceDelete) {
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
                this.cmbFormat.Id
            );
            this.DeleteFormatid = '0';
            this.txtMsg = '';
            this.FillFormat();
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
  async onChangeFormatPlaylist(e){
    if (this.expansionpanelIndex ==3){
       this.PlaylistLists=[]
       this.PlaylistLists= this.MainPlaylistLists.filter(o => o.Formatid == parseInt(e.Id))
       this.FillPlaylistSongs(this.PlaylistLists[0].splPlaylistId,this.PlaylistLists[0].splPlaylistName)
     }
     if (this.expansionpanelIndex ==4){
       this.PlaylistLists=[]
       this.PlaylistLists= this.MainPlaylistLists.filter(o => o.Formatid == parseInt(e.Id))
     }
     if (this.expansionpanelIndex ==5){
       this.PlaylistLists=[]
       this.PlaylistLists= this.MainPlaylistLists.filter(o => o.Formatid == parseInt(e.Id))
     }
 
  }
  openEditPlaylistModal(content,id,playlistName) {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.UpdatePlaylistId=id
    this.NewPlaylistName=playlistName
    this.modalService.open(content);
    this.flocationElement.nativeElement.focus();
  }
  onSubmitUpdatePlaylistName(){
    this.loading = true;
    let payload={
      plName:this.NewPlaylistName,
      id:this.UpdatePlaylistId,
      formatid:this.cmbFormat.Id
    }
    this.pService
      .SavePlaylist(payload)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            this.PlaylistLists.forEach(item => {
              if (item["splPlaylistId"]==this.UpdatePlaylistId){
                item["splPlaylistName"]=this.NewPlaylistName
              }
            })
            this.SaveModifyInfo(
              0,
              'Playlist is create/modify with name ' +
              this.NewPlaylistName
            );
          } else if (obj.Responce == '2') {
            this.toastr.info('Playlist name already exists', 'Success!');
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
  public onSelectTab(e: SelectEvent): void {
    if (e.index==0){
      this.onAction(0,'Audio')
    }
    if (e.index==1){
      this.onAction(1,'Video')
    }
    if (e.index==2){
      this.onAction(2,'Signage')
    }

  }
} 