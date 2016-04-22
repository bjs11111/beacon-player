/* Services */
var generalServices = angular.module('commons.services.generalServices.factory', ['ngCordova', 'commons.filter.bleFilters', 'commons.services.localNotificationsManager.factory']);


generalServices.constant("generalServiceConfig", {
	//vibration settings
	iabOpenVibratePattern 	: [100, 100, 100],
	iabOpenVibrateTime 		: 100,
	//iab settings
	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
	},
	//path vars
	basePath 				: 'http://www.starnberger.at/beaconplayer_analyse',
	iabView 				: 'b-i'

});

generalServices.factory('generalService', ['$rootScope','$window','$timeout','$filter','$ionicPlatform','$ionicPopup','generalServiceConfig','localNotificationsManager',
                                  function ($rootScope,  $window,  $timeout,  $filter,  $ionicPlatform,  $ionicPopup,  generalServiceConfig,  localNotificationsManager) {

	/*
	 * helper functions
	 */
	//@TODO create filter of in bleFilters
	var qrCodeUrlToBcmsBeaconKey = function (url) {

		var bcmsBeaconKeyToObj = $filter('bcmsBeaconKeyToObj');

		var bcmsKeyAndParams = url.split(generalServiceConfig.basePath +'/'+ generalServiceConfig.iabView +'/').pop();
		var bcmsKey = bcmsKeyAndParams.split('?')[0];

		if( bcmsBeaconKeyToObj(bcmsKey) !== false) {
      return bcmsKey;
		}
		return false;
	};


	/*
	 * alerts
	 */

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button
	 * */
	var alertEnsureInetConnection = function(forceCloseApp) {

		forceCloseApp = (forceCloseApp)?true:false;

		//let alert pop up with given settings
		var noInetAlert =	$ionicPopup.alert({
			   title	: 'No internet',
			   template	: 'Please turn on your internet connection and try again!',
			   okType	: 'button-energized'
		});

		//actions after press okButton
		noInetAlert.then( function(result) {
							noInetAlert.close();
							//if(forceCloseApp) { ionic.Platform.exitApp(); }
						});
	};

	/*show alert with information to check inet connection
	 * set closeOnOffline to true closes app after press alert button
	 * */
	var alertWrongUrl = function(forceCloseApp) {

		forceCloseApp = (forceCloseApp)?true:false;

		//let alert pop up with given settings
		var wrongUrl =	$ionicPopup.alert({
			   title	: 'Wrond QR-Code',
			   template	: 'QR-Code not in system',
			   okType	: 'button-energized'
			 });

		//actions after press okButton
		wrongUrl.then( function(result) {
							wrongUrl.close();
							//if(forceCloseApp) { ionic.Platform.exitApp(); }
						});
	};


	//@TODO move into service
	evaluateNFCCard = function(nfcEvent){
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
	            	openIAB(uri);

	            	// End as soon the first URI was detected
	            	break;
	            }
            }




		}
		catch (e) {
		   alert("Error evaluating NFC card")
		}
	}


	/*
	 * Register NFC for listening NDEF messages
	 */
	var isRegistered=false;
    var registerNFCUrlListener = function() {
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






	/*
	 * barcode scanner
	 */
	//@TODO finish implementation
	var qrSuccessCallback = function (barcodeData) {
		var bcmsBeaconKey;

		//canceled in true on android and 1 on ios
		if(!barcodeData.cancelled) {
			if( qrCodeUrlToBcmsBeaconKey(barcodeData.text) !== false ) {
				openIAB(barcodeData.text);
			} else {
				//@TODO cleanup workaround for bug #66 (https://github.com/Tokencube/beacon-player/issues/66)
				$timeout(alertWrongUrl, 300)
			}
		}
	};
	//@TODO handle
	var qrErrorCallback = function (error) {};


	/*
	 * InnAppBrowser
	*/
	//iabIsOpenState
	var iabIsOpen = false;

	//@TODO finish implementation
	var openIABWithBcmsBeaconKey = function(bcmsBeaconKey) {

		//@TODO remove fake data
		var fakeObj = { bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
						bcmsBeacon : {contentTitle:"Beacon1"},
		                contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                major:1,
		                minor:26202,
		                triggerZone:"Near",
		                rssi:-65,
		                sort:4
		               };
		//@TODO fetch device from list
		var device = fakeObj;

		//@TODO use service to get data
		if(device) {

			if(device.bcmsBeacon) {
				if(device.bcmsBeacon.contentTitle == false) {
					//console.log('APPTEST: no connected content given');
					return;
				} else {
					var urlToContent = generalServiceConfig.basePath +'/'+ generalServiceConfig.iabView +'/'+ bcmsBeaconKey+'?ajax=1';
					if(device.bcmsBeacon.thirdPartyWebsite) { urlToContent = device.bcmsBeacon.thirdPartyWebsite; }
					openIAB(urlToContent);
				}
			}
		}

	}

	var openIAB = function(url) {

		//@TODO check if is url!!
		$ionicPlatform.ready(function() {

			//skip if is open
			if(iabIsOpen) { return; }

			//if offline
			//@TODO create wrapper functions for no-inet, no-ble, on-deviceready,
			if( navigator.isOffline() ) {
				alertEnsureInetConnection();
				return;
			}

			iabIsOpen = true;


    		//vibrate for content
			try {
				//$cordovaVibration.cancelVibration();
				//$cordovaVibration.vibrate(generalServiceConfig.iabOpenVibrateTime);
			}
			catch(err) {

			}


    		//open iab with beacon content url
			/*
			 $cordovaInAppBrowser
			    .open(url, '_blank', generalServiceConfig.iabDefaultSettings)
			    .then(
			    	// success
			    	function(event) {},
    			    // error
    			    function(event) {  iabIsOpen = false; });
    			    */
	    });

		$rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
			//@TODO check why we are not able to execute from file!!!
			$cordovaInAppBrowser.executeScript({
				//file: 'app/common/services/assets/css/iab.js',
				code:
	 		    	   "var link_buttonText = document.createTextNode('< Back');\
	 		    		var link_button = document.createElement('a');\
	 		    		link_button.setAttribute('onclick', \"window.close();\");\
	 		    		link_button.setAttribute('href', 'http://www.beacon-player.at/close-iab.action');\
	 			    	link_button.id = 'iba-close-button';\
	 		    		link_button.style.fontSize = '20px';\
	 		    		link_button.style.height = '50px';\
	 		    		link_button.style.textDecoration = 'none';\
	 		    		link_button.style.fontWeight = 'bold';\
	 		    		link_button.style.color = '#0c63ee';\
	 		    		link_button.style.lineHeight = '20px';\
	 		    		link_button.style.textAlign	= 'left';\
	 		    		link_button.style.verticalAlign = 'middle';\
	 		    		link_button.style.backgroundColor = '#f8f8f8';\
	 		    		link_button.style.borderBottom = '1px solid #b2b2b2';\
	 		    		link_button.style.margin = '0px';\
	 		    		link_button.style.padding = '15px';\
	 		    		link_button.style.display = 'block';\
	 		    		link_button.appendChild(link_buttonText);\
	 		    		var footer = document.createElement('div');\
	 		    		footer.style.position = 'fixed';\
	 		    		footer.style.top = 0;\
	 		    		footer.style.left = 0;\
	 		    		footer.style.right = 0;\
	 		    		footer.style.zIndex = 2147483647;\
	 		    		footer.appendChild(link_button);\
	 		    		document.body.appendChild(footer);\
						document.body.style.margin = '50px 0px 0px 0px';"
			});

			$cordovaInAppBrowser.insertCSS({
				file: 'app/common/services/assets/css/iab.css'
			});

		 });

		 $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
			var url = event.url;
			if (url.indexOf("close-iab") != -1) {
				$cordovaInAppBrowser.close();
				iabIsOpen = false;
			}
		 });

		 $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
			 $cordovaInAppBrowser.close();
			 iabIsOpen = false;
		 });

		 $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
			  iabIsOpen = false;
		 });

	};


	//backbutton
	$ionicPlatform.registerBackButtonAction(function (event) {
        event.preventDefault();
	}, 100);

	// return the publicly accessible methods
	return {
		//isBCMSUrl : isBCMSUrl,
		//alertEnsureInetConnection : alertEnsureInetConnection,
		//alertWrongUrl : alertWrongUrl,
		qrSuccessCallback 	: qrSuccessCallback,
		qrErrorCallback 	: qrErrorCallback,
		openIAB 			: openIAB,
		openIABWithBcmsBeaconKey : openIABWithBcmsBeaconKey,
		registerNFCUrlListener:registerNFCUrlListener,
	}

}]);

generalServices.factory('$localstorage', ['$window',
                           function ($window) {
                             return {
                                //
                               setItem: function (key, value) {
                                 $window.localStorage[key] = value;

                               },
                               getItem: function (key, emptyValue) {

                             	 var val = $window.localStorage[key];
                                 emptyValue = (emptyValue !== undefined) ? emptyValue : undefined;

                                 return (val !== undefined)?val:emptyValue;
                               },
                               removeItem: function (key) {
                                 delete $window.localStorage[key];
                               },
                               //
                               setObject: function (key, value) {
                                 $window.localStorage[key] = JSON.stringify(value);
                               },
                               getObject: function (key, emptyValue) {
                                 emptyValue = (emptyValue !== undefined) ? emptyValue : '{}';
                                 var result = $window.localStorage[key];
                                 //@TODO double check this
                                 if(result === undefined || result === "Max"){return emptyValue}
                                 return JSON.parse($window.localStorage[key] || emptyValue);
                               },
                               removeObject: function (key) {
                                 delete $window.localStorage[key];
                               },
                               //
                               clearAll: function (key) {
                                 delete $window.localStorage[key];
                                 $window.localStorage = [];
                               },
                             }
                           }]);

//@TODO finish!!!
// This takes care of actions that should take place on app lounge
generalServices.factory('launcherService',
		['$q', 'generalServiceConfig', '$localstorage',
function ($q,   generalServiceConfig,   $localstorage) {

			var firstVisit;
		     var getFirstVisit = function() {
		    	 return firstVisit;
		     };

		     var setFirstVisit = function(newValue) {
		    	 newValue = (newValue)?true:false;
		    	 $localstorage.setItem('firstVisit', newValue)
		    	 firstVisit = newValue;

		     };

		     return {

		    	getFirstVisit 		: getFirstVisit,
		    	setFirstVisit 		: setFirstVisit
		     };

}]);