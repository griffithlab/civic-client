(function() {
  'use strict';
  angular.module('civic.config')
    .constant('formConfig', {
      options: {
        labelColWidth: 2,
        inputColWidth: 5,
        helpColWidth: 5
      },
      errorMessages: {
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '409': 'Conflict',
        '500': 'Server Error',
        '501': 'Not Implemented'
      },
      errorPrompts: {
        '400': 'The CIViC Client made a request the server didn\'t like, check the console output for more information.',
        '401': 'You must be logged in to perform that action.',
        '403': 'You do not have sufficient permissions to perform that action.',
        '404': 'The CIViC client made a request to a route that could not be found, check the console output for more information',
        '405': 'The CIViC client made a request that is not supported, check the console output for more information',
        '406': 'TOTALLY UNACCEPTABLE, I CAN\'T EVEN',
        '409': 'The attempted update conflicts with an existing record.',
        '500': 'The CIViC server experienced an unrecoverable error, please check the console output for more information.',
        '501': 'The CIViC client attempted to utilize an unimplemented route.'
      }
    })
    .config(formlyTemplatesConfig);

  // @ngInject
  function formlyTemplatesConfig(formlyConfigProvider, formConfig) {
    var inputColWidth = formConfig.options.inputColWidth;
    var labelColWidth = formConfig.options.labelColWidth;
    var helpColWidth = formConfig.options.helpColWidth;
    // set templates here
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapLabel',
      template: [
              '<label for="{{::id}}" class="col-sm-'+ labelColWidth +' control-label">',
              '{{to.label}}',
              '</label>',
              '<div class="col-sm-' + inputColWidth + '">',
              '<formly-transclude></formly-transclude>',
              '</div>'
            ].join(' ')
    });
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapHelp',
      template: ['<label for="{{::id}}" class="col-sm-'+ labelColWidth +' control-label">',
              '{{to.label}}',
              '</label>',
              '<div class="col-sm-'+ inputColWidth +'">',
              '<formly-transclude></formly-transclude>',
              '</div>',
              '<div class="col-sm-'+ helpColWidth +' control-help">',
              '<span class="small" ng-bind-html="to.helpText"></span>',
              '</div>'
            ].join(' ')
    });
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapCheckbox',
      template: [
              '<div class="col-sm-offset-'+ labelColWidth +' col-sm-8">',
              '<formly-transclude></formly-transclude>',
              '</div>'
            ].join(' ')
    });

    // input
    formlyConfigProvider.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalInputHelp',
      extends: 'input',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    // select
    formlyConfigProvider.setType({
      name: 'horizontalSelect',
      extends: 'select',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalSelectHelp',
      extends: 'select',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    // textarea
    formlyConfigProvider.setType({
      name: 'horizontalTextarea',
      extends: 'textarea',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalTextareaHelp',
      extends: 'textarea',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });


    // checkbox
    formlyConfigProvider.setType({
      name: 'horizontalCheckbox',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalCheckboxHelp',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    // multiInput field
    formlyConfigProvider.setType({
      name: 'multiInput',
      templateUrl: '/components/forms/multiInput.tpl.html',
      defaultOptions: {
        noFormControl: true,
        wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError'],
        templateOptions: {
          inputOptions: {
            wrapper: null
          }
        }
      },
      controller: /* @ngInject */ function($scope) {
        $scope.copyItemOptions = copyItemOptions;

        function copyItemOptions() {
          return angular.copy($scope.to.inputOptions);
        }
      }
    });
  }
})();
