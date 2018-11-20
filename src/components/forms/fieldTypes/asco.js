(function() {
  'use strict';
  angular.module('civic.config')
    .config(ascoConfig)
    .controller('AscoController', AscoController);

  // @ngInject
  function ascoConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'asco',
      extends: 'input',
      wrapper: ['loader', 'pubdisplay', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

  // @ngInject
  function AscoController($scope, Ascos) {
    console.log('AscoController called.');
    $scope.validateAsco = function(ascoId) {
      return Ascos.verify(ascoId);
    };
  }

})();
