(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('drugsWithClinicalSignificance', drugsWithClinicalSignificance)
    .controller('drugsWithClinicalSignificanceController', drugsWithClinicalSignificanceController);

  // @ngInject
  function drugsWithClinicalSignificance() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="bar-chart"></div>',
      controller: drugsWithClinicalSignificanceController
    };
    return directive;
  }

  // @ngInject
  function drugsWithClinicalSignificanceController($scope,
                                                   $window,
                                                   $rootScope,
                                                   $element,
                                                   d3,
                                                   dimple,
                                                   _,
                                                   Stats) {
    console.log('drugsWithClinicalSignificance loaded.');
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
    y.addOrderRule('Count');
    chart.addSeries('Clinical Significance', dimple.plot.bar);
    var l = chart.addLegend('50%', '75%', 50, 200, 'left');

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    $scope.$watch(function() {
      return Stats.data.dashboard.top_drugs_with_clinical_significance;
    }, function(data) {
      chart.data =  _.chain(data)
        .map(function(val, key){
          return _.chain(val)
            .map(function(v,k) {
              return { Drug: key, 'Clinical Significance': _.capitalize(k), Count: v };
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
