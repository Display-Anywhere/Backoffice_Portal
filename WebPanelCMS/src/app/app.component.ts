import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@fuse/services/theme/theme.service';
import { IconsModule, SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet,IconsModule,SVGIconModule],
})
export class AppComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(private themeService: ThemeService)
    {
    }
    ngOnInit(): void {
        this.themeService.setDarkMode();
      }
}
