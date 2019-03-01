import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-datasets',
    templateUrl: './datasets.container.html'
})
export class DatasetsComponent implements OnInit {
    name: string;

    constructor( private route: ActivatedRoute ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(
            params => this.name = params.get('id')
        );
    }
}
