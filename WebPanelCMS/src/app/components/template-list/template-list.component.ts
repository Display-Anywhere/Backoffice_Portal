import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css'],
})
export class TemplateListComponent implements OnInit {
  ComponentName="Templates"
  IsEditTemplateOpen=false
  constructor(private router: Router, public auth:AuthService) { 
    this.auth.IsEditTemplateOpen$.subscribe((res: boolean) => {
      this.IsEditTemplateOpen=res
      if (res === true){
        this.ComponentName="Templates"
      }
    });
  }
  
  ngOnInit(): void {
    
  }
  ReloadComponent(componentName){
    this.ComponentName= componentName
  }
  editTemplates(id){
    localStorage.setItem("edittemplate",id)
    this.auth.SetEditTemplateOpen(true)
    this.IsEditTemplateOpen=true
    //this.router.navigate(['general/edit-template']);
  }
}
