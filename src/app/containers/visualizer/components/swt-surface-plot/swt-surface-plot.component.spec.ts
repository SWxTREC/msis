import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwtSurfacePlotComponent } from './swt-surface-plot.component';

describe('SwtSurfacePlotComponent', () => {
    let component: SwtSurfacePlotComponent;
    let fixture: ComponentFixture<SwtSurfacePlotComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SwtSurfacePlotComponent ]
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SwtSurfacePlotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
