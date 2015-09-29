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
        evidenceitems: 'events.genes.summary.variants.summary.evidence'
      };

      var stateExtension = {
        'commented': '.talk.comments',
        'submitted': '.summary',
        'change suggested': '.talk.revisions.list.summary',
        'change accepted': '.talk.revisions.list.summary',
        'change rejected': '.talk.revisions.list.summary'
      };

      var stateParams = {};
      _.each(event.state_params, function(obj, entity) {
        var entityId;
        if(entity === 'suggested_change') {
          entityId = 'revisionId';
        } else if (entity === 'evidence_item') {
          entityId = 'evidenceId';
        } else {
          entityId = entity + 'Id';
        }
        stateParams[entityId] = obj.id;
      });

      $state.go(subjectStates[event.subject_type]+stateExtension[event.event_type], stateParams);

    }
  }
})();
