;(function () {
  'use strict';


  var evothingsChannelConstant = {
    scannerStateChanged 	: 'scannerStateChanged',
    scannedDevice				  : 'scannedDevice'
  };

  angular
    .module('prioloc.evothingsChannel.constant', [])
    .constant("EvothingsChannelConstant", evothingsChannelConstant);

})();
