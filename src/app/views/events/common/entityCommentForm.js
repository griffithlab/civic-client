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
  function EntityCommentFormController($scope, $stateParams, Security, _) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.currentUser = Security.currentUser;
    vm.isEditor = Security.isEditor();

    vm.showMarkdownHelp = false;
    vm.markdownHelpUrl = 'app/views/events/common/entityCommentMarkdownHelp.tpl.html';

    vm.newComment = {
      title: '',
      text: ''
    };

    vm.newCommentFields = [
      //{
      //  key: 'title',
      //  type: 'input',
      //  templateOptions: {
      //    label: 'Title',
      //    value: vm.newComment.title
      //  }
      //},
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
        resetModel();
      });
    };


  }
})();
