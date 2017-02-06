(function() {
  'use strict';
  angular.module('civic.pages')
    .directive('countsByEvidenceType', countsByEvidenceType)
    .controller('countsByEvidenceTypeController', countsByEvidenceTypeController);

  // @ngInject
  function countsByEvidenceType() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=',
        palette: '='
      },
      template: '<div class="row"><div class="col-xs-9"><div class="chart-pie"></div></div><div class="col-xs-3"></div></div>',
      controller: countsByEvidenceTypeController
    };
    return directive;
  }

  // @ngInject
  function countsByEvidenceTypeController($scope,
                                          $window,
                                          $rootScope,
                                          $element,
                                          d3,
                                          dimple,
                                          _) {
    console.log('countsByEvidenceType loaded.');
    var options = $scope.options;

    var svg = d3.select($element[0])
        .selectAll('.chart-pie')
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

    var chart = new dimple.chart(svg)
        // .setBounds('50%', '0%', '90%', '90%');
        .setMargins(0,25,0,25);

    // chart.setBounds(20, 20, 460, 360);
    var p = chart.addMeasureAxis('p', 'Count');
    p.tickFormat = d3.format(',.0f');
    chart.addSeries('Type', dimple.plot.pie);
    var l = chart.addLegend('100%', 25, 90, 300, 'left');

    // override legend sorting
    l._getEntries_old = l._getEntries;
    l._getEntries = function() {
      return _.sortBy(l._getEntries_old.apply(this, arguments), 'key');
    };

    chart.data = _.map(options.data, function(key, value) {
      return {
        Type: _.capitalize(value),
        Count: key
      };
    });
    chart.draw();

    var onResize = function () { chart.draw(0, true); };

    angular.element($window).on('resize', onResize);
    $scope.$on('$destroy', function () {
      angular.element($window).off('resize', onResize);
    });

    $scope.chart = chart;
  }
})();
