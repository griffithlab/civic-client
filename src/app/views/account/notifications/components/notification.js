(function() {
  'use strict';
  angular.module('civic.common')
    .directive('notification', notification);

  // @ngInject
  function notification() {
    return {
      restrict: 'E',
      scope: {
        notification: '=',
        theme: '=',
        fetch: '='
      },
      templateUrl: 'app/views/account/notifications/components/notification.tpl.html',
      controller: notificationController
    };
  }

  // @ngInject
  function notificationController($scope,
                                  $state,
                                  $stateParams,
                                  CurrentUser,
                                  _) {
    var vm = $scope.vm = {};
    var params = $scope.notification.event.state_params;

    vm.seen = $scope.notification.seen;

    vm.entityNames = [];

    if(_.has(params, 'gene')) {vm.entityNames.push(params.gene.name);}
    if(_.has(params, 'variant')) {vm.entityNames.push(params.variant.name);}
    if(_.has(params, 'evidence_item')) {vm.entityNames.push(params.evidence_item.name);}

    vm.entityName = _.compact(vm.entityNames).join(' / ');

    vm.eventClick = function(notification) {
      var subjectStates = {
        genes: 'events.genes',
        variants: 'events.genes.summary.variants',
        variantgroups: 'events.genes.summary.variantGroups',
        evidenceitems: 'events.genes.summary.variants.summary.evidence'
      };

      // revision comments require some more logic to determine the proper state
      if(notification.event.subject_type === 'suggestedchanges') {
        var state;
        var type = notification.event.state_params.suggested_change.subject_type;
        if(type === 'evidenceitems') {
          state = 'events.genes.summary.variants.summary.evidence';
        } else if (type === 'variantgroups') {
          state = 'events.genes.summary.variantGroups';
        } else if (type === 'variants') {
          state = 'events.genes.summary.variants';
        } else if (type === 'genes') {
          state = 'events.genes';
        }
        subjectStates.suggestedchanges = state;
      }


      var stateExtension = {
        'commented': '.talk.comments',
        'submitted': '.summary',
        'accepted': '.summary',
        'rejected': '.summary',
        'change suggested': '.talk.revisions.list.summary',
        'change accepted': '.talk.revisions.list.summary',
        'change rejected': '.talk.revisions.list.summary'
      };

      // revision comments are shown in their revision's summary view, override commented extension
      if(notification.event.subject_type === 'suggestedchanges') {
        stateExtension.commented = '.talk.revisions.list.summary';
      }

      var stateParams = {};
      _.each(notification.event.state_params, function(obj, entity) {
        var entityId;
        if(entity === 'suggested_change') {
          entityId = 'revisionId';
        } else if (entity === 'evidence_item') {
          entityId = 'evidenceId';
        } else if (entity === 'variant_group') {
          entityId = 'variantGroupId';
        } else {
          entityId = entity + 'Id';
        }
        stateParams[entityId] = obj.id;
      });

      if (!notification.event.unlinkable) {
        $state.go(subjectStates[notification.event.subject_type]+stateExtension[notification.event.event_type], stateParams);
      }

    };

    vm.markAsRead = function() {
      CurrentUser.markFeed($stateParams, [$scope.notification.id], true);
      $scope.fetch();
    };

    vm.markAsUnread = function() {
      CurrentUser.markFeed($stateParams, [$scope.notification.id], false);
      $scope.fetch();
    };
  }
})();
