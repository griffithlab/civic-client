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
      require: '^^entityTalkView',
      link: entityCommentFormLink,
      controller: 'EntityCommentFormController',
      templateUrl: 'app/views/events/common/entityCommentForm.tpl.html'
    }
  }

  // @ngInject
  function entityCommentFormLink(scope, element, attrs, entityTalkView) {
    scope.entityTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function EntityCommentFormController($scope, $stateParams, Security) {
    var ctrl = $scope.ctrl = {};

    $scope.$watch('entityTalkModel', function(entityTalkModel) {
      ctrl.isAuthenticated = Security.isAuthenticated();
      ctrl.isAdmin = Security.isAdmin();
      ctrl.currentUser = Security.currentUser;

      ctrl.entityTalkModel = entityTalkModel;

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

      ctrl.submit = function(comment, resetModel) {
        // TODO: comment form shouldn't have to figure out what type of comment it is submitting
        if($scope.type === 'comment') {
          ctrl.entityTalkModel.actions.submitComment(comment).then(function () {
            console.log('comment submitted.');
            ctrl.entityTalkModel.actions.getComments().then(function (response) {
              console.log(response);
              resetModel();
            });
          });
        }
        if($scope.type === 'changeComment') {
          ctrl.entityTalkModel.actions.submitChangeComment($stateParams.changeId, comment)
            .then(function () {
              console.log('comment submitted.');
              entityTalkModel.actions.getChangeComments($stateParams.changeId);
              resetModel();
          });
        }
      };
    });


  }
})();
