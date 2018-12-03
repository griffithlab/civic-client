(function() {
  'use strict';
  angular.module('civic.config')
    .config(publicationConfig);

  // @ngInject
  function publicationConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'publication',
      extends: 'input',
      wrapper: ['loader', 'citation', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'publication-multi',
      extends: 'input',
      wrapper: ['loader','citation']
    });
  }
})();
