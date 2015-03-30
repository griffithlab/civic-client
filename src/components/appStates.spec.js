'use strict';

describe('appStates', function () {
  var $rootScope,
    $compile,
    $state,
    $timeout,
    $templateCache,
    $location,
    Genes,
    MyGeneInfo;

  beforeEach(function () {
    module('civic.states');
    module('civic.templates');

    // inject services
    inject(function(_$templateCache_, _$location_, _$rootScope_, _$compile_) {
      $templateCache = _$templateCache_;
      $location = _$location_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;

      // helpful functions for testing ui-router
      function mockTemplate(templateRoute, tmpl) {
        $templateCache.put(templateRoute, tmpl || templateRoute);
      }

      function goTo(url) {
        $location.url(url);
        $rootScope.$digest();
      }

      function goFrom(url) {
        return {toState: function (state, params) {
          $location.replace().url(url); //Don't actually trigger a reload
          $state.go(state, params);
          $rootScope.$digest();
        }};
      }

      function resolve(value) {
        return {forStateAndView: function (state, view) {
          var viewDefinition = view ? $state.get(state).views[view] : $state.get(state);
          return $injector.invoke(viewDefinition.resolve[value]);
        }};
      }

      // init sinon-as-promised with v1.2 $q shim
      function $qShim(resolver) {
        var deferred = _$q_.defer();
        var resolve = angular.bind(deferred, deferred.resolve);
        var reject = angular.bind(deferred, deferred.reject);
        var promise = deferred.promise;
        resolver(resolve, reject);
        return promise;
      }
      sinonAsPromised($qShim);

      // mock templates
      $templateCache.put('app/views/events/genes/GenesView.tpl.html', '<div ui-view></div>');

      // ui-view compile to force ui-router's controller instantiation
      $compile("<html><body><div ui-view></div></body></html>")($rootScope);
      $rootScope.$digest();
    });
  });

  describe('events.genes state configuration', function() {
    it('should be abstract', function () {
      expect($state.get(state).abstract).to.be.true;
    });

    it('should specify the url "/genes/:geneId"', function () {
      expect($state.get(state).url).to.equal('/genes/:geneId');
    });

    it('should respond to the url "#/events/genes/1"', function () {
      expect($state.href(state, {geneId: 1})).to.equal('#/events/genes/1');
    });

    it('requests Genes service to be resolved', function () {
      var egState = $state.get(state);
      expect(egState.resolve.Genes).to.exist;
      expect(egState.resolve.Genes).to.equal('Genes');
    });

    it('requests MyGeneInfo service to be resolved', function () {
      var egState = $state.get(state);
      expect(egState.resolve.MyGeneInfo).to.exist;
      expect(egState.resolve.MyGeneInfo).to.equal('MyGeneInfo');
    });

    it('resolves specific gene from Genes service', function () {
      var egState = $state.get(state);
      var gene;
      expect(egState.resolve.gene).to.exist;
      expect(egState.resolve.gene).to.be.a('function');
      egState.resolve.gene(Genes, {geneId: 238 }).then(function(result) {
        gene = result;
      });
      $timeout.flush();
      expect(gene.entrez_id).to.equal(238);
    });

    it('retrieves specific gene info from MyGeneInfo service', function () {
      var egState = $state.get(state);
      var gene;
      var myGeneInfo;
      expect(egState.resolve.myGeneInfo).to.exist;
      expect(egState.resolve.myGeneInfo).to.be.a('function');
      egState.resolve.gene(Genes, {geneId: 238 }).then(function(result) {
        gene = result;
      });
      $timeout.flush();
      egState.resolve.gene(MyGeneInfo, gene).then(function(result) {
        myGeneInfo = result;
      });
      $timeout.flush();
      expect(myGeneInfo._id).to.equal('238');
    });
  });
});
