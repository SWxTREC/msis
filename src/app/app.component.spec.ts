import { async, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { LaspFooterModule } from 'lasp-footer';
import { LaspNavModule, LaspNavService } from 'lasp-nav';

import { AppComponent } from './app.component';
import { routes } from './routes';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot( routes ),
                LaspFooterModule,
                LaspNavModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                LaspNavService
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have no more than 7 nav items`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.navItems.length).toBeLessThanOrEqual( 7 );
    });
});
