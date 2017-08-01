'use strict';

const d3Selection = require('d3-selection');
const PubSub = require('pubsub-js');

const heatmap = require('./../src/charts/heatmap');
const colors = require('./../src/charts/helpers/colors');
const dataBuilder = require('./../test/fixtures/heatmapChartDataBuilder');


function createSimpleHeatmapChart() {
    let heatmapChart = heatmap(),
        testDataSet = new dataBuilder.HeatmapDataBuilder(),
        heatmapContainer = d3Selection.select('.js-heatmap-chart-container'),
        containerWidth = heatmapContainer.node() ? heatmapContainer.node().getBoundingClientRect().width : false,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.withGithubCommits().build();

        heatmapChart
            .width(containerWidth)
            .height(300);

        heatmapContainer.datum(dataset).call(heatmapChart);
    }
}

// Show charts if container available
if (d3Selection.select('.js-heatmap-chart-container').node()){
    createSimpleHeatmapChart();

    let redrawCharts = function(){
        d3Selection.selectAll('.heatmap-chart').remove();

        createSimpleHeatmapChart();
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);
}