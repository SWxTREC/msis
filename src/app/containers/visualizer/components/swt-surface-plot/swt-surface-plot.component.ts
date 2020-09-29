import { Component, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as d3 from 'd3';
import { clamp } from 'lodash';
import { EARTH_MAP_URL, ISurfaceData } from 'src/app/models';

@Component({
    selector: 'lasp-swt-surface-plot',
    templateUrl: './swt-surface-plot.component.html',
    styleUrls: [ './swt-surface-plot.component.scss' ]
})
export class SwtSurfacePlotComponent implements OnChanges {
    @Input() data: ISurfaceData;
    @Input() latitude = 0;
    @Input() longitude = 0;
    @Input() variable: string;
    @Output() changeLocation: EventEmitter<number[]> = new EventEmitter();

    margin = 40;
    width = 1000 - (this.margin * 2);
    height = 520 - (this.margin * 2);
    hostElement: HTMLElement; // Native element hosting the SVG container
    svg: d3.Selection<SVGElement, {}, HTMLElement, any>; // Top level SVG element
    g: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element
    surfaceColor: d3.ScaleSequential<string>;
    pathFromProjection: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    projection: d3.GeoProjection;

    constructor( private elRef: ElementRef ) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnChanges() {
        this.createSurfaceSvg();
    }

    addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
    }

    createSurfaceSvg(): void {
        this.removeExistingChartFromParent();
        this.setChartDimensions();
        this.setColorScale();
        this.setProjection();
        this.addGraphicsElement();
        this.drawMap();
        this.drawSurface(this.data);
        this.drawAltitudeBox();
    }

    drawAltitudeBox() {
        const geoBox: d3.GeoPermissibleObjects = this.geoBoxFromPoint( this.longitude, this.latitude);
        // draw a red box around the altitude profile location
        this.g.append('path')
            .attr('id', 'altitude-box')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('d', this.pathFromProjection(geoBox));
    }

    drawMap() {
        const objectType: d3.GeoPermissibleObjects = { type: 'Sphere' };
        this.g.append('path')
            .attr('id', 'earth-outline')
            .attr('d', this.pathFromProjection(objectType))
            .attr('fill', 'none')
            .attr('stroke', 'black');

        d3.json( EARTH_MAP_URL ).then((data: any) => {
            this.g.append('g')
                .append('path')
                .attr('id', 'earth-map')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('d', this.pathFromProjection(data));
        });
    }

    drawSurface(data: any) {
        const tooltip = this.g.append('text')
            .attr('class', 'surface__tooltip');
        data[this.variable].map((value: number, i: number) => {
            const latitude: number = data.Latitude[i];
            const longitude: number = data.Longitude[i];
            const coordinates: [number, number] = [ longitude, latitude ];
            const geoBox: d3.GeoPermissibleObjects = this.geoBoxFromPoint(longitude, latitude);
            this.g.append('path')
                .attr('class', 'surface__cell')
                .attr('fill', this.surfaceColor(value))
                .style('opacity', 0.5)
                .style('stroke-opacity', 0.5)
                .attr('d', this.pathFromProjection(geoBox))
                .on('mouseover', () => {
                    tooltip
                        .attr('x', this.projection(coordinates)[0])
                        .attr('y', this.projection(coordinates)[1])
                        .attr('dx', '0.5rem')
                        .attr('dy', '-0.5rem')
                        .text( `(${longitude.toFixed(0)}, ${latitude.toFixed(0)})` );
                    tooltip.append('tspan')
                        .attr('x', this.projection(coordinates)[0])
                        .attr('y', this.projection(coordinates)[1])
                        .attr('dx', '0.5rem')
                        .attr('dy', '0.5rem')
                        .text(() => `${this.variable}: ${value.toExponential(3)} m`)
                        .append('tspan')
                            .attr('baseline-shift', 'super')
                            .attr('font-size', '70%')
                            .text('-3');
                })
                .on('click', () => {
                    this.changeLocation.emit([ longitude, latitude ]);
                });
        });
    }

    geoBoxFromPoint(lon: number, lat: number): d3.GeoPermissibleObjects {
        const minLon = clamp(lon - 2.5, -180, 180);
        const maxLon = clamp(lon + 2.5, -180, 180);
        const minLat = clamp(lat - 2.5, -90, 90);
        const maxLat = clamp(lat + 2.5, -90, 90);

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
                        coordinates: [ [ [ minLon, minLat ],
                        [ minLon, maxLat ],
                        [ maxLon, maxLat ],
                        [ maxLon, minLat ],
                        [ minLon, minLat ] ] ]
                    }
                }
            ]
        };
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
    }

    setColorScale() {
        this.surfaceColor = d3.scaleSequential(d3.interpolatePlasma)
            .domain([ d3.min<number>(this.data[this.variable]), d3.max<number>(this.data[this.variable]) ]);
    }

    setProjection() {
        this.projection = d3.geoEqualEarth()
            .scale(187)
            .translate([ this.width / 2, this.height / 2 ]);
        this.pathFromProjection = d3.geoPath(this.projection);
    }
}
