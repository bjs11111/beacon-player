;
(function () {
  'use strict';

  angular
    .module('commons.nfcScanner.service', ['ngCordova', 'commons.nfcScanner.channel', 'commons.nfcScannerService.constant'])
    .service('NFCScannerService', NFCScannerService);

  function NFCScannerService($q, $ionicPlatform, NFCScannerChannel, NFCScannerServiceConstant) {

    var isListening = false;

    var diagnosticService = {
      checkNfcEnabled: checkNfcEnabled,
      getIsListening: getIsListening,
      setIsListening: setIsListening,
      startListening: startListening,
      stopListening: stopListening,
      addMimeTypeListener : addMimeTypeListener,
      removeMimeTypeListener : removeMimeTypeListener,
      write: write,
      startSharing: startSharing,
      stopSharing: stopSharing
    }

    return diagnosticService;

    ///////

    function testHanlder(nfcEvent) {

      console.log('testHanlder nfcEvent', nfcEvent);
      var tag = nfcEvent.tag;
      var ndefMessage = tag.ndefMessage;
      var nfcResult = "";
      for (var i=0; i < ndefMessage.length; i++) {
        if (i>0) {
          nfcResult += "<br/>";
        }
        var payload = nfc.bytesToString(ndefMessage[i].payload);
        if (ndefMessage[i].type == 84) {
          // for messages, strip the language prefix
          payload = payload.substring(3);
        }
        nfcResult += payload;
      }
      app.demoService.viewModel.appendOutput("Scanned: " + nfcResult);
    }

    function getIsListening() {
      return isListening;
    }

    function setIsListening(newState) {
      if (newState !== isListening) {
        isListening = !!(newState);
        NFCScannerChannel.pubIsListeningChanged(isListening);
      }
    }

    function startListening(handler, success, error) {
      var defered = $q.defer();

      if (!getIsListening()) {
        setIsListening(true);

        $ionicPlatform.ready(function () {
          nfc.addNdefListener(
            testHanlder,
            function (success) {
              console.log('serv add success:', success);
              defered.resolve(success)
            },
            function (error) {
              console.log('serv add error:', error);
              defered.reject(error)
            }
          )
        });
        return defered.promise;
      }

      return $q.reject();
    }

    function stopListening(handler) {

      var defered = $q.defer();

      if (getIsListening()) {
        setIsListening(false);

        $ionicPlatform.ready(function () {
          nfc.removeNdefListener(
            testHanlder,
            function (success) {
              console.log('serv rem success:', success);
              defered.resolve(success)
            },
            function (error) {
              console.log('serv rem error:', error);
              defered.reject(error)
            }
          )
        });

        return defered.promise;
      }

      return $q.reject("already listening");
    }

     function addMimeTypeListener(mimeType, handler) {
      var defered = $q.defer();
      console.log('mimeType', mimeType);
      nfc.addMimeTypeListener(
        mimeType,
        function (nfcEvent) {
          console.log(nfcEvent);
          handler(nfcEvent);
          evaluateNFCCard(nfcEvent);
        }, // NFC Tag scanned
        function (success) {
          defered.resolve(success);
        },
        defered.reject
      );

       return defered.promise;
    }

    function removeMimeTypeListener(mimeType, callback) {
      var defered = $q.defer();

      nfc.removeMimeTypeListener(mimeType,callback,defered.resolve, defered.reject);

      return defered.promise;
    }


    function write(recordObj) {
      var records = [
          ndef.textRecord(recordObj.text),
          ndef.uriRecord(recordObj.uri)
        ],
        defered = $q.defer();
      $ionicPlatform.ready(function () {
        nfc.write(
          records,
          defered.resolve,
          defered.reject
        )
      });

      return defered.promise;
    }

    function startSharing(recordObj, success, error) {
      var records = [
          ndef.textRecord(recordObj.text)
        ],
        defered = $q.defer();

      $ionicPlatform.ready(function () {
        nfc.share(
          records,
          defered.resolve,
          defered.reject
        );

      });

      return defered.promise;
    }

    function stopSharing() {
      var defered = $q.defer();

      $ionicPlatform.ready(function () {
        nfc.unshare(
          defered.resolve,
          defered.reject
        );
      });

      return defered.promise;
    }

    function checkNfcEnabled(success, error) {
      var defered = $q.defer();

      $ionicPlatform.ready(function () {
        nfc.enabled(
          function (success) {
            if(NFCScannerServiceConstant.NFC_OK === success) { defered.resolve(true) }
            else if(NFCScannerServiceConstant.NFC_DISABLED === success) { defered.resolve(false) }
            else { defered.resolve(success) }
          },
          function (error) {
            if (NFCScannerServiceConstant.NFC_DISABLED === error) {defered.resolve(false)}
            else {defered.resolve(error)}
          }
        );
      });

      return defered.promise;
    }


    /*
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
     };*/


  }

})();
