(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('ReleasesController', ReleasesController);

  // @ngInject
  function ReleasesController(Releases) {
    console.log('ReleasesController loaded.');
    var vm = this;
    // TODO move releases init to ui-router state resolve
    Releases.initBase().then(function(releases){
      vm.releases = releases[0];
    });
  }
})();
