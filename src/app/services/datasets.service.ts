import { Injectable } from '@angular/core';

export interface IDataset {
    name: string;
    description?: string;
}

export const exampleDatasets: IDataset[] = [{
    name: 'Bremen Composite Mg II Index'
}, {
    name: 'CA II K-Line'
}, {
    name: 'FISM Daily'
}, {
    name: 'GOME Mg II Index'
}, {
    name: 'MinXSS'
}, {
    name: 'OMI Solar Indices'
}, {
    name: 'SDO EVE Bands - Level 2B'
}, {
    name: 'TIMED SEE EGS SSI - Level 2'
}];

@Injectable({
    providedIn: 'root'
})
export class DatasetService {
    private _datasets = exampleDatasets;

    getAllDatasets() {
        return this._datasets;
    }

    searchDatasets( query: string ) {
        return this._datasets.filter( dataset => dataset.name.toLowerCase().includes( query ) );
    }
}
