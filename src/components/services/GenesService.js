(function() {
    'use strict';
    angular.module('civic.services')
        .factory('GenesResource', GenesResource)
        .factory('Genes', GenesService);

    // @ngInject
    function GenesResource($resource, $cacheFactory, _) {
        var cache = $cacheFactory.get('$http');

        var cacheInterceptor = function(response) {
            // console.log(['GenesResource: removing', response.config.url, 'from $http cache.'].join(' '));
            cache.remove(response.config.url);
            return response.$promise;
        };

        return $resource('/api/genes/:geneId', {
            geneId: '@geneId'
        }, {
            // Base Gene Resources
            query: {
                method: 'GET',
                isArray: false,
                cache: cache
            },
            get: { // get a single gene
                method: 'GET',
                isArray: false,
                cache: cache
            },
            getName: { // get a single gene's name and entrez_id
                url: '/api/genes/:geneId',
                params: {
                    detailed: 'false'
                },
                method: 'GET',
                isArray: false,
                cache: cache
            },
            update: {
                method: 'PATCH',
                interceptor: {
                    response: cacheInterceptor
                }
            },
            delete: {
                method: 'DELETE',
                interceptor: {
                    response: cacheInterceptor
                }
            },
            apply: {
                method: 'PATCH',
                cache: false
            },
            verify: {
                method: 'GET',
                url: '/api/genes/existence/:geneId',
                isArray: false,
                cache: cache
            },
            search: {

            },
            beginsWith: {
                method: 'GET',
                url: '/api/genes?name=:name&detailed=false',
                isArray: true,
                cache: cache
            },

            // Gene Additional Info
            getMyGeneInfo: {
                url: '/api/genes/:geneId/mygene_info_proxy',
                params: {
                    geneId: '@geneId'
                },
                cache: cache,
                transformResponse: function(data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    var srcMap = {
                        kegg: 'http://www.genome.jp/kegg-bin/show_pathway?',
                        reactome: 'http://www.reactome.org/cgi-bin/control_panel_st_id?ST_ID=',
                        pharmgkb: 'https://www.pharmgkb.org/pathway/',
                        humancyc: 'http://humancyc.org/HUMAN/NEW-IMAGE?type=PATHWAY&object=',
                        smpdb: 'http://www.smpdb.ca/view/',
                        pid: 'http://pid.nci.nih.gov/search/pathway_landing.shtml?what=graphic&jpg=on&pathway_id=',
                        wikipathways: 'http://wikipathways.org/index.php/Pathway:',
                        netpath: null,
                        biocarta: null,
                        inoh: null,
                        signalink: null,
                        ehmn: null
                    };
                    var pathways = data.pathway || [];
                    var pathwaysFinal = [];
                    var link;
                    for (var src in pathways) {
                        if (!angular.isArray(pathways[src])) {
                            pathways[src] = [pathways[src]];
                        }
                        for (var p in pathways[src]) {
                            link = srcMap[src] + pathways[src][p].id;
                            if (srcMap[src] === null) {
                                link = null;
                            }
                            pathwaysFinal.push({
                                name: pathways[src][p].name,
                                link: link,
                                src: src
                            });
                        }
                    }
                    data.pathway = pathwaysFinal;
                    if (!_.isArray(data.alias) && data.alias) {
                        data.alias = [data.alias];
                    }
                    if (!_.isArray(data.interpro) && data.interpro) {
                        data.interpro = [data.interpro];
                    }
                    return data;
                }
            },

            // Gene Collections
            queryVariants: {
                method: 'GET',
                url: '/api/genes/:geneId/variants',
                isArray: false,
                cache: cache
            },
            queryVariantGroups: {
                method: 'GET',
                url: '/api/genes/:geneId/variant_groups',
                isArray: false,
                cache: cache
            },
            queryFlags: {
                method: 'GET',
                url: '/api/genes/:geneId/flags',
                isArray: false,
                cache: cache
            },

            // Gene Comments Resources
            queryComments: {
                method: 'GET',
                url: '/api/genes/:geneId/comments',
                isArray: true,
                cache: cache
            },
            getComment: {
                method: 'GET',
                url: '/api/genes/:geneId/comments/:commentId',
                params: {
                    geneId: '@geneId',
                    commentId: '@commentId'
                },
                isArray: false,
                cache: cache
            },

            submitComment: {
                method: 'POST',
                url: '/api/genes/:geneId/comments',
                params: {
                    geneId: '@geneId'
                },
                cache: false
            },
            updateComment: {
                method: 'PATCH',
                url: '/api/genes/:geneId/comments/:commentId',
                params: {
                    geneId: '@geneId',
                    commentId: '@commentId'
                },
                cache: false
            },
            deleteComment: {
                method: 'DELETE',
                url: '/api/genes/:geneId/comments/:commentId',
                params: {
                    geneId: '@geneId',
                    commentId: '@commentId'
                },
                cache: false
            }
        });
    }

    // @ngInject
    function GenesService(GenesResource, Subscriptions, $q, $cacheFactory) {
        var cache = $cacheFactory.get('$http');

        // Base Gene and Gene Collection
        var item = {};
        var collection = [];

        // Additional Gene Data
        var myGeneInfo = {};

        // Gene Collections
        var variants = [];
        var variantGroups = [];
        var comments = [];
        var variantStatuses = [];
        var flags = [];
        return {
            initBase: initBase,
            initComments: initComments,
            data: {
                item: item,
                collection: collection,
                myGeneInfo: myGeneInfo,
                variants: variants,
                variantGroups: variantGroups,
                variantStatuses: variantStatuses,
                comments: comments,
                flags: flags
            },

            // Gene Base
            query: query,
            get: get,
            getName: getName,
            update: update,
            delete: deleteItem,
            apply: apply,

            // Gene Additional Info
            getMyGeneInfo: getMyGeneInfo,

            // Verify
            verify: verify,

            // Gene Collections
            queryVariants: queryVariants,
            queryVariantGroups: queryVariantGroups,
            queryFlags: queryFlags,

            // Gene Comments
            queryComments: queryComments,
            getComment: getComment,
            submitComment: submitComment,
            updateComment: updateComment,
            deleteComment: deleteComment,

            // Misc
            beginsWith: beginsWith
        };

        function mapVariantStatuses(variants, statuses) {
            return _.map(variants, function(variant) {
                variant.statuses = _.chain(statuses)
                    .find({
                        id: variant.id
                    })
                    .pick(['has_pending_fields', 'has_pending_evidence'])
                    .value();
                return variant;
            });
        }

        function initBase(geneId) {
            return $q.all([
                get(geneId),
                getMyGeneInfo(geneId),
                queryVariants(geneId),
                queryVariantGroups(geneId),
                queryFlags(geneId)
            ]);
        }

        function initComments(geneId) {
            return $q.all([
                queryComments(geneId)
            ]);
        }

        // Gene Base
        function query() {
            return GenesResource.query().$promise
                .then(function(response) {
                    angular.copy(response.records, collection);
                    return response.$promise;
                });
        }

        function get(geneId) {
            return GenesResource.get({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    angular.copy(response, item);
                    return response.$promise;
                });
        }

        function getName(geneId) {
            return GenesResource.getName({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    return response.$promise;
                });
        }

        function update(reqObj) {
            return GenesResource.update(reqObj).$promise
                .then(function(response) {
                    angular.copy(response, item);
                    return response.$promise;
                });
        }

        function deleteItem(geneId) {
            return GenesResource.delete({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    item = null;
                    return response.$promise;
                });
        }

        function apply(reqObj) {
            return GenesResource.apply(reqObj).$promise.then(
                function(response) { // success
                    cache.remove('/api/genes/' + response.id);
                    get(reqObj.geneId);
                    return $q.when(response);
                },
                function(error) { // fail
                    return $q.reject(error);
                });
        }

        function verify(geneId) {
            return GenesResource.verify({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    return response.$promise;
                });
        }

        function beginsWith(name) {
            return GenesResource.beginsWith({
                    name: name
                }).$promise
                .then(function(response) {
                    return response.$promise;
                });
        }

        // Gene Additional Data
        function getMyGeneInfo(geneId) {
            return GenesResource.getMyGeneInfo({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    angular.copy(response, myGeneInfo);
                    return response.$promise;
                });
        }

        // Gene Collections
        function queryVariants(geneId) {
            return GenesResource.queryVariants({
                    geneId: geneId,
                    count: 999
                }).$promise
                .then(function(response) {
                    angular.copy(response.records, variants);
                    return response.$promise;
                });
        }

        function queryVariantGroups(geneId) {
            return GenesResource.queryVariantGroups({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    angular.copy(response.records, variantGroups);
                    return response.$promise;
                });
        }

        function queryFlags(geneId) {
            var mockFlags = [{
                id: 1,
                comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit dolor risus, non congue turpis ornare non. Cras vel imperdiet ipsum, vitae vulputate eros. Etiam ultricies mi quis arcu sodales dapibus. Sed luctus ante eget nisi sagittis tristique. Cras interdum sapien nec magna efficitur bibendum. Maecenas eget ante libero. In suscipit pretium libero, sed porta tortor tristique non. Nullam vitae placerat nulla. Nunc a ipsum et dolor iaculis aliquam quis at eros. Suspendisse potenti.',
                status: 'flagged',
                created: '2017-01-20T12:37:19+00:00',
                resolved: '2017-02-20T12:37:19+00:00',
                flagUser: {
                    "id": 6,
                    "name": "Kilannin Krysiak",
                    "last_seen_at": "2016-10-06T06:04:09.433Z",
                    "username": "kkrysiak",
                    "role": "admin",
                    "avatar_url": "https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=32",
                    "avatars": {
                        "x128": "https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=128",
                        "x64": "https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=64",
                        "x32": "https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=32",
                        "x14": "https://secure.gravatar.com/avatar/17180f9afc9f7f04fff97197c1ee5cb6.png?d=identicon\u0026r=pg\u0026s=14"
                    },
                    "area_of_expertise": "Research Scientist",
                    "orcid": "0000-0002-6299-9230",
                    "display_name": "kkrysiak",
                    "created_at": "2015-02-26T04:14:20.953Z",
                    "url": "",
                    "twitter_handle": null,
                    "facebook_profile": null,
                    "linkedin_profile": "kilannin-krysiak-69047819",
                    "bio": "Dr. Krysiak is a staff scientist at the McDonnell Genome Institute at Washington University School of Medicine where she is involved in the comprehensive genomic analysis of cancer patient cohorts and “n-of-1” studies. She received her PhD in Molecular Genetics and Genomics at Washington University in St. Louis where she focused on the genetics of myelodysplastic syndrome through advanced flow cytometry techniques, primary cell culture and mouse models. She is a founding member of the CIViC team, helping to define the CIViC data model, and a leading content curator and feature development consultant.",
                    "featured_expert": true,
                    "accepted_license": null,
                    "signup_complete": null,
                    "affiliation": null,
                    "organization": null,
                    "domain_expert_tags": [],
                    "trophy_case": {
                        "badges": []
                    },
                    "community_params": {
                        "most_recent_action_timestamp": "2016-10-06T06:04:09.496Z",
                        "action_count": 2665
                    }
                },
                unflagUser: {
                    "id": 15,
                    "name": "Malachi Griffith",
                    "last_seen_at": "2016-10-04T17:33:52.779Z",
                    "username": "MalachiGriffith",
                    "role": "admin",
                    "avatar_url": "https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=32",
                    "avatars": {
                        "x128": "https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=128",
                        "x64": "https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=64",
                        "x32": "https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=32",
                        "x14": "https://secure.gravatar.com/avatar/a4d9fc3b05d58cf3d3ba51dc30bb61d6.png?d=identicon\u0026r=pg\u0026s=14"
                    },
                    "area_of_expertise": "Research Scientist",
                    "orcid": "0000-0002-6388-446X",
                    "display_name": "MalachiGriffith",
                    "created_at": "2015-02-26T22:25:34.692Z",
                    "url": "http://genome.wustl.edu/people/individual/malachi-griffith/",
                    "twitter_handle": "malachigriffith",
                    "facebook_profile": null,
                    "linkedin_profile": "http://www.linkedin.com/in/malachigriffith",
                    "bio": "Dr. Griffith is an Assistant Professor of Genetics and Assistant Director of the McDonnell Genome Institute at Washington University School of Medicine. Dr Griffith has extensive experience in the fields of genomics, bioinformatics, data mining, and cancer research. His research is focused on improving the understanding of cancer biology and the development of personalized medicine strategies for cancer using genomics and informatics technologies. The Griffith lab develops bioinformatics and statistical methods for the analysis of high throughput sequence data and identification of biomarkers for diagnostic, prognostic and drug response prediction. The Griffith lab uses CIViC to interpret variants identified in cases examined by the WASHU Genomics Tumor Board. He is a co-creator of the CIViC resource.",
                    "featured_expert": true,
                    "accepted_license": null,
                    "signup_complete": null,
                    "affiliation": null,
                    "organization": null,
                    "domain_expert_tags": [],
                    "trophy_case": {
                        "badges": []
                    },
                    "community_params": {
                        "most_recent_action_timestamp": "2016-10-03T15:58:49.097Z",
                        "action_count": 2558
                    }
                }
            }];
            angular.copy(mockFlags, flags);
            var d = $q.defer();
            d.resolve(mockFlags);
            return d.promise;
            // return GenesResource.queryFlags({geneId: geneId}).$promise
            //   .then(function(response) {

            //     angular.copy(response.flags, flags);
            //     return response.$promise;
            //   });
        }

        // Gene Comments
        function queryComments(geneId) {
            return GenesResource.queryComments({
                    geneId: geneId
                }).$promise
                .then(function(response) {
                    angular.copy(response, comments);
                    return response.$promise;
                });
        }

        function getComment(geneId, commentId) {
            return GenesResource.getComment({
                    geneId: geneId,
                    commentId: commentId
                }).$promise
                .then(function(response) {
                    return response.$promise;
                });
        }

        function submitComment(reqObj) {
            return GenesResource.submitComment(reqObj).$promise
                .then(function(response) {
                    cache.remove('/api/genes/' + reqObj.geneId + '/comments');
                    queryComments(reqObj.geneId);

                    // flush subscriptions and refresh
                    cache.remove('/api/subscriptions?count=999');
                    Subscriptions.query();

                    return response.$promise;
                });
        }

        function updateComment(reqObj) {
            return GenesResource.updateComment(reqObj).$promise
                .then(function(response) {
                    cache.remove('/api/genes/' + reqObj.geneId + '/comments');
                    queryComments(reqObj.geneId);
                    return response.$promise;
                });
        }

        function deleteComment(commentId) {
            return GenesResource.deleteComment({
                    geneId: item.id,
                    commentId: commentId
                }).$promise
                .then(function(response) {
                    cache.remove('/api/genes/' + item.id + '/comments');
                    queryComments(item.id);
                    return response.$promise;
                });
        }
    }
})();
