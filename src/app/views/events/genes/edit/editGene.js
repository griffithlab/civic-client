(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('EditGeneController', EditGeneController)
    .directive('editGene', editGeneDirective);

  // @ngInject
  function editGeneDirective() {
    return {
      restrict: 'E',
      require: '^^entityView',
      scope: false,
      templateUrl: 'app/views/events/genes/edit/editGene.tpl.html',
      link: editGeneLink,
      controller: 'EditGeneController'
    }
  }

  // @ngInject
  function editGeneLink(scope, element, attributes, entityView) {
    scope.ctrl = {};
    scope.ctrl.geneModel= entityView.entityModel
  }

  // @ngInject
  function EditGeneController ($scope, Security) {
    var unwatch = $scope.$watch('ctrl.geneModel', function(geneModel){
      var config = geneModel.config;
      var ctrl = $scope.ctrl;

      ctrl.gene = geneModel.data.entity;
      ctrl.geneModel = geneModel;
      ctrl.myGeneInfo = geneModel.data.myGeneInfo;
      ctrl.variants = geneModel.data.variants;
      ctrl.variantGroups = geneModel.data.variantGroups;

      ctrl.styles = config.styles;

      ctrl.user = {};

      ctrl.geneFields = [
        {
          key: 'entrez_name',
          type: 'input',
          templateOptions: {
            label: 'Name',
            value: ctrl.gene.entrez_name
          }
        },
        {
          key: 'description',
          type: 'textarea',
          templateOptions: {
            rows: 8,
            label: 'Description',
            value: 'ctrl.gene.description'
          }
        },
        {
          template: '<hr/>'
        }
      ];

      ctrl.submit = function(gene) {
        console.log('submitRevision clicked.');
        gene.geneId = gene.entrez_id; // add geneId param for Genes service
        $scope.ctrl.geneModel.services.Genes.submitChange(gene);
      };

      ctrl.apply = function(gene) {
        console.log('applyRevision clicked.');
        gene.geneId = gene.entrez_id;
        gene.$update();
      };

      ctrl.isAdmin = Security.isAdmin;
      // unbind watcher after first digest
      unwatch();
    }, true);

  }
})();
