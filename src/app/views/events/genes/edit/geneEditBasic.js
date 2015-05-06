(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneEditBasic', geneEditBasicDirective)
    .controller('GeneEditBasicController', GeneEditBasicController);

  // @ngInject
  function geneEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'GeneEditBasicController',
      templateUrl: 'app/views/events/genes/edit/geneEditBasic.tpl.html'
    }
  }

  // @ngInject
  function GeneEditBasicController($scope,
                                   Security,
                                   GeneRevisions,
                                   Genes,
                                   GeneHistory,
                                   GenesViewOptions,
                                   formConfig) {
    var geneModel, vm;

    vm = $scope.vm = {};
    geneModel = vm.geneModel = Genes;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.gene = Genes.data.item;
    vm.geneRevisions = GeneRevisions;
    vm.geneHistory = GeneHistory;
    vm.geneEdit = angular.copy(vm.gene);
    vm.geneEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
    vm.myGeneInfo = geneModel.data.myGeneInfo;
    vm.variants = geneModel.data.variants;
    vm.variantGroups = geneModel.data.variantGroups;

    vm.styles = GenesViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.geneFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: vm.gene.name
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.gene.description',
          focus: true,
          minLength: 32
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.geneEdit.comment,
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        model: vm.geneEdit.comment,
        key: 'text',
        type: 'textarea',
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];

    vm.submit = function(geneEdit, options) {
      geneEdit.geneId = geneEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      GeneRevisions.submitRevision(geneEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.formMessages['submitSuccess'] = true;
          // options.resetModel();
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.apply = function(geneEdit, options) {
      geneEdit.geneId = geneEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Genes.apply(geneEdit)
        .then(function(response) {
          console.log('revision appy success!');
          vm.formMessages['applySuccess'] = true;
          // options.resetModel();
        })
        .catch(function(response) {
          console.error('revision application error!');
          vm.formErrors[response.status] = true;
        })
        .finally(function(){
          console.log('revision apply done!');
        });
    };
  }
})();
