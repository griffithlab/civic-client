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
                                      formConfig,
                                      _) {
    var vm = $scope.vm = {};

    vm.evidenceModel = Evidence;
    vm.evidenceOptions = AddEvidenceViewOptions;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.newEvidence = {
      entrez_id: '',
      variant_name: '',
      description: '',
      disease: '',
      doid: '',
      pubmed_id: '',
      //pubchem_id: '',
      drugs: [],
      rating: Number(0),
      evidence_level: '',
      evidence_type: '',
      evidence_direction: '',
      clinical_significance: '',
      variant_origin: ''
    };

    //vm.newEvidence = {
    //  entrez_id: '673',
    //  variant_name: 'V600E',
    //  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vehicula sed lorem et cursus. In hac habitasse platea dictumst. Sed rhoncus, enim iaculis malesuada scelerisque, quam tortor porttitor tortor, id blandit tellus libero et lectus. Vestibulum nec purus eget purus suscipit ultricies non in dui.',
    //  disease: 'Breast Cancer',
    //  doid: '3908',
    //  pubmed_id: '20979473',
    //  drugs: [],
    //  rating: 4,
    //  evidence_level: 'C',
    //  evidence_type: 'Predictive',
    //  evidence_direction: 'Supports',
    //  clinical_significance: 'Positive',
    //  variant_origin: 'Somatic'
    //};

    vm.newEvidence.comment = { title: 'Support for Inclusion', text:'' };
    vm.newEvidence.drugs  = [];

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.evidenceFields = [
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: '', label: 'Please select an Evidence Type' },
            { value: 'Predictive', label: 'Predictive' },
            { value: 'Diagnostic', label: 'Diagnostic' },
            { value: 'Prognostic', label: 'Prognostic' }
          ],
          onChange: function(value, options, scope) {
            scope.model.clinical_significance = '';
            console.log('evidence_type changed.');
          },
          helpText: 'Type of clinical outcome associated with the evidence statement.'
        }
      },
      {
        key: 'entrez_id',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Gene Entrez ID',
          value: 'vm.newEvidence.entrez_id',
          minLength: 32,
          helpText: 'Entrez Gene ID (e.g., 673 for BRAF)'
        }
      },
      {
        key: 'variant_name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Variant Name',
          value: 'vm.newEvidence.variant_name',
          minLength: 32,
          helpText: 'Description of the type of variant (e.g., V600E, BCR-ABL fusion, Loss-of-function, exon 12 mutations). Should be as specific as possible (i.e., specific amino acid changes).'
        }
      },
      {
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.newEvidence.variant_origin',
          options: [
            { value: '', label: 'Please select a Variant Origin' },
            { value: 'Somatic', label: 'Somatic'},
            { value: 'Germline', label: 'Germline' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Origin of variant'
        }
      },
      {
        key: 'disease',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.disease',
          minLength: 32,
          helpText: 'Enter the disease or subtype that is associated with this evidence statement. This should be a disease in the disease-ontology that carries a DOID (e.g., 1909 for melanoma). If the disease to be entered is not in the disease ontology, enter it as free text. '
        }
      },
      {
        key: 'doid',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'DOID',
          value: 'vm.newEvidence.doid',
          minLength: 8,
          length: 8,
          helpText: 'Disease Ontology ID of the specific disease or disease subtype associated with the evidence statement (e.g., 1909 for melanoma).'
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          label: 'Evidence Statement',
          value: 'vm.newEvidence.description',
          minLength: 32,
          helpText: 'Description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.'
        }
      },
      {
        key: 'pubmed_id',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.newEvidence.pubmed_id',
          minLength: 8,
          length: 8,
          helpText: 'PubMed ID for the publication associated with the evidence statement (e.g. 23463675)'
        }
      },
      {
        key: 'drugs',
        type: 'multiInput',
        templateOptions: {
          label: 'Drug Names',
          inputOptions: {
            type: 'input'
          },
          helpText: 'For predictive evidence, specify one or more drug names. Drugs specified must possess a PubChem ID (e.g., 44462760 for Dabrafenib).'
        },
        expressionProperties: {
          'hide': function($viewValue, $modelValue, scope) {
            return  scope.model.evidence_type != 'Predictive';
          }
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.newEvidence.rating',
          options: [
            { value: '', label: 'Please select an Evidence Level' },
            { value: 'A', label: 'A - Validated'},
            { value: 'B', label: 'B - Clinical'},
            { value: 'C', label: 'C - Preclinical'},
            { value: 'D', label: 'D - Inferential'},
            { value: 'E', label: 'E - n of 1'}
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Description of the study performed to produce the evidence statement'
        }
      },
      {
        key: 'rating',
        type: 'horizontalRatingHelp',
        templateOptions: {
          label: 'Rating',
          options: [
            { value: 0, label: 'Please select an Evidence Rating' },
            { value: 1, label: '1 - Poor' },
            { value: 2, label: '2 - Adequate' },
            { value: 3, label: '3 - Average' },
            { value: 4, label: '4 - Good' },
            { value: 5, label: '5 - Excellent'}
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: [
                   '<p>Please rate your evidence according to the following scale, basing your subjective evaluation on the following guidelines:</p>',
                   '<ul>',
                   '<li><strong>One Star:</strong> Claim is not supported well by experimental evidence. Results are not reproducible, or have very small sample size. No follow-up is done to validate novel claims. </li>',
                   '<li><strong>Two Stars:</strong> Evidence is not well supported by experimental data, and little follow-up data is available. Publication is from a journal with low academic impact. Experiments may lack proper controls, have small sample size, or are not statistically convincing.</li>',
                   '<li><strong>Three Stars:</strong> Evidence is convincing, but not supported by a breadth of experiments. May be smaller scale projects, or novel results without many follow-up experiments. Discrepancies from expected results are explained and not concerning.</li>',
                   '<li><strong>Four Stars:</strong> Strong, well supported evidence. Experiments are well controlled, and results are convincing. Any discrepancies from expected results are well-explained and not concerning.</li>',
                   '<li><strong>Five Stars:</strong> Strong, well supported evidence from a lab or journal with respected academic standing. Experiments are well controlled, and results are clean and reproducible across multiple replicates. Evidence confirmed using separate methods.</li>'].join(" ")
        }
      },
      {
        key: 'evidence_direction',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Direction',
          value: 'vm.newEvidence.evidence_direction',
          options: [
            { value: '', label: 'Please select an Evidence Direction' },
            { value: 'Supports', label: 'Supports'},
            { value: 'Does Not Support', label: 'Does Not Support' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'A indicator of whether the evidence statement supports or refutes the clinical significance of an event.'
        }
      },
      {
        key: 'clinical_significance',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Clinical Significance',
          value: 'vm.newEvidence.clinical_significance',
          clinicalSignificanceOptions: [
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, or diagnostic evidence types. If the variant was not associated with a positive or negative outcome, N/A/ should be selected.'
        },
        expressionProperties: {
          'templateOptions.options': function($viewValue, $modelValue, scope) {
            return  _.filter(scope.to.clinicalSignificanceOptions, function(option) {
              return !!(option.type === scope.model.evidence_type || option.type === 'default' || option.type === 'N/A');
            });
          }
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'text',
        type: 'horizontalTextareaHelp',
        model: vm.newEvidence.comment,
        templateOptions: {
          rows: 5,
          label: 'Support for Inclusion',
          value: 'text',
          helpText: 'Please provide a short paragraph that supports the inclusion of this evidence item into the CIViC database.'
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
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
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
