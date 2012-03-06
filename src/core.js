// Global wysiwyg object.
var Wysiwyg;

Wysiwyg = (function() {

	// Instance version.
	var Wysiwyg = function( els, conf ){

		var selection = $(els), instance, config = conf || {};

		// When single elements are passed, return wysiwyg
		// instance if exists. This provides an easy API for instances.
		//
		if ( selection.length === 1 ) {
			instance = selection.data('wysiwyg');
			if ( instance !== undefined ) {
				return instance;
			}
		}
		
		// Create a new wysiwyg instance for each DOM element unless
		// it already exists.
		//
		selection.each(function( i, el ) {
			var instance;

			// Create a new instance unless it exists.
			if ( $.data(el, 'wysiwyg') === undefined ) {
				instance = new Wysiwyg.fn.init( el, config );
				$.data(el, 'wysiwyg', instance);
				
				instances[instance.uuid] = instance;
			}
			
		});

		return els;
	},
	
	controls  = {},	 // Globally registered controls
	instances = {},	 // All initialized instances of editor
	plugins   = {},  // Globally registered plugins
	
	// Add a list of defaults plugins should adhere to.
	// init: Called on plugin install
	// exec: execution callback
	//
	pluginApi = {
		init: $.noop,
		exec: $.noop
	};

	Wysiwyg.fn = Wysiwyg.prototype = {
		constructor: Wysiwyg,
		init: function( el, config ){
			
			var controlList = [ 'bold', 'italic', 'link', 'image' ],
				self = this;
			
			// Unique UID for this instance... used in dialogs/ui
			this.uuid = new Date().getTime();

			// Key codes that instances capture 
			// TODO: Move to events.js as a private/local variable
			//this.validKeyCodes	= [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];	
			
			// The control names belonging to this instance.
			this.controls = {};
			
			// The plugin names belonging to this instance
			this.plugins = [];
			
			// Plugin methods are added to an instance-level .fn object to
			// ensure there are no name collisions with core methods.
			// Overriding core methods should be done with Wysiwyg.fn
			//
			this.fn = {};
			
			// References the iframe HTML document
			this.document = null;

			// Instance configuration options
			this.options = {};

			// Original replaced element (ie textarea)
			this.element = $(el);

			// Stores a selection range on blur
			this.savedRange = null;

			// Delay timers (is this even necessary?)
			this.timers = [];

			// Check enabled/destroyed state of this editor
			this.isDestroyed = true;
			
			// Capture the closest form for save callbacks
			// Leave undefined if no form is wrapping this editor
			//
			if ( $(el).closest('form').length > 0 ){
				this.form = $(el).closest('form');
			}
			
			// Support passing plugins as a string.. similar to TinyMCE. 
			// Final plugins variable should be an array of strings that resolve to 
			// plugins found in the global plugins object.
			//
			if ( $.type( config.plugins ) === 'string' ){
				this.plugins = config.plugins.split(',');
			} else if ( config.plugins !== undefined ){
				this.plugins = config.plugins;
			}
			
			// Add plugin methods to instance
			$.each( this.plugins, function(ind, name){
				self.fn[name] = plugins[name];
			});
						
			// Support passing controls as a string.. similar to TinyMCE. 
			// Final controls variable is an object where names point to global wysiwyg controls items.
			//
			if ( $.type( config.controls ) === 'string' ){
				
				controlList = config.controls.split(',');
				controlList = controlList.map(function(str){
					return str.replace(/^\s+|\s+$/g,"");
				});
				
			} else if ( config.controls !== undefined ) {
				controlList = config.controls;
			}
			
			// Add controls to instance
			$.each( controlList, function(ind, name){
				var dname;
				
				if ( controls[name] === undefined ){
					return true;
				}
				
				self.controls[name] = controls[name];
				
				// Make sure plugins are installed any time a control
				// is used that delegates exec to it.
				if ( 'delegate' in controls[name] ){
					
					dname = controls[name].delegate;
					
					if ( $.inArray(dname, self.plugins) === -1 ){
																		
						if ( plugins[dname] === undefined ){
							$.error('Could not find plugin "' + dname + '"');
						} else {
							self.plugins.push(dname);
							self.fn[dname] = plugins[dname];
						}
						
					}
				}
			});
			
			// We don't need duplication.
			delete config.controls; 
			delete config.plugins;
			
			// Extend default options with user defined options.
			$.extend( {}, this.options, config );
			
			initEditor.apply(this, [ $(el) ]);
			
		}
	};

	Wysiwyg.fn.init.prototype = Wysiwyg.fn;

	Wysiwyg.extend = function( namespace, data ) {
		var ns, parsed;
		
		if ( $.isPlainObject(namespace) ){
			$.extend(this, namespace);
		} else {
			
			if ( $.isFunction(data) ){
				this[namespace] = data;
				
			} else {
				
				ns = this[namespace] || {};
				ns = $.extend({}, ns, data);
				parsed = {};
				parsed[namespace] = ns;
				$.extend(this, parsed);
				
			}
		}
	};
	
	Wysiwyg.extend({
		version: '@VERSION',
		dialog: {},
		utils:  {},
		ui:     {},
		config: {} 	// Global configuration
	});
	
	// See controls.js for more info
	//
	Wysiwyg.addControl = function( name, control ){
		
		var delegator;
		
		if( $.isPlainObject( control) ){
			
			if ( 'delegate' in control ){
				
				delegator = plugins[control.delegate];
				
				if ( delegator !== undefined ){
					$.extend(control, { exec:delegator.exec });
				}				
				
			} else if ( 'command' in control ){
				control.exec = function(){ this.exec(control.command); };
			}
						
			controls[name] = control;
		}
	};
	
	// Register a plugin. See plugins.js for more info
	//
	Wysiwyg.registerPlugin = function( name, object ){
		// Ensure api compatability
		plugin = $.extend( {}, pluginApi, object );

		// Add plugin to core
		plugins[name] = plugin;
		plugin.init.apply( Wysiwyg ); // Initialize plugin, passing core Wysiwyg object
	};
	
	// Configure the global Wysiwyg object. This is used for things like 
	// locale, xhtml/html format etc. It does not provide any instance configuration.
	//
	Wysiwyg.configure = function( conf ){
		Wysiwyg.config = $.extend( {}, Wysiwyg.config, conf );
	};
	
	function initEditor( element ){
		var iframe, wrapper, doc, self = this, toolBar;

		if ( window.location.protocol === "https:" ){
			iframe = $('<iframe src="javascript:false;"></iframe>');
		} else {
			iframe = $("<iframe></iframe>");
		}
		
		wrapper = $("<div></div>");
		iframe.addClass('wysiwyg')
			  .attr('id', 'wysiwyg_' + this.uuid)
			  .attr('frameborder', '0')
			  .attr("tabindex", element.attr("tabindex"));
		element.hide().before(wrapper);
		wrapper.css({clear: "both"})
			   .addClass('wysiwyg_container')
			   .attr('id', 'wysiwyg_container_' + this.uuid)
			   .append(iframe);
						
		this.editor = iframe;
		
		doc = $(this.editor).get(0);
		
		if ( doc.nodeName.toLowerCase() === "iframe" ) {
			if( doc.contentDocument ){
				// Gecko / Webkit based browsers
				this.document = $(doc.contentDocument);
			} else if( doc.contentWindow ) {
				// IE
				this.document = $(doc.contentWindow.document);
			}
		}

		
		// Delay design mode to make IE happy
		setTimeout( function(){
			$(self.document).attr('contentEditable', 'on');
			$(self.document).attr('designMode', 'on');
		}, 1000 );
				
		// Support a jQuery selector as a toolbar to have a global toolbar for all 
		// editor instances.
		//
		if ( this.options.toolbar !== undefined ){			
			this.toolbar = $(this.options.toolbar);			
			this.toolbar.attr('role', 'menu');
			
			// On focus, re-create the toolbar to ensure controls update for
			// this particular instance. This only applies to a global toolbar;
			this.document.bind('wysiwyg.focus', function( event ){
				self.createToolbar();
			});
			
		} else {
			this.toolbar = $("<ul class='wysiwyg_toolbar' role='menu'></ul>");
			wrapper.prepend(this.toolbar);
		}
		
		if ( this.options.stylesheet !== undefined ){
			this.document.find('head')
				.append(
					$("<link rel='stylesheet' href='" + this.options.stylesheet + "' type='text/css' media='screen' charset='utf-8' />")
				);
		}
		
		this.createToolbar();
		
		
	}
	
	// Setup default config
	//
	Wysiwyg.configure({
		lang: 'en',
		xhtml: true
	});
	
	Wysiwyg.noConflict = function(){
		$.wysiwyg 	 	= previousWysiwyg;
		$.fn.wysiwyg 	= previousFnWysiwyg;
		previousWysiwyg = previousFnWysiwyg = null;
		return Wysiwyg;
	};

	return Wysiwyg;	
	
})();

$.fn.wysiwyg = function( method, options ) {
	
	var instance;
	
	// Support calling method names jquery-ui style:
	// $(obj).wysiwyg('save');
	
	if ( $.type(method) === 'string' ){
		
		instance = $(this).data('wysiwyg');
		
		if ( instance === undefined ){
			$.error('Wysiwyg instance not yet created.');
			return false;
		}
		
		if ( $.isFunction(instance[method]) ){
			return instance[method].apply(instance, options);
						
		} else if ( $.isFunction(instance.fn[method]) ){
			return instance.fn[method].apply(instance, options);
		}
				
	} else {
		Wysiwyg(this, method);
	}	
	
	return this;
};