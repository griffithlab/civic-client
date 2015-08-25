'use strict';
/*jshint expr:true */
describe('myGeneInfo', function () {
  var $rootScope,
    $compile,
    $state,
    $controller,
    $httpBackend,
    $document,
    $timeout,

    _,

    GenesViewController,
    genesViewScope,
    mockViewElem, // DOM element of mocked events.genes ui-view
    mockViewScope, // scope of mocked events.genes ui-view
    dirElem, // element of entity-view directive
    dirScope, // scope of entity-view directive
    modalElem; // element to which modal popup will be appended

  function goFromState(state1, params1) {
    return {
      toState: function (state2, params2) {
        $state.go(state1, params1);
        $rootScope.$digest();
        $state.go(state2, params2);
        $rootScope.$digest();
      }};
  }

  beforeEach(function () {
    // load civic modules
    module('civic.services');
    module('civic.common');
    module('civic.events');
    module('civic.templates'); // load ng-html2js templates
    module('civic.events.common'); // load common events directives
    module('civic.events.genes', function ($provide, $stateProvider) {
      // need to create an initial state to transition from
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/initial',
          template: '<ui-view autoscroll="true"></ui-view>'
        })
        .state('events.genes.child', {
          abstract: false,
          url: '/child',
          template:
          '<mock-ui-view>' +
          '<entity-view entity-model="geneModel">' +
          '<entity-tabs entity-model="geneModel"></entity-tabs>' +
          '<gene-summary>' +
          '</gene-summary>' +
          '</entity-view>' +
          '</mock-ui-view>'
        });
    });

    // load json fixtures for httpBackend mocked responses
    module('served/gene238.json');
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('served/myGeneInfo238.json');

    // inject services
    inject(function(_$rootScope_,
                    _$compile_,
                    _$controller_,
                    _$state_,
                    _$httpBackend_,
                    _$document_,
                    _$timeout_,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $document = _$document_;
      $timeout = _$timeout_;

      _ = window._;

      // setup mocked backend responses
      $httpBackend.when('GET', '/api/genes/238').respond(servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variant_groups').respond(servedGene238VariantGroups);

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      genesViewScope = $rootScope;

      GenesViewController = $controller('GenesViewController', {
        $scope: genesViewScope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
        variants: deps.variants,
        variantGroups: deps.variantGroups,
        myGeneInfo: deps.myGeneInfo
      });

      expect(GenesViewController).to.exist;
      expect(GenesViewController).to.be.an('object');

      // compile test child template
      mockViewElem = $compile($state.current.template)(genesViewScope);
      mockViewScope  = mockViewElem.scope();
      mockViewScope.$digest();

      expect(mockViewScope.geneModel).to.exist;
      expect(mockViewScope.geneModel).to.be.an('object');

      dirElem = $(mockViewElem).find('my-gene-info');
      dirScope = $(dirElem).children(':first').scope();
    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('directive', function(){
    it('is successfully instantiated within the context of gene-summary', function() {
      expect(dirElem).to.exist;
      expect(dirScope).to.exist;
    });

    it('uses an isolate scope', function() {
      expect(dirScope.geneModel).to.not.exist; // would find on GeneViewController if not isolate scope
    });
  });

  describe('controller', function() {
    it('provides the geneInfo object on scope', function(){
      expect(dirScope.geneInfo).to.exist;
      expect(dirScope.geneInfo).to.be.an('object');
      expect(dirScope.geneInfo.symbol).to.equal('ALK');
    });

    it('provides the popupOptions object on ctrl', function(){
      expect(dirScope.ctrl.popupOptions).to.exist;
      expect(dirScope.ctrl.popupOptions).to.be.an('object');
      expect(dirScope.ctrl.popupOptions.controller).to.equal('MyGeneInfoDialogController');
    });

    it('provides an openDialog function on ctrl', function() {
      expect(dirScope.ctrl.openDialog).to.exist;
      expect(dirScope.ctrl.openDialog).to.be.a('function');
    });

    it('provides a closeDialog function on ctrl', function() {
      expect(dirScope.ctrl.closeDialog).to.exist;
      expect(dirScope.ctrl.closeDialog).to.be.a('function');
    });

  });

  describe('myGeneInfo template', function() {
    it('displays name', function() {
      expect($(dirElem).find('td[ng-bind*="name"]').text()).to.contain('anaplastic lymphoma receptor tyrosine kinase');
    });

    it('displays Entrez id', function() {
      expect($(dirElem).find('a[ng-bind*="symbol"]').text()).to.contain('ALK');
    });

    it('displays Entrez id in link to Entrez DB', function() {
      expect($(dirElem).find('a[ng-bind*="symbol"]').attr('href')).to.contain('http://www.ncbi.nlm.nih.gov/gene/');
    });

    it('displays synonyms', function() {
      expect($(dirElem).find('td[ng-bind*="alias"]').text()).to.contain('CD246, NBLST3');
    });

    it('displays protein domains', function() {
      expect($(dirElem).find('td[ng-bind-html*="interpro"]').text()).to.contain('Concanavalin A-like lectin/glucanases superfamily');
    });

    it('displays pathways', function() {
      expect($(dirElem).find('td[ng-bind-html*="pathway"]').text()).to.contain('Cell Cycle, Disease, Chromosome Maintenance');
    });
  });

  describe('openDialog function', function() {
    var $body, button;

    beforeEach(function() {
      $body = $document.find('body');
      button = $(dirElem).find('button.view-gene-details');
    });

    afterEach(function() {
      dirScope.ctrl.closeDialog();
    });

    it('is called by \'View Full Details from MyGene.info\' button', function() {
      var spy = sinon.spy(dirScope.ctrl, 'openDialog');
      button.triggerHandler('click');
      expect(spy).to.have.been.calledOnce;
    });

    it('opens a My Gene Info dialog window', function() {
      button.triggerHandler('click');
      expect($body.find('.myGeneInfoDialog')).to.exist;
    });

    it('closes an existing dialog before opening a new one', function() {
      var spy = sinon.spy(dirScope.ctrl, 'closeDialog');
      dirScope.ctrl.openDialog();
      $rootScope.$digest();
      $timeout.flush();
      expect(dirScope.ctrl.dialog).to.exist;
      expect(dirScope.ctrl.dialog.id).to.equal('ngdialog1');
      dirScope.ctrl.openDialog();
      $rootScope.$digest();
      $timeout.flush();
      expect(spy).to.have.been.calledOnce;
      expect($body.find('.myGeneInfoDialog').length).to.equal(1);
    });
  });

  describe('closeDialog function', function() {
    var $body, button;
    beforeEach(function() {
      $body = $document.find('body');
      button = $(dirElem).find('button.view-gene-details');
    });

    it('closes the dialog window', function() {
      dirScope.ctrl.openDialog();
      $rootScope.$digest();
      $timeout.flush();
      expect($body.find('.myGeneInfoDialog').length).to.be.above(0);
      dirScope.ctrl.closeDialog();
      $rootScope.$digest();
      expect($body.find('.myGeneInfoDialog').length).to.equal(0);
    });
  });

  describe('myGeneInfoDialog template', function() {
    before(function() {
      var $body = $document.find('body');
      dirScope.ctrl.openDialog();
      $rootScope.$digest();
      $timeout.flush();
      modalElem = $body.find('.myGeneInfoDialog');
    });

    it('displays the correct title', function() {
      expect(modalElem.find('.header h3').text()).to.contain('Gene ALK');
    });

    it('displays correct gene summary', function() {
      expect(modalElem.find('.summary').text()).to.contain('This gene encodes a receptor tyrosine kinase');
    });

    it('displays gene synonyms', function() {
      expect(modalElem.find('.synonyms').text()).to.contain('CD246,NBLST3');
    });

    it('displays protein domain datagrid', function() {
      expect(modalElem.find('.protein-domains .ui-grid-render-container').length).to.be.above(0);
    });

    it('displays pathways datagrid', function() {
     expect(modalElem.find('.pathways .ui-grid-render-container').length).to.be.above(0);
    });

    it('displays close dialog button', function() {
      var button = modalElem.find('.buttons button.close');
      expect(button.length).to.be.above(0);
    });

    it('displays close dialog button that closes the dialog when clicked', function() {
      var button = modalElem.find('.buttons button.close');
      button.triggerHandler('click');
      $rootScope.$digest();
      expect($document.find('.myGeneInfoDialog').length).to.equal(0);
    });
  });


});
