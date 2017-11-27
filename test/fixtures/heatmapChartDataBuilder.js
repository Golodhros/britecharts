define(function(require) {
    'use strict';

    var _ = require('underscore'),

        jsonGithubCommits = require('json-loader!../json/heatmapGithubCommits.json');


    function HeatmapDataBuilder(config){
        this.Klass = HeatmapDataBuilder;

        this.config = _.defaults({}, config);

        this.withGithubCommits = function(){
            var attributes = _.extend({}, this.config, jsonGithubCommits);

            return new this.Klass(attributes);
        };

        this.build = function() {
            return this.config.data;
        };
    }

    return {
        HeatmapDataBuilder: HeatmapDataBuilder
    };

});
