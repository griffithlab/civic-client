(function() {
  'use strict';
  angular.module('civic.config')
    .config(diseaseConfig)
    .controller('DiseaseController', DiseaseController);

  // @ngInject
  function diseaseConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'disease',
      extends: 'input',
      wrapper: ['loader', 'diseasedisplay', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'disease-multi',
      extends: 'input',
      wrapper: ['loader','diseasedisplay']
    });
  }

  // @ngInject
  function DiseaseController($scope, Diseases) {
    console.log('DiseaseController called.');
    $scope.validateDisease = function(doid) {
      return Diseases.verify(doid);
    };
  }

})();
