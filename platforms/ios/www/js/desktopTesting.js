jQuery(document).ready(function($) {
/*the test devices prepared like after onDeviceScaned*/

	 var device1 = {
		address : '0C:F3:EE:53:40:65',
		rssi : '-70',
		minRange : '-95',
		maxRange : '4',
		trigger : '-85',
	};
	
	var device2 = {
		address : '0C:F3:EE:53:32:19',
		rssi : '-70',
		minRange : '-95',
		maxRange : '4',
		trigger : '-85',
	};

	var device3 = {
		address : '0C:F3:EE:53:21:65',
		rssi : '-70',
		minRange : '-95',
		maxRange : '4',
		trigger : '-85',
	};
	
/*thes append new contetn the available content list*/
	/**/
	$('body').prepend('<button id="view-add-d3" class="btn btn-default btn-lg btn-block">updateContents with device3</button>'); 
	$('body').prepend('<button id="view-add-d2" class="btn btn-default btn-lg btn-block">updateContents with device2</button>'); 
	$('body').prepend('<button id="view-add-d1" class="btn btn-default btn-lg btn-block">updateContents with device1</button>'); 

	$("#view-add-d3").on("click", function() { app.view.contentView.appendContent(device3); });
	$("#view-add-d2").on("click", function() { app.view.contentView.appendContent(device2); });
	$("#view-add-d1").on("click", function() { app.view.contentView.appendContent(device1); });
	
	
	
	
	/*
	 * buttons
	 		<button id="iab-show" class="btn btn-warning btn-lg btn-block">iab show (only on device testable)</button>
					</li>
					<li class="row row-table">
						<button id="iab-close" class="btn btn-warning btn-lg btn-block">iab close</button>
					</li>
					<li class="row row-table">
						<button id="iab-open1" class="btn btn-warning btn-lg btn-block">iab open1</button>
					</li>
					<li class="row row-table">
						<button id="iab-open2" class="btn btn-warning btn-lg btn-block">iab open2</button>
					</li>
					
					
					<hr/>
					
					<li class="row row-table">
						<button id="resetContent" class="btn btn-warning btn-lg btn-block">reset activeUrl</button>
					</li>
					<li class="row row-table">
						<button id="triggerPIR5" class="btn btn-success btn-lg btn-block">rangeTrigger PRI 5 in</button>
					</li>
					<li class="row row-table">
						<button id="triggerEMWerbeinhalt1" class="btn btn-success btn-lg btn-block">rangeTrigger EM Werbeinhalt1</button>
					</li>
					<li class="row row-table">
						<button id="triggerJSBach" class="btn btn-success btn-lg btn-block">rangeTrigger J. S. Bach</button>
					</li>
	 * */
	
	
	
	
	//browser= window.open(app.view.activeUrl, '_blank','location=yes');
	
	//init app
	
	//bleScanner = $().bleScanner();
	//bleScanner.startScan();
	
	 //document.addEventListener("deviceready", app.initialize, false);
	
	
	//app.scanStatus = 1;
	//app.onScanStatusClick('eventname', 'dasf', 'sdf');
	//$(app.options.eventListener).trigger(app.ble.settings.deviceFoundEvent);
	 //alert(app.featureCheck.ble());
	//dummy beacons
	/*
	var bleScannerObj = {};
	bleScannerObj.devices = {};
*/
	
	/*
	 //same as  d3
	 var device4 = {
				address : 'B0:34:95:46:21:65',
				rssi : '-70',
				minRange : '-95',
				maxRange : '4',
				trigger : '-85',
				triggerTimeStamp : 1212,
				vibrationTriggered : true
			};
	//bleScannerObj.devices[device1.address] = device1;
	//bleScannerObj.devices[device2.address] = device2;
	//bleScannerObj.devices[device3.address] = device3;
	
	onDeviceScanned(device1);
	onDeviceScanned(device2);
	onDeviceScanned(device3);

	console.log(bleScannerObj.devices); 
	
	
	setTimeout(function() {onDeviceScanned(device4); console.log(bleScannerObj.devices);  }, 10000);
	

	
	
		
	function onDeviceScanned(device) {
		
		if (bleScannerObj.devices[device.address] === undefined) {
			// create
			appendDevice(device); 
			// Set timestamp for device (this is used to remove inactive
			// devices).
		} else {
			// update
			console.log('update');
			updateDevice(device); 
		}

	}
	
	function appendDevice(device) {
		device.timeStamp = Date.now();

		// @TODO get this values from B-CMS
		device['minRange'] = -95;
		device['maxRange'] = 4;
		device['possibleRange'] = device.maxRange - device.minRange;
		device['trigger'] = -45;

		//device['triggerTimeStamp'] = 0;
		//device['vibrationTriggered'] = false;

		// Insert the device into table of found devices.
		bleScannerObj.devices[device.address] = device;

	}

	function updateDevice (device) {
	
		$.each(device, function(key, value) {
			bleScannerObj.devices[device.address][key] = value;	
		});
		
	}
*/
	
	
	/*
	var device1 = {
			address : '0C:F3:EE:53:40:65',
			rssi : '-70',
			minRange : '-95',
			maxRange : '4',
			trigger : '-85',
		};
	app.view.updateAvailableContent(device1); */
	
	//$(app.options.eventListener).trigger(app.ble.settings.deviceFoundEvent, device3);
	
	//app.ble.startScan();
	
	//test scanner Panel
	
	app.ui.deviceList.appendDevice(device1);
	app.ui.deviceList.appendDevice(device2);
	app.ui.deviceList.appendDevice(device3);
	
	/*
	//debugger test 
	$().debug('1asf asdf'); 
	$().debug('2asf asdf'); 
	$().debug('3asf asdf'); 
	$().debug('4asf asdf'); 
	$().debug('5asf asdf'); 
	*/
		
	//debug trigger buttons
	
	/*$("#triggerPIR5").on("click", function() {
		// @TODO test param1 and param2
		console.log(app.ble.settings.deviceRangeTriggeredEvent);
		$(document).trigger( app.ble.settings.deviceRangeTriggeredEvent, device1 );
		
	});
	
	$("#triggerEMWerbeinhalt1").on("click", function() {
		// @TODO test param1 and param2
		$(document).trigger( app.ble.settings.deviceRangeTriggeredEvent, device2 );
		
	});
	
	$("#triggerJSBach").on("click", function() {
		// @TODO test param1 and param2
		$(document).trigger( app.ble.settings.deviceRangeTriggeredEvent, device3 );
		
	});*/
	
	
	
	/*====================================================THES CHANGE URL WORKFLOW START====================================================*/
	/*
	app.view.isIabHidden = false;
	var url1 = 'http://bcms.starnberger.at/';
	var url2 = 'http://bcms.starnberger.at/content/how';
	
	$("#resetContent").on("click", function() {
		// @TODO test param1 and param2
		app.view.activeUrl = null;
		
	});
	
	$("#iab-show").on("click", function() {
		console.log('show pressed');
		if(app.view.inAppBrowser != null) {
			app.view.inAppBrowser.show();
		}
	});
	
	$("#iab-close").on("click", function() {
		console.log('close pressed (like the back button on phone)');
		if(app.view.inAppBrowser != null) {
			app.view.inAppBrowser.close();
			app.view.isIabHidden = true;
			
			console.log('user closed iab with back button, same like .close(). that means iab is still in use (!= null)');
		}
	});
	
	$("#iab-open1").on("click", function() {
		console.log('open1 pressed');
		app.view.iabChangeUrl(url1);
	});
	
	$("#iab-open2").on("click", function() {
		console.log('open2 pressed');
		app.view.iabChangeUrl(url2, true);
	});
	
	
	app.view.iabChangeUrl = function(url, openSameUrl) {
		
		
		//try change url
		if (app.view.activeUrl != url) {
			console.log('app.view.activeUrl != url => i try to change url');
			app.view.activeUrl = url;
			
			if(app.view.inAppBrowser != null) {
				console.log('app.view.inAppBrowser != null => iab is in use, so i close it');
				app.view.isIabHidden = true;
				app.view.inAppBrowser.close();
			}
			
			if( app.view.isIabHidden ) {
				console.log('app.view.isIabHidden === true => iab is hidden in background but still exist, so i use .show() to open iab');
				//app.view.inAppBrowser.show(); 
				app.view.inAppBrowser= window.open(app.view.activeUrl, '_blank','location=yes');
			} else {
				app.view.isIabHidden = false;
				console.log('app.view.inAppBrowser == null => iab is null so i can open a new window');
				app.view.inAppBrowser= window.open(app.view.activeUrl, '_blank','location=yes');
			}
			
			
		} 	
		
		//do nothing
		else {
			
			
			 //* i guess this would be dot a good idea to use this else if without openSameUrl param in the app, because it would reopen browser emediately after coles it with back button on phone
			// * terefore we list all opened urls in the app html => availabelContentList
			//
			if( app.view.isIabHidden === true && openSameUrl === true ) {
				var msg = 'app.view.activeUrl == url && app.view.isIabHidden === true && openSameUrl === true'+
						  ' => you want me to reopen current opened url, so i reopen it';
				console.log(msg); 
				app.view.inAppBrowser= window.open(app.view.activeUrl, '_blank','location=yes');
			} else {
			console.log('app.view.activeUrl == url &&  (app.view.isIabHidden != true || openSameUrl != true) => i do nothing when same url is triggered again!');
			}
		}
		
	} ;
	*/
	/*====================================================THES CHANGE URL WORKFLOW END====================================================*/
	
	
	
	
	
	/*
	
	if (app.view.activeUrl != getContentUlr(device)) {
	
		changeReference
		
			app.view.activeUrl = getContentUlr(device);
			
			if(!app.view.inAppBrowser) { 
				app.view.inAppBrowser= window.open(app.view.activeUrl, '_blank','location=yes');
				
				
			} else {
				console.log(app.view.inAppBrowser); 
				//app.view.inAppBrowser.close();
				console.log(app.view.inAppBrowser); 
				//app.view.inAppBrowser = window.open(app.view.activeUrl, '_blank','location=yes'); //@TODO try EnableViewPortScale=yes
			}

			
			function iabClose(browser) {
				browser.close();
				browser.removeEventListener('exit', iabClose);
			 }
			 app.view.inAppBrowser.addEventListener('exit', iabClose(app.view.inAppBrowser));
			   

		
		   
		}
	*/
	
	 /**/
	
	/*
	
	//test injected function
alert('insert done event fired'); 
var mainBackButtonArray = document.getElementsByClassName('main-back-button'); alert(mainBackButtonArray); 
//mainBackButtonArray.addEventListener('click', function() {	alert('.main-back-button clicked'); }); alert(mainBackButtonArray); 
var tmp = null; 
for (var i=0;i<mainBackButtonArray.length;i++){ 
tmp = mainBackButtonArray[i]; alert(tmp); 
tmp.addEventListener ('click', closeDocument, true);
}
function closeDocument() {
	var event = new CustomEvent('test', { 'detail': 'Example of an event' }); 
	document.dispatchEvent(event);
	alert('DF'); 
	} 	

	*/


	
	
	////
	
	//onDeviceReady();
	/*$.get(	"http://bcms.starnberger.at/b-a-i/9D22B2B9-53D0-B2AF-A9B5-581C420F1F59/48", 
			{}, 
			function(content){ 
				//alert("got content!"); 
				$("body").html(content)
			},
			"html"
		);*/
	
	/*
	 * Passing data over events
	 * 
		$( "body" ).on( "custom", function( event, param1, param2 ) {
			alert( param1 + "\n" + param2 );
			});
		$( "body").trigger( "custom", [ "Custom", "Event" ] );
		
	 * */
	/* 
	 * TESTING DECIVE RENDERING
	var device = { 	address:'us:asf:asf:af', 
					rssi:'-70', 
					
					minRange:'-95',
					maxRange:'4',
					
					trigger:'-60',
					};
				
	device['possibleRange'] = device.maxRange - device.minRange;
				
	app.ui.deviceList.appendDevice(device);
	
	
	device['rssi'] = '-10';
	device['trigger'] = '-10';
	
	setTimeout( function()  { app.ui.deviceList.updateDevice(device);  }, 1000 );

	var $currentDevice = $(getDeviceSelector(device));
	debug(getDeviceSelector(device)); 
	debug($currentDevice.size()); 
	setTimeout( function()  { app.ui.deviceList.updateDevice(device);  }, 1000 );
	
	
	var $currentDevice = $(getDeviceSelector(device));
	*/
		//console.log(getDeviceSelector(device)); 
		//console.log($currentDevice.size()); 
	/*
	 		
	 		
	 		
	 		/* device elem test
		'<li>Empty list!</li>'+
			
		'<li id="rer-ttz" class="device">' + 
			'<div class="beacon-name">device.name</div>'+
			'<div class="beacon-uuid">'+
				'<span class="lable">'+'UUID:'+'</span>'+
				'<span class="value">device.address</span>'+
			'</div>'+
			 '<div class="beacon-rssi">'+
			 	'<span class="lable">'+'RSSI:'+'</span>'+
			 	'<span class="value">device.rssi</span>'+
			 '</div>'+
			 '<div class="beacon-trigger">'+
				 '<span class="lable">'+'Trigger:'+'</span>'+
				 '<span class="value">'+'66'+'</span>'+
			 '</div>'+
			 '<div class="trigger-status active"><i class="trigger-status-icon fa fa-dot-circle-o"></i></div>'+
			 
			 '<div class="beacon-bars progress">'+
				'<div class="progress-rssi progress-bar progress-bar-striped " style=" width:75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" role="progressbar">'+
					'<span class="">66</span>'+
				'</div>'+
				'<div class="progress-trigger progress-bar progress-bar-success progress-bar-striped active"    style="width: 45%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" role="progressbar" >'+
					'<span class="">rtrtrtdevice.trigger</span>'+
				'</div>'+
			'</div>'+	
		'</li>'+
		*/ 
	
});