define(function(require) {
    'use strict';

    const d3Array = require('d3-array');
    const d3Ease = require('d3-ease');
    const d3Axis = require('d3-axis');
    const d3Color = require('d3-color');
    const d3Interpolate = require('d3-interpolate');
    const d3Dispatch = require('d3-dispatch');
    const d3Format = require('d3-format');
    const d3Scale = require('d3-scale');
    const d3Selection = require('d3-selection');
    const d3Transition = require('d3-transition');

    const colorHelper = require('./helpers/colors');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /**
     * @typedef HeatmapData
     * @type {Array[]}
     * @property {Number[]} values
     *              {Number} values[0] weekday (0: Monday, 6: Sunday)
     *              {Number} values[1] hour
     *              {Number} values[2] quantity
     *
     * @example
     * [
     *      [0, 1, 3],
     *      [1, 2, 4]
     * ]
     */

    /**
     * Heatmap reusable API class that renders a
     * simple and configurable heatmap.
     *
     * @module Heatmap
     * @tutorial heatmap
     * @requires d3-array, d3-axis, d3-dispatch, d3-scale, d3-selection
     *
     * @example
     * var heatmapChart = heatmap();
     *
     * heatmapChart
     *     .height(500)
     *     .width(800);
     *
     * d3Selection.select('.css-selector')
     *     .datum(dataset)
     *     .call(heatmapChart);
     *
     */
    return function module() {

        let margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 960,
            height = 500,
            chartWidth, chartHeight,
            svg,
            data,

            boxes,
            boxSize = 20,
            
            colorSchema = colorHelper.colorSchemas.extendedLightBlueColorSchema,
            colorScale,

            // Dispatcher object to broadcast the mouse events
            // Ref: https://github.com/mbostock/d3/wiki/Internals#d3_dispatch
            dispatcher = d3Dispatch.dispatch('customMouseOver', 'customMouseOut');
        
        /**
         * This function creates the graph using the selection as container
         * @param  {D3Selection} _selection A d3 selection that represents
         *                                  the container(s) where the chart(s) will be rendered
         * @param {HeatmapData} _data The data to attach and generate the chart
         */
        function exports(_selection) {
            _selection.each(function(_data) {
                chartWidth = width - margin.left - margin.right;
                chartHeight = height - margin.top - margin.bottom;
                data = cleanData(_data);

                buildScales();
                // buildAxis();
                buildSVG(this);
                drawBoxes();
                // drawAxis();
            });
        }

        /**
         * Creates the d3 x and y axis, setting orientations
         * @private
         */
        function buildAxis() {
            if (isHorizontal) {
                xAxis = d3Axis.axisBottom(xScale)
                    .ticks(numOfHorizontalTicks, valueLabelFormat)
                    .tickSizeInner([-chartHeight]);

                yAxis = d3Axis.axisLeft(yScale);
            } else {
                xAxis = d3Axis.axisBottom(xScale);

                yAxis = d3Axis.axisLeft(yScale)
                    .ticks(numOfVerticalTicks, valueLabelFormat)
            }
        }

        /**
         * Builds containers for the chart, the axis and a wrapper for all of them
         * Also applies the Margin convention
         * @private
         */
        function buildContainerGroups() {
            let container = svg
                .append('g')
                  .classed('container-group', true)
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

            container
                .append('g').classed('chart-group', true);
            container
                .append('g').classed('x-axis-group axis', true);
            container
                .append('g').classed('y-axis-group axis', true);
            container
                .append('g').classed('metadata-group', true);
        }

        /**
         * Builds the SVG element that will contain the chart
         * @param  {HTMLElement} container DOM element that will work as the container of the graph
         * @private
         */
        function buildSVG(container) {
            if (!svg) {
                svg = d3Selection.select(container)
                    .append('svg')
                      .classed('britechart heatmap-chart', true);

                buildContainerGroups();
            }

            svg
                .attr('width', width)
                .attr('height', height);
        }

        /**
         * Creates the x and y scales of the graph
         * @private
         */
        function buildScales() {
            colorScale = d3Scale.scaleLinear()
                    .range([colorSchema[0], colorSchema[colorSchema.length - 1]])
                    .domain(d3Array.extent(data, function (d) { return d[2] }))
                    .interpolate(d3Interpolate.interpolateHcl);
        }

        /**
         * Cleaning data adding the proper format
         * @param  {HeatmapData} originalData Data
         * @private
         */
        function cleanData(originalData) {
            let data = originalData.map((d) => {
                    return [ +d[0], +d[1], +d[2]];
                });

            return data;
        }

        /**
         * Custom OnMouseOut event handler
         * @return {void}
         * @private
         */
        function customOnMouseOut(e, d, chartWidth, chartHeight) {
            dispatcher.call('customMouseOut', e, d, d3Selection.mouse(e), [chartWidth, chartHeight]);
        }
 
        /**
         * Custom OnMouseOver event handler
         * @return {void}
         * @private
         */
        function customOnMouseOver(e, d, chartWidth, chartHeight) {
            dispatcher.call('customMouseOver', e, d, d3Selection.mouse(e), [chartWidth, chartHeight]);
            console.log(d[2] + ' commits between ' + d[1] + ':00 and ' + d[1] + ':59 at ' + days[d[0]]);
        }

        /**
         * Draws the boxes that form the heatmap
         * @private
         */
        function drawBoxes() {
            boxes = svg.select('.chart-group').selectAll('.box')
                    .data(data);

            boxes.enter()
              .append('rect')
                .attr('x', function (d) { return d[1] * boxSize; })
                .attr('y', function (d) { return d[0] * boxSize; })
                .attr('width', boxSize)
                .attr('height', boxSize)
                .style('fill', function (d) { return colorScale(d[2]); })
                .classed('box', true)
                .on('mouseover', function (d) {
                    customOnMouseOver(this, d, chartWidth, chartHeight);
                })
                .on('mouseout', function (d) {
                    customOnMouseOut(this, d, chartWidth, chartHeight);
                });
        }


        // API

        /**
         * Gets or Sets the height of the chart
         * @param  {number} _x Desired width for the graph
         * @return { height | module} Current height or Heatmap Chart module to chain calls
         * @public
         */
        exports.height = function(_x) {
            if (!arguments.length) {
                return height;
            }
            height = _x;

            return this;
        };

        /**
         * Gets or Sets the margin of the chart
         * @param  {object} _x Margin object to get/set
         * @return { margin | module} Current margin or Heatmap Chart module to chain calls
         * @public
         */
        exports.margin = function(_x) {
            if (!arguments.length) {
                return margin;
            }
            margin = _x;

            return this;
        };

        /**
         * Exposes an 'on' method that acts as a bridge with the event dispatcher
         * We are going to expose this events:
         * customMouseOver and customMouseOut
         *
         * @return {module} Heatmap Chart
         * @public
         */
        exports.on = function() {
            let value = dispatcher.on.apply(dispatcher, arguments);

            return value === dispatcher ? exports : value;
        };

        /**
         * Gets or Sets the width of the chart
         * @param  {number} _x Desired width for the graph
         * @return { width | module} Current width or Heatmap Chart module to chain calls
         * @public
         */
        exports.width = function(_x) {
            if (!arguments.length) {
                return width;
            }
            width = _x;

            return this;
        };

        return exports;
    };
});
