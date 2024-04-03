import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.css']
})
export class ViewContentComponent implements OnInit {
  url: string = "";
  urlSafe: SafeResourceUrl;
  oType="";
  mViewType="";
  constructor(public sanitizer: DomSanitizer,private modalService: NgbModal,)  {
    this.url=  localStorage.getItem("ViewContent")
    this.oType= localStorage.getItem("oType")
    this.mViewType= localStorage.getItem("mViewType")
   }

  ngOnInit(): void {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    let httpSubDomain = this.url.substring(0,this.url.lastIndexOf("google.com") );
      if (httpSubDomain!=""){
        window.open(this.url, '_blank'); 
        this.modalService.dismissAll('Cross click');
        return
      }
  }

}
