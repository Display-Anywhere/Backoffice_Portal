import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AuthServiceOwn } from 'app/auth/auth.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, NotificationsComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, RouterOutlet, QuickChatComponent],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,public authService: AuthServiceOwn,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,private _fuseConfigService: FuseConfigService
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

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) =>
            {
                this.user = user;
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
        this.setLayout('compact')
        return
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
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
}
