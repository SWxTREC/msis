import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ISurfaceData } from 'src/app/models';

@Component({
    selector: 'lasp-swt-surface-plot',
    templateUrl: './swt-surface-plot.component.html',
    styleUrls: [ './swt-surface-plot.component.scss' ]
})
export class SwtSurfacePlotComponent implements OnInit {
    @Input() data: ISurfaceData;
    @Input() latitude = 0;
    @Input() longitude = 0;
    @Input() variable = 'H';

    margin = 40;
    width = 1000 - (this.margin * 2);
    height = 520 - (this.margin * 2);
    hostElement: HTMLElement; // Native element hosting the SVG container
    svg: d3.Selection<SVGElement, {}, HTMLElement, any>; // Top level SVG element
    g: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element
    surfaceColor: d3.ScaleSequential<string>;
    path: d3.GeoPath<any, d3.GeoPermissibleObjects>;

    constructor( private elRef: ElementRef ) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnInit(): void {
        this.createSurfaceSvg();
    }

    createSurfaceSvg(): void {
        this.removeExistingChartFromParent();
        this.setChartDimensions();
        this.setColorScale();
        this.addGraphicsElement();
        console.log('svg', this.svg, this.g, this.hostElement);


        // // Create the surface SVG first
        // const svg = d3.select('#surface')
        // .append('svg')
        // .attr('width', this.width + 2 * this.margin)
        // .attr('height', this.height + 2 * this.margin);

        // TODO: We might need to fix the width of this to maintain scale/translation?
        const projection = d3.geoEqualEarth()
        .scale(187)
        .translate([ this.width / 2, this.height / 2 ]);
        // .center([ 0, 0 ]);
        this.path = d3.geoPath(projection);
        // this.path = path;

        this.g.append('path')
            .attr('id', 'outline')
            .attr('d', this.path({ type: 'Sphere' }))
            .attr('fill', 'none')
            .attr('stroke', 'black');

        const land = d3.json(
            'https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m_land.geojson'
        ).then((data: any) => {
            return this.g.append('g')
                .append('path')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('d', this.path(data));
        });
        // save to the class variable for later use
        // this.surfaceSvg = svg;
    }

    drawSurface(data: any) {
        // Draw the surface map
        // const variable = this.surfaceVariable;
        // const svg = this.surfaceSvg;
        // const path = this.path;
        // const polyFromPoint = this.polyFromPoint;
        const poly = this.polyFromPoint( this.longitude, this.latitude);
        data[this.variable].map(function(result: any, i: number) {
            this.svg.append('path')
                .attr('id', result['Longitude'])
                .attr('fill', this.surfaceColor(result))
                .style('opacity', 0.5)
                .style('stroke-opacity', 0.5)
                .attr('d', this.path(this.polyFromPoint(data['Longitude'][i],
                    data['Latitude'][i])));
        });

        // draw a red box around the altitude profile location
        this.svg.append('path')
        .attr('id', 'altitude-box')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('d', this.path(poly as any));
    }

    polyFromPoint(lon: number, lat: number) {
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

    addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
        this.g.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', this.width )
                .attr('height', this.height )
                .attr('fill', 'none')
                .attr('stroke', 'teal');
    }

    removeExistingChartFromParent() {
        // !!!!Caution!!!
        // Make sure not to do;
        //     d3.select('svg').remove();
        // That will clear all other SVG elements in the DOM
        d3.select(this.hostElement).select('svg').remove();
    }

    setChartDimensions() {
        const viewBoxHeight = this.height + ( this.margin * 2 ) ;
        const viewBoxWidth = this.width + ( this.margin * 2 );
        this.svg = d3.select(this.hostElement).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
        this.svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'none')
            .attr('stroke', 'hotpink');
    }

    setColorScale() {

        // this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        // Below is an example of using custom colors
        // this.colorScale = d3.scaleOrdinal().domain(["0","1","2","3"]).range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
        this.surfaceColor = d3.scaleSequential(d3.interpolatePlasma)
        .domain([ d3.min<number>(this.data[this.variable]), d3.max<number>(this.data[this.variable]) ]);
    }


}
