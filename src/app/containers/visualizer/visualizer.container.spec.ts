import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/modules';

import { VisualizerComponent } from './visualizer.container';

describe('VisualizerComponent', () => {
    let component: VisualizerComponent;
    let fixture: ComponentFixture<VisualizerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ VisualizerComponent ],
            imports: [
                BrowserAnimationsModule,
                HttpClientModule,
                ReactiveFormsModule,
                MaterialModule
            ]
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VisualizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should round numbers to 4 decimal places', () => {
        const longNumber = 9.99999999999999999999999999;
        const longNumberBig = 1233999.123399999999999999999999999;
        expect(component.round(longNumber, 4)).toEqual('10.0000');
        expect(component.round(longNumberBig, 4)).toEqual('1233999.1234');
    });
});
