'use strict';

var d3Selection = require('d3-selection'),

    PubSub = require('pubsub-js'),

    colors = require('./../src/charts/helpers/colors'),

    stackedBarChart = require('./../src/charts/stacked-bar'),
    tooltip = require('./../src/charts/tooltip'),
    stackedDataBuilder = require('./../test/fixtures/stackedBarDataBuilder'),
    colorSelectorHelper = require('./helpers/colorSelector');


function createStackedBarChartWithTooltip(optionalColorSchema) {
    var stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-stacked-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        // dataset = testDataSet.withReportData().build();
        dataset = testDataSet.with3Sources().build();
        // dataset = testDataSet.with6Sources().build();
        // dataset = testDataSet.withSalesChannelData().build();
        // dataset = testDataSet.withLargeData().build();
        // dataset = testDataSet.withGeneratedData().build();

        // StackedAreChart Setup and start
        stackedBar
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .stackLabel('stack')
            .nameLabel('date')
            .valueLabel('views')
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
                chartTooltip.update(dataPoint, topicColorMap, dataPointXPosition);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .title('Testing tooltip');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-stacked-bar-chart-tooltip-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);

        d3Selection.select('#button').on('click', function() {
                stackedBar.exportChart('stacked-bar.png', 'Britecharts Stacked Bar');
        });
    }
}

function createStackedBarChartWithFixedAspectRatio(optionalColorSchema) {
    var stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedBarDataBuilder(),
        container = d3Selection.select('.js-stacked-bar-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        // dataset = testDataSet.withReportData().build();
        dataset = testDataSet.with3Sources().build();
        // dataset = testDataSet.with6Sources().build();
        // dataset = testDataSet.withLargeData().build();

        // StackedAreChart Setup and start
        stackedBar
            .tooltipThreshold(600)
            // .aspectRatio(0.6)
            // .grid('full')
            .width(containerWidth)
            .horizontal(true)
            .nameLabel('date')
            .margin({
                left: 120,
                top: 0,
                right: 0,
                bottom: 20
            })
            .valueLabel('views')
            .stackLabel('stack')
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
                chartTooltip.update(dataPoint, topicColorMap, dataPointXPosition);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
             .dateLabel('key')
            .title('Dummy Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = d3Selection.select('.js-stacked-bar-chart-fixed-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

if (d3Selection.select('.js-stacked-bar-chart-tooltip-container').node()){
    // Chart creation
    createStackedBarChartWithTooltip();
    createStackedBarChartWithFixedAspectRatio();

    // For getting a responsive behavior on our chart,
    // we'll need to listen to the window resize event
    var redrawCharts = function(){
        d3Selection.selectAll('.stacked-bar').remove();

        createStackedBarChartWithTooltip();
        createStackedBarChartWithFixedAspectRatio();
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);

    // Color schema selector
    colorSelectorHelper.createColorSelector('.js-color-selector-container', '.stacked-bar', createStackedBarChartWithTooltip);
}
