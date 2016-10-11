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

    vm.addEvidence = function(suggestion) {
      console.log('addEvidence called.');
      console.log(suggestion);
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
          width: '5%',
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
          visible: mode === 'full',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },

        {
          name: 'author_list_string',
          displayName: 'Authors',
          visible: mode === 'full',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'publication_date_string',
          displayName: 'Date',
          visible: mode === 'full',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false
        },
        {
          name: 'full_journal_title',
          displayName: 'Journal',
          visible: mode === 'full',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false
        },
        {
          name: 'abstract',
          displayName: 'Abstract',
          visible: mode === 'full',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene',
          displayName: 'Gene',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          displayName: 'Variant',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
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
          displayName: '',
          allowCellFocus: false,
          enableFiltering: false,
          width: '5%',
          cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="{{row.entity.addEvidenceUrl}}"' +
          'class="btn btn-xs btn-cell-add">Add</a></div>'
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
