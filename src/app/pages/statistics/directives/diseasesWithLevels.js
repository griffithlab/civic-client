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
                                        _,
                                        Stats) {
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

    var x = chart.addMeasureAxis('x', 'Count');
    x.tickFormat = ',.2r';

    var y = chart.addCategoryAxis('y', 'Disease');
    y.addOrderRule('Count', false);

    var s = chart.addSeries('Level', dimple.plot.bar);
    s.addOrderRule('Level', true);

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

    // override legend sorting
    var l = chart.addLegend('50%', '90%', 220, 20, 'left');
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.top_diseases_with_levels;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(val, key){
          var complete = _.merge({a:0,b:0,c:0,d:0,e:0}, val);
          return _.chain(complete)
            .map(function(v,k) {
              return { Disease: key, 'Level': _.capitalize(k), Count: v };
            })
            .value();
        })
        .flatten()
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
