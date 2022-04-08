import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { IAltitudeData } from 'src/app/models';

@Component({
    selector: 'swt-altitude-plot',
    templateUrl: './swt-altitude-plot.component.html',
    styleUrls: [ './swt-altitude-plot.component.scss' ]
})
export class SwtAltitudePlotComponent implements OnChanges {
    @Input() altitude: number;
    @Input() data: IAltitudeData;
    @Input() variable: string;
    @Input() variables: string[] = [];

    altitudeXscale: d3.ScaleLogarithmic<number, number> | d3.AxisScale<d3.AxisDomain>;
    altitudeYscale: d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    colorArray: string[];
    filteredVariables: string[];
    g: d3.Selection<SVGElement, {}, HTMLElement, any>; // SVG Group element
    hostElement: HTMLElement; // Native element hosting the SVG container
    margin: { top: number; right: number; bottom: number; left: number} = {
        top: 20,
        right: 0,
        bottom: 35,
        left: 35
    };
    height = 525 - (this.margin.top + this.margin.bottom);
    width = 270 - (this.margin.left + this.margin.right);
    svg: d3.Selection<SVGElement, {}, HTMLElement, any>; // Top level SVG element
    xDomain: [number, number] = [ 1e-10, 1e20 ];
    xScale: d3.ScaleLogarithmic<number, number>;
    yScale: d3.ScaleLinear<number, number>;

    constructor( private _elRef: ElementRef ) {
        this.hostElement = this._elRef.nativeElement;
    }

    ngOnChanges(): void {
        this.filteredVariables = [ ...this.variables ].filter( variable =>
            variable !== 'Temperature' &&
            variable !== 'Mass' &&
            variable !== 'AnomO'
        );
        this.createAltitudeSvg();
    }

    addGraphicsElement(): void {
        this.g = this.svg.append('g')
            .attr('transform', 'translate( ' + this.margin.left + ',' + this.margin.top + ')');
    }

    createAltitudeSvg(): void {
        this.removeExistingChartFromParent();
        this.setChartDimensions();
        this.setColors();
        this.setXDomain(this.filteredVariables);
        this.setXScale();
        this.setYScale();
        this.addGraphicsElement();
        this.drawXAxis();
        this.drawYAxis();
        this.drawSurfaceLine();
        this.drawAltitude();
        this.drawLegend();
    }

    drawAltitude(): void {
        const getLine = d3.line()
            .defined(d => d !== null)
            .x((d) => this.xScale(+d))
            .y((d, i) => this.yScale(this.data['Altitude'][i]));
        this.filteredVariables.forEach( d => {
            const color = this.colorArray[this.variables.indexOf(d)];
            if ( this.data[d] ) {
                this.g.append('path')
                    .datum(this.data[d])
                    .attr('id', d)
                    .attr('fill', 'none')
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', d === this.variable ? 3 : 1) // thicker line for surface var
                    .style('stroke', color) // dynamic variable coloring
                    .attr('d', getLine);
            }
        });
    }

    drawLegend(): void {
        // Add the Legend
        const space = this.margin.top / 2;
        this.g.append('rect')
            .attr('x', this.width - 55)
            .attr('y', -this.margin.top - 2)
            // .attr('rx', 7)
            .attr('width', 57)
            .attr('height', (space) + this.variables.length * space * 1.5 )
            .style('opacity', 0.8)
            .style('stroke', 'silver')
            .style('fill', 'white');

        this.variables.forEach( (d, i) => {
            const activeVariable: boolean = this.filteredVariables.includes(d);
            this.g.append('text')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 'small')
                .attr('x', this.width - (space / 2))
                .attr('y', i * space * 1.5 - (space / 2)) // spacing
                .attr('text-anchor', 'end')
                .attr('class', d === this.variable ? 'altitude__legend--active' : 'altitude__legend') // style the legend
                .style('fill', activeVariable ? this.colorArray[i] : 'silver' ) // dynamic variable coloring
                .text(d === 'Temperature' ? 'Temp' : d)
                .on('click', () => {
                    let newVariables: string[];
                    const setVariables: Set<any> = new Set(this.filteredVariables);
                    if ( setVariables.has(d) ) {
                        setVariables.delete(d);
                        newVariables = Array.from(setVariables);
                    } else {
                        setVariables.add(d);
                        newVariables = Array.from(setVariables);
                    }
                    this.setXDomain(newVariables);
                    this.filteredVariables = newVariables;
                    this.createAltitudeSvg();
                })
                .append('svg:title')
                    .text(`toggle`);
        });

    }

    drawSurfaceLine(): void {
        // make a horizontal surface line
        this.g.append('line')
            .attr('class', 'surface-line')
            .attr('stroke', '#8987C5')
            .attr('stroke-width', '3')
            .style('stroke-dasharray', ('8,3'))
            .attr('x1', this.xScale(this.xDomain[0]))
            .attr('y1', this.yScale(this.altitude))
            .attr('x2', this.xScale(this.xDomain[1]))
            .attr('y2', this.yScale(this.altitude));
    }

    drawXAxis() {
        const xAxis = this.g.append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(this.xScale).ticks(this.width / 80).tickSizeOuter(0));
        const label = xAxis.append('text')
            .attr('class', 'axis__label')
            .attr('y', this.margin.bottom - 5)
            .attr('x', this.width)
            .attr('dx', -5)
            .attr('fill', 'black')
            .attr('text-anchor', 'end');
        label.append('tspan')
            .text('Density (');
        label.append('tspan')
            .text('m');
        label.append('tspan')
            .attr('baseline-shift', 'super')
            .attr('font-size', '70%')
            .text('-3');
        label.append('tspan')
            .text(')');
    }

    drawYAxis() {
        this.g.append('g')
            .call(d3.axisLeft(this.yScale))
            .call(g => g.select('.tick:last-of-type text').clone()
                .attr('x', -30)
                .attr('y', -15)
                .attr('text-anchor', 'start')
                .attr('font-weight', 'bold')
                .text('Altitude (km)'));
    }

    removeExistingChartFromParent() {
        // !!!!Caution!!!
        // Make sure not to do;
        //     d3.select('svg').remove();
        // That will clear all other SVG elements in the DOM
        d3.select(this.hostElement).select('svg').remove();
    }

    setChartDimensions() {
        const viewBoxHeight = this.height + ( this.margin.bottom + this.margin.top ) ;
        const viewBoxWidth = this.width + ( this.margin.left + this.margin.right );
        this.svg = d3.select(this.hostElement).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
    }

    setColors() {
        // 10 distinct colors
        const altitudeColor = d3.scaleOrdinal(d3.schemeCategory10);
        this.colorArray = this.variables.map( d => altitudeColor(d) );
    }

    setXScale() {
        this.xScale = d3.scaleLog()
            .domain(this.xDomain)
            .range([ 0, this.width ]);
    }

    setYScale() {
        this.yScale = d3.scaleLinear()
            .domain([ 0, 1000 ])
            .range([ this.height, 0 ]);
    }

    setXDomain( variables: string[] ) {
        // make one long array of all the variable values
        const allValues = variables.reduce( (aggregator: number[], variable: string) => aggregator.concat(this.data[variable]), []);
        this.xDomain = d3.extent(allValues);
    }
}
