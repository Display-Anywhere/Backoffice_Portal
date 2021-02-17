import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigAPI } from 'src/app/class/ConfigAPI';
@Injectable({
  providedIn: 'root'
})
export class PrayerserService {
 
  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
  FillCombo(qry){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  } 
  FillTokenInfo(cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillTokenInfoPrayer(cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ clientId: cid});
    return this.http.post(this.cApi.FillTokenInfo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  SavePrayer(json:JSON){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = json;
    return this.http.post(this.cApi.SavePrayer,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillSearchPayer(cDate,tid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ cDate: cDate,tokenid:tid});
    return this.http.post(this.cApi.FillSearchPayer,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  DeletePrayer(id){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ id: id});
    return this.http.post(this.cApi.DeletePrayer,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
}
