define(['d3', 'heatmap', 'heatmapChartDataBuilder'], function(d3, chart, dataBuilder) {
    'use strict';

    function aTestDataSet() {
        return new dataBuilder.HeatmapDataBuilder();
    }

    describe('Heatmap Chart', () => {
        let heatmapChart, dataset, containerFixture, f;

        beforeEach(() => {
            dataset = aTestDataSet()
                .withGithubCommits()
                .build();
            heatmapChart = chart();

            // DOM Fixture Setup
            f = jasmine.getFixtures();
            f.fixturesPath = 'base/test/fixtures/';
            f.load('testContainer.html');

            containerFixture = d3.select('.test-container');
            containerFixture.datum(dataset).call(heatmapChart);
        });

        afterEach(() => {
            containerFixture.remove();
            f = jasmine.getFixtures();
            f.cleanUp();
            f.clearCache();
        });

        it('should render a chart with minimal requirements', () => {
            let actual = containerFixture.select('.heatmap-chart').empty(),
                expected = false;

            expect(actual).toEqual(expected);
        });

        it('should draw a box for each data entry', () => {
            let actual = containerFixture.selectAll('.box').size(),
                expected = dataset.length;

            expect(actual).toEqual(expected);
        });

        describe('API', () => {

            it('should provide height getter and setter', () => {
                let previous = heatmapChart.height(),
                    expected = {top: 4, right: 4, bottom: 4, left: 4},
                    actual;

                heatmapChart.height(expected);
                actual = heatmapChart.height();

                expect(previous).not.toBe(actual);
                expect(actual).toBe(expected);
            });

            it('should provide margin getter and setter', () => {
                let previous = heatmapChart.margin(),
                    expected = {top: 4, right: 4, bottom: 4, left: 4},
                    actual;

                heatmapChart.margin(expected);
                actual = heatmapChart.margin();

                expect(previous).not.toBe(actual);
                expect(actual).toBe(expected);
            });

            it('should provide width getter and setter', () => {
                let previous = heatmapChart.width(),
                    expected = {top: 4, right: 4, bottom: 4, left: 4},
                    actual;

                heatmapChart.width(expected);
                actual = heatmapChart.width();

                expect(previous).not.toBe(actual);
                expect(actual).toBe(expected);
            });
        });

        describe('Lifetime', function() {

            describe('when we go over a box', () => {
                it('should trigger a callback', () => {
                    let box = containerFixture.selectAll('.box:nth-child(1)');
                    let callbackSpy = jasmine.createSpy('callback');

                    heatmapChart.on('customMouseOver', callbackSpy);
                    box.dispatch('mouseover');

                    expect(callbackSpy.calls.count()).toBe(1);
                });
            });

            describe('when we go over a box', () => {
                it('should trigger a callback', () => {
                    let box = containerFixture.selectAll('.box:nth-child(1)');
                    let callbackSpy = jasmine.createSpy('callback');

                    heatmapChart.on('customMouseOut', callbackSpy);
                    box.dispatch('mouseout');

                    expect(callbackSpy.calls.count()).toBe(1);
                });
            });
        });
    });
});
