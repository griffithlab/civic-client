(function() {
  'use strict';
  angular.module('civic.config')
    .config(publicationConfig)
    .controller('PublicationController', PublicationController);

  // @ngInject
  function publicationConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'publication',
      extends: 'input',
      wrapper: ['loader', 'pubdisplay', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

  // @ngInject
  function PublicationController($scope, Publications) {
    console.log('PublicationController called.');
    $scope.validatePublication = function(pubmedId) {
      return Publications.get(pubmedId);
    };
  }

})();
