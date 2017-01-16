(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('drugsWithLevels', drugsWithLevels)
    .controller('drugsWithLevelsController', drugsWithLevelsController);

  // @ngInject
  function drugsWithLevels() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: drugsWithLevelsController
    };
    return directive;
  }

  // @ngInject
  function drugsWithLevelsController($scope,
                                          $rootScope,
                                          $element,
                                          d3,
                                          dimple,
                                          _) {
    console.log('drugsWithLevels loaded.');
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

    // var p = chart.addMeasureAxis('p', 'Count');
    // p.tickFormat = d3.format(',.0f');
    // chart.addSeries('Origin', dimple.plot.pie);
    // var l = chart.addLegend(260, 20, 90, 300, 'left');

    chart.addMeasureAxis('x', 'Count');
    var y = chart.addCategoryAxis('y', 'Drug');
    y.addOrderRule('Drug');
    chart.addSeries('Level', dimple.plot.bar);
    var l = chart.addLegend(300, 10, 510, 20, 'left');
    chart.draw();

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    chart.data =  _.chain(options.data)
      .map((val, key) => {
        return _.map(val, (v,k) =>{ return { Drug: key, Level: _.capitalize(k), Count: v } })
      })
      .flatten()
      .value();

    chart.draw();

    $scope.chart = chart;
  }
})();
