import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('stickyMenu') menuElement: ElementRef;

  fillerNav = ['Data', 'Missions', 'Tools', 'About', 'Reference', 'Science', 'Instruments'];
  navOpen = false;
  sticky = false;

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 160) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}
