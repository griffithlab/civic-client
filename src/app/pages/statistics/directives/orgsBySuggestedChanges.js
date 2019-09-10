(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('organizationsBySuggestedChanges', organizationsBySuggestedChanges)
    .controller('organizationsBySuggestedChangesController', organizationsBySuggestedChangesController);

  // @ngInject
  function organizationsBySuggestedChanges() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: organizationsBySuggestedChangesController
    };
    return directive;
  }

  // @ngInject
  function organizationsBySuggestedChangesController($scope,
                                       $window,
                                       $rootScope,
                                       $element,
                                       d3,
                                       dimple,
                                       _,
                                      Stats) {
    console.log('organizationsBySuggestedChanges loaded.');
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
          return _.chain(val.suggested_change_counts)
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
