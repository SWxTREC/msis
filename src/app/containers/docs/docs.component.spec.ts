import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/modules';

import { DocsComponent } from './docs.component';

describe('DocsComponent', () => {
    let component: DocsComponent;
    let fixture: ComponentFixture<DocsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ DocsComponent ],
            imports: [
                HttpClientModule,
                MarkdownModule.forRoot({ loader: HttpClient }),
                MaterialModule
            ]
        })
    .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
