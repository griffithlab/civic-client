(function() {
  'use strict';
  angular.module('civic.common')
    .directive('eventItem', eventItem);

  // @ngInject
  function eventItem() {
    return {
      restrict: 'E',
      scope: {
        event: '=',
        theme: '='
      },
      templateUrl: 'components/directives/eventItem.tpl.html',
      controller: eventItemController
    };
  }

  // @ngInject
  function eventItemController($scope, $state, _) {
    console.log('eventItemController called.');
    var vm = $scope.vm = {};
    var params = $scope.event.state_params;

    vm.seen = $scope.event.seen;

    vm.entityNames = [];

    if(_.has(params, 'assertion')) {vm.entityNames.push(params.assertion.name);}
    if(_.has(params, 'gene')) {vm.entityNames.push(params.gene.name);}
    if(_.has(params, 'variant')) {vm.entityNames.push(params.variant.name);}
    if(_.has(params, 'evidence_item')) {vm.entityNames.push(params.evidence_item.name);}
    if(_.has(params, 'source')) {vm.entityNames.push(params.source.name);}

    vm.entityName = _.compact(vm.entityNames).join(' / ');

    vm.eventClick = function(event) {
      var subjectStates = {
        genes: 'events.genes',
        assertion: 'assertion.summary',
        variants: 'events.genes.summary.variants',
        variantgroups: 'events.genes.summary.variantGroups',
        evidenceitems: 'events.genes.summary.variants.summary.evidence',
        sources: 'sources'
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
        'flagged': '.summary',
        'flag resolved': '.summary',
        'submitted': '.summary',
        'accepted': '.summary',
        'rejected': '.summary',
        'publication suggested': '.summary',
        'change suggested': '.talk.revisions.list.summary',
        'change accepted': '.talk.revisions.list.summary',
        'change rejected': '.talk.revisions.list.summary'
      };

      // revision comments are shown in their revision's summary view, override commented extension
      if(event.subject_type === 'suggestedchanges') {
        stateExtension.commented = '.talk.revisions.list.summary';
      }
      // source summaries have no talk section, display comments in summary view
      if(event.subject_type === 'sources') {
        stateExtension.commented = '.summary';
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
        } else if (entity === 'source') {
          entityId = 'sourceId';
        } else {
          entityId = entity + 'Id';
        }
        stateParams[entityId] = obj.id;
      });
      if (event.unlinkable === false) {
        $state.go(subjectStates[event.subject_type] + stateExtension[event.event_type], stateParams);
      }
    };
  }
})();
