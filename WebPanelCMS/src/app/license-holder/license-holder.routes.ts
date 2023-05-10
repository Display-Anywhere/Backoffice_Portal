import { Route } from '@angular/router';
import { LicenseHolderComponent } from './license-holder.component';
import { ClientPlayerListComponent } from './client-player-list/client-player-list.component';
export const LicenseHolderRoutes: Route[] = [
  {
    path: '',
    component: ClientPlayerListComponent
  }
];
