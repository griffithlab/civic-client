(function() {
  'use strict';
  angular.module('civic.config')
    .config(ratingConfig);

  // @ngInject
  function ratingConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'comment',
      extends: 'textarea',
      wrapper: ['validationMessages', 'horizontalBootstrapComment', 'bootstrapHasError']
    });
  }

})();
