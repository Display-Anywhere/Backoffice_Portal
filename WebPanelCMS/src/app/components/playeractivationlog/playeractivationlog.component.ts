import { Component, OnInit } from '@angular/core';

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
  constructor() { 
    this.imgSrc= localStorage.getItem('imgsrc')
    this.title= localStorage.getItem('title')
    this.desc= localStorage.getItem('desc')
    this.ngClass= localStorage.getItem('ngClass')
  }

  ngOnInit(): void {
    this.content= localStorage.getItem('innerHtml')
  }

}
