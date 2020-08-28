import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAltitudeParameters, ISurfaceParameters } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    constructor(private http: HttpClient) { }

    submitSurfaceRequest( params: ISurfaceParameters ) {
        return this.http.get(environment.msisApi + '/surface', { params: <any>params } );
    }

    submitAltitudeRequest( params: IAltitudeParameters ) {
        return this.http.get<any>(environment.msisApi + '/altitude', { params: <any>params });
    }
}
