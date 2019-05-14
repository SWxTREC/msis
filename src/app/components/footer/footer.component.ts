import { Component, Input } from '@angular/core';
import { INavItem, IImageLink, ISocialLinks } from 'src/app/models/header-footer';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    @Input() orgLogos: IImageLink[] = [];
    @Input() navItems: INavItem[] = [];
    @Input() socialLinks: ISocialLinks = {};

    currentYear = new Date().getFullYear();
}
