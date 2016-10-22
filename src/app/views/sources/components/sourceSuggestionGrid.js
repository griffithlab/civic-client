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
                                          Sources,
                                          uiGridConstants) {
    console.log('SourceSuggestionGridController Loaded.');

    var vm = $scope.vm = {};

    var mode = $scope.mode;

    vm.setSuggestion = function(id, status) {
      Sources.setStatus({suggestionId: id, status: status}).then(function(response) {
        $scope.$emit('suggestion:updated');
      });
    };

    var statusFilters = ['new'];

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
      columnDefs: [
        {
          name: 'status',
          displayName: 'Status',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '6%',
          filter: {
            noTerm: true,
            condition: function(searchTerm, cellValue) {
              return _.contains(statusFilters, cellValue);
            }
          }
        },
        {
          name: 'created_at',
          displayName: 'Submitted',
          width: '8%',
          enableFiltering: false,
          allowCellFocus: false,
          visible: false,
          type: 'date',
          sort: {
            direction: uiGridConstants.DESC
          },
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] | timeAgo }}</div>'
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
          visible: false,
          //visible: mode === 'full',
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
          width: '15%',
          type: 'string',
          cellTemplate: 'app/views/sources/components/cellTemplateCitation.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene',
          displayName: 'Gene',
          width: '6%',
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
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/sources/components/cellTemplateActions.tpl.html'
        }
      ],
      // grid menu
      enableGridMenu: true,
      gridMenuShowHideColumns: false,
      gridMenuCustomItems: [
        {
          title: 'Show Curated',
          active: function() {
            return _.contains(statusFilters, 'curated');
          },
          action: function($event) {
            filterByStatus('curated', this.grid, $event);
          }
        },
        {
          title: 'Show Rejected',
          active: function() {
            return _.contains(statusFilters, 'rejected');
          },
          action: function($event) {
            filterByStatus('rejected', this.grid, $event);
          }
        }
      ]
    };

    function filterByStatus(status, grid) {
     if(_.contains(statusFilters, status)) {
        _.pull(statusFilters, status);
      } else {
        statusFilters.push(status);
      }
      grid.queueGridRefresh();
    }

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

          source.addEvidenceUrl = urlBase + '?' + urlElements.join('&');
          return source;
        });
      }
    };
  }

})();
