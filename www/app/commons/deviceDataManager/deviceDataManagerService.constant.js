;(function() {
    'use strict';

    /**
	 *  Constants for BleDeviceService 
	 *  
	 *  NOTE: if you want to change this constant do this in your app.js config section
	**/
    
    var _triggerAreas 	= {
			positive 		: 'Positive', 
			negative 		: 'Negative', 
			outOfRange 		: 'OutOfRange'
		},
		_triggerZones 	= {
			//Notice Name is same as in bcmsBeaconData
			noServerConfig  : {
							name 					: 'NoServerConfig',
							entryThresholdOffset 	: 10,
							exitThresholdOffset 	: -10
			},
			near 			: { 
							name 					: 'Near',
							entryThresholdOffset 	: 20,
							exitThresholdOffset 	: 10
						  },
			intermediate 	: { 
							name 					: 'Intermediate',
							entryThresholdOffset 	: 10,
							exitThresholdOffset 	: -10
						  },
			far 			: { 
							name 					: 'Far',
							entryThresholdOffset 	: -10,
							exitThresholdOffset 	: -40
						  },
		};
    
    //setup constant
    var	deviceDataManagerServiceConstant =  {
		//default data
		defaultData : {
		scanData 	: {
				alreadyTriggered 	: false,
				lastTriggerArea 	: _triggerAreas.outOfRange,
				actualTriggerArea 	: _triggerAreas.outOfRange,
				lastRssiValue		: -100,
				rssi				: -100,
				lastScan			: 0,
		},
		bcmsBeacon : {},
		},
		
		mapTypeBleDevice	: 'scanData',
		mapTypeAPIDevice	: 'bcmsBeacon',
		//@TODO replace all bcmsBeacon strings with this constant
		bcmsBeaconDataKey	: 'bcmsBeacon',
		//@TODO replace all scanData strings with this constant
		scanDataKey	: 'scanData',
		
		triggerAreas : _triggerAreas,
		triggerZones: _triggerZones,
	};
    
  	/**
	 * deviceDataManager constant
	**/
	angular
	    .module('commons.deviceDataManagerService.constant', [])
	    .constant("DeviceDataManagerServiceConstant", deviceDataManagerServiceConstant);

})();