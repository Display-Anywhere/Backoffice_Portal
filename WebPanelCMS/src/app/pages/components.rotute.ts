import { Route } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MediaLibraryWithTabComponent } from './media-library-with-tab/media-library-with-tab.component';
import { MasterscheduleComponent } from './masterschedule/masterschedule.component';
import { EditmasterscheduleComponent } from './editmasterschedule/editmasterschedule.component';
import { ClientPlayerListComponent } from './client-player-list/client-player-list.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { DComponent } from './d/d.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { UsersComponent } from './users/users.component';
import { KpnchannelComponent } from './kpnchannel/kpnchannel.component';
import { InstantMobileComponent } from './instant-mobile/instant-mobile.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { CopydataComponent } from './copydata/copydata.component';
export const CommonComponentsRoutes: Route[] = [
  {
    path: 'registration',
    component: CustomerRegistrationComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'medialibrary',
    component: MediaLibraryWithTabComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'schedule',
    component: MasterscheduleComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'editmasterschedule/:id/:name',
    component: EditmasterscheduleComponent,
  },
  {
    path: 'playerdetails',
    component: ClientPlayerListComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'ads',
    component: DComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'user',
    component: UsersComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'iptv',
    component: KpnchannelComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'instantplay',
    component: InstantMobileComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'copydata',
    component: CopydataComponent,
    //canActivate:[AuthGuard]
  },
];
