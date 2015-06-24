(function() {
  'use strict';
  angular.module('civic.config')
    .config(publicationConfig);

  // @ngInject
  function publicationConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'comment',
      extends: 'input',
      wrapper: ['validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

})();
