import { Route } from '@angular/router';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { KpnChannelsComponent } from './kpn-channels/kpn-channels.component';
import { PlayeractivationlogComponent } from './playeractivationlog/playeractivationlog.component';
import { EditmasterscheduleComponent } from './editmasterschedule/editmasterschedule.component';
export const CommonComponentsRoutes: Route[] = [
  {
    path: 'edit-template',
    component: EditTemplateComponent
  },
  {
    path: 'template',
    component: PlayeractivationlogComponent
  },
  {
    path: 'kpn',
    component: KpnChannelsComponent
  },
  {
    path: 'editmasterschedule/:id/:name',
    component: EditmasterscheduleComponent
  }
];
