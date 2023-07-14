import { Component, OnInit,ViewChild } from '@angular/core';
import { HorizontalAlign, VerticalAlign } from '@progress/kendo-angular-layout';
import { MachineService } from '../machine-announcement/machine.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbItem } from "@progress/kendo-angular-navigation";
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { PlaylistLibService } from 'src/app/playlist-library/playlist-lib.service';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.css']
})

export class MediaLibraryComponent implements OnInit {
  loading = false;
  public LibraryGenreItems = [];

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
  chkMediaRadio="Video"
  cmbCustomer=localStorage.getItem('dfClientId')
  MainContentList=[]
  ContentList=[]
  ContentPageNo=1
  ShowContent=false

  @ViewChild(DataBindingDirective) dataBinding?: DataBindingDirective;

  constructor(private mService:MachineService,public toastr: ToastrService,private pService: PlaylistLibService,) {
   }

  async ngOnInit(){
    await this.GetLibraryGenre()
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
    this.mService.GetLibraryGenre().pipe()
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
    if (this.breadCrumbItems.length==1){
      await this.GetLibraryGenre()
    }
    this.MainContentList=[]
    this.ContentList=[]
    this.ShowContent=false
  }
  async GetLibrarySubGenre(id,genrename) {
    if (this.breadCrumbItems.length>1){
      this.selectedLibrarySubGenre=genrename
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

    this.breadCrumbItems =[{text: genrename,title: "0"},
      {text: "Sub Genre",title: id.toString()}
    ]
    this.mService.GetLibrarySubGenre(id).pipe()
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
        SubGenereId=item['title']
      }
      CrumbItems.push(item)
    });
    CrumbItems.push({text: "Content",title: "Content"})
    this.breadCrumbItems=CrumbItems
    this.pService.CommanSearch('Genre',SubGenereId,this.chkMediaRadio,false,'1',this.cmbCustomer).pipe().subscribe((data) => {
          var returnData = JSON.stringify(data);
          var obj = JSON.parse(returnData);
          this.ContentList = obj;
          this.MainContentList =obj
          this.ShowContent=true
          this.loading = false;
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
}
