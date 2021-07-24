import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-store-and-forward',
  templateUrl: './store-and-forward.component.html',
  styleUrls: ['./store-and-forward.component.css'],
})
export class StoreAndForwardComponent implements OnInit {

  ComponentName="Normal"
  clid=""
  constructor(
    
  ) {
    
  }
  ngOnInit() {  
    this.clid = localStorage.getItem('dfClientId');

    
  }

  ReloadNormalControls(){
    this.ComponentName="Normal"
     
  }
  
  ReloadFutureControls(){
    this.ComponentName="Future"
  }
}
