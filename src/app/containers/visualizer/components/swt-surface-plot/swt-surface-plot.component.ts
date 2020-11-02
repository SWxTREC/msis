import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import { clamp } from 'lodash';
import { Moment } from 'moment';
import { EARTH_MAP_URL, EMPTY_SURFACE_DATA, ISurfaceData } from 'src/app/models';

@Component({
    selector: 'lasp-swt-surface-plot',
    templateUrl: './swt-surface-plot.component.html',
    styleUrls: [ './swt-surface-plot.component.scss' ]
})
export class SwtSurfacePlotComponent implements OnChanges, OnInit {
    @Input() data: ISurfaceData = EMPTY_SURFACE_DATA;
    @Input() date: Moment;
    @Input() latitude = 0;
    @Input() longitude = 0;
    @Input() variable: string;
    @Output() changeLocation: EventEmitter<number[]> = new EventEmitter();

    centerLongitude = 0;
    margin = 40;
    width = 1000 - (this.margin * 2);
    height = 520 - (this.margin * 2);
    hostElement: HTMLElement; // Native element hosting the SVG container
    svg: d3.Selection<SVGElement, {}, HTMLElement, any>; // Top level SVG element
    g: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element
    altitudeBox: d3.Selection<SVGElement, {}, HTMLElement, any>; // Altitude box
    surfaceCells: d3.Selection<SVGElement, {}, SVGElement, any>; // All of the surface polygons
    surfaceColor: d3.ScaleSequential<string>;
    pathFromProjection: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    projection: d3.GeoProjection;

    constructor(private elRef: ElementRef) {
        this.hostElement = this.elRef.nativeElement;
        console.log('data', this.data, EMPTY_SURFACE_DATA);
    }

    ngOnInit() {
        this.createSurfaceSvg();
    }

    ngOnChanges() {
        if (this.data) {
            this.drawSurface(this.data);
            this.updateSurface();
        }
    }

    addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
    }

    createSurfaceSvg(): void {
        this.setChartDimensions();
        this.setProjection();
        this.addGraphicsElement();
        this.drawMap();
        this.drawSurface(this.data);
    }

    drawAltitudeBox() {
        const geoBox: d3.GeoPermissibleObjects = this.geoBoxFromPoint(this.longitude, this.latitude);
        // draw a red box around the altitude profile location
        this.altitudeBox = this.g
            .append('path')
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

        d3.json(EARTH_MAP_URL).then((data: any) => {
            this.g.append('g')
                .append('path')
                .attr('id', 'earth-map')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('d', this.pathFromProjection(data));
        });

        // Add 6am, noon, 6pm lines
        const l0 = this.centerLongitude > -90 ? this.centerLongitude - 90 : this.centerLongitude + 270;
        const l1 = this.centerLongitude;
        const l2 = this.centerLongitude < 90 ? this.centerLongitude + 90 : this.centerLongitude - 270;
        this.drawLatitudeLabels(l0, '6 AM');
        this.drawLatitudeLabels(l1, 'noon');
        this.drawLatitudeLabels(l2, '6 PM');
    }

    drawLatitudeLabels(lon: number, label: string) {
        this.g.append('path')
            .attr('class', 'latLine')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('d', this.pathFromProjection(
                { type: 'LineString', coordinates: [ [ lon, -90 ], [ lon, -45 ], [ lon, 0 ], [ lon, 45 ], [ lon, 90 ] ] }
            ));
        this.g.append('text')
            .attr('x', this.projection([ lon, 90 ])[0])
            .attr('y', this.projection([ lon, 90 ])[1] - 15)
            .attr('dy', '0.5rem')
            .attr('font-size', '100%')
            .attr('text-anchor', 'middle')
            .text(label);
    }

    updateSurface() {
        // Update the colorscale we are using
        this.setColorScale();
        // update the fill color of the surface cells
        this.surfaceCells.attr('fill', (feature: any) => {
            return this.surfaceColor(this.getData(feature.properties['index']));
        })
        .attr('fill-opacity', 0.5);
        // update the location of the altitude box
        this.altitudeBox.attr('d', this.pathFromProjection(this.geoBoxFromPoint(this.longitude, this.latitude)));
    }

    drawSurface(data: any) {
        const featureCollection = this.geoFeatureCollection(data);
        this.surfaceCells = this.g.selectAll('.surface__cell')
            .data(featureCollection.features)
            .enter()
            .append('path')
            .attr('class', 'surface__cell')
            .attr('d', this.pathFromProjection);

        const tooltip = this.g.append('text')
            .attr('class', 'surface__tooltip');
        this.surfaceCells
            .on('mouseover', (_: any, feature: any) => {
                // mouseover returns the MouseEvent and then the feature as the second argument
                const coordinates: [number, number] = [ feature.properties.Longitude, feature.properties.Latitude ];
                const pixelCoordinates: [number, number] = this.projection(coordinates);
                tooltip
                    .attr('x', pixelCoordinates[0])
                    .attr('y', pixelCoordinates[1])
                    .attr('dx', '0.5rem')
                    .attr('dy', '-0.5rem')
                    .text(`(${feature.properties.Longitude.toFixed(0)}, ${feature.properties.Latitude.toFixed(0)})`);
                tooltip.append('tspan')
                    .attr('x', pixelCoordinates[0])
                    .attr('y', pixelCoordinates[1])
                    .attr('dx', '0.5rem')
                    .attr('dy', '0.5rem')
                    .text(() => `${this.variable}: ${this.getData(feature.properties['index']).toExponential(3)} m`)
                    .append('tspan')
                    .attr('baseline-shift', 'super')
                    .attr('font-size', '70%')
                    .text('-3');
            })
            .on('click', (_: any, feature: any) => {
                this.changeLocation.emit([ feature.properties.Longitude, feature.properties.Latitude ]);
            });

        // Add an altitude Box in
        this.drawAltitudeBox();
    }

    getData(i: number): number {
        // Return the data value for the current variable and index
        return this.data[this.variable][i];
    }

    geoFeatureCollection(data: any): any {
        // Create an empty featureCollection that we can populate
        const featureCollection = {
            name: 'SurfacePolygons',
            type: 'FeatureCollection',
            features: []
        };

        // Map over every point in the data and create a single
        // Feature polygon
        if ( data ) {
            data['Longitude'].map((longitude: number, i: number) => {
                const latitude: number = data.Latitude[i];
                const feature: any = this.geoBoxFromPoint(longitude, latitude);
                // Store the index to reference data later on
                feature.properties['index'] = i;
                feature.properties['Longitude'] = longitude;
                feature.properties['Latitude'] = latitude;
                // Add the feature into the list of features on the collection
                featureCollection.features.push(feature);
            });
        }
        return featureCollection;
    }

    geoBoxFromPoint(lon: number, lat: number): d3.GeoPermissibleObjects {
        const minLon = clamp(lon - 2.5, -180, 180);
        const maxLon = clamp(lon + 2.5, -180, 180);
        const minLat = clamp(lat - 2.5, -90, 90);
        const maxLat = clamp(lat + 2.5, -90, 90);

        return {
            type: 'Feature',
            properties: {
                name: 'Rect:' + lon + ',' + lat
            },
            geometry: {
                type: 'Polygon',
                coordinates: [ [ [ minLon, minLat ],
                [ minLon, maxLat ],
                [ maxLon, maxLat ],
                [ maxLon, minLat ],
                [ minLon, minLat ] ] ]
            }
        };
    }

    setChartDimensions() {
        const viewBoxHeight = this.height + (this.margin * 2);
        const viewBoxWidth = this.width + (this.margin * 2);
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
        this.centerLongitude = 180 - (this.date.hour() + this.date.minute() / 60) / 24 * 360;
        this.projection = d3.geoEqualEarth()
            .scale(187)
            // Center the plot under local noon
            // 12 UTC == 0 degrees, 18 UTC == 90 degrees (rotates opposite direction)
            .rotate([ -this.centerLongitude, 0 ])
            .translate([ this.width / 2, this.height / 2 ]);
        this.pathFromProjection = d3.geoPath(this.projection);
    }
}
