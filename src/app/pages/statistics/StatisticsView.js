(function() {
  angular.module('civic.pages')
    .config(StatisticsConfig)
    .controller('StatisticsController', StatisticsController);

  // @ngInject
  function StatisticsConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('statistics', {
        url: '/statistics',
        abstract: true,
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/statisticsView.tpl.html',
        resolve: {
          data: function(Stats) {
            return Stats.dashboard();
          }
        },
        data: {
          titleExp: '"Statistics"',
          navMode: 'sub'
        }
      })
      .state('statistics.evidence', {
        url: '/evidence',
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/evidence-stats.tpl.html',
        data: {
          titleExp: '"Statistics: Evidence"',
          navMode: 'sub'
        }
      })
      .state('statistics.drugs', {
        url: '/drugs',
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/drugs-stats.tpl.html',
        data: {
          titleExp: '"Statistics: Drugs"',
          navMode: 'sub'
        }
      })
      .state('statistics.diseases', {
        url: '/diseases',
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/diseases-stats.tpl.html',
        data: {
          titleExp: '"Statistics: Diseases"',
          navMode: 'sub'
        }
      })
      .state('statistics.sources', {
        url: '/sources',
        controller: 'StatisticsController',
        templateUrl: 'app/pages/statistics/sources-stats.tpl.html',
        data: {
          titleExp: '"Statistics: Sources"',
          navMode: 'sub'
        }
      });

    $urlRouterProvider.when('/statistics', '/statistics/evidence');
  }

  // @ngInject
  function StatisticsController($scope, data) {
    var vm = $scope.vm = {};
    var pieChartWidth = 290,
        pieChartHeight = 290;

    var barChartWidth = 540,
        barChartHeight = 540;

    var pieMargins = {
      top: 25,
      right: 10,
      bottom: 10,
      left: 10
    };

    var barMargins = {
      top: 25,
      right: 10,
      bottom: 30,
      left: 150
    };

    vm.options = {
      countsByEvidenceType: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Type',
        margin: pieMargins,
        data: data.counts_by_evidence_type
      },
      countsByEvidenceLevel: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Level',
        margin: pieMargins,
        data: data.counts_by_evidence_level
      },
      countsByEvidenceDirection: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Direction',
        margin: pieMargins,
        data: data.counts_by_evidence_direction
      },
      countsByVariantOrigin: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Variant Origin',
        margin: pieMargins,
        data: data.counts_by_variant_origin
      },
      countsByClinicalSignificance: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Clinical Significance',
        margin: pieMargins,
        data: data.counts_by_clinical_significance
      },
      countsByRating: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Rating',
        margin: pieMargins,
        data: data.counts_by_rating
      },
      countsByStatus: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Status',
        margin: pieMargins,
        data: data.counts_by_status
      },
      drugsWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Levels',
        margin: barMargins, 
        data: data.top_drugs_with_levels
      },
      drugsWithClinicalSignificance: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Clinical Significance',
        margin: barMargins, 
        data: data.top_drugs_with_clinical_significance
      }
    };
  }
})();
