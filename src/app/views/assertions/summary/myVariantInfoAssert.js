(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('MyVariantInfoAssertController', MyVariantInfoAssertController)
    .directive('myVariantInfoAssert', function () {
      return {
        restrict: 'E',
        scope: {
          variantInfo: '='
        },
        controller: 'MyVariantInfoAssertController',
        templateUrl: 'app/views/assertions/summary/myVariantInfoAssert.tpl.html'
      };
    });

  // @ngInject
  function MyVariantInfoAssertController($scope, ngDialog, _) {
    var ctrl = $scope.ctrl = {};
    ctrl.variantInfo = $scope.variantInfo;

    // MyVariant.info returns some fields as strings OR arrays, this
    // converts strings to a single-element array
    var multiTypeFields = [
      'cadd.consdetail',
      'cadd.consequence',
      'clinvar.hgvs.coding',
      'clinvar.hgvs.genomic',
      'clinvar.hgvs.non-coding',
      'emv.hgvs',
      'clinvar.rcv',
      'exac.ac.ac_adj',
      'exac.an.an_adj',
      'snpeff.ann'
    ];
    _.each(multiTypeFields, function(field) {
      var val = _.get(ctrl.variantInfo,field);
      if (!(_.isUndefined(val) || _.isArray(val))) { _.set(ctrl.variantInfo, field, [val]); }
    });

    // calculate adjusted allele frequency
    if(!_.isUndefined(ctrl.variantInfo.exac)) {
      if(!_.isUndefined(ctrl.variantInfo.exac.an) && !_.isUndefined(ctrl.variantInfo.exac.ac)) {
        ctrl.variantInfo.exac.adj_allele_freq = _.round(ctrl.variantInfo.exac.ac.ac_adj[0] / ctrl.variantInfo.exac.an.an_adj[0], 5);
      }
    }

    // replace ampersands with commas in SnpEff Effect strings
    if(!_.isUndefined(ctrl.variantInfo.snpeff) && !_.isUndefined(ctrl.variantInfo.snpeff.ann[0])) {
      if(!_.isUndefined(ctrl.variantInfo.snpeff.ann[0])) {
        ctrl.variantInfo.snpeff.ann[0].effect = ctrl.variantInfo.snpeff.ann[0].effect.replace(/_/g, ' ');
        ctrl.variantInfo.snpeff.ann[0].effect = ctrl.variantInfo.snpeff.ann[0].effect.replace(/&/g, ', ');
      }
    }

    ctrl.popupOptions = {
      template: 'app/views/assertions/summary/myVariantInfoAssertDialog.tpl.html',
      scope: $scope
    };

    ctrl.openDialog = function() {
      if(_.has(ctrl.dialog, 'id')) {
        ctrl.closeDialog().then(function() {
          ctrl.dialog = ngDialog.open(ctrl.popupOptions);
        });
      } else {
        ctrl.dialog = ngDialog.open(ctrl.popupOptions);
      }
      return ctrl.dialog;
    };

    ctrl.closeDialog = function() {
      ctrl.dialog.close();
      return ctrl.dialog.closePromise.then(function() { _.omit(ctrl, 'dialog'); } );
    };
  }

})();
