(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('countsByClinicalSignificance', countsByClinicalSignificance)
    .controller('countsByClinicalSignificanceController',
                countsByClinicalSignificanceController);

  // @ngInject
  function countsByClinicalSignificance() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="chart-pie"></div>',
      controller: countsByClinicalSignificanceController
    };
    return directive;
  }

  // @ngInject
  function countsByClinicalSignificanceController($scope,
                                          $rootScope,
                                          $element,
                                          d3,
                                          dimple,
                                          _) {
    console.log('countsByClinicalSignificance loaded.');
    var options = $scope.options;

    var svg = d3.select($element[0])
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

    var chart = new dimple.chart(svg);

    var p = chart.addMeasureAxis('p', 'Count');
    p.tickFormat = d3.format(',.0f');
    chart.addSeries('Clinical Significance', dimple.plot.pie);
    chart.addLegend(270, 20, 90, 300, 'left');

    chart.data = _.map(options.data, function(key, value) {
      return {
        'Clinical Significance': _.capitalize(value),
        Count: key
      };
    });
    chart.draw();

    $scope.chart = chart;
  }
})();
