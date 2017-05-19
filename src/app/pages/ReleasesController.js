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
      vm.releases = _.map(releases[0], function(release) {
        release.fileNames = _.map(release.files, function(filename) {
          return _.last(filename.split('/'));
        });
        release.fileUrls = _.map(release.files, function(filename) {
          return filename;
        });
        return release;
      });

    });
  }
})();
