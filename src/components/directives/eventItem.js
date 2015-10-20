(function() {
  'use strict';
  angular.module('civic.common')
    .directive('eventItem', eventItem);

  // @ngInject
  function eventItem() {
    return {
      restrict: 'E',
      scope: {
        event: '='
      },
      templateUrl: 'components/directives/eventItem.tpl.html',
      controller: eventItemController
    };
  }

  // @ngInject
  function eventItemController($scope, $state, _) {
    console.log('eventItemController called.');
    var vm = $scope.vm = {};

    vm.eventClick = function(event) {
      var subjectStates = {
        genes: 'events.genes',
        variants: 'events.genes.summary.variants',
        variantgroups: 'events.genes.summary.variantGroups',
        evidenceitems: 'events.genes.summary.variants.summary.evidence'
      };

      // revision comments require some more logic to determine the proper state
      if(event.subject_type === 'suggestedchanges') {
        var state;
        var type = event.state_params.suggested_change.subject_type;
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
      if(event.subject_type === 'suggestedchanges') {
        stateExtension.commented = '.talk.revisions.list.summary'
      }

      var stateParams = {};
      _.each(event.state_params, function(obj, entity) {
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

      $state.go(subjectStates[event.subject_type]+stateExtension[event.event_type], stateParams);

    }
  }
})();
