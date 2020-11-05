(function() {
  'use strict';
  angular.module('civic.search')
    .factory('AssertionFieldConfig', function(_, ConfigService) {
      return {
        getFields: function(acmgCodes, organizations) {
          var ampLevels = ConfigService.assertionAttributeDescriptions.ampLevels;
          var make_options = ConfigService.optionMethods.make_options;

          var acmgCodeOptions = _.chain(acmgCodes)
              .map(function(code) { return { value: code.code, name: code.code }; })
              .sortBy('name')
              .unshift({value: null, name:'Please choose an ACMG/AMP Code'})
              .value();

          var organizationOptions = _.chain(organizations)
              .map(function(org) {
                var orgName = org.name +
                    (_.isUndefined(org.parent.name) ? '' : ' at ' + org.parent.name);
                return { value: org.name, name: orgName };
              })
              .sortBy('name')
              .unshift({value: null, name:'Please choose an Organization'})
              .value();

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
                        { value: 'acmg_code', name: 'ACMG/AMP Code' },
                        { value: 'amp_level', name: 'AMP/ASCO/CAP Category' },
                        { value: 'description', name: 'Assertion Description' },
                        { value: 'assertion_direction', name: 'Assertion Direction' },
                        { value: 'id', name: 'Assertion ID'},
                        { value: 'summary', name: 'Assertion Summary'},
                        { value: 'assertion_type', name: 'Assertion Type' },
                        { value: 'clinical_significance', name: 'Clinical Significance' },
                        { value: 'disease_doid', name: 'Disease DOID' },
                        { value: 'disease_name', name: 'Disease Name' },
                        { value: 'interaction_type', name: 'Drug Interaction Type' },
                        { value: 'drug_name', name: 'Drug Name' },
                        { value: 'drug_ncit_id', name: 'Drug NCIt ID' },
                        { value: 'flagged', name: 'Flagged' },
                        { value: 'gene_alias', name: 'Gene Entrez Alias' },
                        { value: 'gene_name', name: 'Gene Entrez Name' },
                        { value: 'phenotype_hpo_class', name: 'Phenotype HPO Class' },
                        { value: 'phenotype_hpo_id', name: 'Phenotype HPO ID' },
                        { value: 'status', name: 'Status' },
                        { value: 'submitter', name: 'Submitter Display Name' },
                        { value: 'submitter_id', name: 'Submitter ID' },
                        { value: 'submitter_organization', name: 'Submitter Organization' },
                        { value: 'suggested_changes_count', name: 'Suggested Revisions' },
                        { value: 'variant_alias', name: 'Variant Alias' },
                        { value: 'variant_name', name: 'Variant Name' },
                        { value: 'variant_origin', name: 'Variant Origin' },
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
                          { value: 'Somatic', name: 'Somatic'},
                          { value: 'Rare Germline', name: 'Rare Germline' },
                          { value: 'Common Germline', name: 'Common Germline' },
                          { value: 'Unknown', name: 'Unknown' },
                          { value: 'N/A', name: 'N/A' }
                        ]
                      }
                    }
                  ],
                  amp_level: [
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
                        defaultValue: null
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: ([{ value: null, label: 'Please select an AMP/ASCO/CAP Category' }].concat(make_options(ampLevels))),
                        valueProp: 'value',
                        labelProp: 'label'
                      }
                    }
                  ],
                  acmg_code: [
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
                          {value: 'is_empty', name: 'is empty'}
                        ]
                      }
                    },
                    {
                      key: 'parameters[0]',
                      type: 'queryBuilderSelect',
                      className: 'inline-field',
                      data: {
                        defaultValue: null
                      },
                      hideExpression: 'model.name =="is_empty" || model.name == "is_not_empty"',
                      templateOptions: {
                        label: '',
                        required: true,
                        options: acmgCodeOptions
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
                  summary: [
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
                        defaultValue: 'is_equal_to'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is_equal_to', name: 'is'},
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
                                return _.map(response, function(disease) {
                                  if ( disease.aliases.length > 0 ) {
                                    disease.alias_list = disease.aliases.join(', ');
                                  } else {
                                    disease.alias_list = '--';
                                  }
                                  return disease;
                                });
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
                  drug_ncit_id: [
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
                        defaultValue: 'Sensitivity/Response'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          { value: 'Sensitivity/Response', name: 'Sensitivity/Response' },
                          { value: 'Resistance', name: 'Resistance' },
                          { value: 'Adverse Response', name: 'Adverse Response' },
                          { value: 'Reduced Sensitivity', name: 'Reduced Sensitivity' },
                          { value: 'Positive', name: 'Positive' },
                          { value: 'Negative', name: 'Negative' },
                          { value: 'Better Outcome', name: 'Better Outcome' },
                          { value: 'Poor Outcome', name: 'Poor Outcome' },
                          { value: 'Pathogenic', name: 'Pathogenic' },
                          { value: 'Likely Pathogenic', name: 'Likely Pathogenic' },
                          { value: 'Benign', name: 'Benign' },
                          { value: 'Likely Benign', name: 'Likely Benign' },
                          { value: 'Uncertain Significance', name: 'Uncertain Significance' },
                          { value: 'Gain of Function', name: 'Gain of Function'},
                          { value: 'Loss of Function', name: 'Loss of Function'},
                          { value: 'Unaltered Function', name: 'Unaltered Function'},
                          { value: 'Neomorphic', name: 'Neomorphic'},
                          { value: 'Dominant Negative', name: 'Dominant Negative' },
                          { value: 'Unknown', name: 'Unknown'},
                          { value: 'N/A', name: 'N/A' }
                        ]
                      }
                    }
                  ],
                  assertion_type: [
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
                          { value: 'Predisposing', name: 'Predisposing' },
                          { value: 'Functional', label: 'Functional'},
                        ]
                      }
                    }
                  ],
                  assertion_direction: [
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
                  phenotype_hpo_class: [
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
                  phenotype_hpo_id: [
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
                      key: 'parameters[0]', // from value
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
                      key: 'parameters[1]', // to value
                      type: 'input',
                      className: 'inline-field inline-field-xs',
                      hideExpression: 'model.name.length > 0 && model.name !== "is_in_the_range"',
                      templateOptions: {
                        label: '',
                        required: true
                      }
                    }
                  ],
                  flagged: [
                    {
                      template: 'Assertion',
                      className: 'inline-field',
                    },
                    {
                      key: 'name',
                      type: 'queryBuilderSelect',
                      className: 'inline-field inline-field-md',
                      data: {
                        defaultValue: 'is_true'
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: [
                          {value: 'is_true', name: 'is'},
                          {value: 'is_false', name: 'is not'},
                        ],
                      }
                    },
                    {
                      template: 'flagged',
                      className: 'inline-field',
                    },
                  ],
                  gene_alias: [
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
                          {value: 'does_not_contain', name: 'does not contain'},
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
                  ],
                  submitter_organization: [
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
                        defaultValue: null
                      },
                      templateOptions: {
                        label: '',
                        required: true,
                        options: organizationOptions
                      }
                    }
                  ],
                }
              }
            }
          ];
        }
      };
    });
})();
