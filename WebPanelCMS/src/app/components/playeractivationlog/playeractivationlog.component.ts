import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SrDownloadTemplateService } from '../download-template/sr-download-template.service';

@Component({
  selector: 'app-playeractivationlog',
  templateUrl: './playeractivationlog.component.html',
  styleUrls: ['./playeractivationlog.component.css']
})
export class PlayeractivationlogComponent implements OnInit {
  content: any = ''
  imgSrc=''
  title=''
  desc=''
  logosrc=''
  ngClass=''
  tempateId=''
  constructor(private dService: SrDownloadTemplateService,private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.GetTemplateHtmlContent(params['t']);
    })
    this.ngClass= localStorage.getItem('ngClass')
  }
GetTemplateHtmlContent(id){
  if (id=== undefined){
    return
  }
  this.dService.GetOwnTemplatesHTMLContent(id).pipe()
      .subscribe(data => {
        if (data['response']=="1"){
          var obj = JSON.parse(data['data']);
          console.log(obj)
          this.content = obj[0].tHtml
          console.log(obj[0].tHtml)
          this.ngClass=obj[0].bgColor
        }
        else{
          this.content=''
        }
      },
        error => {
          this.content=''
        })
}
  ngOnInit(): void {
    this.content= localStorage.getItem('innerHtml')
    this.logosrc= localStorage.getItem('logosrc')
    this.title= localStorage.getItem('title')
    this.desc= localStorage.getItem('desc')
  }

}
