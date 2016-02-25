(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope, _) {
    var vm = $scope.vm = {};

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
                  { value: 'description', name: 'Description' },
                  { value: 'disease_doid', name: 'Disease DOID' },
                  { value: 'disease_name', name: 'Disease Name' },
                  { value: 'drug_id', name: 'Drug PubChem ID' },
                  { value: 'drug_name', name: 'Drug Name' },
                  { value: 'id', name: 'Evidence ID'},
                  { value: 'evidence_type', name: 'Evidence Type' },
                  { value: 'evidence_level', name: 'Evidence Level' },
                  { value: 'gene_name', name: 'Gene Name' },
                  { value: 'pubmed_id', name: 'Pubmed ID' },
                  { value: 'rating', name: 'Rating' },
                  { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                  { value: 'status', name: 'Status' },
                  { value: 'variant_name', name: 'Variant Name' },
                  { value: 'submitter', name: 'Submitter Display Name' },
                  { value: 'submitter_id', name: 'Submitter ID' }
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name === "is_empty"',
                templateOptions: {
                  label: '',
                  required: true
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
                    { value: 'Prognostic', name: 'Prognostic' }
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
                  { value: 'entrez_id', name: 'Entrez ID' },
                  { value: 'name', name: 'Name' },
                  { value: 'aliases', name: 'Aliases' },
                  { value: 'description', name: 'Description' }
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
                  { value: 'name', name: 'Name' },
                  { value: 'description', name: 'Description' },
                  { value: 'variant_group', name: 'Variant Group' },
                  { value: 'reference_build', name: 'Reference Build' },
                  { value: 'ensembl_version', name: 'Ensembl Version' },
                  { value: 'reference_bases', name: 'Reference Base(s)' },
                  { value: 'variant_bases', name: 'Variant Base(s)' },
                  { value: 'chromosome', name: 'CHR1 Chromosome' },
                  { value: 'start', name: 'CHR1 Start' },
                  { value: 'stop', name: 'CHR1 Stop' },
                  { value: 'representative_transcript', name: 'CHR1 Representative Transcript' },
                  { value: 'chromosome2', name: 'CHR2 Chromosome' },
                  { value: 'start2', name: 'CHR2 Start' },
                  { value: 'stop2', name: 'CHR2 Stop' },
                  { value: 'representative_transcript2', name: 'CHR2 Representative Transcript' }                     ],
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
            variant_group: [
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
                    {value: 'is_not', name: 'is_not'},
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name === "is_empty"',
                templateOptions: {
                  label: '',
                  required: true
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
                type: 'input',
                className: 'inline-field',
                hideExpression: 'model.name === "is_empty"',
                templateOptions: {
                  label: '',
                  required: true
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
            ]
          }
        }
      }
    ];

    _.forEach(vm.fields.genes[0].templateOptions.conditionFields)
      .value();

  }
})();
