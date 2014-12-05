// Initial JavaScript code start on jquery is ready 
jQuery(document).ready(function($) {
	 
	//$('.content').on('click', app.onContentClick());
	
	// Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    app.initialize();
    function onDeviceReady() {
    	app.initialize(); 
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