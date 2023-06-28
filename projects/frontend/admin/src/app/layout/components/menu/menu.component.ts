import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'mat-elevation-z2 menu' },
})
export class MenuComponent {

}
