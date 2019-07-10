import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-missions',
    templateUrl: './missions.container.html'
})
export class MissionsComponent implements OnInit {
    name: string;

    constructor( private _route: ActivatedRoute ) {}

    ngOnInit() {
        this._route.paramMap.subscribe(
            params => this.name = params.get('id')
        );
    }
}
