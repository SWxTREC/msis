import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DatasetService, IDataset } from './datasets.service';
import { IMission, MissionService } from './mission.service';

export interface ISearchResults {
    missions: IMission[];
    datasets: IDataset [];
}

const DEFAULT_RESULTS: ISearchResults = {
    missions: [],
    datasets: []
};

/** Service to provide appwide search functions */
@Injectable({
    providedIn: 'root'
})
export class SearchService {
    $results: BehaviorSubject<ISearchResults>;

    constructor(
        private _datasetService: DatasetService,
        private _missionService: MissionService
    ) {
        this.$results = <BehaviorSubject<ISearchResults>>new BehaviorSubject( DEFAULT_RESULTS );
    }

    /** return the observable stream that represents the search results */
    getResults() {
        return this.$results.asObservable();
    }

    /**
     * Sends a search query to the mission and dataset services and aggregates the results
     * @param query - The string to use as a keyword or attribute search
     */
    getSearch( query: string ): void {
        // return empty for empty query
        if ( query === '' ) {
            this.$results.next( DEFAULT_RESULTS );
            return;
        }

        query = query.toLowerCase();

        const missions = this._missionService.searchMissions( query );
        const datasets = this._datasetService.searchDatasets( query );

        // push our results to the subscribers
        this.$results.next({
            missions: missions,
            datasets: datasets
        });
    }
}
