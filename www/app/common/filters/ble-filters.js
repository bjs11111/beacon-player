/*
 * Docs
 * http://toddmotto.com/everything-about-custom-filters-in-angular-js/
 * 
 */

var listFilters = angular.module('listFilters',[]);


listFilters.filter('lastScanFilter', function() {
	
	// Filters only known Devices
	return function(items, msTimeAgo, keyToLastScan) {
		
	
		var recentlyScannedBaecons = {};

		// Filter Only known Devices
		angular.forEach(items, function(item, key) {
			
			console.log('keyToLastScan:'+(keyToLastScan)+ + JSON.stringify(item[keyToLastScan].lastScan) ); 
				var lastscan = (keyToLastScan)?item[keyToLastScan].lastScan: item.lastScan;
			console.log('lastscan: ' + lastscan); 
				if( Date.now() - lastscan <= msTimeAgo){ 
					this[key]=item;
				}
	      	}, 
	      	recentlyScannedBaecons
	    );
		
		return recentlyScannedBaecons;
	}
	
});

listFilters.filter('knownBeaconsFilter', function() { 
	
	// Filters only known Devices
	var filterKnownBeacons = function(items, serverBeacons){
		
		var onlyKnownDevicesList = {};
		
		// Filter Only known Devices
		angular.forEach(items, function(item, key) {
			 var tmpDevice= serverBeacons[key];
				if(tmpDevice){
					this[key]=tmpDevice;
				}
	      	}, 
	      	onlyKnownDevicesList
	    );

		return onlyKnownDevicesList;
	}
	
	return filterKnownBeacons;
	
});

//@TODO optimize
listFilters.filter('whitelistBeaconsFilter', function() {
	
	return function(items, serverBeacons) {
		var whitelistDevicesList = {};
		var whitelistBeacons = {};
		
		// Look if there are Whitelist Beacons and remember the user ids
		for (var key in items) { 
			//TODO: universalize key format. Somewhere it is with "-" and sometimes without.
			var tmpDevice = serverBeacons[key];
			
			if(tmpDevice.bcmsBeacon.whitelisted==1){
				whitelistBeacons[key]=tmpDevice;
			}
		}
		
		// Only add Beacons that have the same user id as the whitelist beacons
		for(var key in items){
			var tmpDevice = serverBeacons[key];
			
			if(Object.keys(whitelistBeacons).length==0){
				whitelistDevicesList[key]=tmpDevice; // If no Whitelist beacon is in the area, add it anyways to list
			}
			else{
				for(var key2 in whitelistBeacons){
					if(whitelistBeacons[key2].bcmsBeacon.userId==tmpDevice.bcmsBeacon.userId
							&& whitelistBeacons[key] ==null)
						whitelistDevicesList[key]=tmpDevice;
				}
			}
			
		}
	
		return whitelistDevicesList;
	}
	
});


var rangeFilters = angular.module('rangeFilters', []);
rangeFilters
.filter('rangeFilter', function() {// register new filter

   return function( items, rangeInfo, key ) {// filter arguments
        
	   if(rangeInfo.state == false) {
        	return items;
        }
	    var filtered = [];
        var min = parseInt(rangeInfo.min);
        var max = parseInt(rangeInfo.max);
        
        angular.forEach(items, function(item) {
        	// If time is within the range
        	if( item.scanData[key] >= min && item.scanData[key] <= max ) {
                filtered.push(item);
            }
        });
        
        return filtered;
    };
});



var bleFilters = angular.module('bleFilters', []);

bleFilters
.filter('oldDevicesFilter', function () {// register new filter => oldDevicesFilter 
	return function (items, msBehidNow) {// filter arguments => basicOperation:itme.time
		  angular.forEach(items, function(item, i) {
			  if( item.scanData.lastScan < Date.now()-msBehidNow) {
		        		delete items[i];
		      }	
		  });
		  return items;
	  };
});

bleFilters
.filter('reverseMId', function() {
	  return function(input, pairs) {
	    input = input || '';
	    var out = "";
	    var firstPair=undefined;
	    var secondPair=undefined;
	    
	    if (!pairs) {
		    for (var i = 0; i < input.length; i++) {
		    	  out = input.charAt(i)  + out;  
		    }
	    }
	    else {
	    	firstPair=input.substring(0,2);
	    	secondPair=input.substring(2,4);
	    	out = secondPair + firstPair;
	    }
	  
	    return out;
	  };
	});



bleFilters.filter('toIsBrokenRawDevice', function() {
	  
	return function(device) {
		
		if (!device && typeof device !== "object" || device === null) {
			console.log('toIsBrokenRawDevice returns false because the device is not a valis json object!');
			return false;
        }
		//@TODO rethink value
		if (!(device.rssi <= 0)) {
			console.log('toIsBrokenRawDevice returns false because the device.rssi is not <= 0!');
			return false;
		}
		
		return true;
  }
  
});

/*
 * returns valid hex string or false
 */
bleFilters.filter('toHexString', function() {
	
	return function(value) {
		
			//the hex value pattern
		var hexPattern 		= new RegExp('^[A-Fa-f0-9]$'),
			//array for invalid characters
			invalidChars 	= [],
			//char array of value
			charArray 		= value.split('');
    	
		//filter invalid characters
 		angular.forEach(charArray, function(char) {
    		if (!hexPattern.test(char)) {
    			invalidChars.push(char);
	        }
    	});
    	
 		//chech if every character is hex value
    	if(invalidChars.length !== 0) {
    		console.log( 'hexToIBeaconUuid returns false because characters "' + invalidChars.join(',') + '" are no valid hex values!' );
    		return false;
    	}
    	
    	return value; 
	};
	
});

/*
 * returns valid hex string or false
 */
bleFilters.filter('toHexString', function() {
	
	return function(value) {
		
			//the hex value pattern
		var hexPattern 		= new RegExp('^[A-Fa-f0-9]$'),
			//array for invalid characters
			invalidChars 	= [],
			//char array of value
			charArray 		= value.split('');
    	
		//filter invalid characters
 		angular.forEach(charArray, function(char) {
    		if (!hexPattern.test(char)) {
    			invalidChars.push(char);
	        }
    	});
    	
 		//chech if every character is hex value
    	if(invalidChars.length !== 0) {
    		console.log( 'hexToIBeaconUuid returns false because characters "' + invalidChars.join(',') + '" are no valid hex values!' );
    		return false;
    	}
    	
    	return value; 
	};
	
});


/*
 * returns valid hex string or false
 */	
bleFilters.filter('bcmsBeaconKeyToObj', ['$filter', function($filter) {
	var tmp = undefined,
		iBeaconUuid 		= undefined,
		major 				= undefined,
		minor 				= undefined;
	    iBeaconUuidToHex 	= undefined;
	
	return function(value) {
		
		tmp = value.toString().split('.');
		
 		//check . seperation 
    	if(tmp.length != 3) {
    		console.log( 'Ivalid seperation. cmsBeaconKey has to be seperated in 3 groups with "." between.' );
    		return false;
    	}
    	
    	iBeaconUuid = tmp[0];
    	iBeaconUuidToHex = $filter('iBeaconUuidToHex');
    	
    	//check valid iBeaconUUid 
    	if(iBeaconUuidToHex(iBeaconUuid) === false) {
    		console.log( 'Ivalid iBeaconUUid.' );
    		return false;
    	}
    	    
    	major 		= tmp[1];
    	
    	//check valid major 
    	if (!(major >= 0)) {
    		console.log(major);
    		console.log( 'major is no int.' );
    		return false;
    	}
    	
		minor 		= tmp[2];
		//check valid minor 
		if (!(minor >= 0)) {
    		console.log( 'minor is no int.' );
    		return false;
    	}

    	return { 
    			iBeaconUuid : iBeaconUuid,
    			 major 		: major,
    			 minor 		: minor
    		}; 
	};
	
}]);


/*
 *  returns a 36 char long string of iBeacon format or false
 */
bleFilters.filter('hexToIBeaconUuid', ['$filter', function($filter) {
  
	return function(value) {
		
		//check string length == 32
		if(value.length != 32) { 
			console.log('hexToIBeaconUuid returns false because string.length is '+value.length+' and has to be 32!');
			return false; 
		}
	    	// filter
 		var toHexString = $filter('toHexString'),
 			//return value
 			iBeaconUUID 	= false,
 			//block value holders
 			part1_8Char 	= undefined,
 			part2_4Char 	= undefined,
 			part3_4Char		= undefined,
 			part4_4Char 	= undefined,
 			part5_12Char 	= undefined;
 		
 		//check valid hex string
 		value = toHexString(value); 
 		if( value === false) {
 			return false;
 		};
	 		
    	//get blocks
    	part1_8Char = value.substr(0,8);
    	part2_4Char = value.substr(8,4);
    	part3_4Char = value.substr(12,4);
    	part4_4Char = value.substr(16,4);
    	part5_12Char = value.substr(20,12);

    	//create formated iBeaconUuid
    	iBeaconUUID = [part1_8Char,part2_4Char, part3_4Char, part4_4Char, part5_12Char].join('-');
    	return iBeaconUUID.toUpperCase();
	 
  };
  
}]);
/*
 *  returns a 32 long lowercase hex string or false
 */
bleFilters.filter('iBeaconUuidToHex', ['$filter', function($filter) {
  
	return function(value) {
		var toHexString = $filter('toHexString');
		
		 	//string.length have to be 36 => 32 chars hexvalue + 4 chars "-"
		     if(value.length != 32+4) {  
		    	 console.log('IBeaconUuidToHex returns false because the stringlength of "'+value+'" is not 36');
		    	 return false; 
		     }
		  
		    //clean string from seperator
		     var hexarray = value.split("-");
		     var hexstring = hexarray.join('');
		     
		     if(hexstring.length != 32) {
		    	console.log('IBeaconUuidToHex returns false because the converted strings length is not 32 => wrong seperator');
		     	return false;
		     } 
		  	
		     hexstring = toHexString(hexstring);
		     if( hexstring === false) {
		 			return false;
		 	 };
		    

		    return hexstring.toLowerCase();

  };
  
}])

/*\
|*|
|*|  Base64 / binary data / UTF-8 strings utilities
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
|*|
\*/
/* Array of bytes to base64 string decoding 
 * returns a Unit6 string or 0
 */
bleFilters.filter('b64ToUint6', function() {
  
	return function(nChr) {
		
		   return  nChr > 64 && nChr < 91 ?
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
  
});

bleFilters.filter('base64DecToArr', ['$filter', function($filter) {
  
	return function(sBase64, nBlocksSize) {
		var b64ToUint6 = $filter('b64ToUint6'),
	     	sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), 
	     	nInLen = sB64Enc.length,
	     	nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, 
	     	taBytes = new Uint8Array(nOutLen);
	     	
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

  };
  
}]);

 /* Base64 string to array encoding */
bleFilters.filter('uint6ToB64', function() {	

	return function  (nUint6) {

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
	 };
});
/* 
 * Base64 string to array encoding 
 */ 
bleFilters.filter('base64EncArr', ['$filter', function($filter) {
 return function (aBytes) {

	var uint6ToB64 = $filter('uint6ToB64'),
		nMod3 = 2, sB64Enc = "";

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
	 };
}]);

 /* UTF-8 array to DOMString and vice versa */
bleFilters.filter('UTF8ArrToStr', function() {
	 
	return function  (aBytes) {
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
	 };
});

/*
 * 
 */
bleFilters.filter('strToUTF8Arr', function() {
	 
	return function(sDOMStr) {

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
	 };
});
