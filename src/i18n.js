(function( Wysiwyg ) {

Wysiwyg.extend('i18n', {

	// Stub translations	
	translations: {},
	translate: function( key ){
		// Get current language
		var lang = Wysiwyg.config.lang;
		if( Wysiwyg.i18n.translations[lang][key] === undefined){
			return 'Translation missing: ' + lang + ": " + key;
		}
		return Wysiwyg.i18n.translations[lang][key];		
	}	
});

// Alias "t" to translate for convenience.
Wysiwyg.extend('t', Wysiwyg.i18n.translate);
	
})( Wysiwyg );