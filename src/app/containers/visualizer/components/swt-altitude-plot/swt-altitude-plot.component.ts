import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'lasp-swt-altitude-plot',
    templateUrl: './swt-altitude-plot.component.html',
    styleUrls: [ './swt-altitude-plot.component.scss' ]
})
export class SwtAltitudePlotComponent implements OnInit {

    altitudeXscale: d3.ScaleLogarithmic<number, number> | d3.AxisScale<d3.AxisDomain>;
    altitudeYscale: d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    margin = 40;
    height = 600 - (this.margin * 2);
    width = 270 - (this.margin * 2);
    hostElement; // Native element hosting the SVG container
    svg; // Top level SVG element
    g; // SVG Group element


    constructor( private elRef: ElementRef ) {
        this.hostElement = this.elRef.nativeElement;
    }

    ngOnInit(): void {
    }

    createAltitudeSvg(): void {
        // this.removeExistingChartFromParent();
        // this.setChartDimensions();
        //
        //
        // // Create the surface SVG first
        // const svg = d3.select('#altitude')
        // .append('svg')
        //     .attr('width', this.width + 2 * this.margin)
        //     .attr('height', this.height + 2 * this.margin);
        //
        // // Set up the axes
        // this.altitudeXscale = d3.scaleLog()
        // .domain([ 1e6, 1e17 ])
        // .range([ this.margin, this.width ]);
        //
        // this.altitudeYscale = d3.scaleLinear()
        // .domain([ 0, 1000 ])
        // .range([ this.height, this.margin ]);
        //
        // // const xAxis = g => g
        // //     .attr('transform', `translate(0,${this.height})`)
        // //     .call(d3.axisBottom(this.altitudeXscale).ticks(this.width / 80).tickSizeOuter(0))
        // //     .call(g => g.select('.tick:last-of-type text').clone()
        // //         .attr('y', 20)
        // //         .attr('x', -10)
        // //         .attr('text-anchor', 'start')
        // //         .attr('font-weight', 'bold')
        // //         .text('Density (N/m3)'));
        //
        // // const yAxis = g => g
        // //     .attr('transform', `translate(${this.margin},0)`)
        // //     .call(d3.axisLeft(this.altitudeYscale))
        // //     .call(g => g.select('.tick:last-of-type text').clone()
        // //         .attr('x', -30)
        // //         .attr('y', -15)
        // //         .attr('text-anchor', 'start')
        // //         .attr('font-weight', 'bold')
        // //         .text('Altitude (km)'));
        //
        // // svg.append('g')
        // //     .call(xAxis);
        // // svg.append('g')
        // //     .call(yAxis);
        //
        // // save the object for later use
        // // this.altitudeSvg = svg;
    }

    drawAltitude(data: any) {
        // // 10 distinct colors
        // const altitudeColor = d3.scaleOrdinal(d3.schemeCategory10);
        //
        // // Set up the axes
        // const xScale = this.altitudeXscale;
        // const yScale = this.altitudeYscale;
        //
        // const line = d3.line()
        //     .x(function(d) {
        //         return xScale(d);
        //     })
        //     .y(function(d, i) {
        //         return yScale(data['Altitude'][i]);
        //     } );
        //
        // const svg = this.altitudeSvg;
        // // make a horizontal surface line
        // // hard coding the xScale values for now
        // const surfaceHeight = this.surfaceForm.value.altitude;
        // svg.append('line')
        // .attr('class', 'surface-line')
        // .attr('stroke', 'black')
        // .attr('stroke-width', 2.5)
        // .attr('x1', xScale(1e6))
        // .attr('y1', yScale(surfaceHeight))
        // .attr('x2', xScale(1e17))
        // .attr('y2', yScale(surfaceHeight));
        //
        // // Temperature doesn't work well here. May need to make shared x-axes to handle
        // // that and Mass variables since they are on totally different scales
        // const variables = [ 'Mass', 'N2', 'O2', 'O', 'He', 'H', 'Ar', 'N', 'AnomO', 'NO' ];
        // const variable = this.surfaceVariable;
        // variables.forEach((d, i) => {
        //     svg.append('path')
        //         .datum(d)
        //         .attr('id', d)
        //         .attr('fill', 'none')
        //         .attr('stroke-linejoin', 'round')
        //         .attr('stroke-linecap', 'round')
        //         .attr('stroke-width', d === variable ? 3 : 1) // thicker line for surface var
        //         .style('stroke', altitudeColor(d)) // dynamic variable coloring
        //         .attr('d', line(data[d]));
        //
        //     // Add the Legend
        //     const space = 20;
        //     svg.append('text')
        //         .attr('y', (space * 2) + i * space) // spacing
        //         .attr('x', 200)
        //         .attr('class', 'legend')    // style the legend
        //         .style('fill', altitudeColor(d)) // dynamic variable coloring
        //         .on('click', function() {
        //             // Update whether or not the elements are active
        //             // d.active = d.active ? true : false;
        //             // Determine if current line is visible
        //             // Hide or show the elements
        //             // d3.select('#' + d).style('opacity', d.active ? 1 : 0);
        //             // d.active = d.active ? 0 : 1;
        //         })
        //         .text(d);
        // });
    }

    removeExistingChartFromParent() {
        // !!!!Caution!!!
        // Make sure not to do;
        //     d3.select('svg').remove();
        // That will clear all other SVG elements in the DOM
        d3.select(this.hostElement).select('svg').remove();
    }

    setChartDimensions() {
        const viewBoxHeight = 100;
        const viewBoxWidth = 200;
        this.svg = d3.select(this.hostElement).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);

    }

}
