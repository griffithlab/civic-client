(function() {
  'use strict';
  angular.module('civic.config')
    .config(geneConfig)
    .controller('GeneController', GeneController);

  // @ngInject
  function geneConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'gene',
      extends: 'input',
      wrapper: ['loader', 'genedisplay', 'validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
      name: 'gene-multi',
      extends: 'input',
      wrapper: ['loader','genedisplay']
    });
  }

  // @ngInject
  function GeneController($scope, Genes) {
    console.log('GeneController called.');
    $scope.validateGene = function(pubmedId) {
      return Genes.verify(pubmedId);
    };
  }

})();
