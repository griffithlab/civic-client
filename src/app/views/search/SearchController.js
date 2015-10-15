(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope, $log, Search) {
    var vm = $scope.vm = {};

    // funcation assignment
    vm.onSubmit = onSubmit;
    vm.options = {};
    vm.searchResults = [];

    init();

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
      $log.debug(JSON.stringify(vm.model));
      vm.searchResults = Search.post(vm.model);
    }

    vm.buttonLabel = 'Search Evidence Items';

    function init() {
      vm.model = {
        operator: 'AND',
        queries: [
          {
            field: '',
            condition: {
              name: undefined,
              parameters: []
            }
          }
        ]
      };

      vm.operatorField = [
        {
          key: 'operator',
          type: 'select',
          defaultValue: 'AND',
          templateOptions: {
            label: '',
            options: [
              { value: 'AND', name: 'all' },
              { value: 'OR', name: 'any' }
            ]
          }
        }
      ];

      vm.fields = [
        {
          type: 'queryRow',
          key: 'queries',
          templateOptions: {
            rowFields: [
              {
                key: 'field',
                type: 'select',
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: '', name: 'Please select a field' },
                    { value: 'description', name: 'Description' },
                    { value: 'disease_doid', name: 'Disease DOID' },
                    { value: 'disease_name', name: 'Disease Name' },
                    { value: 'drug_id', name: 'Drug PubChem ID' },
                    { value: 'drug_name', name: 'Drug Name' },
                    { value: 'evidence_level', name: 'Evidence Level' },
                    { value: 'gene_name', name: 'Gene Name' },
                    { value: 'pubmed_id', name: 'Pubmed ID' },
                    { value: 'rating', name: 'Rating' },
                    { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                    { value: 'variant_name', name: 'Variant Name' }
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
              suggested_changes_count: [
                {
                  template: 'with status',
                  className: 'inline-field'
                },
                {
                  key: 'parameters[0]', // status
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'pending',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: 'pending', name: 'pending' },
                      { value: 'applied', name: 'applied' },
                      { value: 'rejected', name: 'rejected' }
                    ]
                  }
                },
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'is_greater_than',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' },
                      { value: 'is_in_the_range', name: 'is in the range' }
                    ]
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
              ],
              pubmed_id: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field inline-field-md',
                  defaultValue: 'is',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'is_not', name: 'is not'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]', // pubmed id
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              rating: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'is_greater_than',
                  templateOptions: {
                    required: true,
                    label: '',
                    options: [
                      { value: 'is_greater_than', name: 'is greater than' },
                      { value: 'is_less_than', name: 'is less than' },
                      { value: 'is_equal_to', name: 'is equal to' },
                      { value: 'is_in_the_range', name: 'is in the range'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'rating',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                },
                {
                  template: 'to',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"'
                },
                {
                  key: 'parameters[1]',
                  type: 'rating',
                  className: 'inline-field',
                  hideExpression: 'model.name != "is_in_the_range"',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              description: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'contains',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              disease_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'contains',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              disease_doid: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field inline-field-small',
                  defaultValue: 'is',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'is_not', name: 'is not'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              drug_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'contains',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              drug_id: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field inline-field-small',
                  defaultValue: 'is',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'is_not', name: 'is not'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              evidence_level: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'is_above',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'is_above', name: 'is above'},
                      {value: 'is_below', name: 'is below'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'C',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      { value: 'A', name: 'A - Validated'},
                      { value: 'B', name: 'B - Clinical'},
                      { value: 'C', name: 'C - Preclinical'},
                      { value: 'D', name: 'D - Case Study'},
                      { value: 'E', name: 'E - Inferential'}
                    ]
                  }
                }
              ],
              gene_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'contains',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'parameters[0]',
                  type: 'input',
                  className: 'inline-field',
                  templateOptions: {
                    label: '',
                    required: true
                  }
                }
              ],
              variant_name: [
                {
                  key: 'name',
                  type: 'select',
                  className: 'inline-field',
                  defaultValue: 'contains',
                  templateOptions: {
                    label: '',
                    required: true,
                    options: [
                      {value: 'is', name: 'is'},
                      {value: 'contains', name: 'contains'},
                      {value: 'begins_with', name: 'begins with'},
                      {value: 'does_not_contain', name: 'does not contain'}
                    ]
                  }
                },
                {
                  key: 'paramters[0]',
                  type: 'input',
                  className: 'inline-field',
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
  }
})();
