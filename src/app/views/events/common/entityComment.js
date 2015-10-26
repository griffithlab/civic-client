(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('entityComment', entityCommentDirective)
    .controller('EntityCommentController', EntityCommentController);

  // @ngInject
  function entityCommentDirective() {
    return {
      restrict: 'E',
      scope: {
        commentData: '=',
        entityModel: '='
      },
      controller: 'EntityCommentController',
      templateUrl: 'app/views/events/common/entityComment.tpl.html'
    };
  }

  // @ngInject
  function EntityCommentController($scope, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.security = {
      isAuthenticated: Security.isAuthenticated(),
      isAdmin: Security.isEditor(),
      currentUser: Security.currentUser
    };

    ctrl.comment = $scope.commentData;

    ctrl.deleteComment = function(comment) {
      $scope.entityModel.deleteComment(comment.id)
        .then(function() {
          console.log('delete comment successful.');
        })
        .catch(function() {
          console.error('error deleting comment.');
        })
        .finally(function() {
          console.log('comment delete done!');
        });
    };
  }
})();
