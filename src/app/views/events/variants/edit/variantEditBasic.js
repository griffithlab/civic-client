(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantEditBasic', variantEditBasicDirective)
    .controller('VariantEditBasicController', VariantEditBasicController);

  // @ngInject
  function variantEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantEditBasicController',
      templateUrl: 'app/views/events/variants/edit/variantEditBasic.tpl.html'
    };
  }

  // @ngInject
  function VariantEditBasicController($scope,
                                      $stateParams,
                                      $document,
                                      $state,
                                      Security,
                                      VariantRevisions,
                                      Variants,
                                      VariantHistory,
                                      VariantsViewOptions,
                                      formConfig,
                                      _) {
    var variantModel, vm;

    vm = $scope.vm = {};
    variantModel = vm.variantModel = Variants;

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.variant = Variants.data.item;
    vm.pendingFields = VariantRevisions.data.collection.length > 0;
    vm.pendingFieldsList = _.map(_.keys(VariantRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });

    vm.variantRevisions = VariantRevisions;
    vm.variantHistory = VariantHistory;
    vm.variantEdit = angular.copy(vm.variant);

    if(_.isUndefined(vm.variantEdit.variant_types)) {
      vm.variantEdit.variant_types = [];
    }

    vm.variantEdit.comment = { title: 'VARIANT ' + vm.variant.name + ' Suggested Revision', text:'' };
    vm.myVariantInfo = variantModel.data.myVariantInfo;
    vm.variants = variantModel.data.variants;
    vm.variantGroups = variantModel.data.variantGroups;

    vm.styles = VariantsViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;
    vm.serverMsg = '';

    vm.newRevisionId = Number();
    vm.stateParams = $stateParams;

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    // scroll to form header
    $document.ready(function() {
      var elem = document.getElementById('variant-edit-form');
      $document.scrollToElementAnimated(elem);
    });

    vm.variantFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          value: vm.variant.name,
          helpText: ''
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Summary',
          value: 'vm.variant.description',
          minLength: 32,
          helpText: 'User-defined summary of the clinical relevance of this Variant. The Variant Summary should be a synthesis of the existing Evidence Statements for this variant. Basic information on recurrence rates and biological/functional impact of the Variant may be included, but the focus should be on the clinical impact (i.e. predictive, prognostic, and diagnostic value).'
        }
      },
      {
        key: 'variant_types',
        type: 'multiInput',
        templateOptions: {
          label: 'Variant Types',
          helpText: 'Add one or more variant types from the Sequence Ontology',
          entityName: 'Type',
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              formatter: 'model[options.key].name',
              typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)'
            },
            data: {
              typeaheadSearch: function(val) {
                var request = {
                  count: 5,
                  page: 0,
                  name: val
                };
                return Variants.queryVariantTypes(request)
                  .then(function(response) {
                    return _.map(response.records, function(event) {
                      return { name: event.display_name, id: event.id };
                    });
                  });
              }
            }
          }
        }
      },
      {
        template: '<h3 class="form-subheader">Primary Coordinates</h3><hr/>'
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'reference_build',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Reference Build',
          value: vm.variantEdit.coordinates.reference_build,
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: null, label: 'Please select a Reference Build' },
            { value: 'GRCh38', label: 'GRCh38 (hg38)' },
            { value: 'GRCh37', label: 'GRCh37 (hg19)' },
            { value: 'NCBI36', label: 'NCBI36 (hg18)' }
          ],
          helpText: 'Version of the human genome reference sequence from which coordinates will be obtained.'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'ensembl_version',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Ensembl Version',
          value: vm.variantEdit.coordinates.ensembl_version,
          helpText: 'Ensembl database version (e.g. 75).'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'chromosome',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Chromosome',
          value: vm.variantEdit.coordinates.chromosome,
          helpText: 'Chromosome in which this variant occurs (e.g. 17).'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'start',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Start',
          value: vm.variantEdit.coordinates.start,
          helpText: 'Left/first coordinate of the variant. Must be <= the Stop coordinate. Must be compatible with the selected reference build.'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'stop',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Stop',
          value: vm.variantEdit.coordinates.stop,
          helpText: 'Right/second coordinate of the variant. Must be >= the Start coordinate.'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'reference_bases',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Reference Base(s)',
          value: vm.variantEdit.coordinates.reference_bases,
          helpText: 'The nucleotide(s) of the reference genome affected by the variant. Only used for SNVs and Indels (otherwise leave blank).'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'variant_bases',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Variant Base(s)',
          value: vm.variantEdit.coordinates.variant_bases,
          helpText: 'The nucleotide(s) of the variant allele. Only used for SNVs and Indels (otherwise leave blank).'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'representative_transcript',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Representative Transcript',
          value: vm.variantEdit.coordinates.representative_transcript,
          helpText: 'Transcript ID including version number (e.g. ENST00000348159.4, the canonical transcript defined by Ensembl).'
        }
      },
      {
        template: '<h3 class="form-subheader">Secondary Coordinates <span class="small">(for fusions)</span></h3><hr/>'
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'chromosome2',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Chromosome 2',
          value: vm.variantEdit.coordinates.chromosome2,
          helpText: 'If this variant is a fusion (e.g. BCR-ABL1), specify the chromosome name, coordinates, and representative transcript for the 3-prime partner.'
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'start2',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Start 2',
          value: vm.variantEdit.coordinates.start2,
          helpText: ''
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'stop2',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Stop 2',
          value: vm.variantEdit.coordinates.stop2,
          helpText: ''
        }
      },
      {
        model: vm.variantEdit.coordinates,
        key: 'representative_transcript2',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Representative Transcript 2',
          value: vm.variantEdit.coordinates.representative_transcript2,
          helpText: ''
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.variantEdit.comment,
        key: 'text',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          label: 'Revision Description',
          value: 'text',
          helpText: 'Please provide a brief description and support, if necessary, for your suggested revision. It will appear as the first comment in this revision\'s comment thread.'
        }
      }
    ];

    vm.submit = function(variantEdit) {
      variantEdit.variantId = variantEdit.id;
      variantEdit.variant_types = _.map(variantEdit.variant_types, 'id');
      vm.formErrors = {};
      vm.formMessages = {};
      variantEdit = _.merge(variantEdit, variantEdit.coordinates); // civic-server needs coords on base variant obj
      delete variantEdit.coordinates;

      VariantRevisions.submitRevision(variantEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.newRevisionId = response.id;
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.pendingFields = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
          vm.serverMsg = error.data.error;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.apply = function(variantEdit) {
      variantEdit.variantId = variantEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Variants.apply(variantEdit)
        .then(function() {
          console.log('revision appy success!');
          vm.formMessages.applySuccess = true;
        })
        .catch(function(response) {
          console.error('revision application error!');
          vm.formErrors[response.status] = true;
        })
        .finally(function(){
          console.log('revision apply done!');
        });
    };

    vm.revisionsClick = function() {
      $state.go('events.genes.summary.variants.talk.revisions.list', { variantId: Variants.data.item.id });
    }
  }
})();
