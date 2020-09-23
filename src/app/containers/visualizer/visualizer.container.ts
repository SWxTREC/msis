import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { IAltitudeData, IAltitudeParameters, ISurfaceData, ISurfaceParameters } from 'src/app/models';
import { ModelService } from 'src/app/services';

export const DATEPICKER_FORMAT = {
    parse: {
        dateInput: 'YYYY-MM-DD'
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'swt-visualizer',
    templateUrl: './visualizer.container.html',
    styleUrls: [ './visualizer.container.scss' ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMAT }
    ]
})
export class VisualizerComponent implements OnInit {
    invalidFieldMessage: string;
    invalidFields: string[];
    modelForm = new FormGroup({
        date: new FormControl(moment.utc(), [ Validators.required, Validators.min(0) ]),
        // default to penticton around 100.1 for now
        f107: new FormControl(100.1, [ Validators.required, Validators.min(0) ]),
        f107a: new FormControl(99.8, [ Validators.required, Validators.min(0) ]),
        // default to ap of 48 for now
        ap: new FormControl(48, [ Validators.required, Validators.min(0) ])
    });
    surfaceForm = new FormGroup({
        altitude: new FormControl(200, [ Validators.min(0), Validators.max(1000) ])
    });
    altitudeForm = new FormGroup({
        latitude: new FormControl(0, [ Validators.min(-90), Validators.max(90) ]),
        longitude: new FormControl(0, [ Validators.min(-180), Validators.max(360) ])
    });
    surfaceData: ISurfaceData;
    altitudeData: IAltitudeData;
    variables = [
        'AnomO',
        'Ar',
        'H',
        'He',
        'Mass',
        'N',
        'N2',
        'N0',
        'O',
        'O2',
        'Temperature'
    ];
    private surfacePoints = d3.json('https://gist.githubusercontent.com/greglucas/c00879a8463fa1a931caca2a5bc4b713/raw/a2e789985ad14bd5b3dc8e090914884a58b82ff5/surface_points.json').then(function(data) {
        return data;
    });
    private altitudePoints = d3.json('https://gist.githubusercontent.com/greglucas/c00879a8463fa1a931caca2a5bc4b713/raw/a2e789985ad14bd5b3dc8e090914884a58b82ff5/altitude_test.json').then(function(data) {
        return data;
    });
    private surfaceVariable = 'H';
    surfaceSvg;
    altitudeSvg;
    private path;
    // TODO: Make these reactive or put a few breakpoints for good sizes in
    private margin = 40;
    private surfaceWidth = 800 - (this.margin * 2);
    private surfaceHeight = 600 - (this.margin * 2);
    private altitudeHeight = this.surfaceHeight;
    private altitudeWidth = 270 - (this.margin * 2);
    private altitudeXscale;
    private altitudeYscale;

    constructor(
        private modelService: ModelService
    ) {}

    ngOnInit() {
        // create the SVGs and draw the initial default plots
        this.createSurfaceSvg();
        this.createAltitudeSvg();
        // Moving onto the actual data now
        const _this = this;
        this.surfacePoints.then(function(data) {
            return _this.drawSurface(data);
        });
        this.altitudePoints.then(function(data) {
            return _this.drawAltitude(data);
        });

        // this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //     this.surfaceData = cloneDeep(results);
        // });
        // this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //     this.altitudeData = cloneDeep(results);
        // });

        // this.modelForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //         this.surfaceData = cloneDeep(results);
        //     });
        //     this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //         this.altitudeData = cloneDeep(results);
        //     });
        // });
        // this.surfaceForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitSurfaceRequest( this.getSurfaceParams() ).subscribe( (results: ISurfaceData) => {
        //         this.surfaceData = cloneDeep(results);
        //     });
        // });
        // this.altitudeForm.valueChanges.pipe(
        //     debounceTime(300)
        // ).subscribe( () => {
        //     this.modelService.submitAltitudeRequest( this.getAltitudeParams() ).subscribe( (results: IAltitudeData) => {
        //         this.altitudeData = cloneDeep(results);
        //     });
        // });
    }

    getAltitudeParams(): IAltitudeParameters {
        return {
            ap: this.modelForm.value.ap,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107,
            f107a: this.modelForm.value.f107a,
            latitude: this.altitudeForm.value.latitude,
            longitude: this.altitudeForm.value.longitude
        };
    }

    getSurfaceParams(): ISurfaceParameters {
        return {
            altitude: this.surfaceForm.value.altitude,
            ap: this.modelForm.value.ap,
            date: this.modelForm.value.date.format('YYYY-MM-DDTHH:mm'),
            f107: this.modelForm.value.f107,
            f107a: this.modelForm.value.f107a
        };
    }

    getValidationMessage( control: string ): string {
        switch (control) {
        case 'date':
            if ( this.modelForm.controls.date.hasError('required') ) {
                return 'you must select a date';
            }
            break;
        case 'altitude':
            if ( this.surfaceForm.controls.altitude.hasError('min') ) {
                return 'altitude must be positive';
            }
            break;
        case 'latitude':
            if ( this.altitudeForm.controls.latitude.hasError('min') || this.altitudeForm.controls.latitude.hasError('max') ) {
                return 'must be between -90 and 90';
            }
            break;
        case 'longitude':
            if ( this.altitudeForm.controls.longitude.hasError('min') || this.altitudeForm.controls.longitude.hasError('max') ) {
                return 'must be between -180 and 360';
            }
            break;
        }
    }

    private createSurfaceSvg(): void {
        // Create the surface SVG first
        const svg = d3.select('#surface')
        .append('svg')
        .attr('width', this.surfaceWidth + 2 * this.margin)
        .attr('height', this.surfaceHeight + 2 * this.margin);

        // TODO: We might need to fix the width of this to maintain scale/translation?
        const projection = d3.geoEqualEarth()
        .scale(140)
        .translate([ this.surfaceWidth / 2 + this.margin, this.surfaceHeight / 2 + this.margin ])
        .center([ 0, 0 ]);
        const path = d3.geoPath(projection);
        this.path = path;

        svg.append('path')
            .attr('id', 'outline')
            .attr('d', path({ type: 'Sphere' }))
            .attr('fill', 'none')
            .attr('stroke', 'black');

        const land = d3.json(
            'https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m_land.geojson'
        ).then(function(data: any) {
            return svg.append('g')
                .append('path')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('d', path(data));
        });
        // save to the class variable for later use
        this.surfaceSvg = svg;
    }

    private createAltitudeSvg(): void {
        // Create the surface SVG first
        const svg = d3.select('#altitude')
        .append('svg')
            .attr('width', this.altitudeWidth + 2 * this.margin)
            .attr('height', this.altitudeHeight + 2 * this.margin);

        // Set up the axes
        this.altitudeXscale = d3.scaleLog()
        .domain([ 1e6, 1e17 ])
        .range([ this.margin, this.altitudeWidth ]);

        this.altitudeYscale = d3.scaleLinear()
        .domain([ 0, 1000 ])
        .range([ this.altitudeHeight, this.margin ]);

        const xAxis = g => g
            .attr('transform', `translate(0,${this.altitudeHeight})`)
            .call(d3.axisBottom(this.altitudeXscale).ticks(this.altitudeWidth / 80).tickSizeOuter(0))
            .call(g => g.select('.tick:last-of-type text').clone()
                .attr('y', 20)
                .attr('x', -10)
                .attr('text-anchor', 'start')
                .attr('font-weight', 'bold')
                .text('Density (N/m3)'));

        const yAxis = g => g
            .attr('transform', `translate(${this.margin},0)`)
            .call(d3.axisLeft(this.altitudeYscale))
            .call(g => g.select('.tick:last-of-type text').clone()
                .attr('x', -30)
                .attr('y', -15)
                .attr('text-anchor', 'start')
                .attr('font-weight', 'bold')
                .text('Altitude (km)'));

        svg.append('g')
            .call(xAxis);
        svg.append('g')
            .call(yAxis);

        // save the object for later use
        this.altitudeSvg = svg;
    }

    private drawSurface(data: any) {
        // Draw the surface map
        const variable = this.surfaceVariable;
        const surfaceColor = d3.scaleSequential(d3.interpolatePlasma)
            .domain([ d3.min<number>(data[variable]), d3.max<number>(data[variable]) ]);
        const svg = this.surfaceSvg;
        const path = this.path;
        const poly_from_point = this.poly_from_point;
        data[variable].map(function(result: any, i: number) {
            svg.append('path')
                .attr('id', result['Longitude'])
                .attr('fill', surfaceColor(result))
                .style('opacity', 0.5)
                .style('stroke-opacity', 0.5)
                .attr('d', path(poly_from_point(data['Longitude'][i],
                    data['Latitude'][i])));
        });

        // draw a red box around the altitude profile location
        svg.append('path')
        .attr('id', 'altitude-box')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('d', path(poly_from_point(this.altitudeForm.value.longitude,
            this.altitudeForm.value.latitude)));
    }

    private poly_from_point(lon: number, lat: number) {
        return {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {
                        name: 'Rect'
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ [ [ lon - 2.5, lat - 2.5 ],
                        [ lon - 2.5, lat + 2.5 ],
                        [ lon + 2.5, lat + 2.5 ],
                        [ lon + 2.5, lat - 2.5 ],
                        [ lon - 2.5, lat - 2.5 ] ] ]
                    }
                }
            ]
        };
    }

    private drawAltitude(data: any) {
        // 10 distinct colors
        const altitudeColor = d3.scaleOrdinal(d3.schemeCategory10);

        // Set up the axes
        const xScale = this.altitudeXscale;
        const yScale = this.altitudeYscale;

        const line = d3.line()
            .x(function(d) {
                return xScale(d);
            })
            .y(function(d, i) {
                return yScale(data['Altitude'][i]);
            } );

        const svg = this.altitudeSvg;
        // make a horizontal surface line
        // hard coding the xScale values for now
        const surfaceHeight = this.surfaceForm.value.altitude;
        svg.append('line')
        .attr('class', 'surface-line')
        .attr('stroke', 'black')
        .attr('stroke-width', 2.5)
        .attr('x1', xScale(1e6))
        .attr('y1', yScale(surfaceHeight))
        .attr('x2', xScale(1e17))
        .attr('y2', yScale(surfaceHeight));

        // Temperature doesn't work well here. May need to make shared x-axes to handle
        // that and Mass variables since they are on totally different scales
        const variables = [ 'Mass', 'N2', 'O2', 'O', 'He', 'H', 'Ar', 'N', 'AnomO', 'NO' ];
        const variable = this.surfaceVariable;
        variables.forEach((d, i) => {
            svg.append('path')
                .datum(d)
                .attr('id', d)
                .attr('fill', 'none')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', d === variable ? 3 : 1) // thicker line for surface var
                .style('stroke', altitudeColor(d)) // dynamic variable coloring
                .attr('d', line(data[d]));

            // Add the Legend
            const space = 20;
            svg.append('text')
                .attr('y', (space * 2) + i * space) // spacing
                .attr('x', 200)
                .attr('class', 'legend')    // style the legend
                .style('fill', altitudeColor(d)) // dynamic variable coloring
                .on('click', function() {
                    // Update whether or not the elements are active
                    // d.active = d.active ? true : false;
                    // Determine if current line is visible
                    // Hide or show the elements
                    // d3.select('#' + d).style('opacity', d.active ? 1 : 0);
                    // d.active = d.active ? 0 : 1;
                })
                .text(d);
        });
    }

}
