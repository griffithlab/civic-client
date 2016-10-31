(function() {
  'use strict';

  angular.module('civic.sources')
    .directive('sourceGrid', sourceGrid)
    .controller('SourceGridController', SourceGridController);

  // @ngInject
  function sourceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        sources: '=',
        rows: '=',
        context:'='
      },
      templateUrl: 'app/views/sources/components/sourceGrid.tpl.html',
      controller: 'SourceGridController'
    };
    return directive;
  }

  // @ngInject
  function SourceGridController($scope,
                                $state,
                                uiGridConstants) {
    console.log('SourceGridController Loaded.');

    var vm = $scope.vm = {};

    vm.rowsToShow = $scope.rows ? $scope.rows : 10;
    vm.sourceGridOptions = {
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
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      columnDefs: [
        {
          name: 'pubmed_id',
          displayName: 'Pubmed ID',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'name',
          displayName: 'Title',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'author_list_string',
          displayName: 'Authors',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'publication_date_string',
          displayName: 'Date',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '10%'
        },
        {
          name: 'full_journal_title',
          displayName: 'Journal',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          width: '15%'
        },
        {
          name: 'abstract',
          displayName: 'Abstract',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };

    vm.sourceGridOptions.onRegisterApi = function (gridApi) {
      var sources = $scope.sources;
      vm.gridApi = gridApi;

      vm.context = $scope.context;
      vm.sourceGridOptions.data = prepSources(sources);

      $scope.$watchCollection('sources', function (sources) {
        vm.sourceGridOptions.minRowsToShow = sources.length + 1;
        vm.sourceGridOptions.data = prepSources(sources);
      });

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        var params = {sourceId: row.entity.id};
        if (event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('sources.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('sources.summary', params);
        }
      });

      function prepSources(sources) {
        return _.map(sources, function(source) {
          // TODO: refactor this into the service, we're doing the same munging in 3 places
          // format publication date
          var pubDate = [source.publication_date.year];
          if(!_.isUndefined(source.publication_date.month))
            pubDate.push(source.publication_date.month);

          if(!_.isUndefined(source.publication_date.day))
            pubDate.push(source.publication_date.day);

          source.publication_date_string = pubDate.join('-');

          // format author list
          source.author_list_string = _(source.author_list)
            .sortBy('position')
            .map(function(author) {
              return [author.fore_name, author.last_name].join(' ');
            })
            .value()
            .join(', ');
          return source;
        });
      }
    };
  }

})();
