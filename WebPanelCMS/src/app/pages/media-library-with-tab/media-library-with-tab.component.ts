import { Component, OnInit,ViewChild,ViewChildren,QueryList,ElementRef } from '@angular/core';
import { HorizontalAlign, VerticalAlign } from '@progress/kendo-angular-layout';

import { BreadCrumbItem } from "@progress/kendo-angular-navigation";
import { SortDescriptor, process } from '@progress/kendo-data-query';

import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ExpansionPanelComponent } from "@progress/kendo-angular-layout";
import { SelectEvent, TabCloseEvent } from "@progress/kendo-angular-layout"
import {
  SVGIcon,
  saveIcon,
  anchorIcon,
  codeIcon,
  paperclipIcon,
} from "@progress/kendo-svg-icons";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import { AuthServiceOwn } from 'app/auth/auth.service';
import { ConfigAPI } from 'app/class/ConfigAPI';
import { PlaylistLibService } from 'app/mock-api/services/playlist-lib.service';
import { MachineService } from 'app/mock-api/services/machine.service';
import * as allIcons from "@progress/kendo-svg-icons";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as Shuffle from 'shuffle';
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
  breadCrumbPlaylistItems: BreadCrumbItem[]=[{text: "Playlist Group",title: "0"}]
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
  ShowAudoPlaylistContent=false
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
  OtherKey="";
  OtherUrl="";
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
  public kIcons = allIcons;
  PlaylistsFormatScrollViewData = [];
  PlaylistsFormatItems=[]
  selectedPlaylistFormat=""
  selectedPlaylistFormatPlaylist=""
  selectedPlaylistFormatPlaylistId=""

  MasterScheduleScrollViewData = [];
  MasterScheduleItems=[]
  selectedMasterSchedule=""
  selectedMasterScheduleInner=""
  selectedMasterScheduleId=""
  selectedRowPL = [];
  ExpansionPanelExpanded=true
  PlaylistSongsSortList=[]
  PlaylistContentRowSelection
  chkNoSoundPlaylist=false
  chkFixedPlaylist=false
  chkAllowduplicatecontentPlaylist=false
  EditPlaylistId="0"
  @ViewChild('flocation') flocationElement: ElementRef;
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;

  constructor(private mService:MachineService,private pService: PlaylistLibService,public toastr: ToastrService,private router: Router,
    private modalService: NgbModal,public auth:AuthServiceOwn,private cApi: ConfigAPI,    config: NgbModalConfig,
    ) {
      config.backdrop = 'static';
      config.keyboard = false;
   }

  async ngOnInit(){
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
    this.pService.FillCustomerWithKey(q).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          this.CustomerList = JSON.parse(returnData);
          this.loading = false;
          this.cmbCustomer=localStorage.getItem('dfClientId')
          this.onChangeCustomer(localStorage.getItem('dfClientId'));
           
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  async onChangeCustomer(id) {
    /* this.panels.forEach((panel, idx) => {
      if (panel.expanded){
        panel.toggle();
      }
    }); */
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
    await this.onAction(0,'Signage')
    const obj= this.CustomerList.filter(fId => fId.Id == id)
     
    const url='https://content.display-anywhere.com/api/login?key='+ obj[0].apikey;
    this.OtherUrl= url+'&redirectUri=https://content.display-anywhere.com/my-templates/';
    this.OtherKey=obj[0].apikey;
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
    else if (this.ExpansionPanelMediaType=='Templates'){
      localStorage.setItem('ContentType', 'Templates')
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
    if ((index ==1) || (index ==2)){
      await this.GetLibraryGenre()
    }
    if (index ==0){
      await this.FillSongList()
    }
    if (index ==3){
      this.chkSignageMediaType="Url"
      await this.FillSongList()
    }
    await this.FillFormat()    
    /* if (index ==3){
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
    } */
    await this.FillPlaylistFormat(mediaType)
    await this.FillMasterSchedule()
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
          // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  public async onbreadCrumbItemClick(item: BreadCrumbItem): Promise<void> {
    const index = this.breadCrumbItems.findIndex((e) => e.text === item.text);
    this.breadCrumbItems = this.breadCrumbItems.slice(0, index + 1);
     
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
          // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
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
          // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
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
    .subscribe(async data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        let objres = JSON.parse(obj.data)
        await this.GetLibraryPlaylists(1)
        objres.forEach(async item => {
          let arr={}
          arr["value"]=item["Id"]
          arr["text"]=item["Name"]
          this.PlaylistTypeListItems.push(arr)
          //await this.GetLibraryPlaylists(item["Id"])
          //await this.GetLibraryPlaylists(1)
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
        // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
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
  await this.mService.GetLibraryPlaylists(this.cmbCustomer.toString(),this.ExpansionPanelMediaType).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        let objres = JSON.parse(obj.data)

        if (this.ExpansionPanelMediaType !='Regular'){
          this.PlaylistLists=objres
        }
        this.MainPlaylistLists=objres
        let FindFormatId="0"
        objres.forEach(item => {
          if (FindFormatId.toString() != item["Formatid"].toString()){
            FindFormatId= item["Formatid"].toString()
           let arrInner={
              text:item["formatname"],
              items:[]
            }
            let objPlaylist= objres.filter(o => o.Formatid.toString() == FindFormatId.toString())
            for (let index = 0; index < objPlaylist.length; index++) {
              let arrChild={}
              arrChild["text"] = objPlaylist[index].splPlaylistName
              arrChild["value"] = objPlaylist[index].splPlaylistId
              arrInner["items"].push(arrChild)
            }
            this.PlaylistContextMenu.push(arrInner)
          }
        });
        /* let arrInner={
          //text:"Existing Playlist – " +objres[0].Name,
          text:"Existing Playlists",
          items:[]
        }
         
        objres.forEach(item => {
          let arrChild={}
          arrChild["text"] = item["splPlaylistName"]
          arrChild["value"] = item["splPlaylistId"]
          arrInner["items"].push(arrChild)
        }); */
        
      }
      this.loading = false;
    },
      error => {
        // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
        this.loading = false;
      })
}
  async SaveNewPlaylist(){
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
              await this.getPlaylistsAndGroups()
              await this.SaveNewPlaylistWithType(obj.message)
            }
            else{
              this.toastr.info('Saved', 'Success!');
            }
          } else if (obj.Responce == '2') {
             this.toastr.info('Playlist name already exists', 'Success!');
            this.loading = false;
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
          }
        },
        (error) => {
          // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
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
      //tbSpecialPlaylistTypeId:this.cmbPlaylistType.value.toString()
      tbSpecialPlaylistTypeId:"1"
    }
    this.loading = true;
    this.pService.SavePlaylistWithPlaylistType(payload).pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.loading = false;
             this.toastr.info('Saved', 'Success!');
            if (this.selectedContentId.length>0){
              await this.AddContentInPlaylist(this.selectedContentId,playlistid)
            }
            await this.GetSpecialPlayListType()
            this.modalService.dismissAll()
          } else {
            // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
          }
        },
        (error) => {
          // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
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
             
            this.loading = false;
          }
        },
        (error) => {
           
          this.loading = false;
        }
      );
  }

  FillPlaylistSongs(splPlaylistId,playlistname) {
    this.SelectedPlaylistName=playlistname
    this.PlaylistSelectedForContent=splPlaylistId
    this.PlaylistContentLists=[];
    let CrumbItems=[]
    let SubGenereId=""
    this.breadCrumbPlaylistItems.forEach(item => {
      if (item['text']=="Playlists"){
        item['text']=this.selectedPlaylistFormatPlaylist
        item['title']=this.selectedPlaylistFormatPlaylistId
        SubGenereId=this.selectedPlaylistFormatPlaylistId
      }
      else{
        SubGenereId= this.selectedPlaylistFormatPlaylistId
      }
      CrumbItems.push(item)
    });
    CrumbItems.push({text: "Content",title: "Content"})
    this.breadCrumbPlaylistItems=CrumbItems
    this.ShowAudoPlaylistContent=true
    this.loading = true;
    this.pService.PlaylistSong(splPlaylistId, "No").pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.PlaylistContentLists = obj;
          this.loading = false;
        },
        (error) => {
           
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
     
     
    this.modalService.open(mContent,{ centered: true});
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
             
          }
          this.loading = false;
        },
        (error) => {
          
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
      // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
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
      // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
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
        if (this.chkSignageMediaType=="Video"){
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
        if (this.chkSignageMediaType=="Url"){
          this.rdoSearchFilterList=[
            {
                "DisplayName": "Landscape Url",
                "Id": "496",
                "check": false
            },
            {
                "DisplayName": "Portrait Url",
                "Id": "495",
                "check": false
            }
        ]
        }
        if (this.chkSignageMediaType=="Image"){
          this.rdoSearchFilterList=[
            {
                "DisplayName": "Landscape Images",
                "Id": "325",
                "check": false
            },
            {
                "DisplayName": "Portrait Images",
                "Id": "324",
                "check": false
            }
        ]
        }
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
          this.loading = false;
        }
      );
  }
  async onChangeSignageMediaType(){
    this.rdoSearchFilterList=[]
    this.rdoSearchFilter="title"
    await this.FillSongList()
  }
  async onSubmitNewFormat() {
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
        async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce != '-2') {
            this.toastr.info('Saved', 'Success!');
            await this.getPlaylistsAndGroups()

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
            this.ClearEditPlaylist()
            this.FillFormat();
          } else if (obj.Responce == '-2') {
            this.toastr.info('This campaign name already exists', '');
          } else {
            this.loading = false;
          }
        },
        (error) => {
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
    let cmbCustomerMediaType = "'"+this.ExpansionPanelMediaType +"'"
    if (this.ExpansionPanelMediaType=="Audio"){
      cmbCustomerMediaType = "'Audio Copyright','Audio DirectLicence', 'Audio'"
    }
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
    ") and sf.mediatype in(" +
    cmbCustomerMediaType +
    ") group by  sf.formatname";

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
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
          /* if (this.ExpansionPanelMediaType =='Regular'){
            this.PlaylistLists=[]
            this.SelectedPlaylistName=""
            this.PlaylistContentLists=[];
            this.cmbFormat={DisplayName: 'Other Services', Id: '476', check: false}
            this.FilterFormatDropdownDefaultValue={DisplayName: 'Other Services', Id: '476', check: false}
            setTimeout(() => { 
              this.onChangeFormatPlaylist(this.cmbFormat)
             }, 1000);
            
          } */
        },
        (error) => {
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
    this.modalService.open(content,{ centered: true});
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
    if (this.cmbFormat.DisplayName != undefined){
      this.NewFormatName = this.cmbFormat.DisplayName;
    }
    this.modalService.open(mContent,{ centered: true});
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
            
          }
          this.loading = false;
        },
        (error) => {
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
    this.modalService.open(content,{ centered: true});
    this.flocationElement.nativeElement.focus();
  }
  OpenUploadContentModel(content){
    this.modalService.open(content,{ centered: true, size: 'lg'});
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
            ;
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
        }
      );    
    
  }
  public onSelectTab(e: SelectEvent): void {
    if (e.index==0){
      this.onAction(0,'Signage')
    }
    if (e.index==1){
      this.onAction(1,'Video')
    }
    if (e.index==2){
      this.onAction(2,'Audio')
    }
    if (e.index==3){
      this.onAction(3,'Templates')
    }

  }
  FillPlaylistFormat(cmbCustomerMediaType) {
    this.breadCrumbPlaylistItems=[{text: "Playlist Group",title: "0"}]
    if (cmbCustomerMediaType=="Audio"){
      cmbCustomerMediaType = "'Audio Copyright','Audio DirectLicence', 'Audio'"
    }
    else{
      cmbCustomerMediaType = "'"+ cmbCustomerMediaType +"'"
    }
    let objLibraryGenreList=[]
    let objLibraryGenreItems=[]
    this.PlaylistsFormatItems=[]
    this.PlaylistsFormatScrollViewData=[]
    let scrolLimit=24
    this.ShowAudoPlaylistContent=false
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
    ") and sf.mediatype in(" +
    cmbCustomerMediaType +
    ") group by  sf.formatname";

    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          this.loading = false;
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          objLibraryGenreList = obj
           
          let rowIndex=0
          var eventjsonlength= objLibraryGenreList.length
  
          if (objLibraryGenreList.length<scrolLimit){
            scrolLimit=objLibraryGenreList.length
          }
          let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
           
          for (let index = 0; index < ScrollPageCount; index++) {
            this.PlaylistsFormatScrollViewData.push({page:index})
          }
          
          for(var i = 0; i < objLibraryGenreList.length; i++){
            this.LibraryGenreList.push({title: objLibraryGenreList[i].DisplayName,id: objLibraryGenreList[i].Id})
            objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].DisplayName,id: objLibraryGenreList[i].Id})
            rowIndex++
            eventjsonlength--
            if (rowIndex==scrolLimit){
              this.PlaylistsFormatItems.push(objLibraryGenreItems)
              objLibraryGenreItems=[]
              rowIndex=0
              if (eventjsonlength < 24 ){
                scrolLimit = eventjsonlength
              }
            }
          }   
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  async GetFormatPlaylist(id,playlistname) {
     if (this.breadCrumbPlaylistItems.length==2){
      this.selectedPlaylistFormatPlaylist=playlistname
      this.selectedPlaylistFormatPlaylistId=id
      await this.FillPlaylistSongs(id,playlistname)
      return 
    } 
    
    this.loading = true;
    let objLibraryGenreList=[]
    let objLibraryGenreItems=[]
    this.PlaylistsFormatItems=[]
    this.PlaylistsFormatScrollViewData=[]
    let scrolLimit=24
    this.ShowAudoPlaylistContent=false
    
    const index = this.breadCrumbPlaylistItems.findIndex((e) => e.text === "Playlist Group");
    this.breadCrumbPlaylistItems = this.breadCrumbPlaylistItems.slice(0, index + 1);

     this.breadCrumbPlaylistItems =[{text: playlistname,title: id},
      {text: "Playlists",title: ""}
    ]  
    
    await this.mService.GetLibraryPlaylists(this.cmbCustomer.toString(),this.ExpansionPanelMediaType).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          let objData= JSON.parse(obj.data)
          
          objLibraryGenreList = objData.filter(o => parseInt(o.Formatid) == parseInt(id))
        }
        let rowIndex=0
          var eventjsonlength= objLibraryGenreList.length
  
          if (objLibraryGenreList.length<scrolLimit){
            scrolLimit=objLibraryGenreList.length
          }
          let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
          for (let index = 0; index < ScrollPageCount; index++) {
            this.PlaylistsFormatScrollViewData.push({page:index})
          }
          for(var i = 0; i < objLibraryGenreList.length; i++){
            this.LibraryGenreList.push({title: objLibraryGenreList[i].splPlaylistName,id: objLibraryGenreList[i].splPlaylistId})
            objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].splPlaylistName,id: objLibraryGenreList[i].splPlaylistId, IsVideoMute:objLibraryGenreList[i].IsVideoMute,IsShowDefault:objLibraryGenreList[i].IsShowDefault,chkDuplicateContent:objLibraryGenreList[i].chkDuplicateContent})
            rowIndex++
            eventjsonlength--
            if (rowIndex==scrolLimit){
              this.PlaylistsFormatItems.push(objLibraryGenreItems)
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
          // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  public async onbreadCrumbPlaylistFormatClick(item: BreadCrumbItem): Promise<void> {
    const index = this.breadCrumbPlaylistItems.findIndex((e) => e.text === item.text);
    this.breadCrumbPlaylistItems = this.breadCrumbPlaylistItems.slice(0, index + 1);
    
    if (this.breadCrumbPlaylistItems.length==1){
      await this.FillPlaylistFormat(this.ExpansionPanelMediaType)
    }
    if (this.breadCrumbPlaylistItems.length==2){
      const id=this.breadCrumbPlaylistItems[0].title
      const genrename=this.breadCrumbPlaylistItems[0].text
      this.breadCrumbPlaylistItems =[{text: genrename,title: id},
        {text: "Playlists",title: ""}
      ] 
     // await this.GetLibrarySubGenre(id, genrename)
  }
    this.PlaylistContentLists=[]
    this.ShowAudoPlaylistContent=false
  }
  //====================================================================================
  FillMasterSchedule() {
    let objLibraryGenreList=[]
    let objLibraryGenreItems=[]
    this.MasterScheduleItems=[]
    this.MasterScheduleScrollViewData=[]
    let scrolLimit=24
    //this.ShowAudoPlaylistContent=false
    this.loading = true;
    var qry = "";
    qry ="select id as id , name as displayname  from tbMasterSchedule where dfclientid="+this.cmbCustomer+" and mediaType='"+this.ExpansionPanelMediaType+"' order by id"
    this.pService
      .FillCombo(qry)
      .pipe()
      .subscribe(
        (data) => {
          this.loading = false;
          var returnData = JSON.stringify(data);
          let obj = JSON.parse(returnData);
          objLibraryGenreList = obj
          let rowIndex=0
          var eventjsonlength= objLibraryGenreList.length
  
          if (objLibraryGenreList.length<scrolLimit){
            scrolLimit=objLibraryGenreList.length
          }
          let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
          for (let index = 0; index < ScrollPageCount; index++) {
            this.MasterScheduleScrollViewData.push({page:index})
          }
          for(var i = 0; i < objLibraryGenreList.length; i++){
            objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].DisplayName,id: objLibraryGenreList[i].Id})
            rowIndex++
            eventjsonlength--
            if (rowIndex==scrolLimit){
              this.MasterScheduleItems.push(objLibraryGenreItems)
              objLibraryGenreItems=[]
              rowIndex=0
              if (eventjsonlength < 24 ){
                scrolLimit = eventjsonlength
              }
            }
          }   
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  NewMasterScheduleName = ''
  chkOverwritemanual=false
  onSubmitNewMasterSchedule(id,OpenDetail){
    if (this.NewMasterScheduleName == '') {
      this.toastr.info('Schedule name cannot be blank', '');
      return;
    }
    this.pService
      .SaveMasterScheduleName(id,this.NewMasterScheduleName,this.cmbCustomer,this.chkOverwritemanual,this.ExpansionPanelMediaType)
      .pipe()
      .subscribe(
        async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce != '-2') {
            this.toastr.info('Saved', 'Success!');
            this.loading = false;
            await this.FillMasterSchedule();
            if (OpenDetail=="Yes"){
              await this.openMasterScheduleDetail(obj.Responce,this.NewMasterScheduleName)
            }
            else{
             // this.chkOverwritemanual=false
              //this.NewMasterScheduleName = ''
            }
            this.modalService.dismissAll()
          } else if (obj.Responce == '-2') {
            this.toastr.info('This schedule name already exists', '');
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
  async openMasterScheduleDetail(id,name){
    localStorage.setItem('mastermediatype',this.ExpansionPanelMediaType)
    this.router.navigate(['general/editmasterschedule/' + id+'/'+name]);
  }
  plArray = []

  PLShuffle() {
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    if (this.PlaylistContentLists.length == 0) {
      return;
    }

    var deck = Shuffle.shuffle({ deck: this.PlaylistContentLists });
    this.PlaylistContentLists = [];
    this.PlaylistContentLists = deck.cards;
    this.plArray = [];
    var srno = 1;
    for (let prop in this.PlaylistContentLists) {
      this.plArray.push({
        index: srno,
        titleid: this.PlaylistContentLists[prop].id,
        id: this.PlaylistContentLists[prop].sId,
      });
      srno++;
    }

    this.UpdateSRNo('');
  }

  UpdateSRNo(IsFillPlaylist) {
    if (this.plArray.length == 0) {
      return;
    }

    this.loading = true;
    let playlistid=[]
    playlistid.push(this.PlaylistSelectedForContent)
    this.pService
      .UpdatePlaylistSRNo(playlistid, this.plArray)
      .pipe()
      .subscribe(
        (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.loading = false;
            if (IsFillPlaylist=="Yes"){
              this.SelectPlaylist();
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
  SelectPlaylist(){
    this.PlaylistContentLists=[]
    this.loading = true;
    this.pService.PlaylistSong(this.PlaylistSelectedForContent, "No").pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.PlaylistContentLists = obj;
          this.loading = false;
        },
        (error) => {
           
          this.loading = false;
        }
      );
  }

  PlaylistSort(SortModel) {
     
    if (this.IschkViewOnly==1){
      this.toastr.info('This feature is not available in view only');
      return;
    }
    this.FillPlaylistSortContent();
    this.modalService.open(SortModel, { centered: true ,size: 'lg'});
    this.flocationElement.nativeElement.focus();
  }
  FillPlaylistSortContent() {
  this.loading = true;
  this.PlaylistSongsSortList=[]
  this.pService
    .PlaylistSong(this.PlaylistSelectedForContent, 'No')
    .pipe()
    .subscribe(
      (data) => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        obj.forEach(items => {
          items["SrNo"]= parseInt(items["SrNo"])
        });
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
async    SavePlaylistSort(){
  this.plArray = [];
  for (let prop in this.PlaylistSongsSortList) {
    this.plArray.push({
      index: this.PlaylistSongsSortList[prop].SrNo,
      titleid: this.PlaylistSongsSortList[prop].id,
      id: this.PlaylistSongsSortList[prop].sId,
    });
  }
await  this.UpdateSRNo('Yes');

}
PlaylistSortModalClose(){
  this.SelectPlaylist()
}
OnChangeSortInterval(e, sId) {
  
  let prvSrNo=0
  this.PlaylistSongsSortList.forEach(item => {
    if (item["sId"]==sId){
      prvSrNo= parseInt(item["SrNo"])
      item["SrNo"]=e
    }
  });
  this.PlaylistSongsSortList.forEach(item => {
    if ((parseInt(item["SrNo"])==parseInt(e)) && (item["sId"]!=sId)){
      item["SrNo"]=prvSrNo
    }
  });
  
}
moveUp = function () {
  let num=this.PlaylistContentRowSelection[0]
  if (this.IschkViewOnly==1){
    this.toastr.info('This feature is not available in view only');
    return;
  }
  if (num > 0) {
    var tmp = this.PlaylistContentLists[num - 1];
    var tmpPL = this.plArray[num - 1];

    this.PlaylistContentLists[num - 1] = this.PlaylistContentLists[num];
    this.plArray[num - 1] = this.plArray[num];

    this.PlaylistContentLists[num] = tmp;
    this.plArray[num] = tmpPL;

    this.ArrayLoop();
    this.selectedRow--;
    this.selectedRowPL = [];
    this.selectPL(this.selectedRow);
  }
  this.UpdateSRNo('Yes');
}
moveDown = function () {
  let num=this.PlaylistContentRowSelection[0]
  if (this.IschkViewOnly==1){
    this.toastr.info('This feature is not available in view only');
    return;
  }
  if (num < this.PlaylistContentLists.length - 1) {
    var tmp = this.PlaylistContentLists[num + 1];
    var tmpPL = this.plArray[num + 1];

    this.PlaylistContentLists[num + 1] = this.PlaylistContentLists[num];
    this.plArray[num + 1] = this.plArray[num];

    this.PlaylistContentLists[num] = tmp;
    this.plArray[num] = tmpPL;
    this.ArrayLoop();
    this.selectedRow++;
    this.selectedRowPL = [];
    this.selectPL(this.selectedRow);
  }
  this.UpdateSRNo('Yes');
};
ArrayLoop() {
  this.plArray = [];
  var srno = 1;
  for (let prop in this.PlaylistContentLists) {
    this.plArray.push({
      index: srno,
      titleid: this.PlaylistContentLists[prop].id,
      id: this.PlaylistContentLists[prop].sId,
    });
    srno++;
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
isRowSelectedPL(rowIndex) {
  return this.selectedRowPL.indexOf(rowIndex) > -1;
}
OpenViewPlaylistContent(modalName, url,genreId,MediaType){
  let oType="LS"
  if (genreId =="303"){
    oType="PT"
  }
  if (genreId =="324"){
    oType="PT"
  }
    localStorage.setItem("ViewContent",url)
    localStorage.setItem("oType",oType)
    localStorage.setItem("mViewType",MediaType)
    
    if (oType=="LS"){
      this.modalService.open(modalName, {
        size: 'Template',
        centered: true
      }); 
    }
    if (oType=="PT"){
      this.modalService.open(modalName,{
        size: 'PT-Template',
        centered: true
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
    if ((this.OtherKey=="") || (this.OtherKey==undefined)){
      this.toastr.info('Customer is not registered');
      return;
    }
    else{
    window.open(this.OtherUrl,"_blank")
    }
    }
  }
  PlaylistAndGroudSettings(modalFormat,id,name,modalEditPlaylist,data){
    if (this.breadCrumbPlaylistItems.length==1){
      this.cmbFormat.DisplayName=name
      this.cmbFormat.Id=id
      this.openFormatModal(modalFormat)
    }
    if (this.breadCrumbPlaylistItems.length==2){
      let obj= this.breadCrumbPlaylistItems[0]
      this.txtplaylistname=name
      this.EditPlaylistId=id
      this.cmbFormat.Id=obj['title']
      this.chkFixedPlaylist=Boolean(data.IsShowDefault)
      this.chkAllowduplicatecontentPlaylist=Boolean(data.chkDuplicateContent)
      this.chkNoSoundPlaylist=Boolean(data.IsVideoMute)
      this.modalService.open(modalEditPlaylist,{ centered: true});
      this.flocationElement.nativeElement.focus();
    }
    
  }
  ClearEditPlaylist(){
    this.txtplaylistname=""
    this.EditPlaylistId="0"
    this.cmbFormat.Id="0"
    this.chkFixedPlaylist=false
    this.chkAllowduplicatecontentPlaylist=false
    this.chkNoSoundPlaylist=false
    this.cmbFormat.DisplayName=undefined
    this.NewFormatName=""
  }

  async UpdatePlaylist(){
    if (this.cmbFormat.Id == '0') {
      this.toastr.info('Please select a campaign name');
      return;
    }
    if (this.txtplaylistname == '') {
      return;
    }
    let payload={
      id:this.EditPlaylistId,
      plName:this.txtplaylistname,
      formatid: this.cmbFormat.Id
    }
    this.loading = true;
    this.pService.SavePlaylist(payload).pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          if (obj.Responce == '1') {
            this.loading = false;
            await this.UpdatePlaylistSettings()
            await this.getPlaylistsAndGroups()
          } else if (obj.Responce == '2') {
             this.toastr.info('Playlist name already exists', 'Success!');
            this.loading = false;
          } else {
            this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
          }
        },
        (error) => {
          // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );

  }
  UpdatePlaylistSettings(){
    
    this.loading = true;
    this.pService.SettingPlaylist(this.EditPlaylistId,this.chkNoSoundPlaylist,this.chkFixedPlaylist,false,this.chkAllowduplicatecontentPlaylist,"90").pipe().subscribe(async (data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.ClearEditPlaylist()
          if (obj.Responce == '1') {
            this.loading = false;
            this.toastr.info('Saved', 'Success!');
            this.modalService.dismissAll()
          } else {
            // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
            this.loading = false;
          }
        },
        (error) => {
          // this.toastr.error('Apologies for the inconvenience.The error is recorded.','');
          this.loading = false;
        }
      );

  }
  async getPlaylistsAndGroups(){
    if (this.breadCrumbPlaylistItems.length==1){
      await this.FillPlaylistFormat(this.ExpansionPanelMediaType)
    }
    if (this.breadCrumbPlaylistItems.length==2){
      const id=this.breadCrumbPlaylistItems[0].title
      await this.getFormatPlaylists(id)
  }
  }
  async getFormatPlaylists(id){
    let objLibraryGenreList=[]
    let objLibraryGenreItems=[]
    this.PlaylistsFormatItems=[]
    this.PlaylistsFormatScrollViewData=[]
    let scrolLimit=24
    this.ShowAudoPlaylistContent=false
    await this.mService.GetLibraryPlaylists(this.cmbCustomer.toString(),this.ExpansionPanelMediaType).pipe()
      .subscribe(data => {
        var returnData = JSON.stringify(data);
        var obj = JSON.parse(returnData);
        if (obj.data !=''){
          let objData= JSON.parse(obj.data)
          objLibraryGenreList = objData.filter(o => parseInt(o.Formatid) == parseInt(id))
        }
        let rowIndex=0
          var eventjsonlength= objLibraryGenreList.length
  
          if (objLibraryGenreList.length<scrolLimit){
            scrolLimit=objLibraryGenreList.length
          }
          let ScrollPageCount= Math.round(objLibraryGenreList.length/scrolLimit)
          for (let index = 0; index < ScrollPageCount; index++) {
            this.PlaylistsFormatScrollViewData.push({page:index})
          }
          for(var i = 0; i < objLibraryGenreList.length; i++){
            this.LibraryGenreList.push({title: objLibraryGenreList[i].splPlaylistName,id: objLibraryGenreList[i].splPlaylistId})
            objLibraryGenreItems.push({color: this.getRandomColor(), title: objLibraryGenreList[i].splPlaylistName,id: objLibraryGenreList[i].splPlaylistId, IsVideoMute:objLibraryGenreList[i].IsVideoMute,IsShowDefault:objLibraryGenreList[i].IsShowDefault,chkDuplicateContent:objLibraryGenreList[i].chkDuplicateContent})
            rowIndex++
            eventjsonlength--
            if (rowIndex==scrolLimit){
              this.PlaylistsFormatItems.push(objLibraryGenreItems)
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
          // this.toastr.error("Apologies for the inconvenience.The error is recorded.", '');
          this.loading = false;
        })
  }
  ConvertImageTimeInterval(value){
return parseInt(value)
  }
  ImageTimeInterval=[]
  OnChangeImgInterval(e, tid) {
    const ArrImg = {};
    ArrImg['ImgInterval'] = e;
    ArrImg['titleid'] = tid;
    ArrImg['splId'] = this.PlaylistSelectedForContent;
    this.ImageTimeInterval = [];
    this.ImageTimeInterval.push(ArrImg);
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
      this.PlaylistContentLists.forEach((item) => {
        ArrImg = {};
        ArrImg['ImgInterval'] = ImgInterval;
        ArrImg['titleid'] = item.id;
        ArrImg['splId'] = this.PlaylistSelectedForContent;
        this.ImageTimeInterval.push(ArrImg);
      });
    }
    this.SaveImageTimeInterval_API(Type);
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
            if (type == 'All') {
              this.PlaylistContentLists.forEach((item) => {
                item.ImageTimeInterval = this.ImageTimeInterval[0].ImgInterval;
              });
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

}