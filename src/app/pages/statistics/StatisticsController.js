(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('StatisticsController', StatisticsController);

  // @ngInject
  function StatisticsController($scope, Stats, Genes) {
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
    vm.model = {
      entrez_name: '',
      limit_by_status: ''

    };

    function updateData() {
      Stats.getDashboard(vm.model);
    }

    vm.Stats = Stats;

    // place on scope for Filter button onClick
    vm.updateData = updateData;

    var fieldClassName = 'col-xs-5';
    vm.formFields = [
      {
        key: 'entrez_name',
        wrapper: 'horizontalLabel',
        type: 'typeahead',
        className: fieldClassName,
        templateOptions: {
          label: 'Gene Entrez Name',
          value: 'vm.newEvidence.gene',
          placeholder: 'Filter by Gene Entrez Name',
          required: false,
          editable: false,
          formatter: 'model[options.key].name',
          typeahead: 'item.name as item.name for item in to.data.typeaheadSearch($viewValue)',
          templateUrl: 'components/forms/fieldTypes/geneTypeahead.tpl.html',
          data: {
            typeaheadSearch: function(val) {
              return Genes.beginsWith(val)
                .then(function(response) {
                  var labelLimit = 70;
                  var list = _.map(response, function(gene) {
                    if (gene.aliases.length > 0) {
                      gene.alias_list = gene.aliases.join(', ');
                      if(gene.alias_list.length > labelLimit) { gene.alias_list = _.truncate(gene.alias_list, labelLimit); }
                    }
                    return gene;
                  });
                  return list;
                });
            }
          },
        },
      },
      {
        key: 'limit_by_status',
        type: 'select',
        className: fieldClassName,
        defaultValue: undefined,
        templateOptions: {
          label: 'Submitted Status',
          required: false,
          options: [
            { value: '', name: 'Select Status to Filter'},
            { value: 'submitted', name: 'Submitted' },
            { value: 'accepted', name: 'Accepted'},
            { value: 'rejected', name: 'Rejected' },
          ]
        },
      },
    ];
  }
})();
