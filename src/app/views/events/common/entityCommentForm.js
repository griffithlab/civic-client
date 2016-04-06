(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('entityCommentForm', entityCommenntFormDirective)
    .controller('EntityCommentFormController', EntityCommentFormController);

  // @ngInject
  function entityCommenntFormDirective() {
    return {
      restrict: 'E',
      scope: {
        type: '@',
        entityModel: '='
      },
      controller: 'EntityCommentFormController',
      templateUrl: 'app/views/events/common/entityCommentForm.tpl.html'
    };
  }

  // @ngInject
  function EntityCommentFormController($scope,
                                       $stateParams,
                                       Security,
                                       CommentSuggestions,
                                       CommentPreview,
                                       _) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.currentUser = Security.currentUser;
    vm.isEditor = Security.isEditor();

    vm.mode = 'edit';
    vm.previewLoading = false;
    vm.previewText = '';

    vm.commentMessage = '';

    vm.showMarkdownHelp = false;
    vm.markdownHelpUrl = 'app/views/events/common/entityCommentMarkdownHelp.tpl.html';

    vm.switchMode = function(mode) {
      if (mode === 'preview') {
        if (!_.isUndefined(vm.newComment.text) && vm.newComment.text.length >0) {
          vm.commentMessage = '';
          vm.mode = 'preview';
          vm.previewLoading = true;
          CommentPreview.getPreview(vm.newComment.text)
            .then(function(response) { // success
              vm.previewText = response.html;
              vm.previewLoading = false;
            }, function() { // failure
              vm.previewLoading = false;
              vm.commentMessage = 'Error loading preview.';
            });
        } else {
          vm.commentMessage = 'Please enter Markdown text to preview.';
        }
      } else {
        vm.mode = 'edit';
        vm.previewText = '';
        vm.commentMessage = '';
      }
    };

    vm.newComment = {
      title: '',
      text: ''
    };

    vm.newCommentFields = [
      {
        key: 'text',
        type: 'comment',
        ngModelElAttrs: {
          'msd-elastic': 'true',
          'mentio': '',
          'mentio-id': '"commentForm"'
        },
        controller: /* @ngInject */ function($scope) {
          $scope.searchUsers = function(term) {
            CommentSuggestions.getUserSuggestions(term).then(function(response) {
              $scope.users = response;
            });
          };

          $scope.getUser = function(user) {
            return '@' + user.display_name;
          };

          $scope.searchEntities = function(term) {
            CommentSuggestions.getEntitySuggestions(term).then(function(response) {
              $scope.entities = response;
            });
          };

          $scope.getEntity= function(entity) {
            return '#' + entity.type + entity.id;
          };

          $scope.typedTerm = '';
        },
        data: {
          users: [],
          entities: []
        },
        templateOptions: {
          label: 'Add Comment:',
          rows: 4,
          minimum_length: 3,
          value: vm.newComment.text,
          currentUser: vm.currentUser,
          required: false
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

    vm.submit = function(comment, resetModel) {
      comment = _.merge(comment, $stateParams);
      $scope.entityModel.submitComment(comment).then(function () {
        console.log('comment submitted.');
        resetModel();
        vm.previewText = '';
        vm.commentMessage = '';
        vm.mode = 'edit';
      }, function() {
        vm.commentMessage = 'Error submitting comment.';
      });
    };


  }
})();
