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
    });
});
