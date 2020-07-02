(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ReleasesController', ReleasesController);

  // @ngInject
  function ReleasesController($window, Releases, _) {
    console.log('ReleasesController loaded.');
    var vm = this;

    Releases.initBase()
      .then(function(response){
        var releases = response[0];
        var releaseTemplate = {
          GeneSummaries: null,
          VariantSummaries: null,
          ClinicalEvidenceSummaries: null,
          VariantGroupSummaries: null,
          AssertionSummaries: null,
          civic_accepted: null,
          civic_accepted_and_submitted: null
        };

        var gridReleases = _.map(releases, function(release) {
          var row = { note: release.note };
          _.forEach(releaseTemplate, function(value, fileType) {
            var url = _.find(release.files, function(url) {
              return url === null ? false : url.includes(fileType);
            });

            row[fileType] = _.isUndefined(url) ? null : url;
          });
          return row;
        });
        vm.summariesReleaseGridOptions.data = gridReleases;
        vm.variantsReleaseGridOptions.data = _.filter(gridReleases, function(row) {
          return !_.isNull(row.civic_accepted) || !_.isNull(row.civic_accepted_and_submitted);
        });
      });

    vm.summariesReleaseGridOptions = {
      enablePaging: true,
      minRowsToShow: 7,
      paginationPageSizes: [5, 10, 25, 50, 75],
      paginationPageSize: 5,
      enableColumnMenus: false,
      enableSorting: false,
      data: [],
      columnDefs: [
        {
          name: 'note',
          displayName: 'Date',
          width: '12%'
        },
        {
          name: 'GeneSummaries',
          displayName: 'Gene Summaries',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',

        },
        {
          name: 'VariantSummaries',
          displayName: 'Variant Summaries',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
        {
          name: 'ClinicalEvidenceSummaries',
          displayName: 'Evidence Summaries',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
        {
          name: 'VariantGroupSummaries',
          displayName: 'Variant Group Summaries',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
        {
          name: 'AssertionSummaries',
          displayName: 'Assertion Summaries',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
      ]
    };

    vm.variantsReleaseGridOptions = {
      data: [],
      enablePaging: true,
      minRowsToShow: 7,
      paginationPageSizes: [5, 10, 25, 50, 75],
      paginationPageSize: 5,
      enableColumnMenus: false,
      enableSorting: false,
      columnDefs: [
        {
          name: 'note',
          displayName: 'Date',
          width: '12%'
        },
        {
          name: 'civic_accepted',
          displayName: 'Accepted Variants',
          width: '17%',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
        {
          name: 'civic_accepted_and_submitted',
          displayName: 'Accepted & Submitted Variants',
          cellTemplate: 'app/pages/downloadCellTemplate.tpl.html',
          type: 'string',
        },
      ]
    };
  }
})();
