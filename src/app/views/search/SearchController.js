(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope,
                            _,
                            Diseases,
                            ConfigService) {
    var vm = $scope.vm = {};

    vm.suggestedSearch = {};

    vm.setSearch = function(search) {
      $scope.$broadcast('setSearch', search);
    };

    vm.fields = {};

    vm.fields.evidence_items = [
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
                  { value: 'clinical_significance', name: 'Clinical Significance' },
                  { value: 'disease_doid', name: 'Disease DOID' },
                  { value: 'interaction_type', name: 'Drug Interaction Type' },
                  { value: 'disease_name', name: 'Disease Name' },
                  { value: 'drug_id', name: 'Drug PubChem ID' },
                  { value: 'drug_name', name: 'Drug Name' },
                  { value: 'evidence_direction', name: 'Evidence Direction' },
                  { value: 'id', name: 'Evidence ID'},
                  { value: 'evidence_level', name: 'Evidence Level' },
                  { value: 'evidence_type', name: 'Evidence Type' },
                  { value: 'description', name: 'Evidence Statement' },
                  { value: 'gene_name', name: 'Gene Name' },
                  { value: 'publication_year', name: 'Publication Year' },
                  { value: 'pubmed_id', name: 'Pubmed ID' },
                  { value: 'pmc_id', name: 'Pubmed Central ID (PMCID)'},
                  { value: 'rating', name: 'Rating' },
                  { value: 'status', name: 'Status' },
                  { value: 'submitter', name: 'Submitter Display Name' },
                  { value: 'submitter_id', name: 'Submitter ID' },
                  { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                  { value: 'variant_alias', name: 'Variant Alias' },
                  { value: 'variant_name', name: 'Variant Name' },
                  { value: 'variant_origin', name: 'Variant Origin' }
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
            pmc_id: [
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
                    {value: 'is_empty', name: 'is empty'},
                    {value: 'is_not_empty', name: 'is not empty'}
                  ],
                  onChange: function(value, options, scope) {
                    if(scope.model.name.match(/empty/))
                    {
                      _.pullAt(scope.model.parameters, 0);
                    }
                  }
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name =="is_empty" || model.name == "is_not_empty"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            pubmed_id: [
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
            disease_name: [
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
                type: 'typeahead',
                className: 'inline-field',
                hideExpression: 'model.name === "is_empty"',
                templateOptions: {
                  label: '',
                  required: true,
                  typeahead: 'item.name as item.name for item in to.data.typeaheadSearch($viewValue)',
                  editable: true,
                  templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',                                 data: {
                    typeaheadSearch: function(val) {
                      return Diseases.beginsWith(val)
                        .then(function(response) {
                          return response;
                        });
                    }
                  }
                }
              }
            ],
            disease_doid: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-small',
                data: {
                  defaultValue: 'is'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is', name: 'is'},
                    {value: 'is_not', name: 'is not'},
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
            drug_name: [
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
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-small',
                data: {
                  defaultValue: 'is'
                },
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
            interaction_type: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'none'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'none', name: 'None' },
                    { value: 'Combination', name: 'Combination' },
                    { value: 'Sequential', name: 'Sequential' },
                    { value: 'Substitutes', name: 'Substitutes' }
                  ]
                }
              }
            ],
            clinical_significance: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'Sensitivity'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'Sensitivity', name: 'Sensitivity' },
                    { value: 'Resistance or Non-Response', name: 'Resistance or Non-Response' },
                    { value: 'Adverse Response', name: 'Adverse Response' },
                    { value: 'Positive', name: 'Positive' },
                    { value: 'Negative', name: 'Negative' },
                    { value: 'Better Outcome', name: 'Better Outcome' },
                    { value: 'Poor Outcome', name: 'Poor Outcome' },
                    { value: 'Pathogenic', name: 'Pathogenic' },
                    { value: 'Likely Pathogenic', name: 'Likely Pathogenic' },
                    { value: 'Benign', name: 'Benign' },
                    { value: 'Likely Benign', name: 'Likely Benign' },
                    { value: 'Uncertain Significance', name: 'Uncertain Significance' },
                    { value: 'N/A', name: 'N/A' }
                  ]
                }
              }
            ],
            evidence_type: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'Predictive'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'Predictive', name: 'Predictive' },
                    { value: 'Diagnostic', name: 'Diagnostic' },
                    { value: 'Prognostic', name: 'Prognostic' },
                    { value: 'Predisposing', name: 'Predisposing' }
                  ]
                }
              }
            ],
            evidence_level: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_above'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_above', name: 'is above'},
                    {value: 'is_below', name: 'is below'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'C'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'A', name: 'A - Validated'},
                    { value: 'B', name: 'B - Clinical'},
                    { value: 'C', name: 'C - Case Study'},
                    { value: 'D', name: 'D - Preclinical'},
                    { value: 'E', name: 'E - Inferential'}
                  ]
                }
              }
            ],
            evidence_direction: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'Supports'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'Supports', name: 'Supports'},
                    { value: 'Does Not Support', name: 'Does Not Support' }
                  ]
                }
              }
            ],
            status: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-small',
                data: {
                  defaultValue: 'is'
                },
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
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'submitted'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'submitted', name: 'Submitted'},
                    { value: 'accepted', name: 'Accepted'},
                    { value: 'rejected', name: 'Rejected'}
                  ]
                }
              }
            ],
            publication_year: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'is_equal_to', name: 'is' },
                    { value: 'is_not_equal_to', name: 'is not' },
                    { value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to' },
                    { value: 'is_greater_than', name: 'is greater than' },
                    { value: 'is_less_than', name: 'is less than' },
                    { value: 'is_less_than_or_equal_to', name: 'is less than or equal to' },
                    { value: 'is_in_the_range', name: 'is in the range' }
                  ],
                  onChange: function(value, options, scope) {
                    _.pullAt(scope.model.parameters, 1,2);
                  }
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field inline-field-small',
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
                type: 'input',
                className: 'inline-field inline-field-small',
                hideExpression: 'model.name != "is_in_the_range"',
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
            ],
            id: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
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
                className: 'inline-field inline-field-sm',
                templateOptions: {
                  size: 8,
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
            gene_name: [
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
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'contains'
                },
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
            variant_alias: [
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
                    {value: 'is', name: 'is'},
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
            variant_origin: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'Somatic Mutation'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options:[
                    { value: 'Somatic Mutation', name: 'Somatic Mutation'},
                    { value: 'Germline Mutation', name: 'Germline Mutation' },
                    { value: 'Germline Polymorphism', name: 'Germline Polymorphism' },
                    { value: 'Unknown', name: 'Unknown' },
                    { value: 'N/A', name: 'N/A' }
                  ]
                }
              }
            ],
            submitter: [
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
                    {value: 'begins_with', name: 'begins with'}
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
            submitter_id: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
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
            ]
          }
        }
      }
    ];

    vm.fields.genes = [
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
            entrez_id: [
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
                    {value: 'is_not', name: 'is not'}
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

    vm.fields.variants = [
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
                  { value: 'chromosome', name: 'CHR1 Chromosome' },
                  { value: 'start', name: 'CHR1 Start' },
                  { value: 'stop', name: 'CHR1 Stop' },
                  { value: 'representative_transcript', name: 'CHR1 Representative Transcript' },
                  { value: 'chromosome2', name: 'CHR2 Chromosome' },
                  { value: 'start2', name: 'CHR2 Start' },
                  { value: 'stop2', name: 'CHR2 Stop' },
                  { value: 'representative_transcript2', name: 'CHR2 Representative Transcript' },
                  { value: 'description', name: 'Description' },
                  { value: 'ensembl_version', name: 'Ensembl Version' },
                  { value: 'evidence_item_count', name: 'Evidence Items' },
                  { value: 'gene', name: 'Gene' },
                  { value: 'name', name: 'Name' },
                  { value: 'reference_bases', name: 'Reference Base(s)' },
                  { value: 'reference_build', name: 'Reference Build' },
                  { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                  { value: 'variant_alias', name: 'Variant Alias' },
                  { value: 'variant_bases', name: 'Variant Base(s)' },
                  { value: 'variant_group', name: 'Variant Group' },
                  { value: 'variant_types', name: 'Variant Type(s)' }
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
            variant_types: [
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
            variant_group: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is', name: 'is'},
                    {value: 'is_not', name: 'is not'},
                    {value: 'contains', name: 'contains'},
                    {value: 'begins_with', name: 'begins with'},
                    {value: 'does_not_contain', name: 'does not contain'},
                    {value: 'none', name: 'none'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name === "none"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            variant_alias: [
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
                    {value: 'is', name: 'is'},
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
            gene: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is', name: 'is'},
                    {value: 'is_not', name: 'is not'},
                    {value: 'contains', name: 'contains'},
                    {value: 'begins_with', name: 'begins with'},
                    {value: 'does_not_contain', name: 'does not contain'},
                    {value: 'none', name: 'none'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name === "none"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            reference_build: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'GRCh38'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    { value: 'GRCh38', name: 'GRCh38 (hg20)' },
                    { value: 'GRCh37', name: 'GRCh37 (hg19)' },
                    { value: 'NCBI36', name: 'NCBI36 (hg18)' }
                  ]
                }
              }
            ],
            ensembl_version: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'is_equal_to'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: [
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'}
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
            reference_bases: [
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
            variant_bases: [
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
            chromosome: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'},
                    {value: 'is_empty', name: 'is empty'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: '1'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: ConfigService.valid_chromosomes
                }
              }
            ],
            start: [
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
                key: 'parameters[0]',
                type: 'input',
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name != "is_in_the_range"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            stop: [
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
                key: 'parameters[0]',
                type: 'input',
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name != "is_in_the_range"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            representative_transcript: [
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
            chromosome2: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'},
                    {value: 'is_empty', name: 'is empty'}
                  ]
                }
              },
              {
                key: 'parameters[0]',
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: '1'
                },
                templateOptions: {
                  label: '',
                  required: true,
                  options: ConfigService.valid_chromosomes
                }
              }
            ],
            start2: [
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
                key: 'parameters[0]',
                type: 'input',
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name != "is_in_the_range"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            stop2: [
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
                key: 'parameters[0]',
                type: 'input',
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name != "is_in_the_range"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            representative_transcript2: [
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
            ],
            evidence_item_count: [
              {
                template: 'with status',
                className: 'inline-field'
              },
              {
                key: 'parameters[0]', // status
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'accepted'
                },
                templateOptions: {
                  required: true,
                  label: '',
                  options: [
                    { value: 'accepted', name: 'accepted' },
                    { value: 'submitted', name: 'submitted' },
                    { value: 'any', name: 'any' },
                    { value: 'rejected', name: 'rejected' },
                    { value: 'not rejected', name: 'not rejected' }
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
            ],
          }
        }
      }
    ];

    vm.fields.variantGroups = [
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

    vm.fields.sources = [
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
                  { value: 'abstract', name: 'Abstract' },
                  { value: 'author', name: 'Author' },
                  { value: 'evidence_item_count', name: 'Evidence Items' },
                  { value: 'journal', name: 'Journal Name' },
                  { value: 'pmc_id', name: 'PMC ID' },
                  { value: 'publication_year', name: 'Publication Year' },
                  { value: 'pubmed_id', name: 'PubMed ID' },
                  { value: 'source_suggestion_count', name: 'Source Suggestions' },
                  { value: 'title', name: 'Title' }
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
            pubmed_id: [
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
            journal: [
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
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            abstract: [
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
                hideExpression: 'model.name === "is_empty"',
                className: 'inline-field',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
            pmc_id: [
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
            author: [
              {
                key: 'name',
                type: 'queryBuilderSelect',
                className: 'inline-field inline-field-md',
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
            publication_year: [
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
                    {value: 'is_equal_to', name: 'is'},
                    {value: 'is_not_equal_to', name: 'is not'},
                    {value: 'is_greater_than_or_equal_to', name: 'is greater than or equal to'},
                    {value: 'is_less_than_or_equal_to', name: 'is less than or equal to'},
                    { value: 'is_in_the_range', name: 'is in the range' }
                  ],
                  onChange: function(value, options, scope) {
                    _.pullAt(scope.model.parameters, 1,2);
                  }
                }
              },
              {
                key: 'parameters[0]',
                type: 'input',
                className: 'inline-field inline-field-small',
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
                type: 'input',
                className: 'inline-field inline-field-small',
                hideExpression: 'model.name != "is_in_the_range"',
                templateOptions: {
                  label: '',
                  required: true
                }
              }
           ],
            evidence_item_count: [
              {
                template: 'with status',
                className: 'inline-field'
              },
              {
                key: 'parameters[0]', // status
                type: 'queryBuilderSelect',
                className: 'inline-field',
                data: {
                  defaultValue: 'accepted'
                },
                templateOptions: {
                  required: true,
                  label: '',
                  options: [
                    { value: 'accepted', name: 'accepted' },
                    { value: 'submitted', name: 'submitted' },
                    { value: 'any', name: 'any' },
                    { value: 'rejected', name: 'rejected' },
                    { value: 'not rejected', name: 'not rejected' }
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
            ],
            source_suggestion_count: [
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
                    { value: 'rejected', name: 'rejected' },
                    { value: 'any', name: 'any' },
                    { value: 'curated', name: 'curated' },
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
            ],
            title: [
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
                templateOptions: {
                  label: '',
                  required: true
                }
              }
            ],
          }
        }
      }
    ];

    vm.suggestedSearches = {
      'evidence': [
        {
          name: 'High Quality ALK Evidence',
          tooltip: 'Evidence pertaining to ALK variants with high Evidence Levels and Ratings',
          search: {'operator':'AND','queries':[{'field':'gene_name','condition':{'name':'contains','parameters':['ALK']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[4]}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['C']}}]}
        },
        {
          name: 'High Quality Predictive Evidence',
          tooltip: 'Predictive Evidence with high Evidence Levels and Ratings',
          search: {'operator':'AND','queries':[{'field':'evidence_type','condition':{'name':'is_equal_to','parameters':['Predictive']}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['B']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[4]}}]}
        },
        {
          name: 'High Quality Drug Predictions',
          tooltip: 'Highly rated drug predictive evidence indicating successful outcomes',
          search: {'operator':'AND','queries':[{'field':'evidence_type','condition':{'name':'is_equal_to','parameters':['Predictive']}},{'field':'evidence_direction','condition':{'name':'is_equal_to','parameters':['Supports']}},{'field':'evidence_level','condition':{'name':'is_above','parameters':['C']}},{'field':'rating','condition':{'name':'is_greater_than_or_equal_to','parameters':[3]}}],'entity':'evidence_items','save':true}
        },
        {
          name: 'Alectinib Evidence',
          tooltip: 'Evidence associated with the drug Alectinib',
          search: {'operator':'AND','queries':[{'field':'drug_name','condition':{'name':'contains','parameters':['Alectinib']}}],'entity':'evidence_items','save':true}
        }
      ],
      'genes': [
        {
          name: 'Related to Leukemia',
          tooltip: 'Genes mentioning "leukemia" in their descriptions',
          search: {'operator':'AND','queries':[{'field':'description','condition':{'name':'contains','parameters':['leukemia']}}]}
        }
      ],
      'variants': [
        {
          name: 'CHR1 Chromosome is 2',
          tooltip: 'Variants with a primary chromosome of 2',
          search: {'operator':'AND','queries':[{'field':'chromosome','condition':{'name':'is_equal_to','parameters':['2']}}]}
        },
        {
          name: 'CHR1 Start between 16 and 60K',
          tooltip: 'Variants with a variant starting between 16 and 60K in its primary chromosome',
          search: {'operator':'AND','queries':[{'field':'start','condition':{'name':'is_in_the_range','parameters':['16000000','60000000']}}]}
        },
        {
          name: 'Variant type contains frameshift',
          tooltip: 'Variants with a variant type that contains the world frameshift',
          search: {'operator':'AND','queries':[{'field':'variant_types','condition':{'name':'contains','parameters':['frameshift']}}]}
        }
      ],
      'sources': [
        {
          name: 'Name contains "New England"',
          tooltip: 'Sources likely from the New England Journal of Medicine',
          search: {'operator':'AND','queries':[{'field':'journal','condition':{'name':'contains','parameters':['New England']}}]}
        },
        {
          name: 'Publication Year between 2014 and 2016',
          tooltip: 'Source publication year between 2014 and 2016',
          search: {'operator':'AND','queries':[{'field':'publication_year','condition':{'name':'is_in_the_range','parameters':['2014','2016']}}]}
        }
      ]
    };
  }
})();
