// Initial JavaScript code start on jquery is ready 
jQuery(document).ready(function($) {
	 
	//$('.content').on('click', app.onContentClick());
	
	// Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);
    	 
    // Cordova is ready
    //
    function onDeviceReady() {
    	var inetError = $('#inet-connectivity');
    		scannerPanel = $('#ble-scanner-panel');

    	/*diagnostic checks*/
    	if ( !diagnostic.isConnected() ) { 
    		inetError.toggleClass('hidden');
    		scannerPanel.toggleClass('hidden');
    	} 
    	else { 
    		$.ajax({
	  	   	  url:"http://www.starnberger.at/em-sales-tool/get-all-beacons",
	  	   	  type:"GET",
	  	   	  contentType:"application/json; charset=utf-8",
	  	   	  dataType:"json",
	  	   	  success: function(data){
	  	   		app.view.contentMap = data; 
	  	   		
	  	   		app.initialize();
	  	      },
	  	   	  error: function (data) {	   		
	  	   		app.view.contentMap = false; 
	  		  }
	  	   	});	
	    	
    	}
    
    }
	
});

(function($) {
	$.fn.timeout = function(ms, callback) {
		var self = this;
		setTimeout(function() {
			callback.call(self);
		}, ms);
		return this;
	}
})(jQuery);