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
                                   formConfig,
                                   $rootScope) {
    var geneModel, vm;

    vm = $scope.vm = {};
    geneModel = vm.geneModel = Genes;

    vm.gene = Genes.data.item;
    // convert source objects to array of IDs, multi-input field type does not handle objects at this time
    vm.pendingFields = _.keys(GeneRevisions.data.pendingFields).length > 0;
    vm.pendingFieldsList = _.map(_.keys(GeneRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });
    vm.geneRevisions = GeneRevisions;
    vm.geneHistory = GeneHistory;
    vm.geneEdit = angular.copy(vm.gene);
    vm.geneEdit.comment = { title: 'GENE ' + vm.gene.name + ' Revision Description', text:'' };
    vm.geneEdit.source_ids = _.map(vm.gene.sources, 'citation_id');
    vm.myGeneInfo = geneModel.data.myGeneInfo;
    vm.variants = geneModel.data.variants;
    vm.variantGroups = geneModel.data.variantGroups;

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.geneEdit.organization = vm.currentUser.most_recent_organization;
    });

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
          helpText: ['<p>User-defined summary of the clinical relevance of this Gene. By submitting content to CIViC you agree to release it to the public domain as described by the <a href="https://creativecommons.org/publicdomain/zero/1.0/" title="CreativeCommons.org CC0 license" target="_blank">Creative Commons Public Domain Dedication (CC0 1.0 Universal)</a></p>',
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
                        if(error.status === 404) {
                          scope.options.templateOptions.data.citation = 'No PubMed source found with specified ID.';
                        } else {
                          scope.options.templateOptions.data.citation = 'Error fetching source, check console log for details.';
                        }
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
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Revision Description',
          required: true,
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
      vm.geneEdit.organization = _.find(vm.currentUser.organizations, { id: id });
    };

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
          $rootScope.$broadcast('revisionDecision');
          // reload current user if org changed
          if (geneEdit.organization.id != vm.currentUser.most_recent_organization.id) {
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

    vm.apply = function(geneEdit) {
      geneEdit.geneId = geneEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Genes.apply(geneEdit)
        .then(function() {
          console.log('revision apply success!');
          vm.formMessages.applySuccess = true;
          // reload current user if org changed
          if (geneEdit.organization.id != vm.currentUser.most_recent_organization.id) {
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
      $state.go('events.genes.talk.revisions.list', { geneId: Genes.data.item.id });
    };
  }
})();
