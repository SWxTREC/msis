import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatToolbarModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';


import { LaspFooterComponent } from './lasp-footer.component';

describe('FooterComponent', () => {
    let component: LaspFooterComponent;
    let fixture: ComponentFixture<LaspFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FlexLayoutModule,
                MatButtonModule,
                MatToolbarModule,
                RouterTestingModule
            ],
            declarations: [ LaspFooterComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LaspFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
