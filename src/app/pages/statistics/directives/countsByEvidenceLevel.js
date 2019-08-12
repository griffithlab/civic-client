(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('countsByEvidenceLevel', countsByEvidenceLevel)
    .controller('countsByEvidenceLevelController', countsByEvidenceLevelController);

  // @ngInject
  function countsByEvidenceLevel() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      templateUrl: 'app/pages/statistics/directives/chartPie.tpl.html',
      controller: countsByEvidenceLevelController
    };
    return directive;
  }

  // @ngInject
  function countsByEvidenceLevelController($scope,
                                           $window,
                                           $rootScope,
                                           $element,
                                           d3,
                                           dimple,
                                           _,
                                          Stats) {
    console.log('countsByEvidenceLevel loaded.');
    var options = $scope.options;

    var svg = d3.select($element[0])
        .selectAll('.chart-pie')
        .append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('id', options.id)
        .style('overflow', 'visible');

    // title
    svg.append('text')
      .attr('x', options.margin.left)
      .attr('y', options.margin.top - 10)
      .style('text-anchor', 'left')
      .style('font-family', 'sans-serif')
      .style('font-weight', 'bold')
      .text(options.title);

    var chart = new dimple.chart(svg)
        .setMargins(0,25,0,25);

    var p = chart.addMeasureAxis('p', 'Count');
    p.tickFormat = d3.format(',.0f');
    chart.addSeries('Level', dimple.plot.pie);

    // colors
    var levelColors = [
      {
        val: 'A',
        color: '#33b358'
      },
      {
        val: 'B',
        color: '#08b1e6'
      },
      {
        val: 'C',
        color: '#616eb2'
      },
      {
        val: 'D',
        color: '#f68f47'
      },
      {
        val: 'E',
        color: '#e24759'
      },
      {
        val: 'F',
        color: '#fce452'
      }
    ];

    _.map(levelColors, function(c) {
      chart.assignColor(c.val, c.color);
    });

    // legend
    var l = chart.addLegend('100%', 25, 50, 300, 'left');
    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.counts_by_evidence_level;
    }, function(data) {
      chart.data = _.map(data, function(key, value) {
        return {
          Level: _.capitalize(value),
          Count: key
        };
      });

      if(chart.data.length === 0) {
        chart.series.forEach(function(series){
          series.shapes.remove();
        });
      }

      chart.draw();
    });

    var onResize = function () { chart.draw(0, true); };

    angular.element($window).on('resize', onResize);
    $scope.$on('$destroy', function () {
      angular.element($window).off('resize', onResize);
    });

    $scope.chart = chart;
  }
})();
