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
                                     $window,
                                     $rootScope,
                                     $element,
                                     d3,
                                     dimple,
                                     _,
                                     Stats) {
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

    chart.setMargins(options.margin.left, options.margin.top, options.margin.right, options.margin.bottom);

    chart.addMeasureAxis('x', 'Count');

    var y = chart.addCategoryAxis('y', 'Drug');
    y.addOrderRule('Count', false);

    var s = chart.addSeries('Level', dimple.plot.bar);
    s.addOrderRule('Level', true);

    var l = chart.addLegend('50%', '90%', 220, 20, 'left');

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.orderBy(l._getEntries_old.apply(this, arguments), ['key'], ['desc']);
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.top_drugs_with_levels;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(val, key){
          var complete = _.merge({a:0,b:0,c:0,d:0,e:0}, val);
          return _.chain(complete)
            .map(function(v,k){
              return { Drug: key, Level: _.capitalize(k), Count: v };
            })
            .value();
        })
        .flatten()
        .orderBy(['Drug', 'Level'], ['asc', 'desc'])
        .value();

      chart.draw(options.transitionDuration);
    });

    var onResize = function () { chart.draw(0, true); };

    angular.element($window).on('resize', onResize);
    $scope.$on('$destroy', function () {
      angular.element($window).off('resize', onResize);
    });

    $scope.chart = chart;
  }
})();
