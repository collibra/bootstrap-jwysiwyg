if ( @DEBUG ){
	
	var console = ('console' in window) ? window.console : {
		log: $.noop,
		error: $.noop,
		warn: $.noop,
		info: $.noop,
		time: $.noop,
		timeEnd: $.noop,
		assert: $.noop
	};
	
	Wysiwyg.console = console;
}
