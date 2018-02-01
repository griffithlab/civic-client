(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantGroupEditBasic', variantGroupEditBasicDirective)
    .controller('VariantGroupEditBasicController', VariantGroupEditBasicController);

  // @ngInject
  function variantGroupEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantGroupEditBasicController',
      templateUrl: 'app/views/events/variantGroups/edit/variantGroupEditBasic.tpl.html'
    };
  }

  // @ngInject
  function VariantGroupEditBasicController($scope,
                                           $stateParams,
                                           $state,
                                           $q,
                                           Security,
                                           Datatables,
                                           VariantGroupRevisions,
                                           VariantGroups,
                                           VariantGroupHistory,
                                           VariantGroupsViewOptions,
                                           TypeAheadResults,
                                           Publications,
                                           formConfig,
                                           _,
                                           $rootScope) {
    var variantGroupModel, vm;

    vm = $scope.vm = {};
    variantGroupModel = vm.variantGroupModel = VariantGroups;

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.variantGroup = VariantGroups.data.item;
    vm.pendingFields = _.keys(VariantGroupRevisions.data.pendingFields).length > 0;
    vm.pendingFieldsList = _.map(_.keys(VariantGroupRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });

    vm.variantGroupRevisions = VariantGroupRevisions;
    vm.variantGroupHistory = VariantGroupHistory;
    vm.variantGroupEdit = angular.copy(vm.variantGroup);
    vm.variantGroupEdit.comment = { title: 'VARIANT GROUP ' + vm.variantGroup.name + ' Revision Description', text:'' };
    vm.variantGroupEdit.sources = _.map(vm.variantGroup.sources, 'pubmed_id');
    vm.variantGroupEdit.variantsEdit = _.map(vm.variantGroupEdit.variants, function(variant) {
      return { name: variant.entrez_name + ' - ' + variant.name, id: variant.id };
    });

    vm.styles = VariantGroupsViewOptions.styles;

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

    vm.variantGroupFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: false,
          value: vm.variantGroup.name
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Summary',
          value: 'vm.variantGroup.description',
          focus: true,
          minLength: 32
        }
      },
      {
        key: 'sources',
        type: 'multiInput',
        templateOptions: {
          label: 'Sources',
          helpText: 'Please specify the Pubmed IDs of any sources used as references in the Variant Group Summary.',
          entityName: 'Source',
          inputOptions: {
            type: 'publication-multi',
            templateOptions: {
              label: 'Pubmed Id',
              minLength: 1,
              required: true,
              data: {
                description: '--'
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
                    Publications.verify($viewValue).then(
                      function (response) {
                        scope.options.templateOptions.loading = false;
                        scope.options.templateOptions.data.description = response.description;
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
        key: 'variantsEdit',
        type: 'multiInput',
        templateOptions: {
          label: 'Variants',
          entityName: 'Variant',
          helpText: 'Click the X button to delete a variant, click the + button to add a variant. Note that variants must be known to CIViC to be available for including here. New variants may be added as part of an evidence item using the <a href="/add/evidence/basic" target="_self">Add Evidence form</a>.',
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
                  query: val,
                  count: 10
                };
                return TypeAheadResults.variants(request).$promise
                  .then(function(response) {
                    return _.map(response.records, function(event) {
                      return { name: event.gene_name + ' - ' + event.name, id: event.id };
                    });
                  });
              }
            }
          }
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.variantGroupEdit.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          required: false,
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

    vm.submit = function(variantGroupEdit) {
      variantGroupEdit.variantGroupId = variantGroupEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      // prep variant edit obj for submission to server
      variantGroupEdit.variants = _.map(variantGroupEdit.variantsEdit, 'id');

      VariantGroupRevisions.submitRevision(variantGroupEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.newRevisionId = response.id;
          vm.formMessages.submitSuccess = true;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.showInstructions = false;
          vm.pendingFields = false;
          $rootScope.$broadcast('revisionDecision');
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

    vm.apply = function(variantGroupEdit) {
      variantGroupEdit.variantGroupId = variantGroupEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      VariantGroups.apply(variantGroupEdit)
        .then(function() {
          console.log('revision apply success!');
          vm.formMessages.applySuccess = true;
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

    vm.revisionsClick = function() {
      $state.go('events.genes.summary.variantGroups.talk.revisions.list', { variantGroupId: VariantGroups.data.item.id });
    };
  }
})();
