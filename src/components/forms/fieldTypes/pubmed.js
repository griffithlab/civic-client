(function() {
  'use strict';
  angular.module('civic.config')
    .config(pubmedConfig)
    .controller('PubmedController', PubmedController);

  // @ngInject
  function pubmedConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'pubmed',
      extends: 'input',
      wrapper: ['loader', 'pubdisplay', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

  // @ngInject
  function PubmedController($scope, Pubmeds) {
    console.log('PubmedController called.');
    $scope.validatePubmed = function(pubmedId) {
      return Pubmeds.verify(pubmedId);
    };
  }

})();
