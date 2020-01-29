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
        console.log('payload', payload);
        return this.http.post<any>( environment.vectorApi + '/singlepoint', payload);
    }

}
