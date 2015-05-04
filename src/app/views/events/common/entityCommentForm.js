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
        type: '@'
      },
      require: ['^^entityTalkView', '^^entityTalkRevisionsView'],
      link: entityCommentFormLink,
      controller: 'EntityCommentFormController',
      templateUrl: 'app/views/events/common/entityCommentForm.tpl.html'
    }
  }

  // @ngInject
  function entityCommentFormLink(scope, element, attrs, controllers) {
    scope.entityTalkModel = entityTalkView.viewModel;



  }

  // @ngInject
  function EntityCommentFormController($scope, $stateParams, Security) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.currentUser = Security.currentUser;
    vm.isAdmin = Security.isAdmin();

    vm.newComment = {
      title: '',
      text: ''
    };

    vm.newCommentFields = [
      {
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Title',
          value: vm.newComment.title
        }
      },
      {
        key: 'text',
        type: 'textarea',
        templateOptions: {
          label: 'Comment',
          rows: 5,
          value: vm.newComment.text
        }
      }
    ];

    vm.submit = function(comment, resetModel) {
      $scope.entityTalkModel.submitComment(comment).then(function () {
        console.log('comment submitted.');
        resetModel();
      });
    };


  }
})();
