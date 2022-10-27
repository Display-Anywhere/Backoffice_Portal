import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceOwn } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css'],
})
export class TemplateListComponent implements OnInit {
  ComponentName="Templates"
  TemplatListType="LS"
  IsEditTemplateOpen=false
  clientid= localStorage.getItem('dfClientId')
  PortalName= localStorage.getItem('PortalName')
  constructor(private router: Router, public auth:AuthServiceOwn) { 
    this.auth.IsEditTemplateOpen$.subscribe((res: boolean) => {
      this.IsEditTemplateOpen=res
      if (res === true){
        this.ComponentName="Templates"
        this.TemplatListType=localStorage.getItem("edittemplategenre")
      }
    });
  }
  FilterTemplatList(e) {
    this.TemplatListType=e
  }
  ngOnInit(): void {
    
  }
  ReloadComponent(componentName){
    this.ComponentName= componentName
  }
  editTemplates(id){
    localStorage.setItem("edittemplategenre",'LS')
    localStorage.setItem("edittemplate",id)
    this.auth.SetEditTemplateOpen(true)
    this.IsEditTemplateOpen=true
    //this.router.navigate(['general/edit-template']);
  }
  editPTTemplates(id) {
    localStorage.setItem("edittemplategenre",'PT')
    localStorage.setItem("edittemplate",id)
    this.auth.SetEditTemplateOpen(true)
    this.IsEditTemplateOpen=true
  }
}
