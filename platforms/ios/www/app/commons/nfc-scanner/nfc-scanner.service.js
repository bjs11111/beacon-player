;
(function () {
  'use strict';

  angular
    .module('commons.qrScanner.service', ['ngCordova'])
    .service('QRScannerService', QRScannerService);

  function QRScannerService($q, $ionicPlatform, $cordovaBarcodeScanner) {

    var isRegistered=false;

    var diagnosticService = {
      getIsQrScannerOpen: getIsQrScannerOpen,
      saveOpenScan : saveOpenScan,
    };

    init();
    return diagnosticService;

    ///////

    function init() {

    }

    //@TODO move into service
     function evaluateNFCCard (nfcEvent){
      try {

        var tag = nfcEvent.tag,
          ndefMessage = tag.ndefMessage;

        //alert(JSON.stringify(ndefMessage));

        //alert(nfc.bytesToString(ndefMessage[0].payload));

        var uri="";

        // Loop over all NDEF Entries and look if there is an URI
        for(var messageNr=0; messageNr<ndefMessage.length;messageNr++){
          //Check NDEF URI Type
          if(ndefMessage[messageNr].type[0]==85){

            // Decide Shema
            if(ndefMessage[messageNr].payload[0]==1)uri="http://www."; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==2)uri="https://www."; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==3)uri="http://"; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==4)uri="https://"; // Shema not in Payload
            if(ndefMessage[messageNr].payload[0]==0)uri=""; // Whole URL in Payload

            // Get URI
            uri=uri + nfc.bytesToString(ndefMessage[messageNr].payload).substring(1);
            //alert(uri);

            //openIAB(uri);

            // End as soon the first URI was detected
            break;
          }
        }

      }
      catch (e) {
        alert("Error evaluating NFC card")
      }
    }



    function registerNFCUrlListener() {
      try{
        setInterval(
          function ()
          {

            if(!isRegistered && typeof nfc != "undefined" ){
              isRegistered=true;


              nfc.addNdefListener (
                function (nfcEvent) {evaluateNFCCard(nfcEvent);}, // NFC Tag scanned
                function () {isRegistered=true;},// Waiting for NFC Tag, registration Successful
                function (error) { } //TODO: Probably if no NFC Chip in device, handle this
              );


              nfc.addMimeTypeListener("text/json",
                function (nfcEvent) {evaluateNFCCard(nfcEvent);}, // NFC Tag scanned
                function () {isRegistered=true;},// Waiting for NFC Tag, registration Successful
                function (error) { } //TODO: Probably if no NFC Chip in device, handle this
              );


            }

          }, 2000);
      }
      catch(e){
        // NFC init Error
      }
    };


  }

})();
