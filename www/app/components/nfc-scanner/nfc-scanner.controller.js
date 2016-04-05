;(function () {
  'use strict'

  angular.module('bp.nfcScanner.controller', ['commons.nfcScanner.service','commons.nfcScanner.channel'])
          .controller('NFCScannerController', NFCScannerController);

  function NFCScannerController($scope, NFCScannerService, NFCScannerChannel) {

    var vm = this;

    vm.isEnabled;
    vm.isListening;
    vm.code;

    vm.startListening = startListening;
    vm.stopListening = stopListening;
    vm.checkIsEnabled = checkIsEnabled;

    init();

    ////////////////

    function init() {
      vm.isListening = NFCScannerService.getIsListening();
       NFCScannerService.checkNfcEnabled().then(function(success) {
         vm.isEnabled = success;
       });
      NFCScannerChannel.subIsListeningChanged($scope, function(newValue) {
        vm.isListening = NFCScannerService.getIsListening();
      })

      NFCScannerService.addMimeTypeListener("text/json",
        function (nfcEvent) {console.log('ctrl mime  nfcEvent', nfcEvent);},
        function (success) {console.log('ctrl mime  success', success)},
        function (error) {console.log('ctrl mime  success', error) }
      );
    }

    function checkIsEnabled() {
      NFCScannerService
        .checkNfcEnabled()
          .then(
            function(success) {
              vm.isEnabled = success;
            },
            function(error) {
              vm.isEnabled = error;
            }
          )
    }

    function startListening() {
        NFCScannerService
          .startListening(evaluationHandler)
            .then(
              function(success) { console.log(success);  },
              function(error) { console.log(error); }
            )
    }

    function stopListening() {
        NFCScannerService
          .stopListening()
            .then(
              function(success) { console.log(success);  },
              function(error) { console.log(error); }
            )

    }

    function evaluationHandler (nfcEvent){

      console.log('nfcEvent', nfcEvent);
      try {

        var tag = nfcEvent.tag,
          ndefMessage = tag.ndefMessage,
          uri="";

        // Loop over all NDEF Entries and look if there is an URI
        for(var messageNr=0; messageNr<ndefMessage.length;messageNr++) {

          //Check NDEF URI Type
          if(ndefMessage[messageNr].type[0]==85){

            // Decide Schema
            if(ndefMessage[messageNr].payload[0]==1)uri="http://www."; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==2)uri="https://www."; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==3)uri="http://"; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==4)uri="https://"; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==0)uri=""; // Whole URL in Payload

            uri=uri + nfc.bytesToString(ndefMessage[messageNr].payload).substring(1);
            break;
          }
        }

        vm.code = uri;

      }
      catch (e) {
        console.log("Error evaluating NFC card")
      }
    }

  }

})();
