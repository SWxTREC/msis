import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwtAltitudePlotComponent } from './swt-altitude-plot.component';

describe('SwtAltitudePlotComponent', () => {
    let component: SwtAltitudePlotComponent;
    let fixture: ComponentFixture<SwtAltitudePlotComponent>;

    beforeEach(async(() => {
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
