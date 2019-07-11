import { Injectable } from '@angular/core';

export interface IMission {
    name: string;
    description?: string;
    image?: string;
}

export const exampleMissions: IMission[] = [
    {
        name: 'SDO'
    }, {
        name: 'SME'
    }, {
        name: 'SNOE'
    }, {
        name: 'SORCE'
    }, {
        name: 'TCTE'
    }, {
        name: 'UARS'
    }, {
        name: 'TIMED'
    }
];

@Injectable({
    providedIn: 'root'
})
export class MissionService {
    private _missions = exampleMissions;

    getAllMissions() {
        return this._missions;
    }

    searchMissions( query: string ) {
        return this._missions.filter( mission => mission.name.toLowerCase().includes( query ) );
    }
}
