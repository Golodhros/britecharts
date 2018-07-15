define(function (require) {
    'use strict';

    var _ = require('underscore'),

        jsonWeekly = require('json-loader!../json/heatmapWeekly.json');


    function HeatmapDataBuilder(config) {
        this.Klass = HeatmapDataBuilder;

        this.config = _.defaults({}, config);

        this.withWeeklyData = function () {
            var attributes = _.extend({}, this.config, jsonWeekly);

            return new this.Klass(attributes);
        };

        this.build = function () {
            return this.config.data;
        };
    }

    return {
        HeatmapDataBuilder: HeatmapDataBuilder
    };
});
