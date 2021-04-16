import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { LaspFooterModule } from 'lasp-footer';
import { LaspNavModule, LaspNavService } from 'lasp-nav';

import { AppComponent } from './app.component';
import { routes } from './routes';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
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
