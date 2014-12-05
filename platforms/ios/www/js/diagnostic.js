/*
 * Diagnostic
 * needed Plugins:
 * - cordova plugin add org.apache.cordova.network-information
 * 
 */
var diagnostic = {
		//
		getConnectionStates : function() {
			
			var states = {};
		    states[Connection.UNKNOWN]  = 'Unknown connection';
		    states[Connection.ETHERNET] = 'Ethernet connection';
		    states[Connection.WIFI]     = 'WiFi connection';
		    states[Connection.CELL_2G]  = 'Cell 2G connection';
		    states[Connection.CELL_3G]  = 'Cell 3G connection';
		    states[Connection.CELL_4G]  = 'Cell 4G connection';
		    states[Connection.CELL]     = 'Cell generic connection';
		    states[Connection.NONE]     = 'No network connection';
		    
		    return states;
			
		},
		//
		getConnection : function() {
						var states = diagnostic.getConnectionStates();
						var networkState = navigator.connection.type;
					    return states[networkState];
					   
		},
		//
		isConnected	:	function (type) {
			
			if(type) {	return (type == networkState);	}
	
			var networkState = navigator.connection.type;
			var states = diagnostic.getConnectionStates();
			return ( states[networkState] != states[Connection.UNKNOWN] && states[networkState] != states[Connection.NONE]);
		
		}
	
		
};