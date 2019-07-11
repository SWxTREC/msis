import { Component, Input } from '@angular/core';
import { INavItem, IImageLink, ISocialLinks } from './models';

@Component({
    selector: 'lasp-footer',
    templateUrl: './lasp-footer.component.html',
    styleUrls: ['./lasp-footer.component.scss']
})
export class LaspFooterComponent {

    @Input() orgLogos: IImageLink[] = [];
    @Input() navItems: INavItem[] = [];
    @Input() socialLinks: ISocialLinks = {};

    currentYear = new Date().getFullYear();
}
