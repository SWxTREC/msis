import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    samplePayload: {} = {
        objectType: 'cylinder',
        diameter: 1.25,
        length: 2.5,
        area: 0,
        pitch: 30,
        sideslip: 0,
        temperature: 800,
        speed: 7750,
        composition: {
            O: 1e11,
            O2: 1e6,
            N2: 1e6,
            He: 1e6,
            H: 1e4
        },
        accomodationModel: 'SESAM',
        accomodationParameters: {
            alpha: 0,
            ms: 0
        }
    };

    constructor(private http: HttpClient) { }

    submitSinglePointRequest( payload: any ) {
        this.http.post<any>( environment.vectorApi + '/singlepoint', payload).subscribe(data => {
            console.log('response!', data);
        });
    }

}
