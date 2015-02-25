(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('GlossaryCtrl', GlossaryCtrl);

  // @ngInject
  function GlossaryCtrl($scope, Glossary) {
    $scope.glossary = {};
    Glossary.query().$promise
      .then(function(response) {
        $scope.glossary.terms = response;
      });
  }
})();
