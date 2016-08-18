(function() {
  'use strict';
  angular.module('civic.publications')
    .controller('PublicationsListController', PublicationsListController);

  // @ngInject
  function PublicationsListController() {
    console.log('PublicationsListController called.');
  }
})();
