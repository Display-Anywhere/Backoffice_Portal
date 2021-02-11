import { Component, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
@Component({
  selector: 'app-upload-content',
  templateUrl: './upload-content.component.html',
  styleUrls: ['./upload-content.component.css']
})
export class UploadContentComponent implements OnInit {
  constructor() {
    
  }
  ngOnInit() { localStorage.setItem('IsAnnouncement','0'); }
}
