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
        entityTalkModel: '='
      },
      controller: 'EntityCommentFormController',
      templateUrl: 'app/views/events/common/entityCommentForm.tpl.html'
    }
  }



  // @ngInject
  function EntityCommentFormController($scope, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.isAuthenticated = Security.isAuthenticated();
    ctrl.isAdmin = Security.isAdmin();
    ctrl.currentUser = Security.currentUser;
    ctrl.entityTalkModel = $scope.entityTalkModel;
    ctrl.newComment = {
      title: '',
      text: ''
    };

    ctrl.newCommentFields = [
      {
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Title',
          value: ctrl.newComment.title
        }
      },
      {
        key: 'text',
        type: 'textarea',
        templateOptions: {
          label: 'Comment',
          rows: 5,
          value: ctrl.newComment.text
        }
      }
    ];

    ctrl.submit = function(comment) {
      ctrl.entityTalkModel.actions.submitComment(comment).then(function() {
        console.log('comment submitted.');
        ctrl.entityTalkModel.actions.getComments();
      });
    };
  }
})();
