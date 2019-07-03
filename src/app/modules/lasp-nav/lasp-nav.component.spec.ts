import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
} from '@angular/material';
import { LaspSearchModule } from '../lasp-search/lasp-search.module';


import { LaspNavComponent } from './lasp-nav.component';

describe('LaspNavComponent', () => {
    let component: LaspNavComponent;
    let fixture: ComponentFixture<LaspNavComponent>;

    beforeEach(async(() => {
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

    beforeEach(() => {
        fixture = TestBed.createComponent(LaspNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
