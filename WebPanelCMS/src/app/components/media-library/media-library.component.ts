import { Component, OnInit,ViewChild,ViewChildren,QueryList } from '@angular/core';
import { HorizontalAlign, VerticalAlign } from '@progress/kendo-angular-layout';
import { MachineService } from '../machine-announcement/machine.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbItem } from "@progress/kendo-angular-navigation";
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ExpansionPanelComponent } from "@progress/kendo-angular-layout";
import {
  SVGIcon,
  saveIcon,
  anchorIcon,
  codeIcon,
} from "@progress/kendo-svg-icons";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.css']
})

export class MediaLibraryComponent implements OnInit {
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
  breadCrumbItems: BreadCrumbItem[]=[{text: "Genres",title: "0"}]
  LibraryGenreList=[]
  selectedLibraryGenre=""
  selectedLibrarySubGenre=""
  selectedLibrarySubGenreId=""
  chkMediaRadio="Video"
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
  PlaylistContentLists=[]
  SelectedPlaylistName=""
  PlaylistSelectedForContent
  CustomerList=[]
  expansionpanelIndex
  SelectionTitle
  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;

  constructor(private mService:MachineService,public toastr: ToastrService,private pService: PlaylistLibService,
    private modalService: NgbModal,public auth:AuthServiceOwn) {
   }

  async ngOnInit(){
    await this.FillClient()
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
          if (this.auth.IsAdminLogin$.value == false) {
            this.onChangeCustomer(localStorage.getItem('dfClientId'));
            this.cmbCustomer=localStorage.getItem('dfClientId')
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
  async onChangeCustomer(id) {
    this.panels.forEach((panel, idx) => {
      if (panel.expanded){
        panel.toggle();
      }
    });
    if (this.expansionpanelIndex ==2){
      await this.GetLibraryPlaylists(1)
    }
    if (this.expansionpanelIndex ==3){
      await this.GetLibraryPlaylists(2)
    }
    if (this.expansionpanelIndex ==4){
      await this.GetLibraryPlaylists(3)
    }
  }
  public async onAction(index: number,mediaType): Promise<void> {
    if (this.cmbCustomer=="0"){
      this.toastr.info("Please select customer.", '');
      
      return
    }
  
    this.panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
    this.ExpansionPanelMediaType = mediaType
    this.SelectedPlaylistName=""
    this.PlaylistContentLists=[];
    this.expansionpanelIndex=index
    if ((index ==0) || (index ==1)){
      await this.GetLibraryGenre()
    }
    if (index ==2){
      await this.GetLibraryPlaylists(1)
    }
    if (index ==3){
      await this.GetLibraryPlaylists(2)
    }
    if (index ==4){
      await this.GetLibraryPlaylists(3)
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
  }
  async GetLibrarySubGenre(id,genrename) {
    if (this.breadCrumbItems.length==2){
      this.selectedLibrarySubGenre=genrename
      this.selectedLibrarySubGenreId=id
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
  
  getRandomColor() {
    let color = "#"; 
    for (var i = 0; i < 6; i++) {
        color += this.letters[Math.floor(Math.random() * 16)];
    }
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
        SubGenereId=item['title']
      }
      CrumbItems.push(item)
    });
    CrumbItems.push({text: "Content",title: "Content"})
    this.breadCrumbItems=CrumbItems
    if (this.cmbCustomer=="0"){
      return
    }
    this.pService.CommanSearch('Genre',SubGenereId,this.ExpansionPanelMediaType,false,'1',this.cmbCustomer).pipe().subscribe(async (data) => {
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
GetLibraryPlaylists(PlaylistTypeId) {
  if (this.cmbCustomer=="0"){
    this.toastr.info("Please select customer.", '');
    return
  }
  this.PlaylistContextMenu=[]
  this.PlaylistLists=[]
  let arr={
    text: 'New Playlist',
    value:'NewPl',
    }
  this.PlaylistContextMenu.push(arr)
  this.loading = true;
  this.mService.GetLibraryPlaylists(this.cmbCustomer.toString(),PlaylistTypeId.toString()).pipe()
    .subscribe(data => {
      var returnData = JSON.stringify(data);
      var obj = JSON.parse(returnData);
      if (obj.data !=''){
        let objres = JSON.parse(obj.data)
        this.PlaylistLists=objres
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
    if (this.txtplaylistname == '') {
      return;
    }
    let payload={
      id:null,
      plName:this.txtplaylistname,
      formatid:0
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
} 