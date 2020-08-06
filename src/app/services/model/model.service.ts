import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { _getOptionScrollPosition } from '@angular/material/core';

@Injectable({
    providedIn: 'root'
})
export class ModelService {
    data: {};

    constructor(private http: HttpClient) { }

    submitSurfaceRequest(date: Date, altitude: number, f107: number, f107a: number,
        ap: number, options: number[]) {
        return this.http.get<any>(environment.msisApi + '/surface', {
            params: {
                "date": date.toISOString(), // might need to put in setSeconds(0) and milliseconds?
                "altitude": altitude.toString(),
                "f107": f107.toString(),
                "f107a": f107a.toString(),
                "ap": ap.toString(),
                "options": options.toString()
            }
        })
    }

    submitAltitudeRequest(date: Date, longitude: number, latitude: number,
        f107: number, f107a: number,
        ap: number, options: number[]) {
        return this.http.get<any>(environment.msisApi + '/altitude', {
            params: {
                "date": date.toISOString(), // might need to put in setSeconds(0) and milliseconds?
                "longitude": longitude.toString(),
                "latitude": latitude.toString(),
                "f107": f107.toString(),
                "f107a": f107a.toString(),
                "ap": ap.toString(),
                "options": options.toString()
            }
        })
    }
}
