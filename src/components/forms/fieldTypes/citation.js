(function() {
  'use strict';
  angular.module('civic.config')
    .config(citationConfig)
    .controller('CitationController', CitationController);

  // @ngInject
  function citationConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'citation',
      extends: 'input',
      wrapper: ['loader', 'citation', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

  // @ngInject
  function CitationController($scope, Citations) {
    console.log('CitationController called.');
    $scope.validateCitation = function(citationId) {
      return Citations.verify(citationId);
    };
  }

})();
