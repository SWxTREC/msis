import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LaspFooterComponent } from './lasp-footer.component';

describe( 'FooterComponent', () => {
    let component: LaspFooterComponent;
    let fixture: ComponentFixture<LaspFooterComponent>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [
                FlexLayoutModule,
                MatButtonModule,
                MatToolbarModule,
                RouterTestingModule.withRoutes(
                    [ { path: 'foo', redirectTo: '/' } ]
                )
            ],
            declarations: [ LaspFooterComponent ]
        })
        .compileComponents();
    }));

    beforeEach( () => {
        fixture = TestBed.createComponent( LaspFooterComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect( component ).toBeTruthy();
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