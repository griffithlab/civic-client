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
                                      $q,
                                      Security,
                                      VariantRevisions,
                                      Variants,
                                      VariantHistory,
                                      VariantsViewOptions,
                                      Publications,
                                      ConfigService,
                                      formConfig,
                                      _,
                                      $rootScope) {
    var variantModel, vm;
    vm = $scope.vm = {};
    variantModel = vm.variantModel = Variants;

    vm.variant = Variants.data.item;
    vm.pendingFields = _.keys(VariantRevisions.data.pendingFields).length > 0;
    vm.pendingFieldsList = _.map(_.keys(VariantRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });

    vm.variantRevisions = VariantRevisions;
    vm.variantHistory = VariantHistory;
    vm.variantEdit = angular.copy(_.omit(vm.variant, ['evidence_items', 'lifecycle_actions']));

    vm.variantEdit.comment = { title: 'VARIANT ' + vm.variant.name + ' Suggested Revision', text:'' };
    vm.variantEdit.sources = _.map(vm.variant.sources, 'citation_id');
    vm.variantEdit.noClinVar = false;

    vm.myVariantInfo = variantModel.data.myVariantInfo;
    vm.variants = variantModel.data.variants;
    vm.variantGroups = variantModel.data.variantGroups;

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.variantEdit.organization = vm.currentUser.most_recent_organization;
    });
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


    vm.chromosome_dropdown=ConfigService.valid_chromosomes.slice();
    vm.chromosome_dropdown.unshift({type:'default', value: null, name: 'Please select a chromosome'});


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
          helpText: 'User-defined summary of the clinical relevance of this Variant. The Variant Summary should be a synthesis of the existing Evidence Statements for this variant. Basic information on recurrence rates and biological/functional impact of the Variant may be included, but the focus should be on the clinical impact (i.e. predictive, prognostic, diagnostic, or predisposing relevance). By submitting content to CIViC you agree to release it to the public domain as described by the <a href="https://creativecommons.org/publicdomain/zero/1.0/" title="CreativeCommons.org CC0 license" target="_blank">Creative Commons Public Domain Dedication (CC0 1.0 Universal)</a>.'
        }
      },
      {
        key: 'variant_aliases',
        type: 'multiInput',
        templateOptions: {
          label: 'Aliases',
          entityName: 'Alias',
          showAddButton: false,
          helpText: 'Please specify any aliases commonly used to refer to this variant.',
          required: false,
          inputOptions: {
            type: 'basicInput',
            wrapper: '',
            templateOptions: {
              label: '',
              minLength: 1,
              required: true
            }
          }
        }
      },
      {
        key: 'hgvs_expressions',
        type: 'multiInput',
        templateOptions: {
          label: 'HGVS Descriptions',
          required: false,
          entityName: 'Description',
          showAddButton: false,
          helpText: 'Please specify any HGVS descriptions for this variant.',
          inputOptions: {
            type: 'basicInput',
            wrapper: '',
            templateOptions: {
              label: '',
              minLength: 1,
              required: true
            }
          }
        }
      },
      {
        key: 'clinvar_entries',
        type: 'multiInput',
        templateOptions: {
          label: 'ClinVar IDs',
          required: false,
          helpText: 'Please specify any corresponding ClinVar identifiers for this variant.',
          entityName: 'ID',
          showAddButton: false,
          inputOptions: {
            type: 'basicInput',
            wrapper: '',
            templateOptions: {
              label: '',
              minLength: 1,
              required: true
            }
          }
        },
        hideExpression: 'model.noClinVar',
        expressionProperties: {
          'templateOptions.disabled': 'model.noClinVar === true', // deactivate if noClinVar is checked
          'templateOptions.required': 'model.noClinVar === false' // required only if noClinVar is unchecked
        }
      },
      {
        key: 'noClinVar',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Could not locate ClinVar ID'
        },
        controller: /* @ngInject */ function($scope){
          var entries = $scope.model.clinvar_entries;
          // if entries is non-null, only one item, and that item is not a number,
          // check noClinVar to show ClinVar Absence field
          if(entries[0] !== null && entries.length === 1 && !/^\d+$/.test(entries[0])) {
            $scope.model.noClinVar = true;
          }
        },
        hideExpression: 'model.clinvar_entries.length > 1'
      },
      {
        key: 'clinvar_entries[0]',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'ClinVar Absence',
          value: vm.variantEdit.clinvar_entries[0],
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: null, label: 'Please select a reason for ClinVar ID absence' },
            { value: 'NONE FOUND', label: 'None found' },
            { value: 'N/A', label: 'Not applicable' }
          ],
          helpText: 'If a ClinVar ID cannot be found, please select the best reason for its absence.',
          onChange: function(viewValue, model) {
            model.templateOptions.data.attributeDefinition =
              model.templateOptions.data.attributeDefinitions[model.value()];
          },
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions:  {
              null: '&nbsp;',
              undefined: '&nbsp;',
              'N/A': 'ClinVar record is not applicable to the variant (e.g. "Overexpression" variants)',
              'NONE FOUND': 'An attempt was made to find a matching ClinVar Entry, but none exists',
              'NONE SPECIFIED': 'Variant has not been evaluated for a ClinVar ID'
            }
          }
        },
        controller: /* @ngInject */ function($scope) {
          var entries = $scope.model.clinvar_entries;
          // clear clinvar entries if there are more than one, or if the only does not specify
          // one of the approved 'not found' choices.
          if(entries.length > 1 || !_.includes(['N/A', 'NOT FOUND', 'NONE SPECIFIED'], entries[0])) {
            $scope.model.clinvar_entries = [null];
          }
          if(entries[0] !== null || entries[0] !== undefined) {
            $scope.to.data.attributeDefinition =
              $scope.to.data.attributeDefinitions[entries[0]];
          }
        },
        hideExpression: '!model.noClinVar',
        expressionProperties: {
          'templateOptions.disabled': 'model.noClinVar === false', // deactivate if noClinVar is checked
          'templateOptions.required': 'model.noClinVar === true' // required only if noClinVar is unchecked
        }
      },
      {
        key: 'sources',
        type: 'multiInput',
        templateOptions: {
          label: 'Sources',
          helpText: 'Please specify the Pubmed IDs of any sources used as references in the Variant Summary.',
          entityName: 'Source',
          showAddButton: false,
          inputOptions: {
            type: 'publication-multi',
            templateOptions: {
              label: 'Pubmed Id',
              minLength: 1,
              required: true,
              data: {
                citation: '--'
              }
            },
            modelOptions: {
              updateOn: 'default blur',
              allowInvalid: false,
              debounce: {
                default: 300,
                blur: 0
              }
            },
            validators: {
              validPubmedId: {
                expression: function($viewValue, $modelValue, scope) {
                  if ($viewValue.length > 0) {
                    var deferred = $q.defer();
                    scope.options.templateOptions.loading = true;
                    var reqObj = {
                      citationId: $viewValue,
                      sourceType: 'PubMed'
                    };
                    Publications.verify(reqObj).then(
                      function (response) {
                        scope.options.templateOptions.loading = false;
                        scope.options.templateOptions.data.citation = response.citation;
                        deferred.resolve(response);
                      },
                      function (error) {
                        scope.options.templateOptions.loading = false;
                        scope.options.templateOptions.data.description = '--';
                        deferred.reject(error);
                      }
                    );
                    return deferred.promise;
                  } else {
                    scope.options.templateOptions.data.description = '--';
                    return true;
                  }
                },
                message: '"This does not appear to be a valid Pubmed ID."'
              }
            }
          }
        }
      },
      {
        key: 'variant_types',
        type: 'multiInput',
        templateOptions: {
          label: 'Variant Type(s)',
          helpText: 'Add one or more variant types from the <a href="http://www.sequenceontology.org/browser/" title="Opens a new tab for the Sequence Ontology Browser" target="_blank">Sequence Ontology</a> (e.g., missense, loss-of-function). Please be specific as possible, avoid the addition of root concepts, and use the <i>sequence_variant</i> tree of the sequence ontology.',
          entityName: 'Type',
          showAddButton: false,
          inputOptions: {
            type: 'typeahead',
            wrapper: ['simpleHasError', 'validationMessages'],
            templateOptions: {
              formatter: 'model[options.key].display_name',
              typeahead: 'item as item.display_name for item in to.data.typeaheadSearch($viewValue)',
              templateUrl: 'components/forms/fieldTypes/variantTypeTypeahead.tpl.html',
              editable: false,
              data: {
                typeaheadSearch: function(val) {
                  var request = {
                    count: 25,
                    page: 0,
                    name: val
                  };
                  return Variants.queryVariantTypes(request)
                    .then(function(response) {
                      return _.map(response.records, function(event) {
                        return event;
                      });
                    });
                },
                redundancy: {}
              }
            },
            asyncValidators: {
              conflict: {
                expression: function($viewValue, $modelValue, scope) {
                  var deferred = $q.defer();
                  if(_.isEmpty($modelValue) || scope.model.length < 2) {
                    deferred.resolve(true); // empty model value, no need to verify
                  } else {
                    // get existing IDs
                    var existing = _(scope.model)
                      .map('id')
                      .compact()
                      .value();

                    // pull the current Id from existing, assign it to newId
                    var newId = _.pullAt(existing, _.indexOf(existing, $modelValue.id));

                    Variants.queryVariantTypeRelationships({
                      existing_variant_type_ids: existing,
                      new_variant_type_id: newId[0]
                    }).then(function (response) {
                      if (_.isEmpty(response)) {
                        deferred.resolve('Variant type has no conflicts.'); // no relations, resolve.
                      } else {
                        var rel = response[0];
                        if (rel.relationship === 'none') {
                          deferred.resolve(true); // only 'none' relationship, resolve
                        } else {
                          scope.to.data.redundancy = rel;
                          if(rel.relationship === 'is') {
                            scope.to.data.redundancyMsg = rel.variant_type.display_name  + ' is already specified as a variant type.';
                          } else {
                            scope.to.data.redundancyMsg = $modelValue.display_name  + ' is a ' +
                              rel.relationship +
                              ' of ' +
                              rel.variant_type.display_name + '.';
                          }
                          deferred.reject('Variant type conflicts with an existing type.');
                        }
                      }
                    });

                  }
                  return deferred.promise;
                },
                message: 'to.data.redundancyMsg'
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
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Chromosome',
          value: vm.variantEdit.coordinates.chromosome,
          ngOptions: 'option["value"] as option["name"] for option in to.options',
          options: vm.chromosome_dropdown, //ConfigService.valid_chromosomes,
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
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Chromosome2',
          value: vm.variantEdit.coordinates.chromosome2,
          ngOptions: 'option["value"] as option["name"] for option in to.options',
          options: vm.chromosome_dropdown, //ConfigService.valid_chromosomes,
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
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.variantEdit.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          required: true,
          label: 'Revision Description',
          value: 'text',
          helpText: 'Please provide a brief description and support, if necessary, for your suggested revision. It will appear as the first comment in this revision\'s comment thread.'
        },
        validators: {
          length: {
            expression: function(viewValue, modelValue, scope) {
              var value = viewValue || modelValue;
              return value.length >= scope.to.minimum_length;
            },
            message: '"Comment must be at least " + to.minimum_length + " characters long to submit."'
          }
        }
      }
    ];

    vm.switchOrg = function(id) {
      vm.variantEdit.organization = _.find(vm.currentUser.organizations, { id: id });
    };

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
          $rootScope.$broadcast('revisionDecision');
          // reload current user if org changed
          if (variantEdit.organization.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
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
          // reload current user if org changed
          if (variantEdit.organization.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
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
    };
  }
})();
