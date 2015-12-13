;(function() {
	'use strict';
	   
	angular
		.module('drupalionicDemo.deviceManagerLogicTest.controller', ['commons.deviceDataManager'])
		.controller('DeviceManagerLogicTestController', DeviceManagerLogicTestController);
		
	DeviceManagerLogicTestController.$inject= ['$scope','DeviceDataManagerServiceConstant', 'DeviceDataManagerService'];
	function DeviceManagerLogicTestController($scope, DeviceDataManagerServiceConstant, DeviceDataManagerService) {

		var dummyBcmsData1 = {
				"userId":"121",
				"iBeaconUuid":"E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				"major":"2",
				"minor":"1",
				"triggerZone":"Intermediate",
				"whitelisted":"1",
				"contentTitle":"771 EM BLE Beacon",
				"contentType":"bild",
				"contentThumbnailUrl":"http:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/bild\/108\/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF"
			},
			dummyBcmsData2 = {
					"userId":"117",
					"iBeaconUuid":"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
					"major":"1",
					"minor":"495",
					"triggerZone":"Intermediate",
					"whitelisted":0,
					"contentTitle":"PLCD",
					"contentType":"bild",
					"contentThumbnailUrl":"http:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/bild\/97\/97plcdplcd.jpg?itok=HP2me718"
				},
			dummyBcmsData3 = {
								"userId":"152",
								"iBeaconUuid":"E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
								"major":"7",
								"minor":"3",
								"triggerZone":"Far",
								"whitelisted":0,
								"contentTitle":"2011 Tesoro",
								"contentType":"link",
								"contentThumbnailUrl":"http:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/atesoro_2011_1381236950129239.jpg?itok=nlWvrojG",
								"thirdPartyWebsite":"http:\/\/esterhazy.at\/de\/weingut\/weine\/1462187\/2011-Tesoro-"
							},
			dummyBcmsData4 = { "userId":"152",
								"iBeaconUuid":"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
								"major":"90",
								"minor":"3373",
								"triggerZone":"Intermediate",
								"whitelisted":0,
								"contentTitle":"Konzert Eszterhazy Palace",
								"contentType":"video",
								"contentThumbnailUrl":"http:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/video\/149\/149konzert-eszterhazy-palacekonzert.png?itok=NQycTW_3"
						},
						
			dummyScanData1 = {
				address: "0E:FA:EF:0C:22:24",
				b0: "02",
				b1: "15",
				bcmsBeaconKey: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE.2.1",
				binValFlags: "04",
				bleFlags: "01",
				calibrationValue: 179,
				firstBlockLenght: "02",
				iBeaconUuid: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				lastScan: 1449917534818,
				major: 2,
				mfId: "4c00",
				mfUuid: "e6c56db5dffb48d2b08840f5a81496ee",
				minor: 1,
				name: "Unknown Device",
				rssi: -11,
				rssiOneMeterDistance: -77,
				scanRecord: "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
				secondBlockIdentifier: "ff",
				secondBlockLenght: "1a"
		},
		dummyScanData2 = {
				address: "0E:FA:EF:0C:22:24",
				b0: "02",
				b1: "15",
				bcmsBeaconKey: "699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.495",
				binValFlags: "04",
				bleFlags: "01",
				calibrationValue: 179,
				firstBlockLenght: "02",
				iBeaconUuid: "699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
				lastScan: 1449917534818,
				major: 1,
				mfId: "4c00",
				mfUuid: "e6c56db5dffb48d2b08840f5a81496ee",
				minor: 495,
				name: "Unknown Device",
				rssi: -22,
				rssiOneMeterDistance: -77,
				scanRecord: "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
				secondBlockIdentifier: "ff",
				secondBlockLenght: "1a",
		},
		dummyScanData3 = {
				address: "0E:FA:EF:0C:22:24",
				b0: "02",
				b1: "15",
				bcmsBeaconKey: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE.7.3",
				binValFlags: "04",
				bleFlags: "01",
				calibrationValue: 179,
				firstBlockLenght: "02",
				iBeaconUuid: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				lastScan: 1449917534818,
				major: 7,
				mfId: "4c00",
				mfUuid: "e6c56db5dffb48d2b08840f5a81496ee",
				minor: 3,
				name: "Unknown Device",
				rssi: -33,
				rssiOneMeterDistance: -77,
				scanRecord: "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
				secondBlockIdentifier: "ff",
				secondBlockLenght: "1a"
		},
		dummyScanData4 = {
				address: "0E:FA:EF:0C:22:24",
				b0: "02",
				b1: "15",
				bcmsBeaconKey: "699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.90.3373",
				binValFlags: "04",
				bleFlags: "01",
				calibrationValue: 179,
				firstBlockLenght: "02",
				iBeaconUuid: "699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
				lastScan: 1449917534818,
				major: 90,
				mfId: "4c00",
				mfUuid: "e6c56db5dffb48d2b08840f5a81496ee",
				minor: 3373,
				name: "Unknown Device",
				rssi: -98,
				rssiOneMeterDistance: -77,
				scanRecord: "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
				secondBlockIdentifier: "ff",
				secondBlockLenght: "1a"
		};
		
		var knownDevicesList = {
				//item with bcmsBeacon data only
					"E6C56DB5-DFFB-48D2-B088-40F5A81496EE.2.1": {
					bcmsBeaconKey: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE.2.1",
					bcmsBeacon : dummyBcmsData1,
					scanData : {}
				},
				
				//item with scanData data only
				"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.495": {
							bcmsBeaconKey: "699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.495",
							bcmsBeacon : {},
							scanData :  angular.merge({}, dummyScanData2)
						},
				//item with scanData data and bcmsData
				"E6C56DB5-DFFB-48D2-B088-40F5A81496EE.7.3": {
							bcmsBeaconKey: "E6C56DB5-DFFB-48D2-B088-40F5A81496EE.7.3",
							bcmsBeacon : dummyBcmsData3,
							scanData : angular.merge({}, dummyScanData3)
						}
		};
				
		
		// jshint validthis: true 
		var vm = this;
		
		
		
		
		console.log('initial knownDevicesList',angular.copy(knownDevicesList)); 
		
		//new apidata as new device__________________________________________________________________________
		//console.log('new apidata as new device__________________________________________________');
		//mapBeaconDataToKnownDevices(dummyBcmsData4, DeviceDataManagerServiceConstant.mapTypeAPIDevice);
		
		
		//new apidata as old device with bcmsData____________________________________________________________
		//console.log('new apidata as old device with bcmsData__________________________________________________');
		/*var updatedDummyBcmsData1 = angular.copy(dummyBcmsData1);
		
		updatedDummyBcmsData1.userId				= "new121";
		updatedDummyBcmsData1.triggerZone			= "Far";
		updatedDummyBcmsData1.whitelisted			= 0;
		updatedDummyBcmsData1.contentTitle			= "new771 EM BLE Beacon";
		updatedDummyBcmsData1.contentType			= "newbild";
		updatedDummyBcmsData1.contentThumbnailUrl	= "newhttp:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/bild\/108\/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF";
		
		mapBeaconDataToKnownDevices(updatedDummyBcmsData1, DeviceDataManagerServiceConstant.mapTypeAPIDevice);
		*/
		
		
		//new apidata as old device with scanData______________________________________________________________
		/*console.log('apidata as old device with scanData__________________________________________________');
		var updatedDummyBcmsData2 = angular.copy(dummyBcmsData2);
		
		updatedDummyBcmsData2.userId				= "2new117";
		updatedDummyBcmsData2.triggerZone			= "Far";
		updatedDummyBcmsData2.whitelisted			= 1;
		updatedDummyBcmsData2.contentTitle			= "2newPLCD";
		updatedDummyBcmsData2.contentType			= "2newbild";
		updatedDummyBcmsData2.contentThumbnailUrl	= "2newhttp:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/bild\/97\/97plcdplcd.jpg?itok=HP2me718";
		
		mapBeaconDataToKnownDevices(updatedDummyBcmsData2, DeviceDataManagerServiceConstant.mapTypeAPIDevice);
		*/
		
		
		
		//new apidata as old device with bcmsData and scanData______________________________________________________________
		/*
		 console.log('new apidata as old device with bcmsData and scanData______________________________________________________________');
		 var updatedDummyBcmsData3 = angular.copy(dummyBcmsData3);
		
		updatedDummyBcmsData3.userId				= "3new4117";
		updatedDummyBcmsData3.triggerZone			= "Near";
		updatedDummyBcmsData3.whitelisted			= 1;
		updatedDummyBcmsData3.contentTitle			= "3newPLCD";
		updatedDummyBcmsData3.contentType			= "3newbild";
		updatedDummyBcmsData3.contentThumbnailUrl	= "3newhttp:\/\/www.starnberger.at\/beaconplayer_analyse\/sites\/default\/files\/styles\/thumblail_cut_100_100\/public\/content\/bild\/97\/97plcdplcd.jpg?itok=HP2me718";
		
		mapBeaconDataToKnownDevices(updatedDummyBcmsData3, DeviceDataManagerServiceConstant.mapTypeAPIDevice);
		*/
		
		//new scandata as new device______________________________________________________________
		console.log('new scandata as new device______________________________________________________________'); 
		//DeviceDataManagerService.mapBeaconDataToKnownDevices(dummyScanData4, DeviceDataManagerServiceConstant.mapTypeBleDevice);
		
		//new scandata as old device with bcmsData______________________________________________________________
		/*console.log('new scandata as old device with bcmsData__________________________________________________');
		var updatedDummyScanData1 = angular.copy(dummyScanData1);
		
		updatedDummyScanData1.address = "0E:FA:EF:0C:22:24";
		updatedDummyScanData1.b0 = "02";
		updatedDummyScanData1.b1 = "15";
		updatedDummyScanData1.binValFlags = "04";
		updatedDummyScanData1.bleFlags = "01";
		updatedDummyScanData1.calibrationValue = 179;
		updatedDummyScanData1.firstBlockLenght = "02";
		updatedDummyScanData1.lastScan = 1449917534818;

		updatedDummyScanData1.name = "Unknown Device";
		updatedDummyScanData1.rssi = -22;
		updatedDummyScanData1.rssiOneMeterDistance = -77;
		updatedDummyScanData1.scanRecord = "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
		updatedDummyScanData1.secondBlockIdentifier = "ff";
		updatedDummyScanData1.secondBlockLenght = "1a";
		
		mapBeaconDataToKnownDevices(updatedDummyScanData1, DeviceDataManagerServiceConstant.mapTypeBleDevice);*/
		
		/*
		//new scandata as old device with scanData______________________________________________________________
			 
		console.log('new scandata as old device with scanData__________________________________________________');
		var updatedDummyScanData2 = angular.copy(dummyScanData2);
		
		
		updatedDummyScanData2.address = "0E:FA:EF:0C:22:24";
		updatedDummyScanData2.b0 = "02";
		updatedDummyScanData2.b1 = "15";
		updatedDummyScanData2.binValFlags = "04";
		updatedDummyScanData2.bleFlags = "01";
		updatedDummyScanData2.calibrationValue = 179;
		updatedDummyScanData2.firstBlockLenght = "02";
		updatedDummyScanData2.lastScan = 1449917534818;
		updatedDummyScanData2.mfUuid = "e6c56db5dffb48d2b08840f5a81496ee";
		updatedDummyScanData2.name = "Unknown Device";
		updatedDummyScanData2.rssi = -99;
		updatedDummyScanData2.rssiOneMeterDistance = -77;
		updatedDummyScanData2.scanRecord = "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
		updatedDummyScanData2.secondBlockIdentifier = "ff";
		updatedDummyScanData2.secondBlockLenght = "1a";
		updatedDummyScanData2.lastTriggerArea = "???";
		 
		mapBeaconDataToKnownDevices(updatedDummyScanData2, DeviceDataManagerServiceConstant.mapTypeBleDevice);
	*/
		
		//new scandata as old device with bcmsData and scanData______________________________________________________________
		/*
		console.log('new scandata as old device with bcmsData and scanData______________________________________________________________');
		var updatedDummyScanData3 = angular.copy(dummyScanData3);
		
		updatedDummyScanData3.address = "0E:FA:EF:0C:22:24";
		updatedDummyScanData3.b0 = "02";
		updatedDummyScanData3.b1 = "15";
		updatedDummyScanData3.binValFlags = "04";
		updatedDummyScanData3.bleFlags = "01";
		updatedDummyScanData3.calibrationValue = 179;
		updatedDummyScanData3.firstBlockLenght = "02";
		updatedDummyScanData3.lastScan = 1449917534818;
		updatedDummyScanData3.mfUuid = "e6c56db5dffb48d2b08840f5a81496ee";
		updatedDummyScanData3.name = "Unknown Device";
		updatedDummyScanData3.rssi = -99;
		updatedDummyScanData3.rssiOneMeterDistance = -77;
		updatedDummyScanData3.scanRecord = "AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
		updatedDummyScanData3.secondBlockIdentifier = "ff";
		updatedDummyScanData3.secondBlockLenght = "1a";	
		updatedDummyScanData3.lastTriggerArea = "???";	
		
		mapBeaconDataToKnownDevices(updatedDummyScanData3, DeviceDataManagerServiceConstant.mapTypeBleDevice);
		*/
		
		
			    
		///////////////

	    
	};
	
	
})();