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
                                       CommentPreview,
                                       _) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.currentUser = Security.currentUser;
    vm.isEditor = Security.isEditor();

    vm.mode = 'edit';
    vm.previewLoading = false;
    vm.previewText = "";

    vm.commentMessage = "";

    vm.showMarkdownHelp = false;
    vm.markdownHelpUrl = 'app/views/events/common/entityCommentMarkdownHelp.tpl.html';

    vm.switchMode = function(mode) {
      if (mode === 'preview') {
        if (!_.isUndefined(vm.newComment.text) && vm.newComment.text.length >0) {
          vm.commentMessage = "";
          vm.mode = 'preview';
          vm.previewLoading = true;
          CommentPreview.getPreview(vm.newComment.text)
            .then(function(response) { // success
              vm.previewText = response.html;
              vm.previewLoading = false;
            }, function(error) { // failure
              vm.previewLoading = false;
              vm.commentMessage="Error loading preview."
            })
        } else {
          vm.commentMessage = "Please enter Markdown text to preview.";
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
        templateOptions: {
          label: 'Add Comment:',
          rows: 4,
          value: vm.newComment.text,
          minlength: 2,
          currentUser: vm.currentUser,
          required: true
        },
        validation: {
          messages: {
            minlength: '"Comment must be at least " + options.templateOptions.minlength + " characters long."'
          }
        }
      }
    ];

    vm.submit = function(comment, resetModel) {
      comment = _.merge(comment, $stateParams);
      $scope.entityModel.submitComment(comment).then(function () {
        console.log('comment submitted.');
        vm.newComment.text = '';
        vm.previewText = '';
        vm.commentMessage = '';
        vm.mode = 'edit';
      }, function(error) {
        vm.commentMessage = 'Error submitting comment.';
      });
    };


  }
})();
