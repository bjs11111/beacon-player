//Application object.
var app = {};

// App constants
app.aDefaults = {
	// view
	contentListSelector : '#beacon-contents',
	msAfterAvailableContentIsOld : 1000 * 60,
	contentSelectorPrefix : "content",
	contentProvider : 'http://www.starnberger.at/em-sales-tool/',
	contentPath : 'b-i/',
	requestParams : '?ajax=1',
	onContentIsOldFunction :  function() {	this.animate( { height : '0',	opacity : 0 , 'margin-top':'0px','margin-bottom':'0px', 'padding-top':'0px','padding-bottom':'0px' }, 1000, function() { $(this).remove(); });	},
};

//bleScannerObj.settings = $.extend( {}, defaults, settings );
app.settings = app.aDefaults;

app.diagnostic = null;

app.ble = null;

app.ui = null;

// Init function
app.initialize = function() {
	
	
	//@TODO!!!!!!!
	//if ( !app.featureCheck.ble() ) { alert("Please turn on Bluetooth LE and try again");  } 
	//else { alert("Bluetooth LE activated!"); }
		
	
	app.initBle()
	app.initUI(); 
	

	
//	$('.content').on('click', app.onContentClick());
	
	// reste deviceRangeTriggeredEvent listener
	$(document).unbind(app.ble.settings.deviceRangeTriggeredEvent);
	$(document).on(app.ble.settings.deviceRangeTriggeredEvent, app.onDeviceRangeTriggered);
	//
	
	
};

/*
//redirect click 
app.onContentClick = function(e) {
	e.preventDefault();
	console.log(e.target); 
}*/

app.initBle = function () {
	//connect bleScanner
	app.ble = bleScannerObj; 

	//reste deviceFoundeEvent  listener
	$(document).unbind(app.ble.settings.deviceFoundEvent);
	$(document).on(app.ble.settings.deviceFoundEvent, app.onDeviceFound);
	
	//start scanning on initialisation
	//app.ble.startScan();
	
	
}


app.initUI = function() {
	//connect bleScanner
	app.ui = bleScannerPanelObj; 
	app.ui.init();
	
	app.onDeviceFound = function(device) {
		// Display device in scanner panel.
		app.ui.updateDeviceList();
		// Display devices count in scanner panel.
		app.ui.updateDeviceCount();
		
	};
	
	//reste scanStatusClickEvent listener
	$(document).unbind(app.ui.settings.scanStatusClickEvent);
	$(document).on(app.ui.settings.scanStatusClickEvent, app.ui.onScanStatusClick);
	
	$scanStatus = $(app.ui.settings.scanStatusSelector);
	$scanStatus.trigger(app.ui.settings.scanStatusClickEvent, $scanStatus);
	//.onScanStatusClick
}




//main event callbacks
app.onDeviceRangeTriggered = function(event, device, data) {
	//$().debug('onDeviceRangeTriggered'); 

	//restrict to our three beacons
	//if(app.view.contentMap[device.address] != null) {
		app.view.contentView.appendContent(device);
		app.vibrateForNewContent(device); 
		app.view.changeIabUrl(getContentUlr(device));
	//}
}



/*
 * Content View ================================================================
 */
// view methods for content
app.view = {}

//@TODO rename to actoceUrl
app.view.activeUrl = null;
app.view.inAppBrowser = null;
app.view.availableContent = {};
app.view.isIabHidden = false;

// name it app.cache and store all cached values in it
app.view.contentMap = {	};
/*	
 * '0C:F3:EE:53:3B:69' : app.settings.contentProvider+app.settings.contentPath+'E6C56DB5DFFB48D2B060D0F5A71496E1/45',
	'0C:F3:EE:53:23:68' : app.settings.contentProvider+app.settings.contentPath+'E6C56DB5DFFB48D2B060D0F5A71496E2/45',
	'0C:F3:EE:53:25:6D' : app.settings.contentProvider+app.settings.contentPath+'E6C56DB5DFFB48D2B060D0F5A71496E3/45'
}*/

function getContentUlr(device) {
	var iBeaconUuid_major_minor = device.formatedUuid + '.'  + device.major + '.' + device.minor ,
		cmsPath = app.settings.contentProvider + app.settings.contentPath;
		//if(app.view.contentMap[iBeaconUuid_major_minor]) {
		return cmsPath + iBeaconUuid_major_minor + app.settings.requestParams;
	//} else {
	//	return app.settings.contentProvider;
	//}
}

/*
app.view.changeIabUrl = function(beaconUrl, openSameUrl) {

	var canOpenNew=true;

	if (app.view.activeUrl != beaconUrl && canOpenNew==true) {
		// iab already open
		if (app.view.inAppBrowser !== null) {
			app.view.inAppBrowser.close();
		}
		// iab is closed => open again
		canOpenNew=false;
		setTimeout(function(){
			app.view.inAppBrowser = window.open(beaconUrl, '_blank','location=no');
			setTimeout(function(){canOpenNew=true;}, 3000);
		}, 1000);
				
		
		app.view.activeUrl = beaconUrl;
} */
	
	
	
	
	
app.view.changeIabUrl = function(beaconUrl, openSameUrl) {
	
	var tmp = null;
	
	if (app.view.activeUrl != beaconUrl || tmp ) {
		tmp= false;
		
		//iab already open
		if(app.view.inAppBrowser !== null) {
			app.view.inAppBrowser.close();
		} 
		//iab closed => open again
		else {
				app.view.inAppBrowser = window.open(beaconUrl, '_blank','location=no');
				app.view.inAppBrowser.addEventListener(	"exit", 
														function(beaconUrl) { 
															app.view.inAppBrowser.removeEventListener('exit', function(){});
															app.view.inAppBrowser = null;
															tmp = true;
														},
														true
				);
				app.view.activeUrl = beaconUrl;
		}
	} 
	/*
	*/

	
}



/*app.view._changeIabUrl = function(url, openSameUrl) {
	
	//try change url
	if (app.view.activeUrl != url) {
		
		//console.log('app.view.activeUrl != url => i try to change url');
		app.view.activeUrl = url;
		
		if(app.view.inAppBrowser !== null) {
			
			//console.log('app.view.inAppBrowser != null => iab is in use, so i close it');
			app.view.inAppBrowser.close();
		}
	
		//console.log('app.view.inAppBrowser == null => iab is null so i can open a new window');
		app.view.setIabUrl(app.view.activeUrl);

	} 	
	//or
	else {
		//
		// reopen ame url again
		// i guess this would be dot a good idea to use this if without openSameUrl param, because it would reopen browser immediately after close it with back button on phone
		// therefore we list all recently opened url's in the app html => availabelContentList. and on klick fire app.view.iabChangeUr() with the sameUrl param on true
		//
		if( openSameUrl === true ) {
			//var msg = 'app.view.activeUrl == url && app.view.isIabHidden === true && openSameUrl === true'+
			//		  ' => you want me to reopen current opened url, so i reopen it';
			//console.log(msg); 
			
			app.view.setIabUrl(app.view.activeUrl); 
		} 
		//do nothing 
		else {
			//console.log('app.view.activeUrl == url &&  (app.view.isIabHidden != true || openSameUrl != true) => i do nothing when same url is triggered again!');
		}
	}
	
};
*/
app.view.setIabUrl = function(url) {
	app.view.inAppBrowser = window.open(app.view.activeUrl, '_blank','location=no');
	//navigator.app.loadUrl(url, { openExternal:true });
}

app.view.contentView = {};

app.view.contentView.removeContentCallback = function() {	
	this.animate( {height:'0px',opacity:0}, 1000, function() { $(this).remove(); });	
}

app.view.contentView.appendContent = function(device) {
	//dont append if content already on screen
	if ($(getContentSelector(device)).size() < 1) {
	
	$(	'<li id="' + getContentSelector(device).substring(1)+ '" class="content">' + 
			'<a class="content-link btn-link" href="' + getContentUlr(device)	+ '" class="content-link">' + device.address + '</a>' + 
		'</li>' ).prependTo( app.settings.contentListSelector)
				.timeout( app.settings.msAfterAvailableContentIsOld, app.view.contentView.removeContentCallback)
				 .on('click',function( event ) {
				
						app.view.setIabUrl( getContentUlr(device));
						event.preventDefault();
						event.stopPropagation(); 
						});
	}
};

function getContentSelector(device) {
	// @TODO prevent wrong params
	//if(device) { return false; } 
	
	return '#' + app.settings.contentSelectorPrefix+ '-' + device.address.split('.').join('-');
}

app.view.contentView.updateContent = function(device) {
	// not needed => content is "persistent"
	return;
}


// Called when device is ready
app.vibrateForNewContent = function (device){
	//var timeNow = Date.now();
	if(device.vibrationTriggered !== true) {
			app.resetVibrationTrigger(app.ble.devices); 
		
			device['vibrationTriggered'] = true;
			
			navigator.vibrate(0);
			navigator.vibrate([	100, 100, 100 ]);	
	} 
	
};

app.resetVibrationTrigger =  function ( devices ) {
	$.each(	devices, function(deviceAddress, device) {
		devices[deviceAddress]['vibrationTriggered'] = false;
	});
	
};
