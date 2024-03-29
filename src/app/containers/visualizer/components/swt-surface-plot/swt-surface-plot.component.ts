import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
    @Input() dateTime: moment.Moment;
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
    g2: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element drawn over the top of "g"
    colorBar: d3.Selection<SVGElement, {}, HTMLElement, any>; // Color bar
    tooltip: d3.Selection<SVGElement, {}, HTMLElement, any>; // tooltip for the plot
    surfaceColor: d3.ScaleSequential<string>;
    pathFromProjection: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    projection: d3.GeoProjection;
    timer: d3.Timer;

    constructor(private _elRef: ElementRef) {
        this.hostElement = this._elRef.nativeElement;
    }

    ngOnInit() {
        this.setInitialSvg();
    }

    ngOnChanges( changes: SimpleChanges ) {
        if ( changes.dateTime && !changes.dateTime.firstChange && this.dateTime ) {
            this.setProjection();
            this.g2.selectAll('.lonLine').remove();
            this.g2.selectAll('.lonLineText').remove();
            this.drawLongitudeLines();
            this.updateDraw();
        }
        if (this.data) {
            this.setSurfaceCells(this.data);
            this.fillSurfaceCells();
            this.drawColorBar();
            this.drawAltitudeBox();
        }
    }

    addGraphicsElement() {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
        this.g2 = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin + ',' + this.margin + ')');
    }

    drawAltitudeBox() {
        // remove any existing altitude boxes
        this.g2.selectAll('#altitude-box').remove();
        const geoBox: d3.GeoPermissibleObjects = this.geoBoxFromPoint(this.longitude, this.latitude);
        // draw a red box around the altitude profile location
        this.g2
            .append('path')
            .attr('id', 'altitude-box')
            .datum(geoBox)
            .attr('pointer-events', 'none')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('d', this.pathFromProjection);
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

    drawLongitudeLines() {
        // Add 6am, noon, 6pm, and midnight lines
        const sixAm = this.centerLongitude > -90 ? this.centerLongitude - 90 : this.centerLongitude + 270;
        const noon = this.centerLongitude;
        const sixPm = this.centerLongitude < 90 ? this.centerLongitude + 90 : this.centerLongitude - 270;
        const midnight = this.centerLongitude > 0 ? this.centerLongitude - 180 : this.centerLongitude + 180;

        const featureCollection = {
            name: 'LongitudeLines',
            type: 'FeatureCollection',
            features: [
                {
                    type: 'LineString',
                    coordinates: [ [ sixAm, -90 ], [ sixAm, -45 ], [ sixAm, 0 ], [ sixAm, 45 ], [ sixAm, 90 ] ],
                    properties: { name: '6 AM', longitude: sixAm }
                },
                {
                    type: 'LineString',
                    coordinates: [ [ noon, -90 ], [ noon, -45 ], [ noon, 0 ], [ noon, 45 ], [ noon, 90 ] ],
                    properties: { name: 'noon', longitude: noon }
                },
                {
                    type: 'LineString',
                    coordinates: [ [ sixPm, -90 ], [ sixPm, -45 ], [ sixPm, 0 ], [ sixPm, 45 ], [ sixPm, 90 ] ],
                    properties: { name: '6 PM', longitude: sixPm }
                },
                {
                    type: 'LineString',
                    coordinates: [ [ midnight, -90 ], [ midnight, -45 ], [ midnight, 0 ], [ midnight, 45 ], [ midnight, 90 ] ],
                    properties: { name: 'midnight', longitude: midnight }
                }
            ]
        };

        this.g2.selectAll('.lonLine')
            .data(featureCollection.features as any)
            .enter()
            .append('path')
            .attr('pointer-events', 'none')
            .attr('class', 'lonLine')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.75)
            .attr('d', this.pathFromProjection);

        this.g2.selectAll('.lonLineText')
            .data(featureCollection.features)
            .enter()
            .append('text')
            .attr('class', 'lonLineText')
            .attr('pointer-events', 'none')
            .attr('x', (d) => this.projection([ d.properties.longitude, 50 ])[0])
            .attr('y', (d) => this.projection([ d.properties.longitude, 50 ])[1])
            .attr('dy', '0.8rem')
            .attr('font-size', '100%')
            .attr('text-anchor', 'middle')
            .text(d => d.properties.name);
    }

    drawMap() {
        const objectType: d3.GeoPermissibleObjects = { type: 'Sphere' };
        this.g2.append('path')
            .attr('id', 'earth-outline')
            .datum(objectType)
            .attr('d', this.pathFromProjection)
            .attr('pointer-events', 'none')
            .attr('fill', 'none')
            .attr('stroke-width', 0.5)
            .attr('stroke', 'black');

        d3.json(EARTH_MAP_URL).then((data: any) => {
            this.g2.selectAll('.country__outlines')
                .data(data.features)
                .enter()
                .append('path')
                .attr('class', 'country__outlines')
                .attr('id', 'earth-map')
                .attr('pointer-events', 'none')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('d', this.pathFromProjection);
        });
    }

    fillSurfaceCells() {
        // Update the colorscale we are using
        this.setColorScale();
        // update the fill color of the surface cells
        this.g.selectAll('.surface__cell')
            .attr('shape-rendering', 'crispEdges')
            .attr('fill', (feature: any) => {
                return this.surfaceColor(this.getData(feature.properties.index));
            })
            .attr('fill-opacity', 0.8)
            // eslint-disable-next-line @typescript-eslint/naming-convention
            .on('mouseover', (_: any, feature: any) => {
                // mouseover returns the MouseEvent and then the feature as the second argument
                const coordinates: [number, number] = [ feature.properties.Longitude, feature.properties.Latitude ];
                const pixelCoordinates: [number, number] = this.projection(coordinates);
                this.tooltip
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('opacity', 1)
                    .attr('x', pixelCoordinates[0])
                    .attr('y', pixelCoordinates[1] - 30)
                    .attr('dx', '0.5rem')
                    .attr('dy', '-0.5rem')
                    .text(`(${feature.properties.Longitude.toFixed(0)}, ${feature.properties.Latitude.toFixed(0)})`);

                this.tooltip.append('tspan')
                    .attr('pointer-events', 'none')
                    .attr('x', pixelCoordinates[0])
                    .attr('y', pixelCoordinates[1] - 30)
                    .attr('dx', '0.5rem')
                    .attr('dy', '0.5rem')
                    .text(() => `${this.variable}: ${this.getData(feature.properties.index).toExponential(3)}`);

                if (this.variable === 'Mass') {
                    this.tooltip.append('tspan')
                        .text(' kg/m')
                        .append('tspan')
                        .attr('baseline-shift', 'super')
                        .attr('font-size', '70%')
                        .text('3');
                } else if (this.variable === 'Temperature') {
                    this.tooltip.append('tspan')
                        .text(' K');
                } else {
                    this.tooltip.append('tspan')
                        .text(' m')
                        .append('tspan')
                        .attr('baseline-shift', 'super')
                        .attr('font-size', '70%')
                        .text('-3');
                }
            })
            // eslint-disable-next-line @typescript-eslint/naming-convention
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

    setMapInteractivity() {
        // add tooltip
        this.tooltip = this.g2.append('text')
            .attr('class', 'surface__tooltip')
            .attr('pointer-events', 'none');
        // remove the tooltip when we move out of the svg
        this.g.on('mouseleave', () => this.tooltip.transition().duration(500).attr('opacity', 0));

        const sensitivity = 75;
        const initialScale = 170;
        // Drag
        this.g.call(d3.drag().on('drag', (event: any) => {
            // stop the timer
            this.timer.stop();
            const rotate = this.projection.rotate();
            const k = sensitivity / this.projection.scale();
            this.projection.rotate([
                rotate[0] + event.dx * k,
                rotate[1] - event.dy * k
            ]);
            this.updateDraw();
        }));

        // Zoom
        this.g.call(d3.zoom()
            .on('zoom', (event: any) => {
                if (event.transform.k > 0.3) {
                    this.projection.scale(initialScale * event.transform.k);
                    this.updateDraw();
                } else {
                    event.transform.k = 0.3;
                }
            })
        );
        this.g.on('dblclick.zoom', null);

        // Automatic roation
        this.timer = d3.interval( () => {
            const rotate = this.projection.rotate();
            const k = sensitivity / this.projection.scale();
            this.projection.rotate([
                rotate[0] - 1 * k,
                rotate[1]
            ]);
            this.updateDraw();
        }, 200);
    }

    setInitialSvg(): void {
        this.setChartDimensions();
        this.setProjection();
        this.addGraphicsElement();
        this.setSurfaceCells(this.data);
        this.drawMap();
        this.drawLongitudeLines();
        this.setMapInteractivity();
    }

    setProjection() {
        const hour = moment.utc(this.dateTime).hour();
        const minute = moment.utc(this.dateTime).minute();
        this.centerLongitude = 180 - (hour + minute / 60) / 24 * 360;
        this.projection = d3.geoOrthographic()
            .scale(170)
            // Center the plot under local noon
            // 12 UTC == 0 degrees, 18 UTC == 90 degrees (rotates opposite direction)
            .rotate([ -this.centerLongitude, 0 ])
            // tilt it down a little bit
            .rotate([ 0, -30 ])
            .translate([ this.width / 2, this.height / 2 - this.legendHeight ]);
        this.pathFromProjection = d3.geoPath(this.projection);
    }

    setSurfaceCells(data: any) {
        const featureCollection = this.geoFeatureCollection(data);
        this.g.selectAll('.surface__cell')
            .data(featureCollection.features)
            .enter()
            .append('path')
            .attr('class', 'surface__cell')
            .attr('d', this.pathFromProjection);
    }

    updateDraw() {
        // our projection has been moved, so update the path creator
        this.pathFromProjection = d3.geoPath(this.projection);
        // update all the geopaths
        this.svg.selectAll('path').attr('d', this.pathFromProjection);
        this.svg.selectAll('.lonLineText')
            .attr('x', (d: any) => this.projection([ d.properties.longitude, 50 ])[0] )
            .attr('y', (d: any) => this.projection([ d.properties.longitude, 50 ])[1] );
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
