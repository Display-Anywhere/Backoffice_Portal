import { Injectable, PipeTransform } from '@angular/core';
import {ConfigAPI} from '../class/ConfigAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient,private cApi:ConfigAPI) { }
   
  GetCustomerTokenDetailSummary(fType,cid){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
     
    var params = JSON.stringify({clientId:cid,ftype:fType,UserId:localStorage.getItem('UserId')});
    return this.http.post(this.cApi.GetCustomerTokenDetailSummary,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  FillCombo(qry){
    let headers = new HttpHeaders({ 'Content-Type':'application/json' });
    var params = JSON.stringify({ Query: qry });
    return this.http.post(this.cApi.FillQueryCombo,params,{headers:headers})
     .pipe((data=>{return data;}))
  }
  matches(country, term: string, pipe: PipeTransform) {
    return  country.city.toLowerCase().includes(term.toLowerCase())
      || country.location.toLowerCase().includes(term.toLowerCase())
      || pipe.transform(country.tokenid).includes(term);
  }
}
