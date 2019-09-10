(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('StatisticsController', StatisticsController);

  // @ngInject
  function StatisticsController($scope, $state, Stats, Genes, _) {
    var vm = $scope.vm = {};
    vm.stateIncludes = $state.includes;

    var pieChartWidth = '100%',
        pieChartHeight = 360;

    var barChartWidth = '100%',
        barChartHeight = 540;

    var smPieChartWidth = '70%',
        smPieChartHeight = 320;

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

    var transitionDuration = 1000;

    vm.options = {
      countsByEvidenceType: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Type',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByEvidenceLevel: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Level',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByEvidenceDirection: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Evidence Direction',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByVariantOrigin: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Variant Origin',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByClinicalSignificance: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Clinical Significance',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByRating: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Rating',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByStatus: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Status',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      countsByPending: {
        width: pieChartWidth,
        height: pieChartHeight,
        title: 'Counts by Suggested Changes',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      drugsWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Levels',
        margin: barMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      drugsWithClinicalSignificance: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Drugs with Clinical Significance',
        margin: barMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      diseasesWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Diseases with Levels',
        margin: barMarginsWide,
        transitionDuration: transitionDuration,
        data: []
      },
      diseasesWithTypes: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Diseases with Types',
        margin: barMarginsWide,
        transitionDuration: transitionDuration,
        data: []
      },
      sourcesWithLevels: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Sources with Levels',
        margin: barMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      sourcesWithTypes: {
        width: barChartWidth,
        height: barChartHeight,
        title: 'Top Sources with Types',
        margin: barMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByUserCount: {
        width: barChartWidth,
        height: barChartHeight/2,
        title: 'User Count',
        margin: barMarginsWide,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByChangeActivity: {
        width: barChartWidth,
        height: barChartHeight/2,
        title: 'Suggested Changes Submitted',
        margin: barMarginsWide,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByActivityCount: {
        width: barChartWidth,
        height: barChartHeight/2,
        title: 'Assertions and Evidence Submitted',
        margin: barMarginsWide,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByTotalBadgeCount: {
        width: smPieChartWidth,
        height: smPieChartHeight,
        title: 'Organizations by Total Badge Count',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByEvidenceActivity: {
        width: smPieChartWidth,
        height: smPieChartHeight,
        title: 'Organizations by Evidence Actions',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
      organizationsByAssertionActivity: {
        width: smPieChartWidth,
        height: smPieChartHeight,
        title: 'Organizations by Assertion Actions',
        margin: pieMargins,
        transitionDuration: transitionDuration,
        data: []
      },
    };

    var baseModel = {
      entrez_name: '',
      limit_by_status: ''
    };

    vm.model = _.clone(baseModel);

    function updateData() {
      Stats.getDashboard(vm.model);
    }

    function resetForm() {
      vm.model = _.clone(baseModel);
      updateData();
    };

    vm.Stats = Stats;

    // place on scope for Filter/reset button onClick
    vm.updateData = updateData;
    vm.resetForm = resetForm;

    var fieldClassName = 'col-xs-4';
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
