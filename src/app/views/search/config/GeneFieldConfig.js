(function() {
  angular.module('civic.search')
    .factory('GeneFieldConfig', function() {
      return {
        getFields: function() {
          return [
            {
              type: 'queryRow',
              key: 'queries',
              templateOptions: {
                rowFields: [
                  {
                    key: 'field',
                    type: 'queryBuilderSelect',
                    templateOptions: {
                      label: '',
                      required: true,
                      options: [
                        { value: '', name: 'Please select a field' },
                        { value: 'aliases', name: 'Aliases' },
                        { value: 'assertion_count', name: 'Assertion' },
                        { value: 'description', name: 'Description' },
                        { value: 'entrez_id', name: 'Entrez ID' },
                        { value: 'name', name: 'Name' },
                        { value: 'suggested_changes_count', name: 'Suggested Revisions' }
                      ],
                      onChange: function(value, options, scope) {
                        scope.model.condition = {
                          name: undefined,
                          parameters: []
                        };
                      }
                    }
                  }
                ],
                conditionFields: {
                  assertion_count: [
                    {
                      template: 'Gene',
                      className: 'inline-field',
                    },
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is', name: 'is'},
                          {value: 'is_not', name: 'is not'},
                        ],
                      }
                    },
                    {
                      template: 'associated with an assertion',
                      className: 'inline-field',
                    },
                  ],
                  entrez_id: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is_equal_to'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is_equal_to', name: 'equals'},
                          {value: 'is_not_equal_to', name: 'does not equal'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]', // entrez_id
                      type: 'input',
                      className: 'inline-field',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  name: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'contains'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  aliases: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'contains'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  description: [
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'contains'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'contains', name: 'contains'},
                          {value: 'begins_with', name: 'begins with'},
                          {value: 'does_not_contain', name: 'does not contain'},
                          {value: 'is_empty', name: 'is empty'}
                        ],
                        onChange: function(value, options, scope) {
                          if(scope.model.name.match(/empty/)) {
                            _.pullAt(scope.model.parameters, 0);
                          }
                        }

                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'input',
                      className: 'inline-field',
                      hideExpression: 'model.name === "is_empty"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  suggested_changes_count: [
                    {
                      template: 'with status',
                      className: 'inline-field'
                    },
                    {
                      key: 'parameters[0]', // status
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'new'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'new', name: 'new' },
                          { value: 'applied', name: 'applied' },
                          { value: 'rejected', name: 'rejected' }
                        ]
                      }
                    },
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: 'is_greater_than_or_equal_to'
                      },
                      templateOptions: {
                        required: true,
                        label: '',
                        options: [
                          { value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to' },
                          { value: 'is_greater_than', name: 'is greater than' },
                          { value: 'is_less_than', name: 'is less than' },
                          { value: 'is_less_than_or_equal_to', name: 'is less than or equal to' },
                          { value: 'is_equal_to', name: 'is equal to' },
                          { value: 'is_in_the_range', name: 'is in the range'}
                        ],
                        onChange: function(value, options, scope) {
                          _.pullAt(scope.model.parameters, 1,2);
                        }
                      }
                    },
                    {
                      key: 'parameters[1]', // from value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    },
                    {
                      template: 'to',
                      className: 'inline-field',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"'
                    },
                    {
                      key: 'parameters[2]', // to value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ]
                }
              }
            }
          ];
        }
      };
    });
})();
