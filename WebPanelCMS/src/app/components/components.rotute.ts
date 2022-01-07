import { Route } from '@angular/router';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { PlayeractivationlogComponent } from './playeractivationlog/playeractivationlog.component';
export const CommonComponentsRoutes: Route[] = [
  {
    path: 'edit-template',
    component: EditTemplateComponent
  },
  {
    path: 'template',
    component: PlayeractivationlogComponent
  }
];
