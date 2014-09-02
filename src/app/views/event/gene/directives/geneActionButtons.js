(function() {
  'use strict';
  angular.module('civic.event')
    .directive('editGeneBtn', editGeneBtn);

// @ngInject
  function editGeneBtn() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/event/gene/directives/geneActionButtons.tpl.html',
      controller: 'GeneCtrl',
      replace: true,
      scope: true,
      link: function () {
        console.log('editGene btn linked.');
      }
    };

    return directive;
  }
})();