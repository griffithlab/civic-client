(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('organizationsByUserCount', organizationsByUserCount)
    .controller('organizationsByUserCountController', organizationsByUserCountController);

  // @ngInject
  function organizationsByUserCount() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: organizationsByUserCountController
    };
    return directive;
  }

  // @ngInject
  function organizationsByUserCountController($scope,
                                       $window,
                                       $rootScope,
                                       $element,
                                       d3,
                                       dimple,
                                       _,
                                      Stats) {
    console.log('organizationsByUserCount loaded.');
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

    var y = chart.addCategoryAxis('y', 'Organization');
    y.addOrderRule('Count');
    var s = chart.addSeries(null, dimple.plot.bar);

    $scope.$watch(function() {
      return Stats.data.dashboard.organization_user_count;
    }, function(data) {
      chart.data = _.map(data, function(val, key) {
        return { Organization: key, Count: val };
      });
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
