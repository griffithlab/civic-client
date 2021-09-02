(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('organizationsByAssertionsSubmitted', organizationsByAssertionsSubmitted)
    .controller('organizationsByAssertionsSubmittedController', organizationsByAssertionsSubmitted);

  // @ngInject
  function organizationsByAssertionsSubmitted() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: organizationsByAssertionsSubmittedController
    };
    return directive;
  }

  // @ngInject
  function organizationsByAssertionsSubmittedController($scope,
                                       $window,
                                       $rootScope,
                                       $element,
                                       d3,
                                       dimple,
                                       _,
                                      Stats) {
    console.log('organizationsByAssertionsSubmitted loaded.');
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
    var s = chart.addSeries('Activity', dimple.plot.bar);


    var l = chart.addLegend('80%', '70%', 220, 20, 'left');

    var statusColors = [
      {
        val: 'Accepted',
        color: '#B2D49C'
      },
      {
        val: 'Rejected',
        color: '#ECA2C0'
      },
      {
        val: 'Submitted',
        color: '#F3BC94'
      }
    ];

    _.map(statusColors, function(c) {
      chart.assignColor(c.val, c.color);
    });

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.orderBy(l._getEntries_old.apply(this, arguments), ['key'], ['asc']);
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.organization_activity_count;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(val, key){
          return _.chain(val.assertion_count)
            .map(function(v,k){
              return { Organization: key, Activity: _.capitalize(k), Count: v };
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
