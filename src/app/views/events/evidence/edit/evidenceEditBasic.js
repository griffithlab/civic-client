(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .directive('evidenceEditBasic', evidenceEditBasicDirective)
    .controller('EvidenceEditBasicController', EvidenceEditBasicController);

  // @ngInject
  function evidenceEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'EvidenceEditBasicController',
      templateUrl: 'app/views/events/evidence/edit/evidenceEditBasic.tpl.html'
    }
  }

  // @ngInject
  function EvidenceEditBasicController($scope,
                                   Security,
                                   EvidenceRevisions,
                                   Evidence,
                                   EvidenceHistory,
                                   EvidenceViewOptions,
                                   formConfig) {
    var evidenceModel, vm;

    vm = $scope.vm = {};
    evidenceModel = vm.evidenceModel = Evidence;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.evidence = Evidence.data.item;
    vm.evidenceRevisions = EvidenceRevisions;
    vm.evidenceHistory = EvidenceHistory;
    vm.evidenceEdit = angular.copy(vm.evidence);
    vm.evidenceEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };

    vm.styles = EvidenceViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.formSelects = {
      evidence_levels: [
        { name: 'A', label: 'Validated'},
        { name: 'B', label: 'Clinical'},
        { name: 'C', label: 'Preclinical'},
        { name: 'D', label: 'Inferential'}
      ],
      evidence_ratings: [
        { id: 1, name: 'One Star', label: 'Really Crappy'},
        { id: 2, name: 'Two Stars', label: 'Pretty Crappy'},
        { id: 3, name: 'Three Stars', label: 'Just OK'},
        { id: 4, name: 'Four Stars', label: 'Not Bad'},
        { id: 5, name: 'Five Stars', label: 'Outstanding'}
      ],
      clinical_significance: [
        { id: 1, name: 'Positive' },
        { id: 2, name: 'Better Outcome' },
        { id: 3, name: 'Sensitivity' },
        { id: 4, name: 'Resistance or Non-Response' },
        { id: 5, name: 'Poor Outcome' },
        { id: 6, name: 'Negative' },
        { id: 7, name: 'N/A' }
      ],
      evidence_types: [
        { name: 'Predictive' },
        { name: 'Diagnostic' },
        { name: 'Prognostic' }
      ],
      evidence_direction: [
        { name: 'Supports' },
        { name: 'Does Not Support' }
      ],
      variant_origins: [
        { name: 'somatic'},
        { name: 'germline' }
      ]
    };

    vm.evidenceFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: vm.evidence.name
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.evidence.description',
          focus: true,
          minLength: 32
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.evidenceEdit.comment,
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        model: vm.evidenceEdit.comment,
        key: 'text',
        type: 'textarea',
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];



    vm.submit = function(evidenceEdit, options) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      EvidenceRevisions.submitRevision(evidenceEdit)
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

    vm.apply = function(evidenceEdit, options) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Evidence.apply(evidenceEdit)
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
