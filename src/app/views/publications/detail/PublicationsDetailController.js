(function() {
  'use strict';
  angular.module('civic.publications')
    .controller('PublicationsDetailController', PublicationsDetailController);

  // @ngInject
  function PublicationsDetailController() {
    console.log('PublicationsDetailController called.');
  }
})();
