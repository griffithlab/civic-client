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
      link: entityCommentFormLink,
      templateUrl: 'app/views/events/common/entityCommentForm.tpl.html'
    }
  }

  // @ngInject
  function entityCommentFormLink(scope, element, attributes) {

  }

  // @ngInject
  function EntityCommentFormController($scope) {
    var ctrl = $scope.ctrl = {};
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
        ctrl.entityTalkModel.actions.getComments().then(function(comments){
          ctrl.entityTalkModel.data.comments = comments;
          console.log('comments updated.');
        });
      });
    };
  }
})();
