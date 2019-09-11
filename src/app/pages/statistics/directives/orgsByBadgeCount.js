(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('organizationsByBadgeCount', organizationsByBadgeCount)
    .controller('organizationsByBadgeCountController', organizationsByBadgeCountController);

  // @ngInject
  function organizationsByBadgeCount() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: organizationsByBadgeCountController
    };
    return directive;
  }

  // @ngInject
  function organizationsByBadgeCountController($scope,
                                               $window,
                                               $rootScope,
                                               $element,
                                               d3,
                                               dimple,
                                               _,
                                               Stats) {
    console.log('organizationsByBadgeCount loaded.');
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
    var s = chart.addSeries('Type', dimple.plot.bar);


    var l = chart.addLegend('80%', '70%', 220, 20, 'left');

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      var order = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      return _.sortBy(l._getEntries_old.apply(this, arguments),function(item) {
        return order.indexOf(item.Type);
      });
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.organization_badge_count;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(types, org){
          // sum badge types in each badge category
          var base = {'platinum': 0, 'gold': 0, 'silver': 0, 'bronze':0};
          _.each(types, function(badges,category) {
            _.each(badges, function(count,type){
              base[type] += count;
            });
          });
          // create chart object array, one badge type per object
          return _.chain(base)
            .map(function(count, type){
              return { Organization: org, Type: _.capitalize(type), Count: count };
            })
            .flatten()
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
