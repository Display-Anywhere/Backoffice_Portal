import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.css']
})
export class ViewContentComponent implements OnInit {
  url: string = "";
  urlSafe: SafeResourceUrl;
  oType="";
  constructor(public sanitizer: DomSanitizer)  {
    this.url=  localStorage.getItem("ViewContent")
    this.oType= localStorage.getItem("oType")
   }

  ngOnInit(): void {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
