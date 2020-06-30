(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ReleasesController', ReleasesController);

  // @ngInject
  function ReleasesController($window, Releases, _) {
    console.log('ReleasesController loaded.');
    var vm = this;
    // TODO move releases init to ui-router state resolve
    Releases.initBase().then(function(releases){
      var releaseTemplate = {
        GeneSummaries: null,
        VariantSummaries: null,
        ClinicalEvidenceSummaries: null,
        VariantGroupSummaries: null,
        AssertionSummaries: null,
        civic_accepted: null,
        civic_accepted_and_submitted: null
      };
      vm.releases = _.map(releases[0], function(release) {
        // assign note, then for each key in releaseTemplate, attach URL from file list, if found
        var releaseObj = {
          note: release.note
        };
        _.forEach(releaseTemplate, function(value, fileType) {
          releaseObj[fileType] = _.find(release.files, function(val) {
            return val.includes(fileType);
          });
        });
        console.log(releaseObj);
        return releaseObj;
      });

    });
  }
})();
