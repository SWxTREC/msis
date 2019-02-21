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

@Injectable()
export class DatasetService {
    private datasets = exampleDatasets;

    getAllDatasets() {
        return this.datasets;
    }

    searchDatasets( query: string ) {
        return this.datasets.filter( dataset => dataset.name.includes( query ) );
    }
}
