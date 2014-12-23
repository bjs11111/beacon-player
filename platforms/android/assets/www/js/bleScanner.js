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
			//$().debug();
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
		var sr = base64DecToArr(device.scanRecord);
		var str = Array.prototype.map.call(sr, function(n) {
			 var s = n.toString(16);
			 if(s.length == 1) {
			 s = '0'+s;
			 }
			 return s;
		}).join('');
		
		
		/**/
		
		//This sequence says the first block of ad data is two octets long 
		device.firstBlockLenght = str.substr(0,2);
		//This says the advertising octet(s) following are Bluetooth flags 
		device.bleFlags = str.substr(2,2);
		//This is the binary value derived when certain of those flags are set. 
		device.binValFlags = str.substr(4,2);
		//This sequence says the second block of ad data is 26 octets long 
		device.secondBlockLenght = str.substr(6,2);
		//This identifies the group as manufacturer-specific data 
		device.secondBlockIdentifier = str.substr(8,2);
		//Bluetooth manufacturer ID (Apple has c400)
		device.mfId	= str.substr(10,4);
		
		if(device.mfId == '4c00') {
			device.name = 'iBeacon';
		} else if(device.name == undefined) {
			device.name = device.mfId;
		}
		
		//?
		device.d1 = str.substr(14,2);
		//?
		device.d2 = str.substr(16,2);
		//This is the Universally Unique Identifier [UUID] in the Manufacture-Data (length = 32)
		device.mfUuid	= str.substr(18,32); 
		//This is the Major value
		device.major	= parseInt(str.substr(50,4), 16);
		//device.major	= parseInt(device.major);
		//This is the Minor value
		device.minor	= parseInt(str.substr(54,4), 16);
		//device.minor	= parseInt(device.minor);
		//This is out beacon address in the cms if you want to see its content (UUID.Major.Minor) 
		device.address = device.mfUuid + '.' + device.major + '.' + device.minor;
		//This is the UUID as iBeacon-UUID format
		device.formatedUuid	= device.mfUuid.hexToIBeaconUuid();
	/*	
		$().debug(str); 
		$().debug('firstBlockLenght: '+device.firstBlockLenght);
		$().debug('bleFlags: '+device.bleFlags);
		$().debug('binValFlags: '+device.binValFlags);
		$().debug('secondBlockLenght: '+device.secondBlockLenght);
		$().debug('secondBlockIdentifier: '+device.secondBlockIdentifier);
		
		$().debug('mfId: '+device.mfId);
		
		$().debug('d1: '+device.d1);
		$().debug('d2: '+device.d2);
		
		$().debug('mfUuid: '+device.mfUuid);
		
		$().debug('major: '+parseInt(device.major, 16));
		
		$().debug('minor: '+parseInt(device.minor, 16));
		
		$().debug('formatedUuid: '+device.formatedUuid);
		$().debug('address: '+device.address);
*/
		
		
		
		if( device.formatedUuid == false || device.major == 0 || device.minor == 0) {
			return;
		}
		
		if(bleScannerObj.devices[device.address] === undefined ) {
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
				
			var iBeaconUuid_major_minor = device.formatedUuid + '.' + device.major+  '.'  + device.minor;
			
			device['triggerTimeStamp'] = Date.now();
			
			//$().debug(app.view.contentMap, {'format':'json'});
			
			if( (app.view.contentMap[iBeaconUuid_major_minor]) ) {
				$(bleScannerObj.settings.scannerSelector).trigger(bleScannerObj.settings.deviceRangeTriggeredEvent, device);
			}
			
			
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

/*@TODO auslagern*/

/*custom extensions*/

/*expected string: E6C56DB5DFFB48D2B08840F5A81496EF */
String.prototype.hexToIBeaconUuid = function(){
	//string.length have to be 32 => 32 chars hexvalue
    if(this.length != 32) { return false; }
	var iBeaconUUID = false,
   	   part1_8Char = part2_4Char = part3_4Char = part4_4Char = part5_12Char = 0;
  
   	part1_8Char = this.substr(0,8);
   	part2_4Char = this.substr(8,4);
   	part3_4Char = this.substr(12,4);
   	part4_4Char = this.substr(16,4);
   	part5_12Char = this.substr(20,12);
	
   	//console.log("part1_8Char", part1_8Char, part1_8Char.length)
   	//console.log("part2_4Char",part2_4Char,part2_4Char.length); 
   	//console.log("part3_4Char", part3_4Char, part3_4Char.length); 
   	//console.log("part4_4Char", part4_4Char, part4_4Char.length); 
   	//console.log("part5_12Char", part5_12Char, part5_12Char.length); 
   	
   	if( 	part1_8Char.length != 8 
   		||	part2_4Char.length != 4
   		||	part3_4Char.length != 4
   		||	part4_4Char.length != 4
   		||	part5_12Char.length != 12
  ) {
   		//console.log('hexToIBeaconUuid returns false because one of the blocks has an invalid length'); 
   		return false;
   	}
    
    iBeaconUUID = [part1_8Char,part2_4Char, part3_4Char, part4_4Char, part5_12Char].join('-');
    return iBeaconUUID.toUpperCase();
};	 


/*expected string: E6C56DB5-DFFB-48D2-B088-40F5A81496EF (length=32+4)*/
String.prototype.IBeaconUuidToHex = function(){
	//string.length have to be 36 => 32 chars hexvalue + 4 chars "-"
    if(this.length != 32+4) { 
   	 //console.log('IBeaconUuidToHex returns false because the stringlength is not 36');
   	 return false; 
    }
   //clean string from seperator
    var hexarray = this.split("-");
    var hexstring = hexarray.join('');
    
    if(hexstring.length != 32) {
   	//console.log('IBeaconUuidToHex returns false because the converted strings length is not 32 => wrong seperator');
    	return false;
    } 
 	
    toValidate = hexstring.split('');

    $.each(toValidate, function(key, char) {	 
   	 if( !(/^[0-9A-F]/i.test(char)) ) {
   		 //console.log('IBeaconUuidToHex returns false because the character "' + char + '" is no valid hex');
   		 return false;
   	 }
	});

    return hexstring.toLowerCase();
};	 
/* TESTING UUID formatting  

var iBF 	= "E6C56DB5-DFFB-48D2-B088-40F5A81496EF",
	noIBF 	= "E6C56DB5DFFB48D2B08840F5A81496EF";
	
	console.log('iBF');
	console.log(iBF);
	console.log('noIBF');
	console.log(noIBF);

	console.log('iBF === noIBF.hexToIBeaconUuid()');
	console.log(iBF === noIBF.hexToIBeaconUuid());
	console.log('noIBF === iBF.IBeaconUuidToHex()');
	console.log(noIBF === iBF.IBeaconUuidToHex());
	 
	console.log('iBF => iBF.IBeaconUuidToHex()')
	console.log(iBF + '=>'+iBF.IBeaconUuidToHex()); 
	console.log('noIBF => noIBF.hexToIBeaconUuid()');
	console.log(noIBF + '=>'+noIBF.hexToIBeaconUuid()); 
	*/


/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
\*/

/* Array of bytes to base64 string decoding */

function b64ToUint6 (nChr) {

  return nChr > 64 && nChr < 91 ?
      nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
    : nChr > 47 && nChr < 58 ?
      nChr + 4
    : nChr === 43 ?
      62
    : nChr === 47 ?
      63
    :
      0;

}

function base64DecToArr (sBase64, nBlocksSize) {

  var
    sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;

    }
  }

  return taBytes;
}

/* Base64 string to array encoding */

function uint6ToB64 (nUint6) {

  return nUint6 < 26 ?
      nUint6 + 65
    : nUint6 < 52 ?
      nUint6 + 71
    : nUint6 < 62 ?
      nUint6 - 4
    : nUint6 === 62 ?
      43
    : nUint6 === 63 ?
      47
    :
      65;

}

function base64EncArr (aBytes) {

  var nMod3 = 2, sB64Enc = "";

  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
      nUint24 = 0;
    }
  }

  return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

}

/* UTF-8 array to DOMString and vice versa */

function UTF8ArrToStr (aBytes) {

  var sView = "";

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
        (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
        (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
        (nPart - 192 << 6) + aBytes[++nIdx] - 128
      : /* nPart < 127 ? */ /* one byte */
        nPart
    );
  }

  return sView;

}

function strToUTF8Arr (sDOMStr) {

  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription... */

  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    }
  }

  return aBytes;

}