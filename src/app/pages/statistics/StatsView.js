(function() {
  angular.module('civic.pages')
    .config(StatisticsConfig)
    .controller('StatisticsController', StatisticsController);

  // @ngInject
  function StatisticsConfig($stateProvider) {
    $stateProvider
      .state('statistics', {
        url: '/statistics',
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/statistics.tpl.html',
        resolve: {
          data: function(Stats) {
            return Stats.dashboard();
          }
        },
        data: {
          titleExp: '"Statistics"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function StatisticsController($scope, data) {
    var vm = $scope.vm = {};
    var chartWidth = 290,
        chartHeight = 290;

    var margins = {
      top: 25,
      right: 10,
      bottom: 10,
      left: 10
    };

    vm.options = {
      countsByEvidenceType: {
        width: chartWidth,
        height: chartHeight,
        title: 'Counts by Evidence Type',
        margin: margins,
        data: data.counts_by_evidence_type
      },
      countsByEvidenceLevel: {
        width: chartWidth,
        height: chartHeight,
        title: 'Counts by Evidence Level',
        margin: margins,
        data: data.counts_by_evidence_level
      },
      countsByEvidenceDirection: {
        width: chartWidth,
        height: chartHeight,
        title: 'Counts by Evidence Direction',
        margin: margins,
        data: data.counts_by_evidence_direction
      }
    };
  }
})();
