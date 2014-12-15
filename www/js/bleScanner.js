/*
 * BLE Scanner
 * =============================================================
 */

// scanner obj
var bleScannerObj = {};

// default settings:
var bSdefaults = {
	// Events
	scanErrorEvent : "ScanError",
	deviceFoundEvent : "DeviceFound",
	deviceRangeTriggeredEvent : "DeviceRangeTriggered",
	// Options
	scannerSelector : "#ble-scanner",

	scanStatus : false,
	onDeviceScannedFunction : null,// function ($elem) {return $elem.attrs(); },
	onRangeTriggerFunction : null, /* function () { 
								navigator.vibrate(0);
								navigator.vibrate([	100, 500, 100 ]); 
							  },*/			  
};

//bleScannerObj.settings = $.extend( {}, defaults, options );
bleScannerObj.settings = bSdefaults;

// Device list.
bleScannerObj.devices = {};

// Stop scanning for devices.
bleScannerObj.stopScan = function() {
	//$().debug('stopScan', {});

	evothings.ble.stopScan();
	bleScannerObj.settings.scanStatus = false;
	//$().debug('stopScan end');
};

// Start the scan. Call the callback function when a device is found.
// Format:
// callbackFun(deviceInfo, errorCode)
// deviceInfo: address, rssi, name
// errorCode: String
bleScannerObj.startScan = function() {
	//$().debug('startScan');
	// Stop scanning
	bleScannerObj.stopScan();

	//var callbackFun = bleScannerObj.onDeviceScanned || bleScannerObj.settings.onDeviceScannedFunction;
	
	evothings.ble.startScan(function(device) {
		//$().debug('found device');
		// @TODO check if this filter is always good
		// Report success. Sometimes an RSSI of +127 is reported.
		// We filter out these values here.
		if (device.rssi <= 0) {
			//$().debug('found device');
			bleScannerObj.onDeviceScanned(device, null);
		}
	}, function(errorCode) {
		// Report error.
		//$().debug('Error');
		bleScannerObj.onDeviceScanned(null, errorCode);
	});

	bleScannerObj.settings.scanStatus = true;
	//$().debug('startScan end');
};


//@TODO write createDevice updateDevice and removeDevice functions

// Called when a device is scanned.
// Fires 
bleScannerObj.onDeviceScanned = function(device, errorCode) {
	//$().debug('onDeviceScanned');
	//$().debug(device, {	type : 'infoCallout',format : 'json'});

	if (device) {
		// Set timestamp for last scann.
		device.timeStamp = Date.now();
		
		if(bleScannerObj.devices[device.address] === undefined ) {
			//append new device
			
			bleScannerObj.appendDevice(device); 
		} else {
			//update
			bleScannerObj.updateDevice(device); 
			
			
			
		}
		
		// trigger device found correctly
		$(bleScannerObj.settings.scannerSelector).trigger(bleScannerObj.settings.deviceFoundEvent, device);
		
		//$().debug(device, {format:'json'}); 
		
		// trigger rangeTriggerEvent
		if (device.rssi >= device.trigger) {
				
			device['triggerTimeStamp'] = Date.now();
			$(bleScannerObj.settings.scannerSelector).trigger(bleScannerObj.settings.deviceRangeTriggeredEvent, device);
			//$().debug('deviceRangeTriggeredEvent fired'); 
		} 
		
		else {
			//$().debug('not in range');
		}
		
	}
	// display errors
	else if (errorCode) {
		$(settings.scannerSelector).trigger(settings.scanErrorEvent, errorCode);
		//$().debug('Scan Error: ' + errorCode, { type : 'errorCallout' });
	}

};

bleScannerObj.appendDevice = function(device) {
	
	// @TODO get this values from B-CMS
	device['minRange'] = -95;
	device['maxRange'] = 4;
	device['possibleRange'] = device.maxRange - device.minRange;
	device['trigger'] = -65;

	//device['triggerTimeStamp'] = 0;
	//device['vibrationTriggered'] = false;

	// Insert the device into table of found devices.
	bleScannerObj.devices[device.address] = device;
	//$().debug('appended');
}

bleScannerObj.updateDevice = function(device) {

	/*$.each(device, function(key, value) {
		bleScannerObj.devices[device.address][key] = value;	
	});*/
	
	device['minRange'] = -95;
	device['maxRange'] = 4;
	device['possibleRange'] = device.maxRange - device.minRange;
	device['trigger'] = -65;
	device['triggerTimeStamp'] = bleScannerObj.devices[device.address]['triggerTimeStamp'];
	device['vibrationTriggered'] = bleScannerObj.devices[device.address]['vibrationTriggered'];
	
	bleScannerObj.devices[device.address] = device;
}
