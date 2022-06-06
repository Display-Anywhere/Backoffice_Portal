import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {ConfigAPI} from './class/ConfigAPI';
import { NgxLoadingModule  } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
 // {path: '', loadChildren:'./login/login.module#LoginModule' } , 
 { 
   path: 'Dashboard', 
   loadChildren: () => import('./customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule),
   canActivate:[AuthGuard]
  },
  { 
    path: 'LicenseHolderControl', 
    loadChildren: () => import('./license-holder/license-holder.module').then(m => m.LicenseHolderModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Registration', 
    loadChildren: () => import('./customer-registration/customer-registration.module').then(m => m.CustomerRegistrationModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'PlaylistLibrary', 
    loadChildren: () => import('./playlist-library/playlist-library.module').then(m => m.PlaylistLibraryModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'DJPlaylistLibrary', 
    loadChildren: () => import('./djplaylist-library/djplaylist-library.module').then(m => m.DJPlaylistLibraryModule),
    canActivate:[AuthGuard]
   },

   { 
    path: 'StoreAndForward', 
    loadChildren: () => import('./store-and-forward/store-forward.module').then(m => m.StoreAndForwardModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'CopyData', 
    loadChildren: () => import('./copy-data/copy-data.module').then(m => m.CopyDataModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Links', 
    loadChildren: () => import('./links/links.module').then(m => m.LinksModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'manual', 
    loadChildren: () => import('./manual/manual.module').then(m => m.ManualModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'InstantPlay', 
    loadChildren: () => import('./instant-play/instant-play.module').then(m => m.InstantPlayModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Users', 
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Upload', 
    loadChildren: () => import('./upload-content/upload-content.module').then(m => m.UploadContentModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Ads', 
    loadChildren: () => import('./ad/ad.module').then(m => m.AdModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Reports', 
    loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'Streaming', 
    loadChildren: () => import('./streaming/streaming.module').then(m => m.StreamingModule),
    canActivate:[AuthGuard]
   },
   { 
    path: 'general', 
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
   },
   {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy:PreloadAllModules
  }),
  NgbModule,
  
  CommonModule,
  HttpClientModule,
  NgxLoadingModule.forRoot({}),
  ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({positionClass: 'toast-top-center'}),
    
],

  exports: [RouterModule],

  declarations:[],

  providers: [ConfigAPI,
    {provide: LocationStrategy, useClass: HashLocationStrategy}]
  
})
export class AppRoutingModule { }
