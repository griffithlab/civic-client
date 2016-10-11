(function() {
  'use strict';

  angular.module('civic.sources')
    .directive('sourceSuggestionGrid', sourceSuggestionGrid)
    .controller('SourceSuggestionGridController', SourceSuggestionGridController);

  // @ngInject
  function sourceSuggestionGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        suggestions: '=',
        rows: '=',
        mode:'='
      },
      templateUrl: 'app/views/sources/components/sourceSuggestionGrid.tpl.html',
      controller: 'SourceSuggestionGridController'
    };
    return directive;
  }

  // @ngInject
  function SourceSuggestionGridController($scope,
                                $state,
                                uiGridConstants) {
    console.log('SourceSuggestionGridController Loaded.');

    var vm = $scope.vm = {};

    var mode = $scope.mode;

    vm.rejectSuggestion= function(id) {
      console.log('reject suggestion called.');
    };

    vm.rowsToShow = $scope.rows ? $scope.rows : 10;
    vm.sourceSuggestionGridOptions = {
      minRowsToShow: vm.rowsToShow - 1,
      //enablePaginationControls: true,
      //paginationPageSizes: [8],
      //paginationPageSize: 8,
      enablePaging: false,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      columnDefs: [
        {
          name: 'status',
          displayName: 'Status',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'submitter',
          displayName: 'Submitter',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
        },
        {
          name: 'pubmed_id',
          displayName: 'Pubmed ID',
          width: '10%',
          visible: mode === 'full',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'citation',
          displayName: 'Citation',
          visible: mode === 'full',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          cellTemplate: 'app/views/sources/components/cellTemplateCitation.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene',
          displayName: 'Gene',
          width: '8%',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          displayName: 'Variant',
          width: '12%',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
          displayName: 'Disease',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'initial_comment',
          displayName: 'Comment',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'action',
          displayName: 'Actions',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/sources/components/cellTemplateActions.tpl.html'
        }
      ]
    };

    vm.sourceSuggestionGridOptions.onRegisterApi = function (gridApi) {
      var suggestions = $scope.suggestions;
      vm.gridApi = gridApi;

      vm.context = $scope.context;
      vm.sourceSuggestionGridOptions.data = prepSuggestions(suggestions);

      $scope.$watchCollection('suggestions', function (suggestions) {
        vm.sourceSuggestionGridOptions.minRowsToShow = suggestions.length + 1;
        vm.sourceSuggestionGridOptions.data = prepSuggestions(suggestions);
      });

      function prepSuggestions(suggestions) {
        return _.map(suggestions, function(source) {
          var urlBase = '#/add/evidence/basic';
          var urlElements = [];
          if(_.has(source, 'gene')) {
            urlElements.push('geneName=' + source.gene);
          }
          if(_.has(source, 'variant')) {
            urlElements.push('variantName=' + source.variant);
          }
          if(_.has(source, 'disease')) {
            urlElements.push('diseaseName=' + source.disease);
          }
          if(_.has(source, 'pubmed_id')) {
            urlElements.push('pubmedId=' + source.pubmed_id);
          }

          urlElements.push('sourceSuggestionId=' + source.id);
          source.addEvidenceUrl = urlBase + '?' + urlElements.join('&') + '&' + 'suggestionId=' + source.id;
          return source;
        });
      }
    };
  }

})();
