import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    data: {};

    constructor(private http: HttpClient) { }

    submitSinglePointRequest( payload: any ) {
        return this.http.post<any>( environment.vectorApi + '/singlepoint', payload);
    }

    submitGeometryFile( file: any ) {
        const formData = new FormData();
        formData.append('geometryFile', file);
        return this.http.post<any>( environment.vectorApi + '/image', formData, { responseType: 'blob' as 'json' } );
    }

}
