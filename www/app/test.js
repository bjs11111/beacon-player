//
<button id="start">start</button>
<button id="stop">stop</button>


//
//
var rawBleStream = new Rx.Subject();
//
var bleScannerDummy = null;
var startBleScanner = function() {
	bleScannerDummy = setInterval(function(){ 
			var rawDevice = { 'uuid' : '12121212-1212-1212-1221121212'};
      rawBleStream.onNext(rawDevice);
		},
	1000);
}
var stopBleScanner = function() {
	clearInterval(bleScannerDummy);
}


var startAndroidScanning = function() {
	if(isBleDefined() == false){ return; } 
	
	//skip if scanner already scanns
	if(getBleScannerState()) { return;}
	
	//@TODO check ble is on or off
	
	//start scanning
	setBleScannerState(true);	
	
	$ionicPlatform.ready(function() { 
		bleStream = watchAndroidBleScanner();			
	});
};

//
var startButton  = document.querySelector('#start');
var stopButton  = document.querySelector('#stop');
var httpButton  = document.querySelector('#http');

var startClickStream = Rx.Observable.fromEvent(startButton, 'click').share();
var stopClickStream = Rx.Observable.fromEvent(stopButton, 'click').share();
var httpRequestStream = Rx.Observable.fromEvent(httpButton, 'click').share().map( function() { return {e:'e',a:'a'}; } );

startClickStream.subscribe(function(x) {
		console.log('start'); 
    startBleScanner();
});

stopClickStream.subscribe(function(x) {
	console.log('stop'); 
   stopBleScanner();
});

httpRequestStream.subscribe(function(x) {
	console.log('http', x); 
});;

//somewarre in app
rawBleStream.subscribe(
function(rawDate) {
	console.log('rawBleStream'); 
});

//soweware else in app
var unifiedBleStream = rawBleStream.map(
	function(rawDevice) { 
  	var decodedDeviceDate = {};
    decodedDeviceDate.lastScan = Date.now();
    decodedDeviceDate.uuid = rawDevice.uuid;
    
  	return decodedDeviceDate; 
});
  
unifiedBleStream.subscribe(
function(device) {
	console.log('unifiedBleStream'); 
});


httpRequestStream.flatMap( 
	function(x) { 
		console.log('A', x); 
 
})
.subscribe(function(x) {
		console.log('flat'); 
});

var filteredStream = unifiedBleStream.filter(function(device) {
	return device.lastScan % 2 == 0
});

Rx.Observable.from({length: 5}, function(v, k) { return k; }).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  });