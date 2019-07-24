import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LaspSearchModule } from '../lasp-search/lasp-search.module';

import { LaspNavComponent } from './lasp-nav.component';

describe('LaspNavComponent', () => {
    let component: LaspNavComponent;
    let fixture: ComponentFixture<LaspNavComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [
                FlexLayoutModule,
                LaspSearchModule,
                MatButtonModule,
                MatCardModule,
                MatIconModule,
                MatListModule,
                MatToolbarModule,
                RouterTestingModule
            ],
            declarations: [ LaspNavComponent ]
        })
        .compileComponents();
    }));

    beforeEach( () => {
        fixture = TestBed.createComponent(LaspNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect(component).toBeTruthy();
    });

    it( 'should open external URLs in a new window', () => {
        const router = TestBed.get( Router );
        const routerSpy = spyOn( router, 'navigateByUrl' );
        const windowSpy = spyOn( window, 'open' );

        component.onNavClick( '/foo' );
        expect( routerSpy ).toHaveBeenCalled();
        expect( windowSpy ).not.toHaveBeenCalled();

        component.onNavClick( 'http://www.google.com' );
        expect( routerSpy ).toHaveBeenCalledTimes( 1 );
        expect( windowSpy ).toHaveBeenCalledTimes( 1 );

        component.onNavClick( 'https://www.google.com' );
        expect( routerSpy ).toHaveBeenCalledTimes( 1 );
        expect( windowSpy ).toHaveBeenCalledTimes( 2 );
    });
});
