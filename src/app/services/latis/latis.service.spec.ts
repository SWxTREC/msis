import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { LatisService } from './latis.service';

describe('LatisService', () => {
    let service: LatisService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientModule ]
        });
        service = TestBed.inject(LatisService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
