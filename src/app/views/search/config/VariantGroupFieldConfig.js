(function() {
  angular.module('civic.search')
    .constant('VariantGroupFieldConfig', [
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
                  { value: 'name', name: 'Name' },
                  { value: 'description', name: 'Description' },
                  { value: 'contains_variant', name: 'Contains Variant' },
                  { value: 'variant_count', name: 'Variant Count' }
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
            contains_variant: [
              {
                template: 'with name',
                className: 'inline-field'
              },
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
                    {value: 'contains', name: 'containing'},
                    {value: 'begins_with', name: 'that begins with'},
                    {value: 'does_not_contain', name: 'does not begin with'},
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
            variant_count: [
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
                key: 'parameters[0]', // from value
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
                key: 'parameters[1]', // to value
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
    ]);
})();
