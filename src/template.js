// Basic templating functionality.

Wysiwyg.extend('template', {
	// Stores a cache of all raw loaded template data (vs store which is specific templates)
	cache: {},
	// Parse a html template using object style syntax.
	//	
	parse: function( tplString, data ){
		var tmpl, func,
			settings = {
				evaluate    : /\{([\s\S]+?)\}/g,
				interpolate : /\{=([\s\S]+?)\}>/g
			};

		//
		// JavaScript micro-templating, similar to John Resig's implementation.
		// Default implementation by underscore.js.
		// https://github.com/documentcloud/underscore
		//
		tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
			'with(obj||{}){__p.push(\'' +
			str.replace(/\\/g, '\\\\')
		        .replace(/'/g, "\\'")
		        .replace( settings.interpolate, function( match, code ) {
		          return "'," + code.replace(/\\'/g, "'") + ",'";
		        })
		        .replace( settings.evaluate || null, function( match, code ) {
		          return "');" + code.replace(/\\'/g, "'")
		                             .replace(/[\r\n\t]/g, ' ') + "__p.push('";
		        })
		        .replace(/\r/g, '\\r')
		        .replace(/\n/g, '\\n')
		        .replace(/\t/g, '\\t')
		        + "');}return __p.join('');";

		func = new Function( 'obj', tmpl );
		return data ? func( data ) : func;
	},
	
	// Load a html template from a URL and caches the raw data for later.
	//
	load: function( tplURL, ajaxOptions ){
		var options;
		if ( Wysiwyg.template.cache[tplURL] !== undefined ){
			return Wysiwyg.template.cache[tplURL];
		}
		
		options = {
			url:      tplURL,
			dataType: 'html',
			success:  function(data){
				Wysiwyg.template.cache[tplURL] = data;				
			}
		};

		if ( ajaxOptions ){
			options = $.extend( options, ajaxOptions );
		}

		$.ajax( options );
		return true;
	},
	
	// Store a named template for later use.
	//
	store: function( name, template ){
		Wysiwyg.templateData[name] = template;
		return template;
	},
	// Retrive a stored template, optionally parsing it with the provided data.
	//
	fetch: function( name, data ){
		var tpl = Wysiwyg.template.store[name];
		if( !data ){
			return tpl;
		}else{
			return Wysiwyg.template.parse( tpl, data );
		}
	}
	
	
});