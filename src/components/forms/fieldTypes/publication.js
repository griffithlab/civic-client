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
      wrapper: ['validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError'],
      controller: 'PublicationController'
    });
  }

  // @ngInject
  function PublicationController($scope) {
    console.log('PublicationController called.');
  }

})();
