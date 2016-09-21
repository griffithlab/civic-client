(function() {
  'use strict';
  angular.module('civic.sources')
    .controller('SourcesSuggestController', SourcesSuggestController);

  // @ngInject
  function SourcesSuggestController($scope, source, Search) {
    console.log('SourcesSuggestController called.');
  }
})();
