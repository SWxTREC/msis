import { Injectable } from '@angular/core';

export interface IMission {
    name: string;
    description?: string;
    image?: string;
}

export const exampleMissions: IMission[] = [{
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
}];

@Injectable()
export class MissionService {
    private missions = exampleMissions;

    getAllMissions() {
        return this.missions;
    }

    searchMissions( query: string ) {
        return this.missions.filter( mission => mission.name.toLowerCase().includes( query ) );
    }
}
