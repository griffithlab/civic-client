(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('diseasesWithTypes', diseasesWithTypes)
    .controller('diseasesWithTypesController', diseasesWithTypesController);

  // @ngInject
  function diseasesWithTypes() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: diseasesWithTypesController
    };
    return directive;
  }

  // @ngInject
  function diseasesWithTypesController($scope,
                                       $window,
                                       $rootScope,
                                       $element,
                                       d3,
                                       dimple,
                                       _,
                                       Stats) {
    console.log('diseasesWithTypes loaded.');
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

    var x = chart.addMeasureAxis('x', 'Count');
    x.tickFormat = ',.2r';
    var y = chart.addCategoryAxis('y', 'Disease');
    y.addOrderRule('Count');
    chart.addSeries('Type', dimple.plot.bar);
    var l = chart.addLegend('60%', '80%', 50, 200, 'left');

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.top_diseases_with_types;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(val, key){
          return _.chain(val)
            .map(function(v,k) {
              return { Disease: key, 'Type': _.capitalize(k), Count: v };
            })
            .value();
        })
        .flatten()
        .value();

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
