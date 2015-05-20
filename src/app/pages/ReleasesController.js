(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ReleasesController', ReleasesController);

  // @ngInject
  function ReleasesController($location, Releases, _) {
    console.log('ReleasesController loaded.');
    var vm = this;
    vm.urlPrefix = $location.protocol() + '://' + $location.host() + ':3000';
    // TODO move releases init to ui-router state resolve
    Releases.initBase().then(function(releases){
      vm.releases = _.map(releases[0], function(release) {
        release.fileNames = _.map(release.files, function(filename) {
          return _.last(filename.split('/'));
        });
        release.fileUrls = _.map(release.files, function(filename) {
          return vm.urlPrefix + filename;
        });
        return release;
      });

    });
  }
})();
