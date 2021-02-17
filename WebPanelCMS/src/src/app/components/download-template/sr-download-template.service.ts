import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigAPI } from 'src/app/class/ConfigAPI';

@Injectable({
  providedIn: 'root'
})
export class SrDownloadTemplateService {
  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  GetTemplates(dfClientId:string , GenreId, cDate, search){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId , GenreId, cDate, search});
    return this.http.post(this.cApi.GetTemplates,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DownloadTemplates(dfClientId,GenreId,FolderId,tList){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ dfClientId:dfClientId,GenreId:GenreId,FolderId:FolderId,
      tList:tList,dbType: localStorage.getItem('DBType') });
    return this.http.post(this.cApi.DownloadTemplates,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
