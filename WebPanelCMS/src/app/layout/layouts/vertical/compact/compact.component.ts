import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseConfigService, Scheme } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { KendoThemeService } from 'app/mock-api/services/Kendotheme/theme.service';
import { ComponentsModule } from 'app/pages/components.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'compact-layout',
    templateUrl  : './compact.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, MatButtonModule, MatIconModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, QuickChatComponent, FuseVerticalNavigationComponent,DropDownsModule,ComponentsModule,
        ScrollViewModule,
        LabelModule,FormsModule, 
        MenuModule,
        InputsModule],
})
export class CompactLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,private KendothemeService: KendoThemeService,
        private _navigationService: NavigationService,public authService: AuthServiceOwn,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,private _fuseConfigService: FuseConfigService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation data

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                navigation.compact.forEach(itemp => {
                    this.SetNavigationPermissions(itemp)
                });
                navigation.default.forEach(itemp => {
                    this.SetNavigationPermissions(itemp)
                });
                navigation.futuristic.forEach(itemp => {
                    this.SetNavigationPermissions(itemp)
                });
                navigation.horizontal.forEach(itemp => {
                    this.SetNavigationPermissions(itemp)
                });

                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }
    SetNavigationPermissions(itemp){
        this.authService.IsAdminLogin$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="new"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
          this.authService.chkDashboard$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="dashboard"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
          this.authService.chkPlayerDetail$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="playerdetails"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
          this.authService.chkPlaylistLibrary$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="medialibrary"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
          this.authService.chkAdvertisement$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="ads"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
          this.authService.IsAdminLogin$.subscribe((resAdmin) => {
            this.authService.IsClientAdminLogin$.subscribe((resSubAdmin) => {
            if (resAdmin==false && resSubAdmin==false){
                if (itemp.id=="user"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
          });
        });
        this.authService.chkScheduling$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="iptv"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
        });
        this.authService.chkInstantPlay$.subscribe((res) => {
            if (res==false){
                if (itemp.id=="instantplay"){
                    itemp.hidden=()=>{
                        return true
                    }
                }
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
            this.setLayout('classy')
            return
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
    setScheme(scheme: Scheme): void
    {
        this._fuseConfigService.config = {scheme};
    }
    setLayout(layout: string): void
    {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null,
            },
            queryParamsHandling: 'merge',
        }).then(() =>
        {
            // Set the config
            this._fuseConfigService.config = {layout};
        });
    }
    ThemeSwitch=false
    onSwitchChange(value){
        this.ThemeSwitch=value
        if (value==false){
            this.setScheme('dark')
            this.KendothemeService.setDarkMode();
        }
        else{
            this.setScheme('light')
            this.KendothemeService.setLightMode();
        }
    }
}
