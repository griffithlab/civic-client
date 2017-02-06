(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('diseasesWithLevels', diseasesWithLevels)
    .controller('diseasesWithLevelsController', diseasesWithLevelsController);

  // @ngInject
  function diseasesWithLevels() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: diseasesWithLevelsController
    };
    return directive;
  }

  // @ngInject
  function diseasesWithLevelsController($scope,
                                        $window,
                                        $rootScope,
                                        $element,
                                        d3,
                                        dimple,
                                        _) {
    console.log('diseasesWithLevels loaded.');
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

    chart.setMargins(options.margin.left, options.margin.top, options.margin.right, options.margin.bottom);

    chart.addMeasureAxis('x', 'Count');
    var y = chart.addCategoryAxis('y', 'Disease');
    y.addOrderRule('Count');
    chart.addSeries('Level', dimple.plot.bar);

    // override legend sorting
    var l = chart.addLegend('50%', '90%', 220, 20, 'left');
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    chart.data =  _.chain(options.data)
      .map(function(val, key){
        return _.chain(val)
          .map(function(v,k) {
            return { Disease: key, 'Level': _.capitalize(k), Count: v };
          })
          .value();
      })
      .flatten()
      .value();

    chart.draw();

    var onResize = function () { chart.draw(0, true); };

    angular.element($window).on('resize', onResize);
    $scope.$on('$destroy', function () {
      angular.element($window).off('resize', onResize);
    });

    $scope.chart = chart;
  }
})();
