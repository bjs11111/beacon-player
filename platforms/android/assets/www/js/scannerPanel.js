/*
 * BLE Scanner Panel
 * =============================================================
 */
// scanner obj
var bleScannerPanelObj = {};

// default settings:
var sPdefaults = {
	// scanner Panel
	scanPanelWrapperSelector 	: "#ble-scanner-panel",
	scanStatusSelector 			: "#scan-status",
	deviceCountSelector 		: "#device-count",
	devicesListSelector 		: "#devices-inrange",
	deviceSelectorPrefix 		: "device",

	classNameActive 			: 'active',
	
	statusScanActive 			: "acitve",
	statusScanPaused 			: "paused",
	
	statusScanActiveText 		: '<i class="fa fa-spinner fa-spin"></i>',//"Scanning",
	statusScanPausedText 		: '<i class="fa fa-pause"></i>',//"Paused",

	scanStatusClickEvent 		: "ScanStatusClick",
	
	msAfterScannedDeviceIsOld : 5000,
};

//bleScannerObj.settings = $.extend( {}, defaults, options );
bleScannerPanelObj.settings = sPdefaults;

//Timer that updates the list and removes inactive devices
//in case no devices are found by scan.
bleScannerPanelObj.updateTimer = null;

//deviceList of panel
bleScannerPanelObj.deviceList = {};




// init ScanStatus
bleScannerPanelObj.init = function() {
	//$().debug('ui init start'); 
	$scanStatus = $(bleScannerPanelObj.settings.scanStatusSelector);
	//$().debug($scanStatus); 
	if ($scanStatus.size() == 0) {
		// draw ScanStatus
		bleScannerPanelObj.redrawScannerPanel();
		
		//$().debug($scanStatus); 
		// rediect $scanStatus click event
		$scanStatus.on("click", function() {
			// @TODO test param1 and param2
			//$().debug('scanStatus Clicked'); 
			$scanStatus.trigger(bleScannerPanelObj.settings.scanStatusClickEvent, $scanStatus);
		});
	}
	
	//$().debug('ui init end'); 
};

//Display the scan status.
bleScannerPanelObj.redrawScannerPanel = function() {
	//$().debug('redrawScannerPanel start'); 
	var $scanPanelWrapper = $(bleScannerPanelObj.settings.scanPanelWrapperSelector);
	if ($scanPanelWrapper.find(bleScannerPanelObj.settings.scanStatusSelector).size() != 1) {
		$scanPanelWrapper.append('<div id="scan-status-panel" class="btn-group ">'+
									'<span id="scan-status" data-scan-status="'
											+ bleScannerPanelObj.settings.statusScanPaused
											+ '" class="btn btn-lg btn-default">'
											+ '<span class="status-text"></span>'
											+ ' '
											+ '<span class="status-icon"></span>'
											+ '</span>'
											+
					
											'<span type="button" id="device-count" class="btn btn-lg btn-default" data-device-count="0">'
											+ '<span class="lable">'
											+ 'Devices:'
											+ '</span>'
											+ '<span class="value">'
											+ '<i class="fa fa-pause"></i>'
											+ '</span>'
											+
					
											'</span>'
											+ '<span type="button" class="btn btn-lg btn-default dropdown-toggle" data-toggle="dropdown">'
											+ 'Devices' + ' ' + '<span class="caret"></span>'
											+ '</span>' +
					
											'<ul id="'
											+ bleScannerPanelObj.settings.devicesListSelector.substring(1)
											+ '" class="dropdown-menu">' +
					
											'</ul>' +
											
											'</div>'
				);
		}

	bleScannerPanelObj.updateScanStatus();

};

//Called when ScanStatusBar is clicked.
bleScannerPanelObj.onScanStatusClick = function(event, bjo, data) {
	//$().debug('onScanStatusClick start'); 
	//$().debug('scanSataus= ' + app.ble.settings.scanStatus); 
	$scanStatus = $(bleScannerPanelObj.settings.scanStatusSelector);
	
	if (app.ble.settings.scanStatus == true) {
	//if (currentState == bleScannerPanelObj.settings.statusScanActive) {
		app.ble.stopScan();
		
		bleScannerPanelObj.setDeviceCountPaused();
		$scanStatus.attr('data-scan-status', bleScannerPanelObj.settings.statusScanPaused);

		bleScannerPanelObj.updateDeviceList();
		clearInterval(bleScannerPanelObj.updateTimer);

	//} else if (currentState == bleScannerPanelObj.settings.statusScanPaused) {
	} else {
		app.ble.startScan();
		
		bleScannerPanelObj.setDeviceCountActive();
		$scanStatus.attr('data-scan-status', bleScannerPanelObj.settings.statusScanActive);
		bleScannerPanelObj.updateTimer = setInterval(bleScannerPanelObj.updateDeviceList, bleScannerPanelObj.settings.msAfterScannedDeviceIsOld);
	}
	//$().debug('onScanStatusClick end'); 
	bleScannerPanelObj.updateScanStatus();
};

bleScannerPanelObj.updateDeviceCount = function() {

	$deviceCount = $(bleScannerPanelObj.settings.deviceCountSelector);

	var currentCount = 0;
	$.each(app.ble.devices, function(key, device) {
		if (device.timeStamp + bleScannerPanelObj.settings.msAfterScannedDeviceIsOld > Date.now()) {
			currentCount++;
		}
	});

	if (currentCount >= 1) {
		$deviceCount.find('.value').html(currentCount);
		$deviceCount.attr('data-device-count', currentCount);
	} else {
		$deviceCount.find('.value').html(0);
		$deviceCount.attr('data-device-count', 0);
	}
};

bleScannerPanelObj.updateScanStatus = function() {
	
	$scanStatus = $(bleScannerPanelObj.settings.scanStatusSelector);
	var currentState = $scanStatus.attr('data-scan-status');
	
	if (currentState == bleScannerPanelObj.settings.statusScanActive) {
		bleScannerPanelObj.setScanStatusActive();
	} else if (currentState == bleScannerPanelObj.settings.statusScanPaused) {
		bleScannerPanelObj.setScanStatusPaused();
	}
};

//Display the device list.
bleScannerPanelObj.updateDeviceList = function() {

	// Clear device list.
	// $(bleScannerPanelObj.settings.devicesListSelector).empty();
	var timeNow = Date.now();
	$.each(
		app.ble.devices,
		function(key, device) {

			var $currentDevice = $(getDeviceSelector(device));

			// Only show devices that are updated during the last 5
			// seconds else remove it
			if (device.timeStamp + bleScannerPanelObj.settings.msAfterScannedDeviceIsOld > timeNow) {

				if ($currentDevice.size() < 1) {
					bleScannerPanelObj.deviceList.appendDevice(device);
				} else {
					bleScannerPanelObj.deviceList.updateDevice(device);
				}

			} else {
				$currentDevice.animate(	{ height : '0',	opacity : 0 , 'margin-top':'0px','margin-bottom':'0px', 'padding-top':'0px','padding-bottom':'0px' }, 
										1000, function() { $(this).remove(); } 
				);
			}

		});

};

// Display a scan status message
bleScannerPanelObj.setScanStatusText = function(message) {
	$(bleScannerPanelObj.settings.scanStatusSelector + ' .status-text').html(message);
};

// set the scan status on acticv
bleScannerPanelObj.setScanStatusActive = function() {
	// console.log('setScanStatusActive');
	$scanStatus = $(bleScannerPanelObj.settings.scanStatusSelector);
	$scanStatus.attr('data-scan-status', bleScannerPanelObj.settings.statusScanActive);

	$scanStatus.removeClass("btn-default");
	$scanStatus.addClass("btn-success");

	bleScannerPanelObj.setScanStatusText(bleScannerPanelObj.settings.statusScanActiveText); 
	bleScannerPanelObj.setScanStatusIcon(bleScannerPanelObj.settings.statusScanActive);
};

// set the scan status on paused
bleScannerPanelObj.setScanStatusPaused = function() {
	$scanStatus = $(bleScannerPanelObj.settings.scanStatusSelector);

	$scanStatus.attr('data-scan-status', bleScannerPanelObj.settings.statusScanPaused);

	$scanStatus.removeClass("btn-success");
	$scanStatus.addClass("btn-default");

	bleScannerPanelObj.setScanStatusText(bleScannerPanelObj.settings.statusScanPausedText); 
	bleScannerPanelObj.setScanStatusIcon(bleScannerPanelObj.settings.statusScanPaused);
};

// set the scan status on paused
bleScannerPanelObj.setDeviceCountPaused = function() {
	$deviceCount = $(bleScannerPanelObj.settings.deviceCountSelector);
	icon = drawIcon('fa', 'pause', {
		"classNames" : ""
	});
	$deviceCount.find('.value').html(icon);
};

// set the scan status on active
bleScannerPanelObj.setDeviceCountActive = function() {
	$deviceCount = $(bleScannerPanelObj.settings.deviceCountSelector);
	icon = drawIcon('fa', 'spinner', {
		"classNames" : "fa-spin"
	});
	$deviceCount.find('.value').html(icon);
};

// Display a scan status icon
bleScannerPanelObj.setScanStatusIcon = function(scanState) {
	var icon = '';
	if (scanState == bleScannerPanelObj.settings.statusScanActive) {
		icon = drawIcon('fa', 'spinner', {
			"classNames" : "fa-spin"
		});
	} else {
		icon = drawIcon('fa', 'spinner', {
			"classNames" : ""
		});
	}
	$(bleScannerPanelObj.settings.scanStatusSelector + ' .status-icon').html(icon);
};


//Display the device list.

bleScannerPanelObj.updateDeviceList = function() {
	//$().debug('in devidelist start');
	//$().debug(app.ble.devices, { format:'json'} );

	
	// Clear device list.
	// $(bleScannerPanelObj.settings.devicesListSelector).empty();
	var timeNow = Date.now();

	var i = 1;
	$.each( app.ble.devices, function(key, device) {
		//$().debug(device, { format:'json'} );

		var $currentDevice = $(getDeviceSelector(device));
		
		//$().debug($currentDevice.size());
		// Only show devices that are updated during the last 5
		// seconds.
		
		//$().debug( (device.timeStamp + bleScannerPanelObj.settings.msAfterScannedDeviceIsOld) +' '+ timeNow);
		if (device.timeStamp + bleScannerPanelObj.settings.msAfterScannedDeviceIsOld > timeNow) {
			//$().debug('device is not old'); 
			
			if ($currentDevice.size() < 1) {
				//$().debug('append device to list'); 
				bleScannerPanelObj.deviceList.appendDevice(device);
			} else {
				//$().debug('update device in list'); 
				bleScannerPanelObj.deviceList.updateDevice(device);
			}
		//remove device from list
		} else {
			//$().debug('remove device forl device list'); 
			$currentDevice.animate({
				height : '0px',
				opacity : 0
			}, 1000, function() {
				$(this).remove();
			});
		}

	});
	//$().debug('in devidelist end');
};

/*
* Helper functions 
* ==============================================================
*/


bleScannerPanelObj.deviceList.appendDevice = function(device) {

	// Compute a display percent width value from signal strength and trigger
	// value.
	var rssiWidth = getRssiWidth(device);
	var triggerWidth = getTriggerWidth(device);
	// rigger is activ when rssi >= trigger
	var triggerStatusClass = (getTriggerStatus(device)) ? bleScannerPanelObj.settings.classNameActive
			: '';

	var renderedDevice = $('<li id="'
			+ getDeviceSelector(device).substring(1)
			+ '" class="device">'
			+

			'<div class="beacon-name">'
			+ device.name
			+ '</div>'
			+

			'<div class="beacon-uuid">'
			+ '<span class="lable">'
			+ 'UUID:'
			+ '</span>'
			+ '<span class="value">'
			+ device.address
			+ '</span>'
			+ '</div>'
			+

			'<div class="beacon-rssi">'
			+ '<span class="lable">'
			+ 'RSSI:'
			+ '</span>'
			+ '<span class="value">'
			+ device.rssi
			+ '</span>'
			+ '</div>'
			+

			'<div class="beacon-trigger">'
			+ '<span class="lable">'
			+ 'Trigger:'
			+ '</span>'
			+ '<span class="value">'
			+ device.trigger
			+ '</span>'
			+ '<div class="trigger-status '
			+ triggerStatusClass
			+ '">&nbsp;</div>'
			+ '</div>'
			+

			'<div class="beacon-bars progress">'+

			'<div class="progress-rssi progress-bar progress-bar-striped active" style="width:' + rssiWidth + '%;" aria-valuenow="'
			+ rssiWidth
			+ '" aria-valuemin="0" aria-valuemax="100" role="progressbar">'
			+ '<span class="value">' + device.rssi + '</span>' + '</div>' +

			'<div class="progress-trigger progress-bar "    style="width: '
			+ triggerWidth
			+ '%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'
			+ triggerWidth + '" role="progressbar" >' + '<span class="value">'
			+ device.trigger + '</span>' + '</div>' +

			'</div>' +

			'</li>');
	// append rendered device
	$(bleScannerPanelObj.settings.devicesListSelector).append(renderedDevice);
};

bleScannerPanelObj.deviceList.updateDevice = function(device) {
	// prevent wrong params
	var $currentDevice = $(getDeviceSelector(device));

	var $triggerStatus = $currentDevice.find('.beacon-trigger .trigger-status');
	var $progressRssi = $currentDevice.find('.progress-rssi');
	var $progressTrigger = $currentDevice.find('.progress-trigger');

	var rssiWidth = getRssiWidth(device);
	var triggerWidth = getTriggerWidth(device);

	$currentDevice.find('.beacon-name').html(device.name);
	$currentDevice.find('.beacon-uuid .value').html(device.address);
	$currentDevice.find('.beacon-rssi .value').html(device.rssi);
	$currentDevice.find('.beacon-trigger .value').html(device.trigger);

	if (getTriggerStatus(device)) {
		if (!$triggerStatus.hasClass(bleScannerPanelObj.settings.classNameActive)) {
			$triggerStatus.addClass(bleScannerPanelObj.settings.classNameActive);
		}
	} else {
		$triggerStatus.removeClass(bleScannerPanelObj.settings.classNameActive);
	}

	$progressRssi.css('width', rssiWidth + '%');

	$progressRssi.attr('aria-valuenow', rssiWidth);
	$progressRssi.find('.value').html(device.rssi);

	$progressTrigger.css('width', triggerWidth + '%');
	$progressTrigger.attr('aria-valuenow', triggerWidth);
	$progressTrigger.find('.value').html(device.trigger);
	/**/
}

function getDeviceSelector(device) {
	// @TODO prevent wrong params
	return '#' 	+ bleScannerPanelObj.settings.deviceSelectorPrefix+'-'+ device.address.split(':').join('-');
}

function getRssiWidth(device) {
	// @TODO prevent wrong params
	var val = (device.rssi - device.minRange) / (device.possibleRange / 100);
	return val.toFixed(0);
}

function getTriggerWidth(device) {
	// @TODO prevent wrong params
	var val = (device.trigger - device.minRange) / (device.possibleRange / 100);
	return val.toFixed(0);
}

function getTriggerStatus(device) {
	// @TODO prevent wrong params
	return (device.rssi >= device.trigger);
}

function drawIcon(iconSetName, iconName, attribs) {
	// @TODO prevent from wrong input!!!!
	var tag = 'span';
	classNames = attribs.classNames;

	if (iconSetName == "fa") {
		tag = "i";
		classNames += ' ' + iconSetName + ' ' + iconSetName + '-' + iconName;
		return $('<' + tag + ' class="' + classNames + '"></' + tag + '>');
	}

};
