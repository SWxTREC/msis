import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
    MaterialModule
} from '../../modules';


import { FullwidthComponent } from './fullwidth.component';

describe('AboutComponent', () => {
    let component: FullwidthComponent;
    let fixture: ComponentFixture<FullwidthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FullwidthComponent ],
            imports: [ MaterialModule ]
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FullwidthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
