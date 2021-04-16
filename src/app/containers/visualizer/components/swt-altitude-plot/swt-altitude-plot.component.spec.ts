import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwtAltitudePlotComponent } from './swt-altitude-plot.component';

describe('SwtAltitudePlotComponent', () => {
    let component: SwtAltitudePlotComponent;
    let fixture: ComponentFixture<SwtAltitudePlotComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ SwtAltitudePlotComponent ]
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SwtAltitudePlotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
