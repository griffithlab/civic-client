(function() {
  'use strict';
  angular.module('civic.sources')
    .controller('SuggestSourceController', SuggestSourceController);

  // @ngInject
  function SuggestSourceController($scope, Search) {
    console.log('SuggestSourceController called.');
  }
})();
