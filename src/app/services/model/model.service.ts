import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAltitudeParameters, ISurfaceParameters } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    constructor(private _http: HttpClient) { }

    submitSurfaceRequest( params: ISurfaceParameters ) {
        return this._http.get(environment.msisApi + 'surface', { params: params as any } );
    }

    submitAltitudeRequest( params: IAltitudeParameters ) {
        return this._http.get(environment.msisApi + 'altitude', { params: params as any });
    }
}
