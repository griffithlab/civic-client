(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('StatisticsController', StatisticsController);

  // @ngInject
  function StatisticsController($scope, Stats) {
    var vm = $scope.vm = {};
    var pieChartWidth = '100%',
        pieChartHeight = 360;

    var barChartWidth = '100%',
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

    var barMarginsWide = {
      top: 25,
      right: 10,
      bottom: 30,
      left: 250
    };

    vm.options = {
      countsByEvidenceType: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Type',
        margin: pieMargins,
        data: []
      },
      countsByEvidenceLevel: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Level',
        margin: pieMargins,
        data: []
      },
      countsByEvidenceDirection: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Direction',
        margin: pieMargins,
        data: []
      },
      countsByVariantOrigin: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Variant Origin',
        margin: pieMargins,
        data: []
      },
      countsByClinicalSignificance: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Clinical Significance',
        margin: pieMargins,
        data: []
      },
      countsByRating: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Rating',
        margin: pieMargins,
        data: []
      },
      countsByStatus: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Status',
        margin: pieMargins,
        data: []
      },
      drugsWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Levels',
        margin: barMargins,
        data: []
      },
      drugsWithClinicalSignificance: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Clinical Significance',
        margin: barMargins,
        data: []
      },
      diseasesWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Diseases with Levels',
        margin: barMarginsWide,
        data: []
      },
      diseasesWithTypes: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Diseases with Types',
        margin: barMarginsWide,
        data: []
      },
      sourcesWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Sources with Levels',
        margin: barMargins,
        data: []
      },
      sourcesWithTypes: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Sources with Types',
        margin: barMargins,
        data: []
      }
    };
    Stats.dashboard()
      .then(function(data) {
        vm.options = {
          countsByEvidenceType: {
            data: data.counts_by_evidence_type
          },
          countsByEvidenceLevel: {
            data: data.counts_by_evidence_level
          },
          countsByEvidenceDirection: {
            data: data.counts_by_evidence_direction
          },
          countsByVariantOrigin: {
            data: data.counts_by_variant_origin
          },
          countsByClinicalSignificance: {
            data: data.counts_by_clinical_significance
          },
          countsByRating: {
            data: data.counts_by_rating
          },
          countsByStatus: {
            data: data.counts_by_status
          },
          drugsWithLevels: {
            data: data.top_drugs_with_levels
          },
          drugsWithClinicalSignificance: {
            data: data.top_drugs_with_clinical_significance
          },
          diseasesWithLevels: {
            data: data.top_diseases_with_levels
          },
          diseasesWithTypes: {
            data: data.top_diseases_with_types
          },
          sourcesWithLevels: {
            data: data.top_journals_with_levels
          },
          sourcesWithTypes: {
            data: data.top_journals_with_types
          }
        };
      });
  }
})();
