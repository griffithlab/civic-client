(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('entityCommentForm', entityCommenntFormDirective)
    .controller('EntityCommentFormController', EntityCommentFormController)
    .filter('mentioHighlightEntity', mentioHighlightEntity);

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
    vm.mode = 'edit';
    vm.previewLoading = false;
    vm.previewText = '';

    vm.commentMessage = '';

    vm.showMarkdownHelp = false;
    vm.showMacroHelp = false;

    vm.newComment = {
      title: '',
      text: ''
    };

    Security.requestCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      // if user no most_recent_org, assign org
      if(!u.most_recent_organization) {
        vm.currentUser.most_recent_organization = u.organizations[0];
      }

      vm.newComment.organization = vm.currentUser.most_recent_organization;
    });


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


    vm.newCommentFields = [
      {
        key: 'text',
        type: 'basicComment',
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
              if(_.isUndefined(value)) { return false; }
              else {
                return value.length >= scope.to.minimum_length;
              }
            },
            message: '"Comment must be at least " + to.minimum_length + " characters long to submit."'
          }
        }
      }
    ];

    vm.switchOrg = function(id) {
      vm.newComment.organization = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.submit = function(comment, resetModel) {
      comment = _.merge(comment, $stateParams);
      $scope.entityModel.submitComment(comment).then(function () {
        console.log('comment submitted.');
        resetModel();
        vm.previewText = '';
        vm.text = '';
        vm.commentMessage = '';
        vm.mode = 'edit';
        // reload current user if org changed
        if (comment.organization.id != vm.currentUser.most_recent_organization.id) {
          Security.reloadCurrentUser();
        }
      }, function() {
        vm.commentMessage = 'Error submitting comment.';
      });
    };


  }

  // version of ment.io's highlight filter which discards the entity token and colon from the query
  // in order to properly highlight matching strings to returned values
  // @ngInject
  function mentioHighlightEntity(_) {
    function escapeRegexp (queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function (matchItem, query, hightlightClass) {
      if (query) {
        if(_.includes(query, ':')) {
          if(_.includes(query, ':')) { query = query.split(':')[1].length > 0 ? _.drop(query.split(':'), 1)[0] : String(); }
        }
        var replaceText = hightlightClass ?
        '<span class="' + hightlightClass + '">$&</span>' :
          '<strong>$&</strong>';
        return ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), replaceText);
      } else {
        return matchItem;
      }
    };
  }

})();
