(function() {
  'use strict';
  angular.module('civic.config')
    .constant('formConfig', {
      options: {
        labelColWidth: 2,
        inputColWidth: 5,
        helpColWidth: 5
      },
      validationMessages: {
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
    .config(formlyTemplatesConfig)
    .run(formlyTemplatesRun);

  // @ngInject
  function formlyTemplatesRun(formlyValidationMessages) {
    // default messages
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'is the minimum length', 'Too short.');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', 'is the maximum length', 'Too long.');
    formlyValidationMessages.addStringMessage('minlength', 'This field is required.');
    formlyValidationMessages.addStringMessage('required', 'This field is required.');
  }

  // @ngInject
  function formlyTemplatesConfig(formlyConfigProvider, formConfig) {
    var inputColWidth = formConfig.options.inputColWidth;
    var labelColWidth = formConfig.options.labelColWidth;
    var helpColWidth = formConfig.options.helpColWidth;

    /*
    * ERROR MSG WRAPPERS
     */

    formlyConfigProvider.setWrapper({
      name: 'validationMessages',
      template: [
        '<formly-transclude></formly-transclude>',
        '<div class="validation"',
        'ng-if="options.validation.errorExistsAndShouldBeVisible"',
        'ng-messages="options.formControl.$error">',
        '<div class="field-message-error" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
        '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
        '</div>',
        '</div>'
      ].join(' ')
    });

    /*
    * FIELD WRAPPERS
     */
    // TODO: get all template strings into their own files while preserving the ability to define col widths etc.
    formlyConfigProvider.setWrapper({
      // horizontal bootstrap row with label
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

    // horizontal bootstrap field with label and help column
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapHelp',
      template: [
        '<label for="{{::id}}" class="col-sm-'+ labelColWidth +' control-label">',
        '{{to.label}}',
        '</label>',
        '<div class="col-sm-'+ inputColWidth +'">',
        '<formly-transclude></formly-transclude>',
        //'<p class="small">errors:</p>',
        //'<div ng-messages-include="commentValidation.tpl.html"></div>',
        '</div>',
        '<div class="col-sm-'+ helpColWidth +' control-help">',
        '<span class="small" ng-bind-html="to.helpText"></span>',
        '</div>'
      ].join(' ')
    });

    // horizontal bootstrap checkbox
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapCheckbox',
      template: [
              '<div class="col-sm-offset-'+ labelColWidth +' col-sm-8">',
              '<formly-transclude></formly-transclude>',
              '</div>'
            ].join(' ')
    });

    // horizontal bootstrap with current user (intended for comment forms)
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapComment',
      template: [
        '<label for="{{::id}}" class="col-sm-1 control-label">',
        '<user-image user="to.currentUser" height="32" width="32"></user-image>',
        '</label>',
        '<div class="col-sm-11">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });
    /*
    * BASIC FIELD TYPES
    * Two versions of each basic field type, one with a help column and one without
     */
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
      wrapper: ['validationMessages', 'horizontalBootstrapLabel', 'bootstrapHasError']
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

    /*
     * CUSTOM FIELDS
     */

    // comment submit
    formlyConfigProvider.setType({
      name: 'comment',
      extends: 'textarea',
      wrapper: ['validationMessages', 'horizontalBootstrapComment', 'bootstrapHasError']
    });

    // rating
    formlyConfigProvider.setType({
      name: 'rating',
      templateUrl: '/components/forms/fieldTypes/rating.tpl.html',
      controller: /* @ngInject */ function($scope) {
        $scope.overStar = $scope.model.rating;
        $scope.hoveringOver= function(value) {
          $scope.overStar = value;
        };

        $scope.leave = function() {
          $scope.model.rating === 0 ? $scope.overStar = 0 : $scope.overStar = $scope.model.rating;
        }
      }
    });

    formlyConfigProvider.setType({
      name: 'horizontalRating',
      extends: 'rating',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalRatingHelp',
      extends: 'rating',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });


    /*
    * MULTI-INPUT FIELD
     */
    formlyConfigProvider.setType({
      name: 'multiInput',
      templateUrl: '/components/forms/fieldTypes/multiInput.tpl.html',
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
        $scope.deleteItem = deleteItem;

        function deleteItem(model, index) {
          model.splice(index,1);
        }

        function copyItemOptions() {
          return angular.copy($scope.to.inputOptions);
        }
      }
    });

    // multi-input typeahead
    formlyConfigProvider.setType({
      name: 'typeahead',
      templateUrl: '/components/forms/fieldTypes/typeahead.tpl.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });

  }
})();
