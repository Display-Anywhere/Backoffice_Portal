import { Route } from '@angular/router';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { KpnChannelsComponent } from './kpn-channels/kpn-channels.component';
import { PlayeractivationlogComponent } from './playeractivationlog/playeractivationlog.component';
import { EditmasterscheduleComponent } from './editmasterschedule/editmasterschedule.component';
import { AuthGuard } from '../auth/auth.guard';
export const CommonComponentsRoutes: Route[] = [
  {
    path: 'edit-template',
    component: EditTemplateComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'template',
    component: PlayeractivationlogComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'kpn',
    component: KpnChannelsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'editmasterschedule/:id/:name',
    component: EditmasterscheduleComponent,
    canActivate:[AuthGuard]
  }
];
