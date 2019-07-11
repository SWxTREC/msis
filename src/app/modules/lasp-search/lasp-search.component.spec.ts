import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatIconModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { LaspSearchComponent } from './lasp-search.component';

describe('SearchComponent', () => {
    let component: LaspSearchComponent;
    let fixture: ComponentFixture<LaspSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FlexLayoutModule,
                FormsModule,
                MatButtonModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [ LaspSearchComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LaspSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
