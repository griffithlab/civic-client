angular.module('civic.gene')
.directive('editGeneBtn', editGeneBtn);

// @ngInject
function editGeneBtn() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/gene/directives/geneActionButtons.tpl.html',
    controller: 'GeneCtrl',
    replace: true,
    scope: true,
    link: function() {
      console.log('editGene btn linked.');
    }
  };

  return directive;
}