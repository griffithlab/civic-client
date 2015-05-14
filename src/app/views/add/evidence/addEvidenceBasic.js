(function() {
  'use strict';
  angular.module('civic.add.evidence')
    .directive('addEvidenceBasic', addEvidenceBasicDirective)
    .controller('AddEvidenceBasicController', AddEvidenceBasicController);

  // @ngInject
  function addEvidenceBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'app/views/add/evidence/addEvidenceBasic.tpl.html',
      controller: 'AddEvidenceBasicController'
    }
  }

  // @ngInject
  function AddEvidenceBasicController($scope,
                                      Security,
                                      Evidence,
                                      AddEvidenceViewOptions,
                                      formConfig) {
    var vm = $scope.vm = {};

    vm.evidenceModel = Evidence;
    vm.evidenceOptions = AddEvidenceViewOptions;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.newEvidence = {
      name: '',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vehicula sed lorem et cursus. In hac habitasse platea dictumst. Sed rhoncus, enim iaculis malesuada scelerisque, quam tortor porttitor tortor, id blandit tellus libero et lectus. Vestibulum nec purus eget purus suscipit ultricies non in dui.',
      disease: 'Breast Cancer',
      doid: '3908',
      pubmed_id: '20979473',
      drugs: [4,5],
      rating: 4,
      evidence_level: 'C',
      evidence_type: 'Predictive',
      evidence_direction: 'Supports',
      clinical_significance: 'Positive',
      variant_origin: 'Somatic'
    };

    vm.newEvidence.comment = { title: 'New Suggested Revision', text:'Comment text.' };

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.formSelects = {
      evidence_levels: [
        { value: 'A', label: 'A - Validated'},
        { value: 'B', label: 'B - Clinical'},
        { value: 'C', label: 'C - Preclinical'},
        { value: 'D', label: 'D - Inferential'}
      ],
      evidence_ratings: [
        { value: 1, label: '1 - Poor' },
        { value: 2, label: '2 - Adequate' },
        { value: 3, label: '3 - Average' },
        { value: 4, label: '4 - Good' },
        { value: 5, label: '5 - Excellent'}
      ],
      clinical_significance: [
        { value: 'Positive', label: 'Positive' },
        { value: 'Better Outcome', label: 'Better Outcome' },
        { value: 'Sensitivity', label: 'Sensitivity' },
        { value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
        { value: 'Poor Outcome', label: 'Poor Outcome' },
        { value: 'Negative', label: 'Negative' },
        { value: 'N/A', label: 'N/A' }
      ],
      evidence_types: [
        { value: 'Predictive', label: 'Predictive' },
        { value: 'Diagnostic', label: 'Diagnostic' },
        { value: 'Prognostic', label: 'Prognostic' }
      ],
      evidence_directions: [
        { value: 'Supports', label: 'Supports'},
        { value: 'Does Not Support', label: 'Does Not Support' }
      ],
      variant_origins: [
        { value: 'Somatic', label: 'Somatic'},
        { value: 'Germline', label: 'Germline' }
      ]
    };

    vm.evidenceFields = [
      //{
      //  key: 'name',
      //  type: 'input',
      //  templateOptions: {
      //    label: 'Name',
      //    disabled: true,
      //    value: 'vm.newEvidence.name'
      //  }
      //},
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 3,
          label: 'Description',
          value: 'vm.newEvidence.description',
          minLength: 32
        }
      },
      {
        key: 'disease',
        type: 'input',
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.disease',
          minLength: 32
        }
      },
      {
        key: 'doid',
        type: 'input',
        templateOptions: {
          label: 'DOID',
          value: 'vm.newEvidence.doid',
          minLength: 8,
          length: 8
        }
      },
      {
        key: 'pubmed_id',
        type: 'input',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.newEvidence.pubmed_id',
          minLength: 8,
          length: 8
        }
      },
      {
        key: 'drugs',
        type: 'input',
//        model: vm.newEvidence.drugs,
        templateOptions: {
          label: 'Drugs',
          value: 'vm.newEvidence.drugs'
          // disabled: true
        }
      },
      {
        key: 'rating',
        type: 'select',
        templateOptions: {
          label: 'Rating',
          options: vm.formSelects.evidence_ratings,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_level',
        type: 'select',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.newEvidence.rating',
          options: vm.formSelects.evidence_levels,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_type',
        type: 'select',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.newEvidence.evidence_type',
          options: vm.formSelects.evidence_types,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_direction',
        type: 'select',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.newEvidence.evidence_direction',
          options: vm.formSelects.evidence_directions,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'clinical_significance',
        type: 'select',
        templateOptions: {
          label: 'Clinical Significance',
          value: 'vm.newEvidence.clinical_significance',
          options: vm.formSelects.clinical_significance,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'variant_origin',
        type: 'select',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.newEvidence.variant_origin',
          options: vm.formSelects.variant_origins,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      { template: '<hr/>'},
      {
        type: 'input',
        key: 'title',
        model: vm.newEvidence.comment,
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        key: 'text',
        type: 'textarea',
        model: vm.newEvidence.comment,
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];



    vm.submit = function(newEvidence, options) {
      newEvidence.evidenceId = newEvidence.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Evidence.add(newEvidence)
        .then(function(response) {
          console.log('add evidence success!');
          vm.formMessages['submitSuccess'] = true;
          // options.resetModel();
        })
        .catch(function(error) {
          console.error('add evidence error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('add evidence done!');
        });
    };
  }

})();
