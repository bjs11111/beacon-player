
/*Plugins for debugging*/
(function($) {
	
	$.fn.debug = function(value, options) {
		
		// default settings:
		var defaults = {
			validTypes 		: 	{
								'infoCallout' : 'bs-callout bs-callout-info',
								'infoAlert' : 'alert alert-info',
								'errorCallout'	: 'bs-callout bs-callout-error',
							},
			type 		: 	'infoCallout',
			target		: 	'#debug-msg-list',
			format 		: 	null,
			timeout 	: 	5000,
			callback 	: 	function() { this.css('overflow', 'hidden !important'); this.animate({	height : '0',	opacity : 0 , 'margin-top':'0px','margin-bottom':'0px', 'padding-top':'0px','padding-bottom':'0px' }, 
																						1000, function() {  $(this).css('display', 'none');	});	return;	},
		};
		
	
		var settings = $.extend({}, defaults, options);
		
		var $renderedMsg = null;
		//set target to append to
		$target = setTarget(settings.target);
		//format
		value = formatValue(value, settings.format); 
		// wrap and style value
		$renderedMsg = $('<li class="debug-msg ' + settings.validTypes[settings.type] + '">' + value + '</li>');
		// print value to debug view
		$renderedMsg.prependTo($target).timeout(settings.timeout, settings.callback);
		
		return $target;

	}
	
	//Private function 
	function setTarget(target) {
		$target = $(target);
		if( $target.size() < 1) {
			if($('#debug-panel').size() <1) {
				redrawPanel(); 
				$target = $('#debug-msg-list');
			}
		}
		return $target;
	}
	
	//Private function 
	function formatValue(value, format) {
		//format value
		if(format) {
			switch (format) {
			case 'json':
				value = JSON.stringify(value);
				break;
			}
		}
		
		return value;
	}
	
	//Private function 
	function redrawPanel( target ) 
	{
		var $target = (target)?$(target):$('body');
		$renderedDebugPanel = $('<div id="debug-panel" class="btn-group dropup">'+
									
									'<span type="button" id="log-count-total" class="btn btn-lg btn-default" data-log-count-total="0">'+
										'<span class="lable">Total:</span>'+
										'<span class="value">35</span>'+
									'</span>'+
									'<span type="button" id="log-count-info" class="btn btn-lg btn-info" data-log-count-info="0">'+
										'<span class="lable"><i class="fa fa-info-circle"></i>:</span>'+
										'<span class="value">0</span>'+
									'</span>'+
									
									'<span type="button" id="log-count-info" class="btn btn-lg btn-warning" data-log-count-info="0">'+
										'<span class="lable"><i class="fa fa-warning"></i>:</span>'+
										'<span class="value">0</span>'+
									'</span>'+
									
									'<span type="button" id="log-count-info" class="btn btn-lg btn-danger" data-log-count-info="0">'+
										'<span class="lable"><i class="fa fa-flash"></i>:</span>'+
										'<span class="value">0</span>'+
									'</span>'+
									
									'<span type="button" class="btn btn-lg btn-default dropdown-toggle" data-toggle="dropdown">'+
										'List loggs <span class="caret"></span>'+
									'</span>'+
							
									'<ul id="debug-msg-list" class="list-unstyled dropdown-menu">'+
									'</ul>'+
							
								'</div>');
		
		$target.append($renderedDebugPanel);
		
		return $target;
	} 
	
})(jQuery);

//a little jQuery plugin... needed for debug function



