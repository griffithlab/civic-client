(function() {
  'use strict';

  angular.module('civic.sources')
    .directive('sourceSuggestionGrid', sourceSuggestionGrid)
    .controller('SourceSuggestionGridController', SourceSuggestionGridController)
    .controller('cellTemplateActionsController', CellTemplateActionsController);

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
  function CellTemplateActionsController($scope, Sources) {
    $scope.rejectSuggestion = function(id, status, reason) {
      Sources.setStatus({suggestionId: id, status: status, reason: reason}).then(function() {
        $scope.$emit('suggestion:updated');
      });
      $scope.popoverIsOpen=false;
    };
  }

  // @ngInject
  function SourceSuggestionGridController($scope,
                                          $location,
                                          Sources,
                                          _,
                                          Security,
                                          uiGridConstants) {
    console.log('SourceSuggestionGridController Loaded.');

    var vm = $scope.vm = {};

    var mode = $scope.mode;

    vm.setSuggestion = function(id, status, reason) {
      Sources.setStatus({suggestionId: id, status: status, reason: reason}).then(function() {
        $scope.$emit('suggestion:updated');
      });
    };

    vm.setLocation = function(url) {
      $location.url(url);
    };

    vm.hasEditorPerms = function() {
      return (Security.isAdmin() || Security.isEditor());
    };

    vm.isAuthenticated = function() {
      return Security.isAuthenticated();
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
          width: '8%',
          filter: {
            noTerm: true,
            condition: function(searchTerm, cellValue) {
              if(!_.isUndefined(searchTerm)) {
                return _.includes(statusFilters, cellValue) && _.includes(cellValue, searchTerm);
              } else {
                return _.includes(statusFilters, cellValue);
              }
            }
          },
          cellTemplate: 'app/views/sources/components/cellTemplateStatus.tpl.html'
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
          sortingAlgorithm: function(a, b) {
            if (undefined === a && undefined === b) { return 0; }
            else if (undefined === a) {return -1;}
            else if (undefined === b) {return 1;}
            else {
              if (a.display_name.toLowerCase() < b.display_name.toLowerCase()) { return -1; }
              else if (a.display_name.toLowerCase() > b.display_name.toLowerCase()) { return 1; }
              else {return 0;}
            }
          },
          filter: {
            // condition: uiGridConstants.filter.CONTAINS
            condition: function(search, value)
            {
                var query = new RegExp(search, 'i');
                return query.exec(value.username);
            }
          },
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>'
        },
        {
          name: 'source_type',
          displayName: 'Type',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          type: 'string',
          width: '8%',
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: '0', label: 'pubmed'},
              { value: '1', label: 'asco'}
            ]
          }
        },
        {
          name: 'citation_id',
          displayName: 'Citation ID',
          width: '8%',
          visible: true,
          cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] }}</div>',
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
          width: '13%',
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
          width: '140',
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
            return _.includes(statusFilters, 'curated');
          },
          action: function($event) {
            filterByStatus('curated', this.grid, $event);
          }
        },
        {
          title: 'Show Rejected',
          active: function() {
            return _.includes(statusFilters, 'rejected');
          },
          action: function($event) {
            filterByStatus('rejected', this.grid, $event);
          }
        }
      ]
    };

    function filterByStatus(status, grid) {
     if(_.includes(statusFilters, status)) {
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
          var urlBase = '/add/evidence/basic';
          var urlElements = [];
          if(_.has(source, 'gene') && source.gene !== null) {
            urlElements.push('geneName=' + source.gene);
          }
          if(_.has(source, 'variant') && source.variant !== null) {
            urlElements.push('variantName=' + source.variant);
          }
          if(_.has(source, 'disease') && source.disease !== null) {
            urlElements.push('diseaseName=' + source.disease);
          }
          if(_.has(source, 'pubmed_id') && source.pubmed_id !== null) {
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
