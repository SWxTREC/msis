import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';
import { clamp } from 'lodash';
import * as moment from 'moment';
import { EARTH_MAP_URL, EMPTY_SURFACE_DATA, ISurfaceData } from 'src/app/models';

@Component({
    selector: 'swt-surface-plot',
    templateUrl: './swt-surface-plot.component.html',
    styleUrls: [ './swt-surface-plot.component.scss' ]
})
export class SwtSurfacePlotComponent implements OnChanges, OnInit {
    @Input() data: ISurfaceData = EMPTY_SURFACE_DATA;
    @Input() date: moment.Moment;
    @Input() latitude = 0;
    @Input() longitude = 0;
    @Input() variable: string;
    @Output() changeLocation: EventEmitter<number[]> = new EventEmitter();

    centerLongitude = 0;
    margin = 40;
    width = 1000 - (this.margin * 2);
    height = 520 - (this.margin * 2);
    legendWidth = this.width / 2;
    legendHeight = 20;
    hostElement: HTMLElement; // Native element hosting the SVG container
    svg: d3.Selection<SVGElement, {}, HTMLElement, any>; // Top level SVG element
    g: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element
    altitudeBox: d3.Selection<SVGElement, {}, HTMLElement, any>; // Altitude box
    colorBar: d3.Selection<SVGElement, {}, HTMLElement, any>; // Color bar
    surfaceCells: d3.Selection<SVGElement, {}, SVGElement, any>; // All of the surface polygons
    surfaceColor: d3.ScaleSequential<string>;
    pathFromProjection: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    projection: d3.GeoProjection;

    constructor(private elRef: ElementRef) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnInit() {
        this.setInitialSvg();
    }

    ngOnChanges() {
        if (this.data) {
            this.setSurfaceCells(this.data);
            this.fillSurfaceCells();
            this.drawColorBar();
        }
    }

    addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
    }

    drawAltitudeBox() {
        if ( this.altitudeBox ) {
            this.svg.selectAll('#altitude-box').remove();
        }

        const geoBox: d3.GeoPermissibleObjects = this.geoBoxFromPoint(this.longitude, this.latitude);
        // draw a red box around the altitude profile location
        this.altitudeBox = this.g
            .append('path')
            .attr('id', 'altitude-box')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('d', this.pathFromProjection(geoBox));
    }

    drawColorBar() {
        if ( this.colorBar ) {
            this.svg.selectAll('#color-bar').remove();
        }
        // Append a linearGradient element to the defs and give it a unique id
        const linearGradient = this.svg.append('defs').append('linearGradient')
            .attr('id', 'linear-gradient');

        const surfaceColorAny = this.surfaceColor as any;

        // Draw the rectangle and fill with gradient
        this.colorBar = this.svg.append('g')
            .attr('transform', `translate(0,${this.height + this.margin})`)
            .append('rect')
            .attr('id', 'color-bar')
            .attr('transform', `translate(${this.margin + this.width / 2 - this.legendWidth / 2}, 0)`)
            .attr('width', this.legendWidth)
            .attr('height', this.legendHeight)
            .style('fill', 'url(#linear-gradient)')
            .attr('fill-opacity', 0.8);

        linearGradient.selectAll('stop')
            .data(surfaceColorAny.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: this.surfaceColor(t) })))
            .enter().append('stop')
            .attr('offset', (d: any) => d.offset)
            .attr('stop-color', (d: any) => d.color);

        this.svg.append('g')
            .attr('class', `legendAxis`)
            .attr('transform', `translate(0,${this.height + this.margin + this.legendHeight})`);
        this.updateLegend();
    }

    drawLatitudeLabels(lon: number, label: string) {
        this.g.append('path')
            .attr('class', 'latLine')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('d', this.pathFromProjection(
                { type: 'LineString', coordinates: [ [ lon, -90 ], [ lon, -45 ], [ lon, 0 ], [ lon, 45 ], [ lon, 90 ] ] }
                ));
        this.g.append('text')
            .attr('x', this.projection([ lon, 90 ])[0])
            .attr('y', this.projection([ lon, 90 ])[1] - 15)
            .attr('dy', '0.8rem')
            .attr('font-size', '100%')
            .attr('text-anchor', 'middle')
            .text(label);
    }

    drawMap() {
        const objectType: d3.GeoPermissibleObjects = { type: 'Sphere' };
        this.g.append('path')
            .attr('id', 'earth-outline')
            .attr('d', this.pathFromProjection(objectType))
            .attr('fill', 'none')
            .attr('stroke-width', 0.5)
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

    fillSurfaceCells() {
        // add tooltip
        const tooltip = this.g.append('text')
            .attr('class', 'surface__tooltip');
        // Update the colorscale we are using
        this.setColorScale();
        // update the fill color of the surface cells
        // this.svg.on('mouseout', () => this.svg.selectAll('.surface__tooltip').remove());
        this.surfaceCells
            .attr('shape-rendering', 'crispEdges')
            .attr('fill', (feature: any) => {
                return this.surfaceColor(this.getData(feature.properties.index));
            })
            .attr('fill-opacity', 0.8)
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
                    .text(() => `${this.variable}: ${this.getData(feature.properties.index).toExponential(3)} m`)
                    .append('tspan')
                    .attr('baseline-shift', 'super')
                    .attr('font-size', '70%')
                    .text('-3');
            })
            .on('click', (_: any, feature: any) => {
                this.changeLocation.emit([ feature.properties.Longitude, feature.properties.Latitude ]);
            });
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
            data.Longitude.map((longitude: number, i: number) => {
                const latitude: number = data.Latitude[i];
                const feature: any = this.geoBoxFromPoint(longitude, latitude);
                // Store the index to reference data later on
                feature.properties.index = i;
                feature.properties.Longitude = longitude;
                feature.properties.Latitude = latitude;
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
        this.surfaceColor = d3.scaleSequential(d3.interpolateCividis)
            .domain([ d3.min<number>(this.data[this.variable]), d3.max<number>(this.data[this.variable]) ]);
    }

    setInitialSvg(): void {
        this.setChartDimensions();
        this.setProjection();
        this.addGraphicsElement();
        this.setSurfaceCells(this.data);
        this.drawMap();
    }

    setProjection() {
        this.centerLongitude = 180 - (this.date.hour() + this.date.minute() / 60) / 24 * 360;
        this.projection = d3.geoEqualEarth()
            .scale(170)
            // Center the plot under local noon
            // 12 UTC == 0 degrees, 18 UTC == 90 degrees (rotates opposite direction)
            .rotate([ -this.centerLongitude, 0 ])
            .translate([ this.width / 2, this.height / 2 - this.legendHeight ]);
        this.pathFromProjection = d3.geoPath(this.projection);
    }

    setSurfaceCells(data: any) {
        if ( this.surfaceCells ) {
            this.svg.selectAll('.surface__cell').remove();
            this.svg.selectAll('.surface__tooltip').remove();
        }

        const featureCollection = this.geoFeatureCollection(data);
        this.surfaceCells = this.g.selectAll('.surface__cell')
            .data(featureCollection.features)
            .enter()
            .append('path')
            .attr('class', 'surface__cell')
            .attr('d', this.pathFromProjection);

        // Add an altitude Box in
        this.drawAltitudeBox();
    }

    updateLegend() {
        const legendAxisScale = d3.scaleLinear()
            .domain(this.surfaceColor.domain())
            .range([ this.margin + this.width / 2 - this.legendWidth / 2, this.margin + this.width / 2 + this.legendWidth / 2 ])
            .nice();

        d3.selectAll('.legendAxis')
            .call(d3.axisBottom(legendAxisScale)
                .ticks(this.legendWidth / 80)
                .tickSize(-this.legendHeight)
                .tickFormat(d3.format('.2e')))
            .attr('font-size', '70%');
    }
}
