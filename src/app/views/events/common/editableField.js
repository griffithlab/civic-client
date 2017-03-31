(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EditableFieldController', EditableFieldController)
    .directive('editableField', editableField);

  // @ngInject
  function editableField() {

    return {
      restrict: 'A',
      transclude: true,
      scope: {
        entityViewModel: '=',
        entityViewRevisions: '=',
        entityViewOptions: '=',
        type: '=',
        name: '='
      },
      controller: 'EditableFieldController',
      templateUrl: 'app/views/events/common/editableField.tpl.html'
    };
  }

  // @ngInject
  function EditableFieldController($scope, $state, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.baseState = '';
    ctrl.stateParams = {};
    ctrl.isAuthenticated = Security.isAuthenticated;
    ctrl.flags = [
      {id: 1,
       comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit dolor risus, non congue turpis ornare non. Cras vel imperdiet ipsum, vitae vulputate eros. Etiam ultricies mi quis arcu sodales dapibus. Sed luctus ante eget nisi sagittis tristique. Cras interdum sapien nec magna efficitur bibendum. Maecenas eget ante libero. In suscipit pretium libero, sed porta tortor tristique non. Nullam vitae placerat nulla. Nunc a ipsum et dolor iaculis aliquam quis at eros. Suspendisse potenti.',
       active: false,
       flagUser: {"id":6,"name":"Kilannin Krysiak","last_seen_at":"2016-10-06T06:04:09.433Z","username":"kkrysiak","role":"admin","avatar_url":"https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=32","avatars":{"x128":"https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=128","x64":"https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=64","x32":"https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=32","x14":"https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=14"},"area_of_expertise":"Research Scientist","orcid":"0000-0002-6299-9230","display_name":"kkrysiak","created_at":"2015-02-26T04:14:20.953Z","url":"","twitter_handle":null,"facebook_profile":null,"linkedin_profile":"kilannin-krysiak-69047819","bio":"Dr. Krysiak is a staff scientist at the McDonnell Genome Institute at Washington University School of Medicine where she is involved in the comprehensive genomic analysis of cancer patient cohorts and “n-of-1” studies. She received her PhD in Molecular Genetics and Genomics at Washington University in St. Louis where she focused on the genetics of myelodysplastic syndrome through advanced flow cytometry techniques, primary cell culture and mouse models. She is a founding member of the CIViC team, helping to define the CIViC data model, and a leading content curator and feature development consultant.","featured_expert":true,"accepted_license":null,"signup_complete":null,"affiliation":null,"organization":null,"domain_expert_tags":[],"trophy_case":{"badges":[]},"community_params":{"most_recent_action_timestamp":"2016-10-06T06:04:09.496Z","action_count":2665}},
       unflagUser: {"id":15,"name":"Malachi Griffith","last_seen_at":"2016-10-04T17:33:52.779Z","username":"MalachiGriffith","role":"admin","avatar_url":"https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=32","avatars":{"x128":"https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=128","x64":"https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=64","x32":"https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=32","x14":"https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=14"},"area_of_expertise":"Research Scientist","orcid":"0000-0002-6388-446X","display_name":"MalachiGriffith","created_at":"2015-02-26T22:25:34.692Z","url":"http://genome.wustl.edu/people/individual/malachi-griffith/","twitter_handle":"malachigriffith","facebook_profile":null,"linkedin_profile":"http://www.linkedin.com/in/malachigriffith","bio":"Dr. Griffith is an Assistant Professor of Genetics and Assistant Director of the McDonnell Genome Institute at Washington University School of Medicine. Dr Griffith has extensive experience in the fields of genomics, bioinformatics, data mining, and cancer research. His research is focused on improving the understanding of cancer biology and the development of personalized medicine strategies for cancer using genomics and informatics technologies. The Griffith lab develops bioinformatics and statistical methods for the analysis of high throughput sequence data and identification of biomarkers for diagnostic, prognostic and drug response prediction. The Griffith lab uses CIViC to interpret variants identified in cases examined by the WASHU Genomics Tumor Board. He is a co-creator of the CIViC resource.","featured_expert":true,"accepted_license":null,"signup_complete":null,"affiliation":null,"organization":null,"domain_expert_tags":[],"trophy_case":{"badges":[]},"community_params":{"most_recent_action_timestamp":"2016-10-03T15:58:49.097Z","action_count":2558}}
      }
    ];

    ctrl.baseState  = $scope.entityViewOptions.state.baseState;
    ctrl.gstateParams = $scope.entityViewOptions.state.params;
    ctrl.entityViewModel = $scope.entityViewModel;

    ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    $scope.$on('$stateChangeSuccess', function() {
      ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    });

    ctrl.edit= function() {
      if (Security.isAuthenticated()) {
        $state.go(ctrl.baseState + '.edit.basic', ctrl.stateParams);
      }
    };

    ctrl.flag = function() {
      console.log('ctrl.flag() called.');
    };

  }


})();
