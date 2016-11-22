(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('MyVariantInfoController', MyVariantInfoController)
    .directive('myVariantInfo', function () {
      return {
        restrict: 'E',
        scope: {
          variantInfo: '='
        },
        controller: 'MyVariantInfoController',
        templateUrl: 'app/views/events/variants/summary/myVariantInfo.tpl.html'
      };
    });

  // @ngInject
  function MyVariantInfoController($scope, ngDialog, _) {
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
      'emv.hgvs'
    ];
    _.each(multiTypeFields, function(field) {
      var val = _.get(ctrl.variantInfo,field);
      if (_.isString(val)) { _.set(ctrl.variantInfo, field, [val]); }
    });

    // calculate adjusted allele frequency
    if(!_.isUndefined(ctrl.variantInfo.exac)) {
      if(!_.isUndefined(ctrl.variantInfo.exac.an) && !_.isUndefined(ctrl.variantInfo.exac.ac)) {
        ctrl.variantInfo.exac.adj_allele_freq = _.round(ctrl.variantInfo.exac.ac.ac_adj / ctrl.variantInfo.exac.an.an_adj, 5);
      }
    }

    ctrl.popupOptions = {
      template: 'app/views/events/variants/summary/myVariantInfoDialog.tpl.html',
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
