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
    };
  }

  // @ngInject
  function GeneEditBasicController($scope,
                                   $q,
                                   $document,
                                   $state,
                                   _,
                                   Publications,
                                   Security,
                                   GeneRevisions,
                                   Genes,
                                   GeneHistory,
                                   GenesViewOptions,
                                   formConfig) {
    var geneModel, vm;

    vm = $scope.vm = {};
    geneModel = vm.geneModel = Genes;

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.gene = Genes.data.item;
    vm.pendingFields = _.keys(GeneRevisions.data.pendingFields).length > 0;
    vm.pendingFieldsList = _.map(_.keys(GeneRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });
    vm.geneRevisions = GeneRevisions;
    vm.geneHistory = GeneHistory;
    vm.geneEdit = angular.copy(vm.gene);
    vm.geneEdit.comment = { title: 'GENE ' + vm.gene.name + ' Revision Description', text:'' };
    vm.geneEdit.source_ids = _.pluck(vm.gene.sources, 'pubmed_id');
    vm.myGeneInfo = geneModel.data.myGeneInfo;
    vm.variants = geneModel.data.variants;
    vm.variantGroups = geneModel.data.variantGroups;

    vm.styles = GenesViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;
    vm.serverMsg = '';
    vm.newRevisionId = Number();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    // scroll to form header
    $document.ready(function() {
      var elem = document.getElementById('gene-edit-form');
      $document.scrollToElementAnimated(elem);
    });

    vm.geneFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: vm.gene.name,
          helpText: ''
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Summary',
          value: 'vm.gene.description',
          focus: true,
          minLength: 32,
          helpText: ['<p>User-defined summary of the clinical relevance of this Gene.</p>',
                  '<p>Should include:</p>',
                  '<ul>',
                  '<li>relevance to appropriate cancer(s)</li>',
                  '<li>treatment(s) related specifically to variants affecting this Gene</li>',
                  '</ul>',
                  '<p>May include relevant mechanistic information such as:</p>',
                  '<ul>',
                  '<li>pathway interactions</li>',
                  '<li>functional alterations caused by variants in this Gene (i.e., activating, loss-of-function, etc.)</li>',
                  '<li>normal functions key to its oncogenic properties.</li>',
                  '</ul>'
                ].join(' ')
        }
      },
      {
        key: 'source_ids',
        type: 'multiInput',
        templateOptions: {
          label: 'Sources',
          helpText: 'Please specify the Pubmed IDs of any sources used as references in the Gene Summary.',
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
        template: '<hr/>'
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.geneEdit.comment,
        ngModelElAttrs: {
          'msd-elastic': 'true',
          'mentio': '',
          'mentio-id': '"commentForm"'
        },
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Revision Description',
          required: false,
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

    vm.submit = function(geneEdit) {
      geneEdit.geneId = geneEdit.id;
      geneEdit.sources = geneEdit.source_ids;
      vm.formErrors = {};
      vm.formMessages = {};

      GeneRevisions.submitRevision(geneEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.newRevisionId = response.id;
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.pendingFields = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          // options.resetModel();
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

    vm.apply = function(geneEdit) {
      geneEdit.geneId = geneEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Genes.apply(geneEdit)
        .then(function() {
          console.log('revision apply success!');
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
      $state.go('events.genes.talk.revisions.list', { geneId: Genes.data.item.id });
    }
  }
})();
